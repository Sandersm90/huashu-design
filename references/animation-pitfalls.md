# Animation Pitfalls: Real Bugs and Rules for HTML Animation

The most common bugs in HTML animation, plus how to avoid them. Every rule here comes from a real failure case.

Read this before building animation. It usually saves a full debugging pass.

## 1. Stacked layouts — `position: relative` is a default duty
If a container holds absolutely positioned children, give that container `position: relative` explicitly. Even when no visible offset is needed, treat it as the coordinate-system anchor, not an optional flourish.

## 2. Character traps — do not rely on rare Unicode
If the chosen font lacks a glyph, it will render as tofu or disappear. For things like Space / Enter / Tab, build semantic keycaps with CSS instead of rare symbols.

## 3. Data-driven grid / flex templates
If the number of visual items comes from JS data, the CSS grid template must also be data-driven. Do not hardcode a fixed count in CSS while the JS count changes.

## 4. Transition gaps — scene changes must overlap
Fade-out and fade-in should usually cross-fade. Do not fully remove one scene and then wait before showing the next, or the viewer reads the blank gap as a bug.

## 5. Pure render principle — animation state should be seekable
`render(t)` should ideally be a pure function of time. If you must use side effects, provide an explicit reset path and expose something like `window.__seek(t)`. The real test is: can you jump to any frame without the timeline remembering stale history?

## 6. Measuring before fonts load gives wrong geometry
Anything that depends on `getBoundingClientRect`, `offsetWidth`, etc. should wait for `document.fonts.ready`, then usually one extra `requestAnimationFrame`.

## 7. Recording preparation — leave hooks for video export
The 0th frame should already be a valid initial state, not a blank loading screen. Plan export and recording behavior into the animation itself.

## 8. Batch export — temp dirs must include a PID or random suffix
Parallel export jobs can collide if they share the same temporary directory name.

## 9. Progress bars / replay buttons leaking into the video
Separate human-facing chrome from exportable content. Use a convention like `.no-record` and hide it automatically during recording.

## 10. Warmup frames leaking into the recording
Warmup and record should use separate Playwright contexts. Recording should begin from a fresh context after warmup is done.

## 11. Do not draw fake player chrome inside the canvas
If Stage already provides a scrubber and controls, do not also draw decorative progress bars, timestamps, or footer strips inside the animation itself. Those are usually filler, or worse, chrome collisions that make the export look like a screen recording instead of a designed motion piece.

## 12. Blank pre-roll or offset starts — the `__ready` × tick × lastTick trap
The starter loop must pair `window.__ready = true` with the true animation `t=0` frame. The Chinese source contains the full canonical starter template. Key ideas:
- `lastTick` starts as `null`
- animation does not advance until fonts are ready
- the first tick sets `__ready` and renders `0`
- `window.__seek` exists as a corrective hook

## 13. Never loop during recording — respect `window.__recording`
During video export, looping causes the final seconds to wrap back to scene 1. Recording mode should force `loop=false` and preserve the last frame.

## 14. Default 60fps export should use frame duplication
`minterpolate` can create compatibility issues in QuickTime / Safari. Default to simple `fps=60`; enable interpolation only explicitly.

## 15. `file://` + external `.jsx` = CORS trap
For single-file delivery, inline `animations.jsx` rather than loading it externally. External JSX often fails when the user opens the HTML directly from the file system.

## 16. Cross-scene color inversion
Reusable overlay elements (scene numbers, chapter labels, watermarks) should not hardcode a single text color. Use `currentColor`, explicit inversion props, or contrast-aware logic.

## Fast self-check

- [ ] Every `position:absolute` child has the intended positioned ancestor
- [ ] Every special glyph actually exists in the chosen font
- [ ] Grid counts and JS data counts match
- [ ] Scene transitions cross-fade cleanly
- [ ] DOM measurement waits for font readiness
- [ ] `render(t)` is pure or fully resettable
- [ ] Frame 0 is complete, not blank
- [ ] No fake player chrome is embedded in the scene
- [ ] Tick sets `window.__ready = true` on the true first frame
- [ ] Recording mode disables loop
- [ ] Ending sprites do not fade away unintentionally
- [ ] 60fps defaults to the compatible path
- [ ] Export validation checks both first frame and last frame
- [ ] Single-file delivery uses inline animation code
- [ ] Cross-scene overlays stay visible on every background
