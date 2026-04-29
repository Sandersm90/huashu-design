# Slide Decks: HTML Slide-Making Rules

Slide-making is a high-frequency design task. This document explains how to do HTML slide decks well — from architecture choice and slide design to PDF / PPTX export.

## Scope of this skill

This skill covers:
- **HTML presentation version** (always the default base deliverable): one HTML file per slide, plus `assets/deck_index.html` as the aggregator
- HTML → PDF via `scripts/export_deck_pdf.mjs` / `scripts/export_deck_stage_pdf.mjs`
- HTML → editable PPTX via `references/editable-pptx.en.md` + `scripts/html2pptx.js` + `scripts/export_deck_pptx.mjs`

> **HTML is the source. PDF and PPTX are derivatives.** No matter what final format the user wants, you should first build the browser-playable HTML deck.

Why HTML first:
- best for live presentation
- each slide can be opened and checked individually during production
- PDF / PPTX export both derive from it
- the user can receive HTML + PDF or HTML + PPTX together

## Hard checkpoint: confirm delivery format before building

This decision matters even more than “single-file vs multi-file.”

### Decision tree

All deck work begins with the same base:
- `index.html` + `slides/*.html`

Then decide whether the user also needs:
- nothing else → HTML alone
- PDF → export after the HTML is done
- editable PPTX → write the HTML under the editable constraints from the very first line

### Practical script to tell the user

> I’ll first build a browser-playable HTML deck with keyboard navigation. That is the base artifact no matter what.
> Then we decide whether you also need:
> - HTML only
> - HTML + PDF
> - HTML + editable PPTX
>
> If you need editable PPTX, I have to write the HTML under stricter constraints from the start, which sacrifices some visual freedom (no gradients, no web components, no complex SVG).

### Why editable PPTX must shape the HTML from the start

If editable PPTX is required, the HTML must follow the constraints documented in `editable-pptx.en.md`:
- fixed canvas size
- semantic text tags
- visual decorations on wrappers, not paragraphs
- `<img>` instead of `background-image`
- avoid gradients, web components, and complex SVG

If you ignore that and design freely first, you usually create 2–3 hours of avoidable rework.

Important decision rule from the Chinese source: if the user wants both **browser-playable HTML** and **editable PPTX**, that is still just the PPTX-constrained path. There is no separate “hybrid” architecture here; the stricter requirement wins.

## Before mass production: build 2 showcase slides first

If the deck has **5 or more slides**, do not go page 1 → page N in one pass.

Correct order:
1. build 2 visually different showcase pages first
2. get approval on the visual grammar
3. only then produce the remaining slides

This turns a potential “redo N slides” problem into “redo 2 slides.”

## Grammar template for publication-style decks

A common reusable structure:
- masthead / top strip
- kicker / chapter label
- large H1 with selective accent-color emphasis
- optional English subtitle
- divider line
- page-specific content structure
- footer with section name and slide count

Useful conventions:
- Chinese H1 in a strong serif
- restrained accent color use
- warm light background
- rotate the visual hero type by page: cover, portrait, timeline, graph, quote, UI mockup, etc.

## Common pitfalls

### Emoji often fail in Chromium / Playwright PDF export
Use plain Unicode symbols or text instead.

### Export script dependency errors
Install `playwright` and `pdf-lib` in the project where the export script runs.

### Webfont timing issues
Wait for fonts to load before screenshots / PDF capture.

### Information-density imbalance
A slide should usually carry one core message, not a maximal amount of content.

## First architecture choice: single-file or multi-file?

### Comparison

| Dimension | Single file + `deck_stage.js` | Multi-file + `deck_index.html` |
|---|---|---|
| CSS scope | global, easy to break | isolated per slide |
| Validation | harder | easy, each slide opens directly |
| Parallel authoring | conflict-prone | easy |
| Shared state | easier | needs messaging if needed |
| Recommended default | only for small / special decks | yes |

### Decision rule

Use **multi-file** by default.
Use **single-file** only when:
- the deck is small (roughly ≤10 slides)
- cross-slide shared state is important
- it is more like a compact pitch-demo artifact than a long deck

## Path A (default): multi-file architecture

Structure:

```text
MyDeck/
├── index.html
├── shared/
│   ├── tokens.css
│   └── fonts.html
└── slides/
    ├── 01-cover.html
    ├── 02-agenda.html
    └── ...
```

Principles:
- each slide is a complete 1920×1080 HTML file
- shared design tokens live in `shared/tokens.css`
- the aggregator manifest lists slides in order
- each slide can be opened directly for validation

This is the strongest workflow for long decks and team / multi-agent production.

## Path B: single-file + `deck_stage.js`

Use for smaller decks or when global shared state matters.

Important constraints:
- put the `<script src="deck_stage.js">` **after** `</deck-stage>` or at least use `defer`
- never let slide-level CSS steal `display` control away from the deck stage

### Most important CSS trap

Do **not** write `display:flex` or `display:grid` directly on all `deck-stage > section` slides. That can force every slide to render at once.

Safer pattern:
- let `section` only control visibility
- put actual layout display rules on `.active` or an inner wrapper

## Slide labels

Give meaningful labels.
- multi-file: put them in the manifest
- single-file: use `data-screen-label`

Always number slides starting from 1, not 0.

## Speaker notes

Only add notes when the user explicitly wants them.

Use a JSON block in the HTML and keep the notes conversational, complete, and tied to each slide.

## Slide design patterns

Common layouts:
- title slide
- section divider
- content slide
- data slide
- image slide
- quote slide
- two-column comparison

Do not let every slide look the same. Vary density, background, and visual rhythm intentionally.

## PDF / PPTX export

### Multi-file PDF
Use `export_deck_pdf.mjs`.

### Single-file deck-stage PDF
Use `export_deck_stage_pdf.mjs` because shadow DOM and slotting make the general multi-file exporter inappropriate.

### Editable PPTX
Use `export_deck_pptx.mjs` only if the HTML was authored within the editable constraints from the start.

If visual fidelity matters more, export PDF instead.

If editable PPTX appears late, the preferred fallback order is:
1. recommend PDF first
2. if the user still needs editable text, rewrite the HTML into the constrained PPTX-safe structure
3. avoid hand-maintained PPTX reimplementation unless there is no better path

## Verification checklist

- [ ] open the deck in a browser and confirm the first slide is clean
- [ ] navigate through all slides
- [ ] print preview produces exactly one page per slide
- [ ] test refresh / localStorage navigation memory when relevant
- [ ] batch-screenshot several slides and inspect them manually
- [ ] search for leftover `TODO` / `placeholder` text
