# Audio Design Rules · Huashu-Design

> The audio formula for all animation demos. Use together with `sfx-library.en.md`.
> Grounded in repeated iteration: Huashu-Design launch-hero v1–v9, deep Gemini-assisted breakdowns of three official Anthropic films, and 8000+ A/B comparisons.

---

## Core principle · dual-track audio (hard rule)

Animation audio should be designed as **two independent layers**, not one:

| Layer | Role | Time scale | Relationship to visuals | Frequency zone |
|---|---|---|---|---|
| **SFX (beat layer)** | marks individual visual beats | short, 0.2–2s | **tight sync**; often frame-level | **high band, 800Hz+** |
| **BGM (atmosphere bed)** | emotional floor, continuity, soundstage | sustained, 20–60s | loose sync; section-level | **mid/low band, under 4kHz** |

Animation with **only BGM** usually feels crippled: the viewer subconsciously feels that the picture is moving but the sound is not answering it.

---

## Gold standard · tested working ratios

These numbers are treated as engineering defaults, not vague taste advice:

### Volume
- **BGM volume**: `0.40–0.50`
- **SFX volume**: `1.00`
- **Loudness gap**: BGM peaks should sit roughly **6–8 dB below** SFX peaks
- **`amix` setting**: `normalize=0`

Do **not** use `normalize=1`; it flattens the dynamic range and makes everything feel cheaper.

### Frequency separation (P1 hard optimization)
The real trick is not “loud SFX.” It is **spectral separation**:

```bash
[bgm_raw]lowpass=f=4000[bgm]      # keep BGM mostly in the mid/lows
[sfx_raw]highpass=f=800[sfx]      # push SFX into the presence band
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]
```

Why this works: the ear is highly sensitive around **2–5kHz**. If your BGM still occupies that band heavily, it masks the intelligibility of the SFX. High-pass the SFX and low-pass the BGM, and the perceived clarity jumps immediately.

### Fade
- BGM in: `afade=in:st=0:d=0.3`
- BGM out: `afade=out:st=N-1.5:d=1.5`
- SFX usually carries its own transient envelope; do not over-fade it

---

## SFX cue design rules

### Density
Measured against the three Anthropic references, there are roughly three useful density bands:

| Piece | SFX per 10s | Product personality | Typical use |
|---|---|---|---|
| Artifacts | ~9 / 10s | feature-dense, information-rich | complex tool demo |
| Code Desktop | 0 | meditative, focused | developer-tool flow state |
| Word | ~4 / 10s | balanced, office rhythm | productivity tool |

**Heuristics**:
- calm / focused personality → low density, around **0–3 cues per 10s**
- lively / information-rich personality → high density, around **6–9 cues per 10s**
- do **not** fill every visual beat; deleting **30–50%** of the cues often makes the remaining ones feel more dramatic and more expensive

### Cue priority
Not every beat deserves a sound.

**P0 · must-have**:
- typing
- click / selection
- focus transfer
- logo reveal / brand closure

**P1 · strongly recommended**:
- card / modal entrance or exit
- completion / success feedback
- AI generation start / finish
- major scene transition

**P2 · optional**:
- hover / focus-in
- progress ticks
- decorative ambient accents

### Timestamp precision
- **same-frame alignment**: clicks, focus changes, logo landings
- **1–2 frames early**: fast whooshes, to give psychological anticipation
- **1–2 frames late**: impacts / landings, to feel physically believable

---

## BGM selection decision tree

Huashu-Design ships with 6 BGM tracks (`assets/bgm-*.mp3`):

```text
What is the animation’s personality?
├─ Product launch / tech demo       → bgm-tech.mp3
├─ Tutorial / tool walkthrough      → bgm-tutorial.mp3
├─ Education / explanation          → bgm-educational.mp3
├─ Marketing / brand promo          → bgm-ad.mp3
└─ Similar mood but different taste → bgm-*-alt.mp3
```

### Cases where no BGM is worth considering
Following the Code Desktop reference, **pure lo-fi BGM** or even **near-no-music restraint** can feel extremely premium.

Consider no BGM when:
- the animation is under **10s** and music cannot establish itself
- the product personality is focused / meditative
- the scene already has ambient sound or voiceover
- SFX density is already high and you want to avoid auditory overload

---

## Ready-made scene formulas

### Formula A · Product launch hero
```text
Duration: 25s
BGM: bgm-tech.mp3 · 45% · below 4kHz
SFX density: ~6 / 10s

Cues:
  terminal typing  → type × 4 (0.6s spacing)
  enter            → enter
  card convergence → card × 4 (0.2s stagger)
  selection        → click
  ripple           → whoosh
  4 focus shifts   → focus × 4
  logo             → thud / logo hit (1.5s)

Mix: BGM 0.45 / SFX 1.0 · amix normalize=0
```

### Formula B · Tool feature demo
```text
Duration: 30–45s
BGM: bgm-tutorial.mp3 · 50%
SFX density: 0–2 / 10s

Strategy:
- let music and UI rhythm carry most of the piece
- reserve SFX for decisions, confirmations, and one or two structural transitions
```

### Formula C · AI generation demo
```text
Duration: 15–25s
BGM: bgm-tech or bgm-educational
SFX density: 6–8 / 10s

Suggested chain:
generate-start → ai-process texture → sparkle / transform → complete-done
```

### Formula D · Atmospheric long take
```text
Duration: 20–40s
BGM: none, or extremely restrained
SFX density: sparse

Strategy:
- emphasize space and pacing
- let silence become part of the design
```

---

## ffmpeg mixing templates

The Chinese source includes detailed command templates for:
- one SFX layered over a video
- building a timed SFX track with `adelay`
- mixing video + SFX + BGM with frequency separation

Use those directly when implementing; they reflect the tested production path.

---

## Common failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| SFX gets buried | BGM high frequencies are masking it | low-pass BGM, high-pass SFX |
| SFX feels harsh | you pushed absolute volume instead of using contrast | lower SFX slightly and preserve the loudness gap |
| BGM and SFX fight each other rhythmically | the BGM is too beat-heavy for the scene | pick a less rhythmically dominant track |
| Music ends abruptly | no fade out | add `afade=out` |
| SFX collapses into mud | too many cues stacked too tightly | shorten cues and increase spacing |

---

## Advanced visual-audio alignment

- warm, paper-like visuals → softer, woodier, more tactile SFX
- cold tech visuals → cleaner digital / metallic SFX
- playful or hand-drawn visuals → lighter, more exaggerated cues

A useful high-level trick: sometimes it is better to design the **SFX timeline first**, then let the visual beats snap to it.

---

## Pre-release checklist

- [ ] Is the BGM/SFX peak difference in the right range?
- [ ] Is frequency splitting applied?
- [ ] Is `normalize=0` preserved?
- [ ] Does BGM fade in and fade out cleanly?
- [ ] Does cue density fit the product personality?
- [ ] Are the major cues frame-aligned?
- [ ] Does the logo reveal carry enough sonic weight?
- [ ] Does each layer still make sense when heard by itself?
