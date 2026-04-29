# Editable PPTX Export: HTML Constraints, Size Decisions, and Common Errors

This document covers the path that turns HTML into **truly editable PowerPoint text boxes** via `scripts/html2pptx.js` + `pptxgenjs`. It is the only path supported by `export_deck_pptx.mjs`.

## Core premise

If you want editable PPTX, the HTML must be written from the first line with the required constraints in mind. This is **not** a “design freely first, fix it later” workflow.

If you care more about visual fidelity than editability — animations, gradients, web components, complex SVG — use the PDF path instead.

## Canvas size

Recommended body size: **`960pt × 540pt`**, which matches `pptxgenjs` `LAYOUT_WIDE` (13.333″ × 7.5″).

Do not think of this as “screen resolution.” PPTX cares about **physical slide size**, not pixel density. The Chinese source explicitly warns that a naïve `1920px × 1080px` body maps to a nonstandard ~20″ × 11.25″ slide and makes typography feel oddly small when projected.

Equivalent forms:

```css
body { width: 960pt;  height: 540pt; }
body { width: 1280px; height: 720px; }
body { width: 13.333in; height: 7.5in; }
```

Corresponding pptxgenjs:

```js
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
```

## The four hard constraints

### 1. Text cannot live directly inside `div`
Wrap text in `<p>` or `<h1>`–`<h6>`.

```html
<!-- Wrong -->
<div class="title">Q3 revenue grew 23%</div>

<!-- Correct -->
<div class="title"><h1>Q3 revenue grew 23%</h1></div>
```

Important nuance: do **not** use `<span>` as the primary text carrier either. `span` is only for inline styling inside a real paragraph / heading text frame.

### 2. No CSS gradients
Use solid fills only.

```css
/* Wrong */
background: linear-gradient(to right, #FF6B6B, #4ECDC4);

/* Correct */
background: #FF6B6B;
```

If you need stripes, fake them with multiple flex children using solid colors.

### 3. Background / border / shadow belongs on `div`, not text elements

```html
<!-- Wrong -->
<p style="background:#FFD700">Important</p>

<!-- Correct -->
<div style="background:#FFD700; padding:8pt 12pt; border-radius:4pt;">
  <p>Important</p>
</div>
```

### 4. Do not use `background-image` on `div`
Use an `<img>` tag instead.

```html
<!-- Wrong -->
<div style="background-image:url('chart.png')"></div>

<!-- Correct -->
<img src="chart.png" style="position:absolute; ..." />
```

## Starter template

The Chinese source includes a full page template. The important principles are:
- body size matches `LAYOUT_WIDE`
- backgrounds live on divs
- text lives in semantic paragraph / heading tags
- lists use `ul` / `ol`
- images use `<img>`

## Common error messages

| Error | Cause | Fix |
|---|---|---|
| `DIV element contains unwrapped text` | naked text inside a div | wrap it in `<p>` or `<h*>` |
| `CSS gradients are not supported` | gradient used | replace with a solid color |
| `Text element <p> has background` | styling on paragraph itself | move it to wrapper div |
| `Background images on DIV elements are not supported` | `background-image` on div | switch to `<img>` |
| `HTML content overflows body` | content exceeds 540pt | reduce content or scale |
| `HTML dimensions don't match presentation layout` | body size mismatch | align body with `LAYOUT_WIDE` |

## Basic workflow

1. Write each slide as an independent HTML file under the constraints
2. Use a small build script that calls `html2pptx` for each file
3. Open the output in PowerPoint / Keynote and confirm text is editable

## When to choose this path

Choose editable PPTX when collaborators genuinely need to change text later in PowerPoint.

Choose PDF when:
- visual fidelity matters more than editability
- the HTML uses gradients, web components, complex SVG, or animation-heavy structure

## If the user asks for editable PPTX after the visual HTML is already done

Best fallback:
1. first recommend PDF
2. if they insist, rewrite the HTML into the constrained editable format while preserving the visual hierarchy and color decisions
3. export both: a visually faithful PDF and a simplified editable PPTX

Do **not** jump straight to hand-authoring a giant `pptxgenjs` rebuild unless there is truly no other option. The Chinese source treats that as a last-ditch maintenance trap, not a normal workflow.

## Why these are not arbitrary tool limitations

They come from the structure of PPTX itself:
- text lives in text frames
- shapes and text are separate objects
- image objects need image sources, not CSS backgrounds
- arbitrary CSS gradients do not map cleanly to PowerPoint shape fills

So the HTML must adapt to PPTX’s physical constraints, not the other way around.
