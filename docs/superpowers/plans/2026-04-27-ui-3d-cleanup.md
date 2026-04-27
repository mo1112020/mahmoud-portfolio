# UI Improvements, 3D Hero & Code Cleanup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean dead code from App.jsx, add a Three.js wireframe building behind the hero character, and apply UI polish (entrance animations, grid fix, theme consistency).

**Architecture:** All changes stay in `src/App.jsx` (single-file approach). A `WireframeBuilding` R3F component is added inline. The existing `<svg className="bp-svg">` in `HeroVisual` is replaced with an R3F `<Canvas>`. CSS cleanup removes ~500 lines of duplicates and dead code.

**Tech Stack:** React 19, Vite, `three`, `@react-three/fiber`

---

## Files

- **Modify:** `src/App.jsx` — all changes

---

## Task 1: Install Three.js dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install packages**

```bash
cd "/Users/mohamedsaad/Desktop/My projects/mahmoud-portflio"
npm install three @react-three/fiber
```

Expected output: `added N packages` with no errors.

- [ ] **Step 2: Verify dev server still starts**

```bash
npm run dev
```

Expected: Vite starts, no errors in terminal. Open `http://localhost:5173` and confirm the page loads.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install three and react-three-fiber"
```

---

## Task 2: Update imports at top of App.jsx

**Files:**
- Modify: `src/App.jsx` (lines 1–3)

- [ ] **Step 1: Replace the import block**

Find this at the very top of `src/App.jsx`:

```js
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import charImg from "./assets/character.png";
```

Replace with:

```js
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import charImg from "./assets/character.png";
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds with no errors. Warnings about unused imports are fine for now.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "chore: add three.js imports to App.jsx"
```

---

## Task 3: Add WireframeBuilding component

**Files:**
- Modify: `src/App.jsx` — add component after the `Icons` block (around line 36)

- [ ] **Step 1: Add the component**

Find this comment in `src/App.jsx`:

```js
// ─── Shared Components ────────────────────────────────────────────────────────
```

Insert the following BEFORE that comment (i.e. between the `Icons` object and the `// ─── Shared Components` comment):

```jsx
// ─── Three.js Wireframe Building ─────────────────────────────────────────────

function WireframeBuilding() {
  const groupRef = useRef();
  const scanRef = useRef();

  const towerEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 3, 1.2)),
    []
  );
  const floorEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 0.01, 1.2)),
    []
  );
  const floorY = useMemo(() => [-0.9, -0.3, 0.3, 0.9], []);
  const joints = useMemo(() => [
    [-0.6, -1.5, -0.6], [0.6, -1.5, -0.6], [-0.6, -1.5, 0.6], [0.6, -1.5, 0.6],
    [-0.6,  1.5, -0.6], [0.6,  1.5, -0.6], [-0.6,  1.5, 0.6], [0.6,  1.5, 0.6],
  ], []);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
    if (scanRef.current)
      scanRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 1.5;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={towerEdges}>
        <lineBasicMaterial color="#78716c" />
      </lineSegments>

      {floorY.map((y, i) => (
        <lineSegments key={i} geometry={floorEdges} position={[0, y, 0]}>
          <lineBasicMaterial color="#57534e" transparent opacity={0.7} />
        </lineSegments>
      ))}

      {joints.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}

      <mesh ref={scanRef}>
        <planeGeometry args={[1.4, 0.02]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors. `WireframeBuilding` is defined but not yet used — that's fine.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add WireframeBuilding Three.js component"
```

---

## Task 4: Replace SVG blueprint with Canvas in HeroVisual

**Files:**
- Modify: `src/App.jsx` — `HeroVisual` function (~line 111)

- [ ] **Step 1: Replace HeroVisual function entirely**

Find the entire `function HeroVisual()` block (from `function HeroVisual() {` through its closing `}`), which currently ends with the `</div>` that closes `hero-visual`. Replace it with:

```jsx
function HeroVisual() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef(null);

  const msgs = [
    "Welcome to my portfolio!",
    "How can I help you today?",
    "Need an engineering tutor?",
    "Building things is my passion!",
    "Let's create something great!",
    "Check out my YouTube channel!",
    "Success starts with a plan.",
    "Calculus 1 & 2 are my specialty!",
    "Solving problems, one at a time.",
    "Ready for our next project?",
    "Innovation in every design.",
    "Welcome! Click me for more!",
  ];

  const nextMsg = () => {
    setMsgIdx((i) => (i + 1) % msgs.length);
    setIsTalking(true);
    setTimeout(() => setIsTalking(false), 2000);
  };

  useEffect(() => {
    const t = setInterval(nextMsg, 8000);
    return () => clearInterval(t);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-8, Math.min(8, ((e.clientX - cx) / (rect.width / 2)) * 8));
    const dy = Math.max(-8, Math.min(8, ((e.clientY - cy) / (rect.height / 2)) * -8));
    setTilt({ x: dy, y: dx });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <div
      className="hero-visual"
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="bp-frame"
        ref={frameRef}
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <Canvas
          gl={{ alpha: true }}
          camera={{ position: [0, 0.5, 4], fov: 45 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 4, 2]} intensity={1.0} />
          <WireframeBuilding />
        </Canvas>

        <div
          className={`char-wrap ${isTalking ? "is-talking" : ""}`}
          onClick={nextMsg}
          style={{ cursor: "pointer" }}
        >
          <div className="char-circle">
            <div className="char-glow" />
            <img src={charImg} alt="Welcome" className="hero-char" />
            <div className="mouth-anim" />
          </div>
          <div className="welcome-bubble">{msgs[msgIdx]}</div>
        </div>

        <div className="float-tag ft-tl">AutoCAD</div>
        <div className="float-tag ft-tr">SAP2000</div>
        <div className="float-tag ft-bl">Site Supervision</div>
        <div className="float-tag ft-br">Structural Design</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. The hero right side should show a wireframe building slowly rotating, with the character circle centered on top and the float tags around it. The whole panel should tilt subtly when you move the mouse over it.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: replace blueprint SVG with Three.js wireframe building in hero"
```

---

## Task 5: Remove Reveal component and unwrap all usages

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Delete the Reveal component definition**

Find and delete this entire block:

```jsx
function Reveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
```

- [ ] **Step 2: Unwrap Reveal usages in HomePage**

In `function HomePage`, find and replace each `<Reveal ...>...</Reveal>` wrapper, keeping only its inner content. There are 5 usages. Replace each one:

Find:
```jsx
              <Reveal>
                <div className="hero-eyebrow">
```
Replace with:
```jsx
              <div className="hero-eyebrow">
```
(and remove the closing `</Reveal>` tag after `</div>`)

Find:
```jsx
              <Reveal delay={0.22}>
                <p className="hero-bio">
```
Replace with:
```jsx
              <p className="hero-bio">
```

Find:
```jsx
              <Reveal delay={0.3}>
                <div className="hero-btns">
```
Replace with:
```jsx
              <div className="hero-btns">
```

Find:
```jsx
              <Reveal delay={0.4}>
                <div className="hero-stats">
```
Replace with:
```jsx
              <div className="hero-stats">
```

Find:
```jsx
          <Reveal delay={0.5}>
            <SkillsMarquee />
          </Reveal>
```
Replace with:
```jsx
          <SkillsMarquee />
```

- [ ] **Step 3: Unwrap Reveal usages in ExperiencePage**

In `function ExperiencePage`, the timeline map has `<Reveal key={i} delay={i * 0.07}>`. Find:

```jsx
              <Reveal key={i} delay={i * 0.07}>
                <div className="tl-item">
```
Replace with:
```jsx
              <div className="tl-item" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
```
And remove the closing `</Reveal>` (keep the `</div>` for tl-item).

- [ ] **Step 4: Unwrap Reveal usages in SkillsPage**

In `function SkillsPage`, find the services map:
```jsx
            <Reveal key={i} delay={i * 0.09}>
              <div className="card svc-card">
```
Replace with:
```jsx
            <div className="card svc-card" key={i} style={{ animationDelay: `${i * 0.09}s` }}>
```
Remove closing `</Reveal>`.

Find the three standalone Reveal wrappers in SkillsPage:
```jsx
        <Reveal delay={0.28}>
          <div className="card tools-card">
```
Replace with:
```jsx
        <div className="card tools-card">
```

```jsx
          <Reveal delay={0.34}>
            <div className="card edu-card">
```
Replace with:
```jsx
          <div className="card edu-card">
```

```jsx
          <Reveal delay={0.42}>
            <div className="card lang-card">
```
Replace with:
```jsx
          <div className="card lang-card">
```

```jsx
        <Reveal delay={0.5}>
          <div className="card vol-card">
```
Replace with:
```jsx
        <div className="card vol-card">
```

- [ ] **Step 5: Unwrap Reveal usages in ContactPage**

In `function ContactPage`, the contacts map:
```jsx
            <Reveal key={i} delay={i * 0.07}>
              <div className="card contact-card">
```
Replace with:
```jsx
            <div className="card contact-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
```
Remove closing `</Reveal>`.

Find:
```jsx
        <Reveal delay={0.3}>
          <div className="card form-card">
```
Replace with:
```jsx
        <div className="card form-card">
```

- [ ] **Step 6: Verify build and browser**

```bash
npm run build
```

Expected: no errors, no `Reveal` references remaining. Confirm in browser that all sections still render correctly.

```bash
grep -n "Reveal" src/App.jsx
```

Expected: no output (zero matches).

- [ ] **Step 7: Remove also the unused ScrollProgress component**

Find and delete this entire block (ScrollProgress is defined but never rendered):

```jsx
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 || 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${pct / 100})` }} />;
}
```

- [ ] **Step 8: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: remove no-op Reveal wrapper and unused ScrollProgress component"
```

---

## Task 6: Remove duplicate CSS — hero-stats, stat-cell, stat-num, stat-lbl

The `css(T)` template literal contains three definitions of `.hero-stats` (and `.stat-cell`, `.stat-num`, `.stat-lbl`). The third and final definition (in the polish overrides section) is the one that uses grid layout and scoped selectors — keep it. Delete the first two.

**Files:**
- Modify: `src/App.jsx` — inside the `css(T)` template literal

- [ ] **Step 1: Delete first .hero-stats block**

Find and delete this exact block (first occurrence, in the `/* Stats */` comment section):

```css
  .hero-stats {
    display: flex; margin-top: 60px; padding-top: 48px;
    border-top: 1px solid var(--border);
  }
  .stat-cell {
    flex: 1; display: flex; flex-direction: column; gap: 4px;
    padding-right: 48px;
  }
  .stat-num {
    font-family: var(--display); font-size: 48px; font-weight: 400;
    color: var(--accent); line-height: 1; letter-spacing: -0.02em;
  }
  .stat-lbl { font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; }
```

- [ ] **Step 2: Delete second .hero-stats block**

Find and delete this block (preceded by the `/* Stats */` comment):

```css
  /* Stats */
  .hero-stats {
    display: flex; margin-top: 48px; padding-top: 36px;
    border-top: 1px solid var(--border);
  }
  .stat-cell {
    flex: 1; display: flex; flex-direction: column; gap: 6px;
    padding-right: 32px; position: relative;
  }
  .stat-cell:not(:last-child)::after {
    content: ''; position: absolute; right: 16px; top: 4px; bottom: 4px;
    width: 1px; background: var(--border);
  }
  .stat-num {
    font-family: var(--display); font-size: 44px; font-weight: 800;
    color: var(--white); line-height: 1; letter-spacing: -0.03em;
  }
  .stat-lbl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; }
```

- [ ] **Step 3: Verify**

```bash
grep -c "\.hero-stats {" src/App.jsx
```

Expected: `1` (only the grid-layout definition remains).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: remove duplicate hero-stats CSS blocks"
```

---

## Task 7: Remove duplicate CSS — hh-line, btn-capsule, hero-head, pill-img, pill-ico

**Files:**
- Modify: `src/App.jsx` — inside the `css(T)` template literal

- [ ] **Step 1: Delete first .hh-line block**

Find and delete:

```css
  .hh-line { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 4px; }
  .hh-line b { font-weight: 500; letter-spacing: -0.02em; }
  .hh-line i { font-family: var(--display); font-style: italic; font-weight: 300; color: var(--dim); }
```

Keep the second definition (further down) which has `gap: 12px` and correct `font-weight`.

- [ ] **Step 2: Merge letter-spacing into the kept .hh-line b rule**

The first definition had `letter-spacing: -0.02em` on `.hh-line b` which the second definition lacks. Find the second (kept) definition:

```css
  .hh-line b { font-weight: 800; color: #1c1917; }
```

Replace with:

```css
  .hh-line b { font-weight: 800; color: #1c1917; letter-spacing: -0.02em; }
```

- [ ] **Step 3: Delete first .btn-capsule block**

Find and delete this block (the shorter first definition):

```css
  .btn-capsule {
    padding: 20px 52px; border-radius: 100px; background: #1c1917; color: #fff;
    font-weight: 600; font-size: 16px; border: none;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
```

Keep the second definition (which has `animation`, `cursor`, `box-shadow`, etc.).

- [ ] **Step 4: Merge the first two .hero-head definitions into the third**

There are three `.hero-head` definitions. The third (in the polish overrides section) only sets `margin-bottom`, `font-size`, and `line-height`. The animation and `letter-spacing` come from the second. Merge everything into one.

Find and delete:

```css
  .hero-head {
    font-family: var(--display);
    font-size: clamp(38px, 6vw, 72px);
    line-height: 1.1; color: var(--white);
    margin-bottom: 24px;
  }
```

Find and delete:

```css
  .hero-head {
    font-size: clamp(38px, 4.8vw, 66px);
    line-height: 1.04;
    letter-spacing: -0.035em;
    margin-bottom: 4px;
    font-family: var(--display);
    color: #1c1917;
    animation: heroFadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.08s;
  }
```

Then find the third (now only) `.hero-head` definition:

```css
  .hero-head {
    margin-bottom: 8px;
    font-size: clamp(34px, 4vw, 56px);
    line-height: 1.02;
  }
```

Replace with the fully merged version:

```css
  .hero-head {
    font-family: var(--display);
    font-size: clamp(34px, 4vw, 56px);
    line-height: 1.02;
    letter-spacing: -0.035em;
    margin-bottom: 8px;
    color: #1c1917;
    animation: heroFadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.08s;
  }
```

- [ ] **Step 5: Delete all .pill-img and .pill-ico definitions**

These classes exist in CSS but no JSX element uses them. Find and delete all instances:

First `.pill-img` block:
```css
  .pill-img {
    display: inline-flex; width: clamp(44px, 8vw, 88px); height: clamp(28px, 4vw, 44px);
    border-radius: 100px; overflow: hidden; background: #fff;
    border: 1px solid var(--border); box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  }
  .pill-img img { width: 100%; height: 100%; object-fit: cover; }
  .pill-ico {
    display: inline-flex; width: 44px; height: 44px;
    background: #fff; border: 1px solid var(--border); border-radius: 50%;
    align-items: center; justify-content: center; font-size: 18px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  }
```

Second `.pill-img` block:
```css
  .pill-img { 
    height: clamp(28px, 3.5vw, 42px); aspect-ratio: 1.8; 
    border-radius: 100px; overflow: hidden; border: 1px solid var(--border);
    background: #fff; transform: rotate(-1deg); box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
```

Second `.pill-img img` and `.pill-ico`:
```css
  .pill-img img { width: 100%; height: 100%; object-fit: cover; }
  .pill-ico {
    padding: 6px 16px; background: #fff; border: 1px solid var(--border);
    border-radius: 100px; font-size: 18px; transform: rotate(2deg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }
```

- [ ] **Step 6: Verify**

```bash
grep -c "\.hero-head {" src/App.jsx
grep -c "\.btn-capsule {" src/App.jsx
grep -c "\.pill-img" src/App.jsx
```

Expected: all return `1`, `1`, `0`.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: remove duplicate CSS blocks for hh-line, btn-capsule, hero-head, pill-img/ico"
```

---

## Task 8: Remove unused CSS classes and dead keyframes

**Files:**
- Modify: `src/App.jsx` — inside the `css(T)` template literal

- [ ] **Step 1: Delete .dot-grid**

Find and delete:

```css
  .dot-grid {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 34px 34px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  }
```

- [ ] **Step 2: Delete the empty .ambient-bg block**

Find and delete the empty rule (there is a second `.ambient-bg` definition with actual content — keep that one):

```css
  .ambient-bg {
  }
```

- [ ] **Step 3: Delete @keyframes orbFloat**

Find and delete:

```css
  @keyframes orbFloat {
    0%   { transform: translate(0,0) scale(1); }
    50%  { transform: translate(-4%,6%) scale(1.06); }
    100% { transform: translate(5%,-4%) scale(0.96); }
  }
```

- [ ] **Step 4: Delete @keyframes bpSpin and .bp-svg**

The SVG is now gone (replaced by Canvas). Find and delete:

```css
  .bp-svg {
    width: 100%; height: 100%; color: var(--accent);
    animation: bpSpin 120s linear infinite;
    filter: drop-shadow(0 0 20px rgba(0,0,0,0.02));
  }
  @keyframes bpSpin { to { transform: rotate(360deg); } }
```

- [ ] **Step 5: Delete .scroll-cue, .scroll-cue-text, .scroll-cue-icon**

Find and delete:

```css
  /* Scroll cue */
  .scroll-cue {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 32px 0 8px; margin-top: auto; opacity: 0.45;
  }
  .scroll-cue-text { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); }
  .scroll-cue-icon { color: var(--accent); animation: scrollBounce 2.3s ease-in-out infinite; }
  @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 55% { transform: translateY(7px); } }
```

- [ ] **Step 6: Delete .status-pill and .status-dot**

Find and delete:

```css
  .status-pill {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 8px 18px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 100px;
    font-size: 13px; color: var(--white); font-weight: 500;
    width: fit-content; backdrop-filter: blur(10px);
  }
  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); flex-shrink: 0;
    animation: statusPulse 2.4s ease-in-out infinite;
  }
  @keyframes statusPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
    50%       { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }
```

- [ ] **Step 7: Delete .hero-bg-word**

Find and delete:

```css
  .hero-bg-word {
    position: absolute; bottom: -8%; right: -14%;
    font-family: var(--display); font-size: clamp(48px, 8vw, 96px);
    font-weight: 900; letter-spacing: -0.07em;
    color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.045);
    user-select: none; pointer-events: none; z-index: -1; white-space: nowrap;
  }
```

- [ ] **Step 8: Verify build**

```bash
npm run build
```

Expected: success, no errors.

- [ ] **Step 9: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: remove unused CSS classes, dead keyframes, and bp-svg rule"
```

---

## Task 9: Fix amber color remnants + card hover + cursor glow

**Files:**
- Modify: `src/App.jsx` — inside the `css(T)` template literal

- [ ] **Step 1: Fix .cursor-glow**

Find:
```css
    background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%);
```
Replace with:
```css
    background: radial-gradient(circle, rgba(28,25,23,0.04) 0%, transparent 70%);
```

- [ ] **Step 2: Remove .card::after and .card:hover::after**

The `.card::after` overlay is invisible on the light background (amber at 5% opacity on white). Find and delete both:

```css
  .card::after {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 55%);
    opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
  }
```

And:

```css
  .card:hover::after { opacity: 1; }
```

- [ ] **Step 3: Clean up .card:hover (first definition)**

There are two `.card:hover` definitions. The first (dark-theme era) has an amber glow. Find and delete this first definition:

```css
  .card:hover {
    border-color: var(--border-hov);
    transform: translateY(-5px);
    box-shadow: 0 28px 64px rgba(0,0,0,0.5), 0 0 32px var(--glow),
                inset 0 1px 0 rgba(255,255,255,0.06);
  }
```

The second `.card:hover` definition (in the polish overrides, `box-shadow: 0 18px 36px rgba(28, 25, 23, 0.12)`) is the correct stone-theme one — keep it.

- [ ] **Step 4: Add .bp-canvas CSS rule**

Find the `.bp-frame` rule:

```css
  .bp-frame { position: relative; width: 100%; aspect-ratio: 1; }
```

Replace with:

```css
  .bp-frame { position: relative; width: 100%; aspect-ratio: 1; }
  .bp-canvas { position: absolute; inset: 0; }
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Check:
- No yellow/amber tint on card hover
- Cursor glow is stone-tinted (barely visible, correct)
- The 3D wireframe canvas fills the hero-right area correctly

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx
git commit -m "fix: remove amber color remnants, clean card hover glow, fix cursor-glow color"
```

---

## Task 10: Add fadeUp entrance animations + fix svc-grid

**Files:**
- Modify: `src/App.jsx` — inside the `css(T)` template literal

- [ ] **Step 1: Add @keyframes fadeUp**

Find the `@keyframes heroFadeUp` block:

```css
  @keyframes heroFadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
```

Add the following directly after it:

```css
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
```

- [ ] **Step 2: Apply fadeUp to tl-item, svc-card, contact-card**

Find the `.tl-item` rule:

```css
  .tl-item { position: relative; }
```

Replace with:

```css
  .tl-item { position: relative; animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
```

Find the `.svc-card` rule:

```css
  .svc-card { display: flex; flex-direction: column; height: 100%; padding: 40px; }
```

Replace with:

```css
  .svc-card { display: flex; flex-direction: column; height: 100%; padding: 40px; animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
```

Find the `.contact-card` rule:

```css
  .contact-card { display: flex; align-items: flex-start; gap: 20px; padding: 28px; }
```

Replace with:

```css
  .contact-card { display: flex; align-items: flex-start; gap: 20px; padding: 28px; animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
```

- [ ] **Step 3: Fix .svc-grid layout**

Find:

```css
  .svc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
```

Replace with:

```css
  .svc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Check:
- Timeline items fade up with stagger when navigating to Experience
- Service cards fade up with stagger on Skills page
- Contact cards fade up with stagger on Contact page
- On the Skills page, the 5 service cards form a balanced grid (no lone card spanning full width)

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add fadeUp entrance animations, fix svc-grid auto-fill layout"
```

---

## Task 11: Final verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: no errors, no warnings about undefined references.

- [ ] **Step 2: Check all pages in browser**

```bash
npm run dev
```

Visit each page and confirm:

| Check | Expected |
|---|---|
| Home hero | 3D wireframe building visible behind character circle, slow rotation, mouse tilt |
| Hero mobile (< 1024px) | hero-right hidden, no Canvas rendered, no JS errors |
| Character click | Speech bubble updates message, mouth animation plays |
| Float tags | AutoCAD / SAP2000 / Site Supervision / Structural Design visible and bobbing |
| Experience page | Timeline items animate in with stagger |
| Skills page | Service cards animate in, 5-card grid self-balances |
| Contact page | Cards animate in, form submits correctly |
| Card hover | Subtle lift, no amber glow |
| Cursor movement | Faint stone-toned glow follows cursor |

- [ ] **Step 3: Confirm dead code is gone**

```bash
grep -n "Reveal\|ScrollProgress\|pill-img\|pill-ico\|dot-grid\|scroll-cue\|status-pill\|hero-bg-word\|orbFloat\|bpSpin\|bp-svg" src/App.jsx
```

Expected: zero matches.

- [ ] **Step 4: Final commit**

```bash
git add src/App.jsx
git commit -m "chore: final cleanup verification pass"
```
