# Cinematic Patterns · Best Practices for Workflow Demos

> Five patterns for upgrading from “PPT animation” to “launch-event cinematic” storytelling.

## What this solves

When you need to demo a workflow (skill flow, product onboarding, API flow, agent execution), there are two modes:
- **bad**: step 1 fades in, then step 2, then step 3 — feels like PPT
- **good**: scene-based cinematic focus with dissolves, focus pulls, and morphs — feels like a product film

The difference is narrative structure more than animation technology.

## Five core patterns

### A · Dashboard + cinematic overlay
Default state shows a real static workflow dashboard. A play trigger launches a cinematic overlay, then returns to the dashboard.

Important implementation detail: the default state should **not** be a blank black screen with a giant centered play icon. Keep the dashboard visible at all times, and use a small launch control (typically bottom-right) so the page still communicates the workflow before playback.

### B · Scene-based, not step-based
Think in 5 scenes:
1. invoke
2. process
3. insight / result
4. output
5. hero reveal

~22 seconds is a very good default length.

Typical timing is roughly:
- invoke: 3–4s
- process: 5–6s
- result / insight: 4–5s
- output: 3–4s
- hero reveal: 4–5s

Build this on a **single timeline render loop** (`requestAnimationFrame` over a shared `T` map), not a `setTimeout` chain. The Chinese source is stricter here than the old English summary: chained timeouts are a real anti-pattern because they are fragile and hard to tune.

### C · Each demo needs its own visual language
Do not reuse one cinematic template and swap only the copy. Different workflows need different metaphors and motion languages.

### D · Use real generated assets, not emoji or hand-drawn SVG
For floating objects, panels, and thematic materials, use actual generated imagery or extracted transparent assets.

This is specifically about avoiding the “cheap demo” look. Emoji and quick SVG doodles erase brand specificity. If you need a gallery / orbit / floating-asset scene, generate or collect a coherent asset set first.

### E · BGM + SFX dual-track system
Silence makes demos feel cheap. Use music + cue-based effects, with user-triggered playback to respect autoplay limits.

Minimum control surface:
- user-triggered start / play state
- a mute button the viewer can reach at any time
- no forced autoplay just because the slide became visible

## Static dashboard layer

A dashboard should answer, even before the cinematic starts:
- what the workflow is
- what real output looks like
- how it evolves over time
- example inputs and outputs

In practice, a good dashboard usually combines a few distinct panel roles rather than repeating the same card type:
- pipeline / flow diagram
- snapshot of real state or output
- trajectory / evolution panel
- examples / gallery
- input → output strip

## Dev tools you should always add

- `?seek=N` to freeze on second N
- `?autoplay=1` to skip the play prompt in testing
- a small replay button

## iframe embedding pitfalls

- parent click zones can steal play-button clicks
- keyboard focus can get trapped inside the iframe
- file:// and http:// behave differently, especially for audio autoplay

## Anti-pattern summary

- defaulting to a blank overlay with a huge play icon
- step-by-step box fades instead of scenes
- reusing the same visual template for different demos
- emoji / bad SVG as visual assets
- no audio
- `setTimeout` chains instead of a timeline render loop
