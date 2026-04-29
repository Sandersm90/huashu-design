# Preview v1 demo

Small fixtures for testing the Huashu preview workflow.

## Files

- `choice-fragment.html` — lightweight fragment demo; the preview server wraps it automatically
- `full/full-prototype.html` — full HTML demo with a relative `style.css`

## Quick test

1. Start the preview server from repo root:

   ```bash
   scripts/start-preview.sh --project-dir /tmp/huashu-preview-test
   ```

2. Copy one of the demos into the returned `content_dir`.

   Fragment demo:

   ```bash
   cp demos/preview-v1/choice-fragment.html <content_dir>/01-choice.html
   ```

   Full HTML demo (preserves relative assets):

   ```bash
   mkdir -p <content_dir>/full
   cp demos/preview-v1/full/full-prototype.html <content_dir>/full/
   cp demos/preview-v1/full/style.css <content_dir>/full/
   ```

3. Open the returned `url` in your browser.
4. Click a few `data-choice` options.
5. Check `<state_dir>/events` for recorded interactions.

## Example agent prompts

These are useful for testing whether an agent naturally reaches for the preview workflow.

### Prompt 1 — design directions

```text
Use huashu-design preview mode. Show me 3 distinct design directions for an AI focus app in the browser, and let me click the one I want.
```

### Prompt 2 — iterative prototype review

```text
Build me a first-pass iOS prototype for a calm pomodoro app. Use the local preview server so I can review it in the browser while you iterate.
```

### Prompt 3 — tweaks-oriented review

```text
Make a browser preview for a landing page concept with 3 selectable style directions and at least one tweakable visual parameter. I want to choose in the browser, not from screenshots.
```
