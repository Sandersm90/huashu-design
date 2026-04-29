# Apple Gallery Showcase · Gallery-Wall Animation Style

> Inspired by the Claude Design homepage hero and Apple-style product-page “works wall” displays.
> Production origin: Huashu-Design launch hero v5.
> Best for **product-launch hero animation, skill capability showcase, and portfolio display** — any case where you need to exhibit many high-quality outputs at once while still guiding attention.

---

## Trigger check: when to use this style

**Good fit**:
- you have **10+ real outputs** to display at once: slides, apps, websites, infographics
- the audience is professional and sensitive to craft: developers, designers, product people
- the mood should feel **restrained, exhibition-like, premium, and spacious**
- you need both **focus** and **the larger field** to remain present

**Not a fit**:
- a single-product hero where one object should dominate the whole story
- strongly emotional or narrative animation; use a timeline-story structure instead
- small-screen or vertical formats; the tilted perspective gets muddy there

---

## Core visual tokens

A warm light-gallery palette, one terracotta accent, and type that feels closer to a publication than a web product.

**Key principles**:
1. **Never use pure black as the main base.** A black field makes the work feel cinematic, not like adoptable, real design output.
2. **Terracotta orange should be the only hue accent.** Let everything else stay in whites and grays.
3. Use **serif + sans + mono** to create a publishing / exhibition atmosphere rather than generic internet-product energy.

---

## Core layout patterns

### 1. Floating card
The fundamental unit of the whole style.

Use white cards with:
- a thin hairline border
- soft, layered shadows
- a slightly smaller inner image radius
- enough padding to feel like mounting paper, not edge-to-edge tiles

**Anti-pattern**: edge-to-edge tiles with no padding, border, or shadow. That reads like dense infographic layout, not exhibition display.

### 2. 3D tilted gallery wall
Use perspective plus modest `rotateX`, `rotateY`, and a slight `rotateZ`.

The subtle `rotateZ` matters: it removes the sterile feeling of “a machine placed every card perfectly.” It adds just enough human irregularity.

The offscreen canvas should be larger than the viewport so the camera feels like it is peeking across a larger exhibition field, not staring at a fixed grid.

### 3. 2×2 corner convergence
Four cards enter from the four corners toward the center.

This is especially good for openings where you are presenting **multiple candidate directions** at once.

---

## Five core animation modes

### A · Corner convergence
Cards slide in from the four corners, fade up, and scale from roughly `0.85 → 1.0` with an ease-out curve.

Use it when you want the viewer to feel that several directions are arriving into one shared stage.

### B · Focus enlarge + others drift away
The selected card grows from `1.0 → 1.28` while the others fade, blur, and drift back toward the corners.

**Key nuance**: the unselected cards should not merely fade. They should also **blur slightly** so the chosen card feels optically pushed forward by depth-of-field, not just emphasized by opacity.

### C · Ripple reveal
Cards reveal outward from the center with distance-based delay while the whole wall scales from an enlarged state toward a slightly zoomed-out state.

The feeling should be “the lens pulling back and revealing the full field,” not “a bunch of tiles appearing one by one.”

### D · Sinusoidal pan
Combine slow sine/cosine drift with gentle linear drift.

The purpose is to avoid the cheap feeling of a marquee loop that has an obvious beginning and end. The wall should feel like it is **quietly floating in a larger world**.

### E · Focus overlay
The focus overlay is a **flat element**, not a tilted one. It floats above the tilted wall and expands the chosen slide into a large centered presentation surface.

Background cards should dim, but they must stay visible. Do **not** crush the background under a full blackout; the whole point is to preserve the exhibition field while briefly isolating attention.

---

## Timeline skeleton

The Chinese source includes a full timing object and canonical `render(t)` structure. The core architectural idea is:
- all state is derived from time
- there is no `setTimeout` choreography
- any frame can be jumped to deterministically

That is what makes this style easy to debug, capture frame-by-frame, and loop cleanly.

---

## Texture details that matter more than they look

- a barely visible noise layer keeps light backgrounds from feeling too flat
- a corner brand tag can act like a gallery label in a museum
- wordmarks often benefit from **negative tracking** so they lock up like marks, not plain text

The Chinese note is right here: with the noise texture, the viewer may not consciously notice a difference — but remove it and the stage suddenly feels dead.

---

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Looks like a slide template | no shadows / no hairline borders | add exhibition framing cues |
| Tilt feels cheap | only one rotation axis | use slight `rotateZ` too |
| Pan feels mechanical | looped CSS animation or timer-like logic | use `requestAnimationFrame` + sine/cosine motion |
| Focused image is blurry | reusing a low-res tile image | use a separate high-res overlay source linked to the original asset |
| Background feels empty | completely flat `#F5F5F7` field | add subtle noise / texture |
| Typography feels too “internet” | only Inter or generic product sans | add serif and mono layers |

---

## Reference note

When the need is “display many strong outputs at once,” this file is meant to be copied as a starting skeleton and then retimed / reskinned for the specific work.
