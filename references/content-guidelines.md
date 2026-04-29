# Content Guidelines: Anti-AI-Slop, Content Rules, and Scale Standards

This is the trap AI design falls into most easily. It is a list of what **not** to do, and that matters more than a list of what to do — because AI slop is the default unless you actively resist it.

## AI slop blacklist

### Visual traps

**❌ Aggressive gradient backgrounds**
- Purple → pink → blue full-screen gradients
- Rainbow gradients of any direction
- Mesh gradients filling the entire background
- ✅ If you must use gradients: keep them subtle, monochrome, and intentional (for example, a restrained button hover)

**❌ Rounded cards + left accent border**
This is a signature cliché of AI-generated dashboards:

```css
.card {
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  padding: 16px;
}
```

If you need emphasis, use a more thoughtful method: background contrast, type contrast, plain dividers, or no card at all.

**❌ Decorative emoji**
Unless the brand itself uses emoji (Notion, Slack, etc.), avoid them in UI. Especially avoid:
- 🚀 ⚡️ ✨ 🎯 💡 in front of headings
- ✅ in feature lists
- Emoji arrows in CTA buttons

If you do not have an icon, use a real icon library or a placeholder.

**❌ Drawing imagery with SVG**
Do not try to draw people, scenes, devices, objects, or abstract hero illustrations in SVG. A gray rectangle labeled “illustration slot 1200×800” is better than a bad AI-looking SVG illustration.

SVG is acceptable for:
- real icons (16×16 to 32×32)
- geometric decorative elements
- charts / data visualization

**❌ Too much iconography**
Not every heading, feature, or section needs an icon. Overusing icons makes interfaces feel toy-like.

**❌ Data slop**
Do not fabricate decorative stats:
- “10,000+ happy customers”
- “99.9% uptime”
- fake metric cards
- mock tables dressed up with fake data

If the data is not real, leave a placeholder or ask for it.

**❌ Quote slop**
Do not invent testimonials or decorative quotes.

### Typography traps

**❌ Avoid overused fonts**
- Inter
- Roboto
- Arial / Helvetica
- system-only stacks
- Fraunces (AI has overused it)
- Space Grotesk

**✅ Use a distinctive display/body pairing**
Directions that work:
- serif display + sans body
- mono display + sans body
- heavy display + light body
- variable-font hero weight animation

### Color traps

**❌ Do not invent a whole color system from thin air**
That usually produces disharmony.

**✅ Better strategy**:
1. If there is a brand color → use it, then interpolate missing tokens in OKLCH
2. No brand color but there is a reference → sample colors from real product screenshots
3. Starting from zero → use an established palette system (Radix Colors / Tailwind defaults / Anthropic brand)

Example:

```css
:root {
  --primary: oklch(0.65 0.18 25);
  --primary-light: oklch(0.85 0.08 25);
  --primary-dark: oklch(0.45 0.20 25);
}
```

**❌ Do not casually add dark mode by inverting colors**
Good dark mode requires deliberate saturation, contrast, and accent retuning.

### Layout traps

**❌ Bento grids everywhere**
If the information structure does not truly fit a bento grid, do not force one.

**❌ Large hero + 3-column features + testimonials + CTA template**
That landing-page formula is overused.

**❌ Card grids where every card looks the same**
Real design likes asymmetry, size variation, and cards with different content roles.

## Content rules

### 1. Do not add filler content

Every element must earn its place. Blank space is a composition problem, not a prompt to invent content.

Ask yourself:
- If this content disappeared, would the design get worse?
- What real problem does this element solve?
- Is this stat / quote / feature supported by real data?

“One thousand no’s for every yes.”

### 2. Ask before adding material

If you think another section or page would help, ask first. The user knows the audience better than you do, and content additions have cost.

### 3. Create a system up front

Once you have explored context, say your intended system out loud before building:

```markdown
My design system:
- Color: #1A1A1A text + #F0EEE6 background + #D97757 accent
- Typography: Instrument Serif for display + Geist Sans for body
- Rhythm: section titles use full-bleed color blocks; normal sections use white
- Imagery: hero uses a full-bleed photo; feature section stays placeholder until you provide assets
- Maximum two background colors to avoid noise
```

## Scale standards

### Slides (1920×1080)
- Body text minimum: **24px**, ideally 28–36px
- Titles: 60–120px
- Section titles: 80–160px
- Hero headlines: 180–240px
- Never use under 24px body text on slides

### Print documents
- Body minimum: **10pt** (≈13.3px), ideally 11–12pt
- Titles: 18–36pt
- Captions: 8–9pt

### Web and mobile
- Body minimum: **14px** (16px if accessibility matters)
- Mobile body: **16px** to avoid iOS zoom behavior
- Minimum hit target: **44×44px**
- Line height: 1.5–1.7 (Chinese often 1.7–1.8)

### Contrast
- Body text vs background: **at least 4.5:1**
- Large text vs background: **at least 3:1**

## CSS superpowers

Use advanced CSS when it helps.

### Typography
```css
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }
p {
  text-spacing-trim: space-all;
  hanging-punctuation: first;
}
```

### Layout
```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.card { display: grid; grid-template-rows: subgrid; }
```

### Visual effects
```css
* { scrollbar-width: thin; scrollbar-color: #666 transparent; }
.glass {
  backdrop-filter: blur(20px) saturate(150%);
  background: color-mix(in oklch, white 70%, transparent);
}
@view-transition { navigation: auto; }
```

### Interaction
```css
.card:has(img) { padding-top: 0; }
@container (min-width: 500px) { ... }
.button:hover {
  background: color-mix(in oklch, var(--primary) 85%, black);
}
```

## Fast decision guide

- Want to add a gradient? → probably do not
- Want to add an emoji? → do not
- Want rounded cards with left accent borders? → do not
- Want to draw a hero illustration in SVG? → do not; use a placeholder
- Want a decorative quote? → ask for a real quote first
- Want a row of feature icons? → ask whether icons are needed
- Want to use Inter? → choose something with more character
- Want a purple tech gradient? → pick a palette with actual grounding

**When you think “adding this will make it prettier,” that is often the smell of AI slop.** Start with the simplest version and add only when there is a real reason.
