# Download CV Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a ghost-style "Download CV" button beside the "Get In Touch" button in the hero section that triggers a PDF download.

**Architecture:** Import the existing PDF as a Vite asset to get a hashed URL, add an `ArrowDown` icon to the `Icons` object, then render an `<a>` tag with `download` attribute inside `.hero-btns`. No new CSS needed — `.btn-ghost` and `.btn-capsule` already exist and the responsive stacking is already handled.

**Tech Stack:** React 19, Vite 8, plain CSS (all in `src/App.jsx`)

---

### Task 1: Add ArrowDown icon and import the CV PDF

**Files:**
- Modify: `src/App.jsx:27-38` (Icons object) and top of file (import)

- [ ] **Step 1: Add the PDF import at the top of App.jsx**

Open `src/App.jsx`. After the existing asset imports (look for any existing `import ... from './assets/...'` line, or after the React imports at the top), add:

```js
import cvPdf from './assets/MAHMOUD_AHMED_CV_ATS.pdf';
```

- [ ] **Step 2: Add ArrowDown to the Icons object**

Find the `Icons` object (line ~27). Add `ArrowDown` as the last entry before the closing `};`:

```js
  ArrowDown: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>,
```

The full Icons object closing should look like:

```js
  ArrowDown: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>,
};
```

- [ ] **Step 3: Run lint to confirm no syntax errors**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add ArrowDown icon and import CV PDF asset"
```

---

### Task 2: Render the Download CV button in the hero section

**Files:**
- Modify: `src/App.jsx:383-387` (hero-btns div)

- [ ] **Step 1: Add the Download CV anchor inside .hero-btns**

Find this block (around line 383):

```jsx
              <div className="hero-btns">
                <button className="btn-primary btn-capsule" onClick={() => onNavigate("Contact")}>
                  Get In Touch <Icons.ArrowRight />
                </button>
              </div>
```

Replace it with:

```jsx
              <div className="hero-btns">
                <button className="btn-primary btn-capsule" onClick={() => onNavigate("Contact")}>
                  Get In Touch <Icons.ArrowRight />
                </button>
                <a
                  className="btn-ghost btn-capsule"
                  href={cvPdf}
                  download="Mahmoud_Saad_CV.pdf"
                >
                  Download CV <Icons.ArrowDown />
                </a>
              </div>
```

The `download="Mahmoud_Saad_CV.pdf"` attribute sets the filename the browser saves the file as.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Start the dev server and verify visually**

```bash
npm run dev
```

Open the local URL (usually `http://localhost:5173`). Check:
1. Two buttons appear side-by-side in the hero section
2. "Download CV" uses the ghost/outline style
3. Clicking "Download CV" triggers a file download named `Mahmoud_Saad_CV.pdf`
4. Narrow the browser window to mobile width — buttons should stack vertically, both full-width

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Download CV ghost button to hero section"
```
