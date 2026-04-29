const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');

const OPCODES = { TEXT: 0x01, CLOSE: 0x08, PING: 0x09, PONG: 0x0A };
const WS_MAGIC = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function computeAcceptKey(clientKey) {
  return crypto.createHash('sha1').update(clientKey + WS_MAGIC).digest('base64');
}

function encodeFrame(opcode, payload) {
  const fin = 0x80;
  const len = payload.length;
  let header;

  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = fin | opcode;
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = fin | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = fin | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  return Buffer.concat([header, payload]);
}

function decodeFrame(buffer) {
  if (buffer.length < 2) return null;
  const secondByte = buffer[1];
  const opcode = buffer[0] & 0x0f;
  const masked = (secondByte & 0x80) !== 0;
  let payloadLength = secondByte & 0x7f;
  let offset = 2;

  if (!masked) throw new Error('Client frames must be masked');

  if (payloadLength === 126) {
    if (buffer.length < 4) return null;
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLength === 127) {
    if (buffer.length < 10) return null;
    payloadLength = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }

  const maskOffset = offset;
  const dataOffset = offset + 4;
  const totalLength = dataOffset + payloadLength;
  if (buffer.length < totalLength) return null;

  const mask = buffer.slice(maskOffset, dataOffset);
  const data = Buffer.alloc(payloadLength);
  for (let i = 0; i < payloadLength; i++) {
    data[i] = buffer[dataOffset + i] ^ mask[i % 4];
  }

  return { opcode, payload: data, bytesConsumed: totalLength };
}

const PORT = Number(process.env.HUASHU_PREVIEW_PORT || (49152 + Math.floor(Math.random() * 16383)));
const HOST = process.env.HUASHU_PREVIEW_HOST || '127.0.0.1';
const URL_HOST = process.env.HUASHU_PREVIEW_URL_HOST || (HOST === '127.0.0.1' ? 'localhost' : HOST);
const SESSION_DIR = process.env.HUASHU_PREVIEW_DIR || '/tmp/huashu-preview';
const CONTENT_DIR = path.join(SESSION_DIR, 'content');
const STATE_DIR = path.join(SESSION_DIR, 'state');
const OWNER_PID_RAW = process.env.HUASHU_PREVIEW_OWNER_PID;
let ownerPid = OWNER_PID_RAW ? Number(OWNER_PID_RAW) : null;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const WAITING_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Huashu Preview</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #111; color: #f3f3f0; }
    .panel { padding: 2rem 2.25rem; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; background: rgba(255,255,255,0.04); max-width: 720px; }
    h1 { margin: 0 0 0.5rem; font-size: 1.2rem; }
    p { margin: 0.3rem 0; color: rgba(243,243,240,0.7); line-height: 1.55; }
    code { color: #efc4b4; }
  </style>
</head>
<body>
  <div class="panel">
    <h1>Huashu Preview is waiting for a screen</h1>
    <p>Start writing HTML into the preview <code>content/</code> directory. The newest <code>.html</code> file becomes the active preview automatically.</p>
    <p>For lightweight review screens, write a fragment. For full prototypes, write a complete HTML document and it will render as-is.</p>
  </div>
</body>
</html>`;

const frameTemplate = fs.readFileSync(path.join(__dirname, 'preview-frame.html'), 'utf-8');
const helperScript = fs.readFileSync(path.join(__dirname, 'preview-helper.js'), 'utf-8');
const helperInjection = `<script>\n${helperScript}\n</script>`;

function baseHrefFor(file) {
  if (!file) return '/files/';
  const relDir = path.posix.dirname(file.relPath.replace(/\\/g, '/'));
  return relDir === '.' ? '/files/' : `/files/${relDir}/`;
}

const clients = new Set();
const snapshots = new Map();
const debounceTimers = new Map();
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
let lastActivity = Date.now();

function touchActivity() {
  lastActivity = Date.now();
}

function ensureDirs() {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.mkdirSync(STATE_DIR, { recursive: true });
}

function isFullDocument(html) {
  const trimmed = html.trimStart().toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
}

function injectHelper(html, file) {
  const baseTag = `<base href="${baseHrefFor(file)}">`;
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${baseTag}\n</head>`);
  } else {
    html = `${baseTag}\n${html}`;
  }
  if (html.includes('</body>')) return html.replace('</body>', `${helperInjection}\n</body>`);
  return `${html}\n${helperInjection}`;
}

function wrapFragment(content) {
  return frameTemplate.replace('<!-- CONTENT -->', content);
}

function listHtmlFiles(dir = CONTENT_DIR, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listHtmlFiles(full, rel));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const stat = fs.statSync(full);
      files.push({ relPath: rel, fullPath: full, mtimeMs: stat.mtimeMs });
    }
  }
  return files.sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function newestScreen() {
  const files = listHtmlFiles();
  return files.length > 0 ? files[0] : null;
}

function manifest() {
  const files = listHtmlFiles();
  return {
    type: 'preview-manifest',
    current: files[0]?.relPath || null,
    files: files.map((file) => ({ path: file.relPath, updatedAt: file.mtimeMs })),
  };
}

function safeResolveWithinContent(requestPath) {
  const relative = decodeURIComponent(requestPath).replace(/^\/+/, '');
  const resolved = path.resolve(CONTENT_DIR, relative);
  if (!resolved.startsWith(path.resolve(CONTENT_DIR) + path.sep) && resolved !== path.resolve(CONTENT_DIR)) {
    return null;
  }
  return resolved;
}

function readPreviewHtml(file) {
  if (!file) return injectHelper(WAITING_PAGE, null);
  const raw = fs.readFileSync(file.fullPath, 'utf-8');
  const html = isFullDocument(raw) ? raw : wrapFragment(raw);
  return injectHelper(html, file);
}

function writeEvent(event) {
  const line = JSON.stringify(event) + '\n';
  fs.appendFileSync(path.join(STATE_DIR, 'events'), line);
}

function clearEvents() {
  const eventsFile = path.join(STATE_DIR, 'events');
  if (fs.existsSync(eventsFile)) fs.unlinkSync(eventsFile);
}

function broadcast(message) {
  const frame = encodeFrame(OPCODES.TEXT, Buffer.from(JSON.stringify(message)));
  for (const socket of clients) {
    try {
      socket.write(frame);
    } catch {
      clients.delete(socket);
    }
  }
}

function snapshotTree(dir = CONTENT_DIR, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const next = new Map();
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const [key, value] of snapshotTree(full, rel)) next.set(key, value);
    } else if (entry.isFile()) {
      const stat = fs.statSync(full);
      next.set(rel, `${stat.mtimeMs}:${stat.size}`);
    }
  }
  return next;
}

function diffSnapshots(previous, next) {
  const changed = [];
  const keys = new Set([...previous.keys(), ...next.keys()]);
  for (const key of keys) {
    if (previous.get(key) !== next.get(key)) changed.push(key);
  }
  return changed;
}

function scheduleReload(changedFiles) {
  const marker = '__all__';
  if (debounceTimers.has(marker)) clearTimeout(debounceTimers.get(marker));
  debounceTimers.set(marker, setTimeout(() => {
    debounceTimers.delete(marker);
    touchActivity();
    const htmlChanged = changedFiles.some((file) => file.endsWith('.html'));
    if (htmlChanged) clearEvents();
    broadcast({ type: 'reload', changedFiles, manifest: manifest() });
  }, 120));
}

function handleRequest(req, res) {
  touchActivity();

  if (req.method === 'GET' && req.url === '/') {
    const html = readPreviewHtml(newestScreen());
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
    return;
  }

  if (req.method === 'GET' && req.url === '/manifest.json') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(manifest(), null, 2));
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/files/')) {
    const requested = req.url.slice('/files/'.length).split('?')[0];
    const filePath = safeResolveWithinContent(requested);
    if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
    res.end(fs.readFileSync(filePath));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
}

function handleMessage(text) {
  let event;
  try {
    event = JSON.parse(text);
  } catch (error) {
    console.error('huashu-preview invalid event:', error.message);
    return;
  }

  touchActivity();
  const normalized = { source: 'browser', ...event };
  console.log(JSON.stringify({ type: 'browser-event', event: normalized }));
  writeEvent(normalized);
}

function handleUpgrade(req, socket) {
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  const accept = computeAcceptKey(key);
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );

  let buffer = Buffer.alloc(0);
  clients.add(socket);
  socket.write(encodeFrame(OPCODES.TEXT, Buffer.from(JSON.stringify({ type: 'manifest', manifest: manifest() }))));

  socket.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (buffer.length > 0) {
      let result;
      try {
        result = decodeFrame(buffer);
      } catch {
        socket.end(encodeFrame(OPCODES.CLOSE, Buffer.alloc(0)));
        clients.delete(socket);
        return;
      }
      if (!result) break;
      buffer = buffer.slice(result.bytesConsumed);

      switch (result.opcode) {
        case OPCODES.TEXT:
          handleMessage(result.payload.toString());
          break;
        case OPCODES.CLOSE:
          socket.end(encodeFrame(OPCODES.CLOSE, Buffer.alloc(0)));
          clients.delete(socket);
          return;
        case OPCODES.PING:
          socket.write(encodeFrame(OPCODES.PONG, result.payload));
          break;
        case OPCODES.PONG:
          break;
        default:
          socket.end(encodeFrame(OPCODES.CLOSE, Buffer.alloc(0)));
          clients.delete(socket);
          return;
      }
    }
  });

  socket.on('close', () => clients.delete(socket));
  socket.on('error', () => clients.delete(socket));
}

function ownerAlive() {
  if (!ownerPid) return true;
  try {
    process.kill(ownerPid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

function writeServerInfo() {
  const info = {
    type: 'preview-started',
    port: PORT,
    host: HOST,
    url_host: URL_HOST,
    url: `http://${URL_HOST}:${PORT}`,
    content_dir: CONTENT_DIR,
    state_dir: STATE_DIR,
  };
  const serialized = JSON.stringify(info);
  fs.writeFileSync(path.join(STATE_DIR, 'server-info'), serialized + '\n');
  console.log(serialized);
}

function shutdown(reason, watcher, server) {
  console.log(JSON.stringify({ type: 'preview-stopped', reason }));
  const infoFile = path.join(STATE_DIR, 'server-info');
  if (fs.existsSync(infoFile)) fs.unlinkSync(infoFile);
  fs.writeFileSync(path.join(STATE_DIR, 'server-stopped'), JSON.stringify({ reason, timestamp: Date.now() }) + '\n');
  watcher.close();
  server.close(() => process.exit(0));
}

function startServer() {
  ensureDirs();
  for (const [key, value] of snapshotTree()) snapshots.set(key, value);

  const server = http.createServer(handleRequest);
  server.on('upgrade', handleUpgrade);

  const watcher = fs.watch(CONTENT_DIR, { persistent: true }, () => {
    const next = snapshotTree();
    const changedFiles = diffSnapshots(snapshots, next);
    snapshots.clear();
    for (const [key, value] of next) snapshots.set(key, value);
    if (changedFiles.length > 0) scheduleReload(changedFiles);
  });

  watcher.on('error', (error) => {
    console.error('huashu-preview watcher error:', error.message);
  });

  const lifecycleCheck = setInterval(() => {
    if (!ownerAlive()) shutdown('owner process exited', watcher, server);
    else if (Date.now() - lastActivity > IDLE_TIMEOUT_MS) shutdown('idle timeout', watcher, server);
  }, 60 * 1000);
  lifecycleCheck.unref();

  if (ownerPid) {
    try {
      process.kill(ownerPid, 0);
    } catch (error) {
      if (error.code !== 'EPERM') ownerPid = null;
    }
  }

  server.listen(PORT, HOST, () => {
    writeServerInfo();
  });
}

if (require.main === module) startServer();

module.exports = { computeAcceptKey, encodeFrame, decodeFrame, OPCODES };
