# Mahmoud Ahmed Saad — Portfolio

> A modern, responsive portfolio website built with React + Vite, showcasing the professional experience, skills, and contact details of **Mahmoud Ahmed Saad**, Civil Engineer based in Istanbul, Turkey.



---

## ✨ Features

- **Responsive Design** — Fully mobile-friendly with a slide-in sidebar menu on small screens
- **Amber & Slate Dark Theme** — Premium dark aesthetic with amber accent color
- **Smooth Animations** — Page transitions, scroll-reveal effects, and animated hero blueprint graphic
- **Downloadable CV** — Direct download of the PDF resume from the hero section
- **Contact Form** — Opens the user's email client pre-filled with the submitted message
- **Interactive Timeline** — Career experience displayed in an animated vertical timeline
- **Scroll Progress Bar** — Visual reading progress indicator at the top
- **Ambient Background** — Animated glow orbs and dot grid for a dynamic feel
- **Counter Animations** — Stats section with animated number counters on scroll

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| CSS-in-JS (inline `<style>`) | All styles co-located in `App.jsx` |
| `ReactDOM.createPortal` | Mobile menu overlay rendering |
| `IntersectionObserver` | Scroll-reveal and counter animations |

---

## 📁 Project Structure

```
my-portfolio/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── MAHMOUD_AHMED_CV_ATS.pdf   # Downloadable CV
│   └── App.jsx                         # Entire app — components + styles
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repository
git clone https://github.com/mo1112020/mahmoud-portfolio.git
cd mahmoud-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy to Netlify or GitHub Pages.

---

## 📄 Pages

| Page | Description |
|---|---|
| **Home** | Hero section with name, role, stats, and blueprint visual |
| **Experience** | Career timeline with all professional roles |
| **Skills** | Services offered, tools, education, languages, and volunteering |
| **Contact** | Contact cards and a message form |

---

## 🎨 Design System

All design tokens are defined in the `T` constant at the top of `App.jsx`:

```js
const T = {
  bg:          "#09090b",       // Page background
  accent:      "#f59e0b",       // Amber primary color
  accentSoft:  "rgba(245,158,11,0.08)",
  white:       "#fafafa",
  muted:       "#a1a1aa",
  ...
};
```

---

## 📬 Contact

- **Email:** mabdelhady322@gmail.com
- **Phone:** +90 544 185 19 08
- **LinkedIn:** [eng-mahmoud-saad-635185249](https://www.linkedin.com/in/eng-mahmoud-saad-635185249/)
- **Location:** Istanbul, Turkey

---

## 📝 License

This project is personal and not licensed for reuse. All rights reserved © 2026 Mahmoud Ahmed Saad.
