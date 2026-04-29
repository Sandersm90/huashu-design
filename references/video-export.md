# Video Export: Export HTML Animation to MP4 / GIF

When an animation HTML is done, users often ask: “Can this be exported as video?” This guide gives the full path.

## When to export

Export only after:
- the animation runs correctly end to end
- the visuals have been verified (Playwright screenshots at key timestamps)
- the user has viewed it in a browser at least once and confirmed the direction

Do **not** export while key animation bugs are still unresolved. Video export makes late fixes more expensive.

## Output formats

Default recommendation: give the user all three formats at once.

| Format | Spec | Best for |
|---|---|---|
| MP4 25fps | 1920×1080 · H.264 · CRF 18 | WeChat embeds, social, YouTube |
| MP4 60fps | 1920×1080 · H.264 · 60fps | high-frame-rate showcases, Bilibili, portfolios |
| GIF | 960×540 · 15fps · optimized palette | X/Twitter, README, Slack previews |

## Toolchain

### 1. `render-video.js` — HTML → MP4

Records a 25fps base MP4.

```bash
NODE_PATH=$(npm root -g) node scripts/render-video.js <html-file>
```

Common options:
- `--duration=30`
- `--width=1920 --height=1080`
- `--trim=2.2`
- `--fontwait=1.5`

Output: a same-name `.mp4` next to the HTML.

### 2. `add-music.sh` — MP4 + BGM → MP4

Adds background music to a silent MP4. Picks from the built-in BGM library by mood, or uses a custom track.

```bash
bash scripts/add-music.sh <input.mp4> [--mood=<name>] [--music=<path>] [--out=<path>]
```

Built-in moods:
- `tech`
- `ad`
- `educational`
- `educational-alt`
- `tutorial`
- `tutorial-alt`

Behavior:
- trims music to video length
- 0.3s fade in + 1s fade out
- video copied without re-encoding (`-c:v copy`)
- custom `--music` overrides `--mood`

### 3. `convert-formats.sh` — MP4 → 60fps MP4 + GIF

```bash
bash scripts/convert-formats.sh <input.mp4> [gif_width] [--minterpolate]
```

Outputs:
- `<name>-60fps.mp4`
- `<name>.gif`

Two 60fps modes:
- default frame duplication (`fps=60`) — most compatible
- `--minterpolate` — higher-quality interpolation, but some macOS players may reject it

## Standard workflow

```bash
cd <skill-project-root>

NODE_PATH=$(npm root -g) node scripts/render-video.js my-animation.html
bash scripts/convert-formats.sh my-animation.mp4
# optional
bash scripts/add-music.sh my-animation-60fps.mp4 --mood=tech
```

## Technical notes

### Playwright recording limitations
- source recording is fixed at 25fps
- recording starts when the context is created, so trimming is required
- output is initially WebM and then converted to H.264 MP4

`render-video.js` already handles these constraints.

### Why GIF export is two-pass
GIF is limited to 256 colors. A generated palette pass followed by a palette-usage pass gives much better results for subtle warm backgrounds and accent colors.

## Pre-flight checklist

- [ ] HTML runs without console errors
- [ ] frame 0 is a proper initial frame, not a loading blank
- [ ] the last frame is stable and intentional
- [ ] fonts / images / emoji render correctly
- [ ] duration matches the real animation length
- [ ] the Stage respects `window.__recording` and disables looping during export
- [ ] ending sprites use `fadeOut={0}` so the last frame stays clear
- [ ] the animation watermark rules in `SKILL.md` are respected

## Delivery note format

```markdown
**Delivered**

| File | Format | Spec | Size |
|---|---|---|---|
| foo.mp4 | MP4 | 1920×1080 · 25fps · H.264 | X MB |
| foo-60fps.mp4 | MP4 | 1920×1080 · 60fps · H.264 | X MB |
| foo.gif | GIF | 960×540 · 15fps · optimized palette | X MB |

**Notes**
- 60fps uses motion interpolation or duplicated frames depending on mode
- GIF uses palette optimization for smaller file size
```

## Common follow-up requests

| User asks | Response |
|---|---|
| “Too large” | raise MP4 CRF or reduce GIF width / fps |
| “GIF is too blurry” | increase GIF width to 1280 or recommend MP4 |
| “Need vertical 9:16” | rerender HTML at 1080×1920 |
| “Add watermark” | use ffmpeg `drawtext` or image overlay |
| “Need transparent background” | MP4 cannot do alpha; use WebM VP9 or APNG |
| “Need lossless” | set CRF to 0, accept much larger files |
