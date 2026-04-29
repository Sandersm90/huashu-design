# Deep Design Critique Guide

> Detailed reference for Phase 7 critique work: scoring criteria, scenario weighting, and common issue lists.

---

## Scoring criteria in detail

### 1. Philosophy alignment

| Score | Standard |
|---|---|
| 9–10 | The design fully embodies the core spirit of the chosen philosophy; nearly every detail feels philosophically grounded. |
| 7–8 | The overall direction is right and the signature traits are present, with only a few details drifting off-course. |
| 5–6 | The intent is visible, but execution mixes in other stylistic habits and the result lacks purity. |
| 3–4 | It imitates the surface but does not understand the underlying philosophy. |
| 1–2 | It is largely unrelated to the chosen philosophy. |

**Review points**:
- Does it use the signature moves of that designer / studio / lineage?
- Do the color, type, and layout actually belong to that philosophy?
- Are there self-contradictory choices? For example: choosing Kenya Hara, then cramming the surface with content.

### 2. Visual hierarchy

| Score | Standard |
|---|---|
| 9–10 | The eye moves naturally along the intended path; reading the information feels frictionless. |
| 7–8 | Primary and secondary relationships are clear, with only one or two slightly muddy spots. |
| 5–6 | You can tell title from body, but the middle layers are confused. |
| 3–4 | Information is flattened; there is no clear visual entry point. |
| 1–2 | Chaotic; the viewer does not know where to look first. |

**Review points**:
- Is the title-to-body size contrast strong enough? A good baseline is at least **2.5×**.
- Do color, weight, and scale establish **3–4 readable hierarchy levels**?
- Is whitespace helping direct the eye?
- Does the hierarchy survive the **squint test**?

### 3. Craft quality

| Score | Standard |
|---|---|
| 9–10 | Pixel-level precision; alignment, spacing, and color use feel immaculate. |
| 7–8 | Overall refined, with only one or two tiny alignment or spacing issues. |
| 5–6 | Basically aligned, but spacing is inconsistent and color use is not systematized. |
| 3–4 | Obvious alignment mistakes, messy spacing, too many colors. |
| 1–2 | Rough; it still feels like a draft. |

**Review points**:
- Is there a consistent spacing system, such as an 8pt grid?
- Is spacing between similar elements consistent?
- Is the number of colors controlled? Usually no more than **3–4**.
- Is the font family count controlled? Usually no more than **2**.
- Do edges align precisely?

### 4. Functionality

| Score | Standard |
|---|---|
| 9–10 | Every design element serves the goal; there is effectively no redundancy. |
| 7–8 | Clearly functional, with only a small amount of removable decoration. |
| 5–6 | Usable, but decorative elements noticeably distract from the message. |
| 3–4 | Form outweighs function; the viewer has to work to find the information. |
| 1–2 | Decoration completely overwhelms communication. |

**Review points**:
- If you removed any one element, would the design get worse? If not, delete it.
- Is the CTA / key information in the most prominent place?
- Are there elements that exist only because they “look cool”?
- Does the information density suit the medium? Slide decks should usually stay lighter; PDFs can carry more density.

### 5. Originality

| Score | Standard |
|---|---|
| 9–10 | It feels genuinely fresh and finds a distinctive expression inside the chosen philosophy. |
| 7–8 | It has its own point of view rather than just applying a template. |
| 5–6 | Competent but generic; it feels templated. |
| 3–4 | It leans heavily on clichés, such as gradient blobs standing in for “AI.” |
| 1–2 | It is basically a template or asset collage. |

**Review points**:
- Does it avoid the common clichés listed below?
- Does it maintain some personal judgment while staying inside the chosen philosophy?
- Are there any decisions that feel surprising **and** right?

---

## Scenario weighting

Different output types deserve different review emphasis:

| Scenario | Most important | Secondary | Can be relaxed |
|---|---|---|---|
| WeChat article cover / supporting image | Originality, visual hierarchy | Philosophy alignment | Functionality (single images do not involve interaction) |
| Infographic | Functionality, visual hierarchy | Craft quality | Originality (accuracy comes first) |
| PPT / Keynote | Visual hierarchy, functionality | Craft quality | Originality (clarity comes first) |
| PDF / white paper | Craft quality, functionality | Visual hierarchy | Originality (professionalism comes first) |
| Landing page / official site | Functionality, visual hierarchy | Originality | — full-stack expectations |
| App UI | Functionality, craft quality | Visual hierarchy | Philosophy alignment (usability comes first) |
| Xiaohongshu supporting image | Originality, visual hierarchy | Philosophy alignment | Craft quality (atmosphere can matter more than polish) |

---

## Top 10 common design problems

### 1. AI-tech cliché
**Problem**: gradient blobs, digital rain, blue circuit boards, robot faces.

**Why it is a problem**: people are already numb to these images; they make your work indistinguishable from everyone else’s.

**Fix**: swap literal symbols for more abstract metaphors. For example, express “conversation” through rhythm, turn-taking, or spatial exchange instead of dropping in a chat-bubble icon.

### 2. Weak type hierarchy
**Problem**: the title and body are too close in size, usually under **2.5×**.

**Why it is a problem**: viewers cannot locate the key information quickly.

**Fix**: the title should usually be at least **3×** the body size. Example: body 16px → title 48–64px.

### 3. Too many colors
**Problem**: five or more colors with no clear primary/secondary relationship.

**Why it is a problem**: visual noise rises and brand recognition weakens.

**Fix**: constrain the system to **1 primary + 1 secondary + 1 accent + neutrals**.

### 4. Inconsistent spacing
**Problem**: spacing feels improvised instead of systematic.

**Why it is a problem**: the piece looks less professional and the visual rhythm falls apart.

**Fix**: adopt an **8pt spacing system** and stick to values like 8 / 16 / 24 / 32 / 48 / 64px.

### 5. Not enough whitespace
**Problem**: every available area gets filled.

**Why it is a problem**: crowded layouts increase reading fatigue and actually reduce communication efficiency.

**Fix**: let whitespace occupy at least **40%** of the area; minimalist work may need **60%+**.

### 6. Too many fonts
**Problem**: using three or more font families.

**Why it is a problem**: it creates visual noise and weakens unity.

**Fix**: cap it at **2 families** at most — typically one for display and one for body — then create variation through size and weight.

### 7. Inconsistent alignment
**Problem**: some things are left-aligned, some centered, some right-aligned, without a system.

**Why it is a problem**: it breaks the sense of visual order.

**Fix**: choose one dominant alignment logic — usually left alignment — and apply it consistently.

### 8. Decoration overpowering content
**Problem**: background patterns, gradients, or shadows steal attention from the message.

**Why it is a problem**: the priorities flip; the viewer came for information, not decoration.

**Fix**: ask, “If I remove this decoration, does the design get worse?” If not, remove it.

### 9. Cyber-neon overuse
**Problem**: dark-blue bases like `#0D1117` plus glowing neon accents.

**Why it is a problem**: this skill treats that as a default taste danger zone, because it has become one of the most exhausted visual clichés. Brands can override it, but it should not be the unthinking default.

**Fix**: choose a palette with stronger identity; the 20-style library is the intended source of better color systems.

### 10. Information density mismatched to the medium
**Problem**: a slide packed with a full page of text, or a cover image stuffed with ten competing elements.

**Why it is a problem**: each medium has its own optimal density.

**Fix**:
- PPT: one core idea per slide
- cover image: one visual focal point
- infographic: layered disclosure
- PDF: denser is acceptable, but only with clear navigation

---

## Output template

```markdown
## Design Critique Report

**Overall score**: X.X/10 [Excellent (8+) / Good (6–7.9) / Needs improvement (4–5.9) / Failing (<4)]

**Dimension scores**:
- Philosophy alignment: X/10 [one-line explanation]
- Visual hierarchy: X/10 [one-line explanation]
- Craft quality: X/10 [one-line explanation]
- Functionality: X/10 [one-line explanation]
- Originality: X/10 [one-line explanation]

### Keep
- [name what is already working, specifically, in design language]

### Fix
[ordered by severity]

**1. [Issue name]** — ⚠️ fatal / ⚡ important / 💡 optimization
- Current state:
- Why it is a problem:
- Specific fix: [include real operations and numbers]

### Quick wins
If you only had 5 minutes, do these three things first:
- [ ] [highest-leverage fix]
- [ ] [second]
- [ ] [third]
```

---

**Version**: v1.0
**Updated**: 2026-02-13
