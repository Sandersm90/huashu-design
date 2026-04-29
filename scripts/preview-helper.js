(function () {
  const WS_URL = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;
  let socket = null;
  let queue = [];

  function send(event) {
    const payload = {
      ...event,
      timestamp: Date.now(),
      page: window.location.pathname + window.location.search,
      title: document.title || null,
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      queue.push(payload);
    }
  }

  function flushQueue() {
    if (!socket || socket.readyState !== WebSocket.OPEN || queue.length === 0) return;
    for (const payload of queue) socket.send(JSON.stringify(payload));
    queue = [];
  }

  function connect() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      flushQueue();
      send({ type: 'client-connected' });
    };

    socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.type === 'reload') {
          window.location.reload();
        }
      } catch (error) {
        console.warn('huashu-preview: failed to parse server message', error);
      }
    };

    socket.onclose = () => {
      setTimeout(connect, 1000);
    };

    socket.onerror = () => {
      try { socket.close(); } catch (_) {}
    };
  }

  function selectedSummary(container) {
    const selected = Array.from(container.querySelectorAll('.selected,[aria-pressed="true"]'));
    return selected.map((el) => ({
      choice: el.dataset.choice || null,
      label: el.dataset.label || el.querySelector('h3,h4,strong,.title,.label')?.textContent?.trim() || el.textContent?.trim()?.slice(0, 120) || null,
      id: el.id || null,
    }));
  }

  function updateIndicator(text) {
    const indicator = document.getElementById('huashu-preview-indicator');
    if (indicator) indicator.textContent = text;
  }

  function defaultToggle(target) {
    const container = target.closest('[data-choice-group], .options, .cards, [data-multiselect]');
    const multi = !!(target.closest('[data-multiselect]') || (container && container.dataset.multiselect !== undefined));

    if (container && !multi) {
      container.querySelectorAll('[data-choice]').forEach((el) => {
        el.classList.remove('selected');
        el.setAttribute('aria-pressed', 'false');
      });
    }

    if (multi) {
      const next = !target.classList.contains('selected');
      target.classList.toggle('selected', next);
      target.setAttribute('aria-pressed', next ? 'true' : 'false');
    } else {
      target.classList.add('selected');
      target.setAttribute('aria-pressed', 'true');
    }

    const selected = container ? selectedSummary(container) : [{ choice: target.dataset.choice || null, label: target.textContent?.trim()?.slice(0, 120) || null, id: target.id || null }];
    if (selected.length === 0) {
      updateIndicator('Click a choice in the preview, then continue in the terminal.');
    } else if (selected.length === 1) {
      updateIndicator(`${selected[0].label || selected[0].choice || 'Option'} selected — continue in the terminal.`);
    } else {
      updateIndicator(`${selected.length} choices selected — continue in the terminal.`);
    }
    return selected;
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-choice]');
    if (!target) return;

    const selected = defaultToggle(target);
    send({
      type: 'choice',
      choice: target.dataset.choice || null,
      label: target.dataset.label || target.textContent?.trim()?.slice(0, 120) || null,
      id: target.id || null,
      selected,
    });
  });

  window.huashuPreview = {
    send,
    select(choice, metadata = {}) {
      send({ type: 'choice', choice, ...metadata });
    },
    state(name, value, metadata = {}) {
      send({ type: 'state', name, value, ...metadata });
    },
    note(text, metadata = {}) {
      send({ type: 'note', text, ...metadata });
    },
  };

  connect();
})();
