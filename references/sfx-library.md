# SFX Library · Huashu-Design

> Generated with the ElevenLabs Sound Generation API. Intended to feel **Apple-keynote-grade** in clarity and restraint.
> A production-grade SFX asset library for Huashu animations, demos, and product showcases.

**Asset path**: `assets/sfx/<category>/<name>.mp3`
**Total**: 37 SFX
**Model**: ElevenLabs Sound Generation API (`prompt_influence 0.4`)
**Audio quality**: 44.1kHz MP3, clean and keynote-like, no extra reverb

## Directory structure

```text
assets/sfx/
├── keyboard/
├── ui/
├── transition/
├── container/
├── feedback/
├── progress/
├── impact/
├── magic/
└── terminal/
```

## Quick index

### Keyboard
- `type.mp3` — single key press
- `type-fast.mp3` — rapid typing
- `delete-key.mp3` — backspace
- `space-tap.mp3` — spacebar tap
- `enter.mp3` — confirm / enter key

### UI
- `click.mp3` — standard UI click
- `click-soft.mp3` — softer secondary click
- `focus.mp3` — focus / selection
- `hover-subtle.mp3` — subtle hover hint
- `tap-finger.mp3` — mobile finger tap
- `toggle-on.mp3` — iOS-style switch flip

### Transition
- `whoosh.mp3` — standard whoosh
- `whoosh-fast.mp3` — faster cinematic whoosh
- `swipe-horizontal.mp3` — horizontal swipe
- `slide-in.mp3` — panel / drawer slide-in
- `dissolve.mp3` — soft dissolve transition

### Container
- `card-snap.mp3` — card snapping into place
- `card-flip.mp3` — card flip
- `stack-collapse.mp3` — cards collapsing into a stack
- `modal-open.mp3` — modal opening

### Feedback
- `success-chime.mp3` — success signal
- `error-tone.mp3` — warning / failure
- `notification-pop.mp3` — toast / message popup
- `achievement.mp3` — milestone / reward

### Progress
- `loading-tick.mp3` — loading pulse
- `complete-done.mp3` — completion confirmation
- `generate-start.mp3` — AI generation starts

### Impact
- `logo-reveal.mp3` — short logo hit
- `logo-reveal-v2.mp3` — longer cinematic logo hit
- `brand-stamp.mp3` — stamp / certification thud
- `drop-thud.mp3` — object landing / insertion

### Magic
- `sparkle.mp3` — bright AI sparkle / highlight
- `ai-process.mp3` — AI thinking / processing bed
- `transform.mp3` — morph / transformation transition

### Terminal
- `command-execute.mp3` — command execution
- `output-appear.mp3` — output appearing
- `cursor-blink.mp3` — cursor pulse

## Recommended combinations by scenario

### Terminal interaction demo
`type → enter → command-execute → output-appear`

Optional idle bed: use `cursor-blink` as a very light ambient pulse while the terminal is waiting.

### Card selection flow
`hover-subtle → click-soft → card-snap`

### Full AI generation flow
`generate-start → ai-process → sparkle → complete-done`

### Logo reveal / brand moment
`whoosh-fast → logo-reveal-v2 → sparkle`

Think of this as **setup → landing impact → tail resonance**. For a shorter version, `whoosh → logo-reveal` is the direct v7b-style two-hit chain.

### Mobile UI demo
`tap-finger → slide-in → toggle-on`

### Data visualization / dashboard
`loading-tick × N → complete-done → achievement`

### Form submission
`click-soft → loading-tick ×2 → success-chime`

### Magic transform scene
`whoosh-fast → transform → sparkle`

## Usage rules

### Volume guidance
- SFX main track: `1.0`
- BGM: `0.4–0.5`
- Multiple SFX in one mix: use `amix=inputs=N:duration=longest:normalize=0`

The intent is not raw loudness. The intent is **clear SFX penetration over a calmer bed**.

### ffmpeg templates
See the Chinese source or `audio-design-rules.en.md` for full command examples. The key point is: mix without normalization and preserve dynamic range.

### Selection tree
1. Tactile action → `keyboard/` or `ui/`
2. Entrance / exit → `transition/`
3. Card / modal / container → `container/`
4. State feedback → `feedback/`
5. Progress / waiting → `progress/`
6. Brand / impact moment → `impact/`
7. AI magic / morphing → `magic/`
8. Terminal / code demo → `terminal/`

### Avoid SFX pile-up
- Maximum 2 concurrent SFX at the same moment
- If BGM is very low, 3 can work
- Clear space around brand impact moments

At the actual brand hit, it is usually better to leave about **0.2s of space** before the impact than to keep everything crowded.

## Prompt-writing principle

Reference style: `apple keynote, tight, minimal, no reverb unless ambient, crisp, elegant`

A good prompt includes:
1. Physical description of the sound
2. Texture / style constraint
3. Anti-example constraint (`no reverb`, `clean studio`, `minimal`)

Example of the taste difference:
- weak: `click sound`
- better: `crisp UI button click, clean modern interface sound, apple-style, high pitched`

## See also
- `audio-design-rules.en.md`
- `apple-gallery-showcase.en.md`
