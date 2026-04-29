# Animation Best Practices: Positive Motion Design Grammar

> Distilled from close study of three official Anthropic product animations.
> Use together with `animation-pitfalls.en.md`.

This file is about **how motion should work**. It does **not** prescribe brand colors. Color decisions belong to brand assets or design-direction work.

## §0 · Identity and taste first

Before any technical rule: you are not “adding CSS transitions.” You are a motion designer treating pixels as objects with mass, inertia, and physical behavior.

Core beliefs:
1. **Animation is physics, not mere easing curves**
2. **Time allocation matters more than curve shape**
3. **Yielding to the viewer is harder than showing off**

Your standard of beauty:
- weight
- pause before key information
- clear hold, not a weak fade-out
- restraint
- handmade feel
- respect for process instead of fake magic

## 1. Narrative rhythm: Slow → Fast → Boom → Stop

Anthropic-style product animation tends to follow a 5-part structure:
- trigger
- generation
- process
- burst
- landing / brand frame

The Chinese source is more specific about the ratio: roughly **15% / 15% / 40% / 20% / 10%**. For a 15s piece, think about **2s / 2s / 6s / 3s / 2s**. The point is not arithmetic precision; it is avoiding uniform density.

Do not make everything equally dense or equally paced.

## 2. Easing philosophy

Default to **physical-feeling** curves.
- `expoOut` for most entrances and major motion
- `overshoot` for toggles / emphasized interactions
- `spring` for settling and geometric landing

Avoid `linear` unless it is truly appropriate.

## 3. Motion language principles

### 3.1 Do not use pure black / pure white as the main ground
Use neutrals with temperature.

### 3.2 Easing should almost never be linear
See section 2.

### 3.3 Rhythm must have contrast
See section 1.

### 3.4 Show process, not just magic results
Anthropic’s product animations show tweaking, debugging, editing, and transformation in progress. That creates trust and controllability.

### 3.5 Mouse movement should feel human
Use curved paths and tiny irregularity, not straight-line robotic interpolation.

### 3.6 Logo ending should converge or morph
Brand lockups should feel like the narrative collapses into the logo, not like the logo merely fades in.

Likewise, the ending should usually feel like an **abrupt, confident stop with a hold**, not a weak fade-to-black.

### 3.7 Serif + sans layering
Serif gives taste and editorial quality; sans/mono gives function and UI clarity.

### 3.8 Focus changes require depth treatment
Dimming alone is not enough. Use some combination of brightness reduction, desaturation, and blur so the unfocused layer truly recedes.

## 4. Reusable movement techniques

- FLIP / shared-element transitions
- width-before-height “breathing” expansion
- 30ms staggered fade-up for rows / cards / lists
- 0.5s hover before key results
- chunk-based text reveal instead of character-by-character subtitles
- anticipation → action → follow-through
- perspective + layered translateZ
- diagonal pan with different X/Y frequencies

## 5. Scene recipes

### Recipe A · Apple Keynote–style dramatic launch
For launches and hero animations.

### Recipe B · Flow-state tooling style
For developer / productivity demos.

### Recipe C · Office-efficiency narrative style
For enterprise software and document / table / calendar demos.

## 6. What counts as AI slop in motion

Bad patterns include:
- `transition: all 0.3s ease`
- everything fading only via opacity
- logo fading in without narrative convergence
- straight-line cursor motion
- per-character `setInterval` typing
- no pause before important results
- focus changes with opacity only
- pure black / pure white grounds
- uniform pacing throughout
- weak fade-to-black endings

## 7. 60-second delivery self-check

- [ ] Does the animation have real rhythm rather than uniform pacing?
- [ ] Is `expoOut` the default main easing?
- [ ] Are toggles and emphasized actions using elastic curves?
- [ ] Do lists and cards stagger in?
- [ ] Is there a pause before key results?
- [ ] Is text reveal chunked rather than per-character?
- [ ] Do focus shifts use blur / depth treatment?
- [ ] Does the logo converge rather than merely fade in?
- [ ] Is the ground temperature-aware rather than pure black/white?
- [ ] Is the ending decisive?

## 8. Relationship to other docs

- `animation-pitfalls.en.md` → what **not** to do
- `animations.en.md` → how the engine works
- `audio-design-rules.en.md` → how to score and mix sound
- `apple-gallery-showcase.en.md` → one specific motion style
