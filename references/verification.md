# Verification: Output Validation Workflow

Some design-agent environments include a built-in screenshot verifier. Most do not. In those cases, use Playwright and the bundled `scripts/verify.py` helper to cover the same checks manually.

## Verification checklist

Run through this checklist every time you produce HTML:

### 1. Browser rendering check (required)

Most basic question: **does the HTML open at all?** On macOS:

```bash
open -a "Google Chrome" "/path/to/your/design.html"
```

Or use Playwright screenshots (next section).

### 2. Console error check

The most common HTML failure mode is a JS error that turns the page white. Use Playwright:

```bash
python scripts/verify.py path/to/design.html
```

Run that command from the skill project root. The script will:
1. Open the HTML in headless Chromium
2. Save a screenshot next to the project
3. Capture console errors
4. Report status

See `scripts/verify.py` for details.

### 3. Multi-viewport check

If the design is responsive, capture multiple viewports:

```bash
python scripts/verify.py design.html --viewports 1920x1080,1440x900,768x1024,375x667
```

### 4. Interaction check

Tweaks, animations, button toggles: static screenshots do not cover them. **Best practice: have the user click through it in a real browser**, or record interaction with Playwright:

```python
page.video.record('interaction.mp4')
```

### 5. Slide-by-slide deck check

For deck-style HTML, capture slides one by one:

```bash
python scripts/verify.py deck.html --slides 10
```

This generates `deck-slide-01.png`, `deck-slide-02.png`, and so on for quick review.

## Playwright setup

On first use:

```bash
# If not installed yet
npm install -g playwright
npx playwright install chromium

# Or Python version
pip install playwright
playwright install chromium
```

If Playwright is already installed in the environment, just use it.

## Screenshot best practices

### Capture the full page

```python
page.screenshot(path='full.png', full_page=True)
```

### Capture only the viewport

```python
page.screenshot(path='viewport.png')
```

### Capture a specific element

```python
element = page.query_selector('.hero-section')
element.screenshot(path='hero.png')
```

### High-resolution screenshots

```python
page = browser.new_page(device_scale_factor=2)
```

### Wait for animations to settle

```python
page.wait_for_timeout(2000)
page.screenshot(...)
```

## Sharing screenshots with the user

### Open local screenshots directly

```bash
open screenshot.png
```

The user can inspect them in Preview / Figma / VSCode / a browser.

### Upload to an image host

If a remote collaborator needs them (Slack / Feishu / WeChat, etc.), use the user’s own uploader or tooling:

```bash
python ~/Documents/写作/tools/upload_image.py screenshot.png
```

That returns a permanent ImgBB link.

## If verification fails

### White page

There is almost always a console error. Check:

1. Whether the React+Babel script-tag integrity hashes match `react-setup.en.md`
2. Whether you have a `const styles = {...}` naming collision
3. Whether cross-file components were exported to `window`
4. JSX syntax errors (switch from `babel.min.js` to non-minified `babel.js` for clearer errors)

### Choppy animation

- Record performance in Chrome DevTools
- Look for layout thrashing (frequent reflows)
- Prefer `transform` and `opacity` for animation (GPU-friendly)

### Wrong fonts

- Check whether the `@font-face` URL is reachable
- Check font fallback behavior
- Chinese fonts may load slowly: show fallback first, then swap

### Misaligned layout

- Check whether `box-sizing: border-box` is applied globally
- Check the `* { margin: 0; padding: 0 }` reset
- Turn on grid overlays in Chrome DevTools to inspect the real layout

## Verification is a designer’s second pair of eyes

**Always review it yourself once.** AI-written code often has issues like:

- Looks right, but interaction is broken
- Static screenshot is fine, but scrolling misaligns things
- Wide screens look good, narrow screens collapse
- Dark mode was never tested
- Some components do not respond when Tweaks change

**The last 1 minute of verification can save 1 hour of rework.**

## Common verify.py commands

```bash
# Basic: open + screenshot + error capture
python scripts/verify.py design.html

# Multiple viewports
python scripts/verify.py design.html --viewports 1920x1080,375x667

# Multiple slides
python scripts/verify.py deck.html --slides 10

# Output to a specific directory
python scripts/verify.py design.html --output ./screenshots/

# headless=false, show a real browser window
python scripts/verify.py design.html --show
```
