# UI Improvements, 3D Hero Element & Code Cleanup

**Date:** 2026-04-27  
**Approach:** A — Targeted cleanup + Three.js injection (single-file, no component split)

---

## 1. Code Cleanup

### Remove: `Reveal` component and all usages
- The `Reveal` component wraps children in a plain `<div>` and does nothing. The `delay` prop is accepted but never applied.
- Remove the component definition and unwrap all ~30 call sites, keeping the inner children in place.

### Remove: Duplicate CSS blocks
Each of the following is defined 2–3 times with conflicting values. Keep only the last (most specific) definition:

- `.hero-stats` (×3 definitions — lines ~1027, ~1066, ~1616)
- `.stat-cell`, `.stat-num`, `.stat-lbl` (×3 each)
- `.hh-line` (×2)
- `.btn-capsule` (×2)
- `.hero-head` (×3)
- `.pill-img`, `.pill-ico` (×2 each)

### Remove: Unused CSS classes
These classes are defined but no JSX element references them:

- `.dot-grid`
- `.scroll-cue`, `.scroll-cue-text`, `.scroll-cue-icon`
- `.status-pill`, `.status-dot`
- `.hero-bg-word`
- Empty `.ambient-bg {}` rule (the rule body is empty — the class exists with real rules elsewhere)

### Remove: Unused keyframes
- `@keyframes orbFloat` — defined but applied to no element

### Fix: Amber color remnants
The current theme is stone/monochrome light. Leftover amber (`rgba(245,158,11,...)`) from a previous dark theme appears in:
- `.card::after` gradient overlay (invisible on light background)
- `.cursor-glow` radial gradient
- `.card:hover` box-shadow glow
- `.timeline::before` gradient
- `.chip-current`, `.chip-accent` border colors

Action: The amber appears as hardcoded `rgba(245,158,11,...)` values directly in shadow/gradient strings (not via `--glow`, which is already stone). Remove these hardcoded amber values from `.card:hover` box-shadow and `.cursor-glow` radial-gradient. Keep amber in chip borders (`.chip-current`, `.chip-accent`) — those are intentional accent chips.

---

## 2. Three.js Wireframe Building

### Dependencies
Install: `three`, `@react-three/fiber`  
Do NOT install `@react-three/drei` — not needed for this geometry.

```
npm install three @react-three/fiber
```

### New component: `WireframeBuilding`

A self-contained React component rendered inside a `<Canvas>` from `@react-three/fiber`.

**Geometry:**
- Main tower: `BoxGeometry(1.2, 3, 1.2)` passed through `EdgesGeometry` → `lineSegments` with `LineBasicMaterial({ color: '#78716c' })`.
- Floor lines: 4 thin `BoxGeometry(1.2, 0.01, 1.2)` meshes with `EdgesGeometry`, evenly spaced up the tower height.
- Corner joints: 8 small `SphereGeometry(0.05)` meshes at the 8 box corners, `MeshStandardMaterial({ color: '#10b981', emissive: '#10b981', emissiveIntensity: 1.5 })`.

**Scan line:**
- A thin `PlaneGeometry(1.4, 0.02)` mesh, semi-transparent green (`#10b981`, opacity 0.5).
- Animated in `useFrame`: position.y oscillates between -1.5 and +1.5 over ~4 seconds using `Math.sin(clock.elapsedTime * 0.8)`.

**Lighting:**
- `ambientLight` intensity 0.4
- `pointLight` at `[2, 4, 2]` intensity 1.0

**Auto-rotation:**
- In `useFrame`: `mesh.rotation.y += 0.003` (slow continuous Y-axis rotation).

**Mouse parallax tilt:**
- Handled in CSS (not Three.js) on the `.hero-visual` wrapper.
- On `mousemove` in `HeroVisual`, track cursor offset from element center.
- Apply `transform: perspective(800px) rotateX(Ydelta * 0.015deg) rotateY(Xdelta * 0.015deg)` via inline style.
- Clamp tilt to ±8°.

### Integration into `HeroVisual`

Replace the existing `<svg className="bp-svg">` element entirely with:

```jsx
<Canvas
  className="bp-canvas"
  camera={{ position: [0, 0.5, 4], fov: 45 }}
  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
>
  <WireframeBuilding />
</Canvas>
```

The character circle (`.char-wrap`) stays absolutely positioned over the canvas at `z-index: 10`. Float tags stay as-is at `z-index: 20`.

**CSS for canvas:**
```css
.bp-canvas { position: absolute; inset: 0; border-radius: inherit; }
```

Remove `.bp-svg` and `@keyframes bpSpin` (the old SVG spinner) — replaced by Three.js.

---

## 3. UI Improvements

### Entrance animations (replacing the no-op `Reveal` wrappers)
After removing `Reveal`, add `fadeUp` keyframe animations directly on elements that previously had `<Reveal delay={...}>` wrappers:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Apply to `.tl-item`, `.svc-card`, `.contact-card` with staggered `animation-delay` via inline style (passed as a prop or index-based nth-child).

### Fix services grid layout
Change `.svc-grid` from fixed `1fr 1fr` to:
```css
.svc-grid { grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); }
```
This prevents the 5th card from spanning awkwardly.

### Remove amber glow from card hover
Replace:
```css
.card:hover { box-shadow: 0 28px 64px rgba(0,0,0,0.5), 0 0 32px var(--glow), ...; }
```
With stone-appropriate shadow:
```css
.card:hover { box-shadow: 0 18px 36px rgba(28,25,23,0.12); }
```

### Fix cursor-glow color
Change radial gradient from `rgba(245,158,11,0.08)` → `rgba(28,25,23,0.04)` to match stone theme.

---

## Out of Scope

- Component file splitting (future work)
- CSS extraction to separate file (future work)
- Mobile 3D (hero-right is already hidden on `max-width: 1024px` — Three.js canvas inherits this)
- Replacing the Formspree contact form
- Any new sections or content changes
