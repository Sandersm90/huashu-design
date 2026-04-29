# Gallery Ripple + Multi-Focus · Scene-Orchestration Philosophy

> A reusable arrangement pattern distilled from the huashu-design hero animation v9.

## One-sentence summary

**When you have 20+ visually consistent assets and need to express both scale and depth, favor Gallery Ripple + Multi-Focus over static layout stacking.**

## What this structure expresses

It is not just “showing many assets.” It tells a two-beat story:
1. **Ripple reveal** → the audience feels the scale
2. **Multi-focus** → the audience pauses on selected examples and feels the depth

Core arc:
**breadth → focus → fade-off**

The missing nuance in the earlier English pass: the structure only works when those beats happen in sequence. Ripple without focus becomes a pretty grid screenshot. Focus without the surrounding gallery loses the feeling of scale.

## Preconditions

All of these should be true:
1. at least ~20 assets, ideally 30+
2. visual consistency across them
3. individual assets still hold up when enlarged
4. the scene is landscape or square, not vertical

If those conditions fail, use a different structure.

Recommended fallbacks from the Chinese source:
- too few assets → 3–5 static pieces + sequential focus
- inconsistent style → keynote-style chapter images instead of a gallery wall
- weak assets when enlarged → data dashboard or big-type / quote treatment
- vertical scene → vertical scroll + sticky cards

## Technical recipe

- large perspective viewport
- oversized canvas
- 8×6 grid of cards
- center-based ripple timing
- four sequential focus windows
- slow pan using combined sine/cos drift

Key operating details:
- the canvas should be much larger than the viewport (about 2.25× in the case study) so the pan feels like peeking into a larger world
- the ripple uses **distance from center** to delay each card, not random staggering
- each focus window is about **1.7s** with about **0.6s** of breathing room between focuses
- during focus, background cards should not just fade: they should also **dim and desaturate** so the focused card truly jumps forward

## Five reusable lessons

1. Prefer `expoOut` over ordinary cubic easing for the main motion language
2. Warm paper-like bases + one terracotta accent create a sophisticated Anthropic-adjacent tone
3. Simulated depth via shadow tiers is often better than true expensive per-card 3D transforms
4. Variable font-weight shifts can feel more cinematic than naive scale-up effects
5. A subtle corner brand anchor helps the viewer remember what they are watching without screaming the brand

## When not to use this

Do not use it for:
- product feature walkthroughs
- data-first content that requires reading
- causal story narratives
- tiny asset sets
- vertical 9:16 scenes

## Fast suitability check

1. Do you have enough assets?
2. Do they feel like a coherent set?
3. Is the story really about breadth × depth rather than a process or a feature?

If yes to all three, this structure is a strong default.
