# 🚀 Nexyos — QR-Based AI Feedback System Website

Ultra-level Three.js website with 3D animations, particle fields, and full responsive layout documenting the Nexyos technical architecture.

---

## 📁 File Structure

```
nexyos-website/
├── index.html          ← Main HTML (all sections)
├── css/
│   └── style.css       ← Full stylesheet (variables, animations, responsive)
├── js/
│   ├── three-scene.js  ← Three.js 3D engine (particles, geometries, lighting)
│   ├── animations.js   ← Scroll animations, counters, tilt, QR grids
│   └── main.js         ← Loader, cursor, navbar, ripple effects
└── README.md           ← This file
```

---

## ✨ Features

- **Three.js 3D Scene** — Particle sphere (2,200 points), animated icosahedron, dodecahedron, torus rings, floating data nodes, custom shader glow core
- **Mouse Parallax** — Camera follows cursor in 3D space
- **Custom Cursor** — Dot + smooth trailing ring with hover states
- **Loader** — Animated progress bar
- **QR Grid** — Live animated QR pattern
- **Counter Animations** — Stats count up on scroll into view
- **Intersection Observer** — Staggered reveals for all sections
- **3D Tilt Cards** — Perspective tilt on tech cards
- **Scroll Progress Bar** — Top edge indicator
- **Glitch Effect** — H2 headings glitch on hover
- **Ripple Buttons** — Material-style click ripple
- **Responsive** — Mobile burger menu, stacked layouts

---

## 📤 How to Upload to GitHub (Step-by-Step)

### Method 1: GitHub Desktop (Easiest)

1. Download [GitHub Desktop](https://desktop.github.com)
2. Sign in with your GitHub account
3. Click **File → New Repository**
   - Name: `nexyos-website`
   - Local path: choose where you saved these files
   - Check "Initialize with README" → **OFF** (you already have README.md)
   - Click **Create Repository**
4. GitHub Desktop will show all files as new
5. In the bottom left, type a commit message: `Initial commit: Nexyos website`
6. Click **Commit to main**
7. Click **Publish repository** (top right)
   - Choose Public or Private
   - Click **Publish Repository**
8. ✅ Done! Your site is live at `https://github.com/YOUR_USERNAME/nexyos-website`

---

### Method 2: Git Command Line

```bash
# Step 1 — Navigate to your project folder
cd path/to/nexyos-website

# Step 2 — Initialize Git
git init

# Step 3 — Add all files
git add .

# Step 4 — Commit
git commit -m "Initial commit: Nexyos 3D website"

# Step 5 — Create repo on GitHub
# Go to https://github.com/new
# Name it: nexyos-website
# Leave all options unchecked → click Create Repository

# Step 6 — Connect & push
git remote add origin https://github.com/YOUR_USERNAME/nexyos-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

### Method 3: GitHub Web (Drag & Drop)

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `nexyos-website`
3. Click **Create repository**
4. On the next page, click **uploading an existing file**
5. Drag and drop **all files and folders** into the upload area:
   - `index.html`
   - `css/` folder (with `style.css`)
   - `js/` folder (with all 3 JS files)
   - `README.md`
6. Scroll down → type commit message: `Add Nexyos website`
7. Click **Commit changes**
8. ✅ Done!

---

## 🌐 Deploy as GitHub Pages (Free Hosting)

After uploading to GitHub:

1. Go to your repository on GitHub
2. Click **Settings** tab (top of repo)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source** → select `Deploy from a branch`
5. Branch: **main** / folder: **/ (root)**
6. Click **Save**
7. Wait ~60 seconds
8. Your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/nexyos-website/
   ```

---

## 🛠 Local Development

No build tools needed. Just open in browser:

```bash
# Option A: Simple
open index.html

# Option B: Local server (avoids CORS for fonts)
npx serve .
# or
python3 -m http.server 3000
```

---

## 📦 Dependencies (CDN — No Install Required)

| Library | Version | Purpose |
|---|---|---|
| Three.js | r128 | 3D graphics engine |
| Google Fonts | latest | Bebas Neue, DM Sans, Space Mono |

All loaded via CDN — no npm or build step required.

---

## 🎨 Editing Guide

| What to change | Where |
|---|---|
| Colors / theme | `css/style.css` → `:root` variables at top |
| Text content | `index.html` → each section |
| 3D scene density | `js/three-scene.js` → `PARTICLE_COUNT` constant |
| Animation speeds | `js/three-scene.js` → `speed` values in torus / node arrays |
| Section content | `index.html` → each `<section>` block |
| Stats numbers | `index.html` → `data-target` attributes on `.stat-num` |

---

## 📄 License

MIT — Free to use and modify.

---

*Built for Nexyos — QR-Based AI Feedback & Review Generation System*
