# Animations: Timeline Animation Engine

Read this when you are making motion-design HTML. It explains the core model, usage, and common patterns.

## Core pattern: Stage + Sprite

The animation system in `assets/animations.jsx` provides:
- **`<Stage>`**: the outer timeline container with auto-scaling, scrubber, play/pause/loop controls
- **`<Sprite start end>`**: a time slice that only exists between `start` and `end`
- **`useTime()`**: reads current global time in seconds
- **`useSprite()`**: reads local `t` for the current sprite
- **`Easing.*`** and `interpolate()`

It borrows from Remotion / After Effects ideas, but stays lightweight.

## Starter example

The Chinese source contains a full runnable sample. The main idea is:
- wrap the whole animation in `Stage duration={...}`
- break the story into `Sprite` ranges
- use local `t` for opacity / position / timing

## Common patterns

### Fade in / fade out
Use local `t` and `opacity` interpolation.

### Slide in
Translate from an edge while increasing opacity.

### Typewriter
Reveal text progressively by character count or chunk count.

### Count up
Interpolate a numeric value over time.

### Multi-phase teaching / explainer animation
Lay out scenes in a timeline:
- problem
- approach
- result
- always-visible caption layer

## Easing functions

Available easings include:
- `linear`
- `easeIn`
- `easeOut`
- `easeInOut`
- `expoOut` ⭐
- `overshoot` ⭐
- `spring`
- `anticipation`

Default recommendation:
- entrances → `expoOut`
- exits → `easeIn`
- toggles → `overshoot`

## Timing guidance

- micro-interactions: 0.1–0.3s
- UI transitions: 0.3–0.8s
- narrative animation segment: 2–10s
- do not make a single narrative segment longer than ~10s

## Design order of operations

1. Content / story first, animation second
2. Write the scene timeline before you build components
3. Gather assets before you animate

## Common problems

**Animation stutters**
→ Use `transform` and `opacity`, not layout-affecting properties.

**Animation is too fast**
→ Text needs real reading time; one sentence often needs ~3 seconds.

**Animation is too slow**
→ Static frames beyond ~5 seconds become dull.

**Animations interfere with each other**
→ Use `will-change` appropriately and avoid heavy layout thrashing.

## Video export

Use the built-in export tools:
- `scripts/render-video.js`
- `scripts/convert-formats.sh`

If you need a fully pure frame-based render pipeline, see `animation-pitfalls.en.md`.

## About fallback libraries

If you truly need more advanced physical animation primitives, you can fall back to something like Popmotion — but try the built-in engine first. It covers most real use cases.
