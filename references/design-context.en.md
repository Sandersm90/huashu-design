# Design Context: Start from Existing Context

**This is the single most important thing in this skill.**

Good hi-fi design grows out of existing design context. Designing hi-fi from nothing is a last resort and almost always produces generic work.

## What counts as design context

In descending priority:

### 1. The user’s design system / UI kit
Their real component library, color tokens, type rules, icon language. Best case.

### 2. The user’s codebase
If the user gave you code, it contains living implementation detail. Read:
- `theme.ts`, `colors.ts`, `tokens.css`, `_variables.scss`
- representative components (`Button.tsx`, `Card.tsx`)
- layout scaffolds (`App.tsx`, `MainLayout.tsx`)
- global stylesheets

Lift exact values from code: hex, spacing, font stacks, border radii.

### 3. The user’s shipped product
If there is no code but the product is live, inspect it with Playwright or ask for screenshots.

Example:

```bash
npx playwright screenshot https://example.com screenshot.png --viewport-size=1920,1080
```

### 4. Brand guides / logos / existing materials
Logos, color guidelines, marketing collateral, slide templates — all of these count.

### 5. Competitive references
If the user says “like X,” ask them for the real URL or screenshot. Do not rely on vague memory.

### 6. A known design system (fallback)
If none of the above exists, use a reputable system as the base:
- Apple HIG
- Material Design 3
- Radix Colors
- shadcn/ui
- Tailwind default palette

Be explicit with the user that this is a starting point, not the final answer.

## How to gather context

### Step 1: ask the user
Use the questions from `workflow.en.md`.

### Step 2: if the user says “there is nothing,” help them search
Try:
- earlier internal projects
- the company marketing site
- the logo’s existing visual language
- products they admire

### Step 3: read everything you can find
If the user gives you a repo path:
1. Inspect the file tree for style / theme / component files
2. Read token files first
3. Read 2–3 representative components
4. Read the global stylesheet
5. If there is a Figma link or screenshots, inspect them too — but trust code more than screenshots for exact values

Do not glance once and then improvise. You want 30+ real values internalized before you say you have context.

### Step 4: say the system out loud
For example:

```markdown
From your codebase and screenshots, here is the design system I extracted:

**Color**
- Primary: #C27558
- Background: #FDF9F0
- Text: #1A1A1A
- Muted: #6B6B6B

**Typography**
- Display: Instrument Serif
- Body: Geist Sans
- Mono: JetBrains Mono

**Spacing**
- 4, 8, 12, 16, 24, 32, 48, 64

**Shadow pattern**
- `0 1px 2px rgba(0,0,0,0.04)`
- `0 10px 40px rgba(0,0,0,0.1)`

**Border radius**
- Small elements 4px, cards 12px, buttons 8px
```

Wait for confirmation, then build.

## If you truly must design without context

Warn the user that quality will be lower.

```markdown
You do not have usable design context, so I can only proceed from generic design intuition.
That will likely produce something acceptable but not truly distinctive.
Would you rather continue now, or provide more references first?
```

If they still want you to proceed:

1. Pick one clear aesthetic direction
2. Use a known design system as the structural base
3. Choose a distinctive font pairing
4. Write down the reasoning for each major decision in comments

## Import strategy when the user gives a codebase

### Small projects (<50 files)
Read the whole relevant surface.

### Medium projects (50–500 files)
Focus on:
- `src/components/` or `components/`
- all style/theme/token files
- 2–3 representative full pages

### Large projects (>500 files)
Ask the user to point you toward the relevant part.

## Working with Figma

If the user only gives a Figma link:
- do not assume you can turn Figma directly into HTML
- many links are private
- ask for screenshots and key values (hex, px, etc.)

If they only give screenshots, explain that you can see the visual language but not extract exact values from the file itself.

## Final reminder

**The ceiling of design quality is set by the quality of context you collect.**

Ten minutes spent gathering context is usually worth far more than an hour of designing hi-fi from nothing.
