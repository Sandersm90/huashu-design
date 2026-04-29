# React + Babel Project Rules

These are the technical rules you must follow when building prototypes with HTML + React + Babel. Ignore them and the setup tends to break in surprisingly non-obvious ways.

## Pinned script tags (must use these versions)

Put these three script tags in `<head>` with **fixed versions + integrity hashes**:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
```

Do **not** use unpinned versions like `react@18` or `react@latest` — version drift and cache weirdness will bite you.

Do **not** omit `integrity` — if the CDN is tampered with, that is your line of defense.

## File structure

```
project/
├── index.html               # main HTML
├── components.jsx           # component file loaded via type="text/babel"
├── data.js                  # data file
└── styles.css               # optional extra CSS
```

In HTML, load them like this:

```html
<!-- React + Babel first -->
<script src="https://unpkg.com/react@18.3.1/..."></script>
<script src="https://unpkg.com/react-dom@18.3.1/..."></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/..."></script>

<!-- Then your component files -->
<script type="text/babel" src="components.jsx"></script>
<script type="text/babel" src="pages.jsx"></script>

<!-- Main entry last -->
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

Do **not** use `type="module"` — it conflicts with Babel.

## Three non-negotiable rules

### Rule 1: style objects must have unique names

**Wrong** (guaranteed collisions in multi-component projects):
```jsx
// components.jsx
const styles = { button: {...}, card: {...} };

// pages.jsx  ← same name overrides it
const styles = { container: {...}, header: {...} };
```

**Correct**: each component file gets a uniquely prefixed style object.

```jsx
// terminal.jsx
const terminalStyles = {
  screen: {...},
  line: {...}
};

// sidebar.jsx
const sidebarStyles = {
  container: {...},
  item: {...}
};
```

Or use inline styles for small components:

```jsx
<div style={{ padding: 16, background: '#111' }}>...</div>
```

This rule is **not negotiable**. Every `const styles = {...}` should be renamed to something specific, otherwise multi-file Babel prototypes fail in exactly the kind of confusing way that wastes an hour.

### Rule 2: scope is not shared — export manually

Each `<script type="text/babel">` block is compiled independently by Babel. Their scopes do **not** automatically connect. If `Terminal` is defined in `components.jsx`, then `pages.jsx` will see it as **undefined** by default.

**Fix**: export shared components and utilities to `window` at the end of each file:

```jsx
function Terminal(props) { ... }
function Line(props) { ... }
const colors = { green: '#...', red: '#...' };

Object.assign(window, {
  Terminal, Line, colors,
});
```

Then `pages.jsx` can use `<Terminal />` because JSX resolution will ultimately find `window.Terminal`.

### Rule 3: never use `scrollIntoView`

`scrollIntoView` tends to shove the whole HTML container upward and breaks the harness layout. **Never use it.**

Use one of these instead:

```js
container.scrollTop = targetElement.offsetTop;

container.scrollTo({
  top: targetElement.offsetTop - 100,
  behavior: 'smooth'
});
```

## Calling Claude / an LLM inside HTML

Some native design-agent environments (such as Claude.ai Artifacts) expose a no-config helper like `window.claude.complete`, but most environments (Claude Code / Codex / Cursor / Trae / etc.) do **not**.

If your HTML prototype needs an LLM-backed demo, there are three options.

### Option A: mock it instead of calling the real API

Recommended for demos:

```jsx
window.claude = {
  async complete(prompt) {
    await new Promise(r => setTimeout(r, 800));
    return "This is a mock response. Replace it with the real API in production.";
  }
};
```

### Option B: call the Anthropic API directly

The user must paste their own API key into the HTML. **Never hardcode the key.**

```html
<input id="api-key" placeholder="Paste your Anthropic API key" />
<script>
window.claude = {
  async complete(prompt) {
    const key = document.getElementById('api-key').value;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    return data.content[0].text;
  }
};
</script>
```

**Note**: direct browser calls may hit CORS restrictions. If the preview environment cannot bypass CORS, this path is effectively closed; use Option A or tell the user a proxy backend is required.

### Option C: generate mock data on the agent side first

For local demos, you can use the current agent session (or another installed multi-model skill) to generate mock responses first, then hardcode them into the HTML. That way the runtime HTML depends on no external API at all.

## Standard starter template

Copy this as a React prototype skeleton:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Prototype Name</title>

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; width: 100%; }
    body {
      font-family: -apple-system, 'SF Pro Text', sans-serif;
      background: #FAFAFA;
      color: #1A1A1A;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel" src="components.jsx"></script>

  <script type="text/babel">
    const { useState, useEffect } = React;

    function App() {
      return (
        <div style={{padding: 40}}>
          <h1>Hello</h1>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
```

## Common errors and fixes

**`styles is not defined` or `Cannot read property 'button' of undefined`**
→ You reused `const styles` in multiple files. Give each style object a specific name.

**`Terminal is not defined`**
→ Cross-file scopes are isolated. Add `Object.assign(window, { Terminal })` at the end of the file that defines it.

**The whole page is white but the console shows nothing obvious**
→ Often a JSX syntax error with poor minified Babel reporting. Swap `babel.min.js` for non-minified `babel.js` temporarily.

**`ReactDOM.createRoot is not a function`**
→ Wrong version. Make sure you are using `react-dom@18.3.1`.

**`Objects are not valid as a React child`**
→ You rendered an object instead of JSX/string. Common case: `{someObj}` when you meant `{someObj.name}`.

## How to split large projects

Single files beyond ~1000 lines are painful to maintain. A reasonable split:

```
project/
├── index.html
├── src/
│   ├── primitives.jsx
│   ├── components.jsx
│   ├── pages/
│   │   ├── home.jsx
│   │   ├── detail.jsx
│   │   └── settings.jsx
│   ├── router.jsx
│   └── app.jsx
└── data.js
```

Load them in order:

```html
<script type="text/babel" src="src/primitives.jsx"></script>
<script type="text/babel" src="src/components.jsx"></script>
<script type="text/babel" src="src/pages/home.jsx"></script>
<script type="text/babel" src="src/pages/detail.jsx"></script>
<script type="text/babel" src="src/pages/settings.jsx"></script>
<script type="text/babel" src="src/router.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
```

And export shared items from each file via `Object.assign(window, {...})`.
