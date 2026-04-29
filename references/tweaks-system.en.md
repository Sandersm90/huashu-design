# Tweaks: Real-Time Parameter Tuning for Design Variants

Tweaks are a core capability of this skill: they let users switch variations and adjust parameters in real time without editing code.

**Cross-agent compatibility**: some native design-agent environments (such as Claude.ai Artifacts) rely on host-side `postMessage` plumbing to write tweak values back into the source. This skill uses a **pure frontend localStorage approach** instead. The behavior is effectively the same (state survives refresh), but persistence happens in browser localStorage rather than the source file. That makes it portable across Claude Code / Codex / Cursor / Trae / etc.

## When to add Tweaks

- The user explicitly asks for adjustable parameters or version switching
- The design needs multiple variants for comparison
- The user did not ask, but you judge that a few thoughtful tweaks would help them see the possibility space

Default recommendation: **add 2–3 tweaks to most designs** even if the user did not request them explicitly (theme color, typography scale, layout variant, etc.). Showing the user the **possibility space** is part of the design service, not extra garnish.

## Implementation (pure frontend)

### Basic structure

```jsx
const TWEAK_DEFAULTS = {
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
};

function useTweaks() {
  const [tweaks, setTweaks] = React.useState(() => {
    try {
      const stored = localStorage.getItem('design-tweaks');
      return stored ? { ...TWEAK_DEFAULTS, ...JSON.parse(stored) } : TWEAK_DEFAULTS;
    } catch {
      return TWEAK_DEFAULTS;
    }
  });

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    try {
      localStorage.setItem('design-tweaks', JSON.stringify(next));
    } catch {}
  };

  const reset = () => {
    setTweaks(TWEAK_DEFAULTS);
    try {
      localStorage.removeItem('design-tweaks');
    } catch {}
  };

  return { tweaks, update, reset };
}
```

### Tweaks panel UI

Use a floating panel in the lower-right corner. It should be collapsible.

```jsx
function TweaksPanel() {
  const { tweaks, update, reset } = useTweaks();
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      {open ? (
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          width: 280,
          fontFamily: 'system-ui',
          fontSize: 13,
        }}>
          {/* controls */}
        </div>
      ) : (
        <button>⚙ Tweaks</button>
      )}
    </div>
  );
}
```

The Chinese source includes a full working example with color, font-size, density, dark-mode, and reset controls. Reuse it as-is if you want a ready-made starter.

The taste principle here matters: the panel should feel like a **designer's variation surface**, not a settings page.

### Applying Tweaks

```jsx
function App() {
  const { tweaks } = useTweaks();

  return (
    <div style={{
      '--primary': tweaks.primaryColor,
      '--font-size': `${tweaks.fontSize}px`,
      background: tweaks.dark ? '#0A0A0A' : '#FAFAFA',
      color: tweaks.dark ? '#FAFAFA' : '#1A1A1A',
    }}>
      <TweaksPanel />
    </div>
  );
}
```

And then consume them via CSS variables:

```css
button.cta {
  background: var(--primary);
  color: white;
  font-size: var(--font-size);
}
```

## Typical tweak options

### General
- Primary color (color picker)
- Font size (12–24px slider)
- Typeface mode (display-heavy vs body-heavy)
- Dark mode (toggle)

### Slide decks
- Theme (light / dark / brand)
- Background style (solid / gradient / image)
- Typography contrast (decorative vs restrained)
- Information density (minimal / standard / dense)

### Product prototypes
- Layout variants (A / B / C)
- Interaction speed (0.5x–2x)
- Data volume (5 / 20 / 100 rows)
- State (empty / loading / success / error)

### Animation
- Speed (0.5x–2x)
- Looping mode (once / loop / ping-pong)
- Easing (linear / easeOut / spring)

### Landing pages
- Hero style (image / gradient / pattern / solid)
- CTA copy variants
- Structure (single-column / two-column / sidebar)

## Design principles for Tweaks

### 1. Expose meaningful options, not noisy ones

Each tweak should represent a **real design option**. Avoid controls that merely let users fiddle without helping them see a stronger direction.

Good tweaks usually expose **discrete, opinionated variations**:
- Corner style: none / slight / large
- Density: compact / comfortable / spacious
- Typography mode: restrained / expressive

Bad tweak:
- Border radius: 0–50px slider

If most in-between values look bad, the control is not helping; it is offloading design judgment onto the user.

### 2. Less is more

A Tweaks panel should generally have **no more than 5–6 options**. Beyond that it turns into a configuration screen instead of a quick design exploration surface.

### 3. Default values must already be a finished design

Tweaks are an enhancement, not a rescue plan. The default state must already be a coherent, publishable design. If the user closes the panel, what remains should still feel like the intended deliverable.

### 4. Group options when there are enough of them

For example:

```
---- Visual ----
Primary color | Font size | Dark mode

---- Layout ----
Density | Sidebar position

---- Content ----
Visible data volume | State
```

## Forward compatibility with source-persistent tweak hosts

If you want the same design to work later in a host that supports source-level tweak persistence, keep an **EDITMODE marker block**:

```jsx
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;
```

That marker does nothing in the localStorage version, but remains harmless and future-compatible.

## Common issues

**The Tweaks panel blocks the design**
→ Make it collapsible. Default to closed, with a small button.

**Users have to reconfigure everything after refresh**
→ localStorage should already solve that. If it does not, check whether localStorage is available (private browsing may fail; catch errors).

**Multiple HTML pages need to share the same tweaks**
→ Namespace the key, e.g. `design-tweaks-[projectName]`.

**Some tweaks should affect others**
→ Add logic inside `update()`:

```jsx
const update = (patch) => {
  let next = { ...tweaks, ...patch };
  if (patch.dark === true && !patch.textColor) {
    next.textColor = '#F0EEE6';
  }
  setTweaks(next);
  localStorage.setItem(...);
};
```
