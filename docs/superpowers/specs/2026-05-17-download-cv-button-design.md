# Download CV Button — Design Spec

**Date:** 2026-05-17
**Status:** Approved

## Summary

Add a secondary "Download CV" button beside the existing "Get In Touch" button in the hero section. The button triggers a PDF download of Mahmoud's CV.

## Design

### Button style
Use the existing `.btn-ghost.btn-capsule` classes to create a clear primary/secondary hierarchy:
- "Get In Touch" → `.btn-primary.btn-capsule` (filled, primary CTA)
- "Download CV" → `.btn-ghost.btn-capsule` (outline, secondary CTA)

### PDF asset
The CV PDF already exists at `src/assets/MAHMOUD_AHMED_CV_ATS.pdf`. Import it as a Vite asset so Vite handles the URL (with content hash for cache-busting on future updates):

```js
import cvPdf from './assets/MAHMOUD_AHMED_CV_ATS.pdf';
```

### Element
Render as an `<a>` tag (not a `<button>`) with:
- `href={cvPdf}` — resolved asset URL
- `download` attribute — browser triggers file download instead of navigation
- A download icon from the existing `Icons` set (or a simple inline SVG arrow-down if none exists)

### Responsive behaviour
On mobile, `.hero-btns` already switches to `flex-direction: column; align-items: stretch`, so both buttons stack full-width automatically. No additional CSS needed.

## Out of scope
- No new CSS classes required
- No changes to any other section
- No tracking / analytics on the download click
