# 📷 Shashi Sahai — Three Decades of Perspective

A memorial photography website dedicated to **Shashi Sahai** (1960 – August 15, 2026) — veteran photojournalist, photographer, and philanthropist. The site celebrates his 35+ years behind the lens and his lasting impact through Aarohan NGO.

---

## 🌐 Live Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — Hero, portfolio gallery, philosophy |
| `archive.html` | Timeline — Decade-by-decade photographic journey (1991–2026) |
| `tributes.html` | Tributes — Obituary, reflections, and archival photo slider |

---

## 🗂️ Project Structure

```
photography/
├── index.html          # Main landing page
├── archive.html        # Archive & timeline page
├── tributes.html       # Tributes & memorial page
├── style.css           # Global stylesheet
├── script.js           # JavaScript (GSAP animations, lightbox, gallery filter)
├── favicon.svg         # Browser tab icon (aperture design)
└── images/             # All photographs and assets
```

---

## ✨ Features

- **Animated Hero Section** — Full-bleed hero with GSAP scroll reveal animations
- **Scroll Progress Indicator** — Vertical scroll tracker on the left edge
- **Mosaic Gallery** — Filterable photo grid with lightbox preview modal (← → navigation)
- **Timeline** — Interactive decade-by-decade visual history (1991 → 2026)
- **Tributes Page** — Tabbed tribute sections + Swiper.js photo slider
- **Film Strip Divider** — Decorative SVG film-strip section separator
- **Aperture Favicon** — Custom SVG favicon styled with the site's dark red palette
- **Fully Responsive** — Mobile-first layout using Bootstrap 5 grid

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 (Vanilla) | Custom design system, animations |
| JavaScript (ES6) | Gallery filter, lightbox, scroll logic |
| [Bootstrap 5.3](https://getbootstrap.com/) | Responsive grid & utilities |
| [GSAP 3](https://gsap.com/) + ScrollTrigger | Scroll-based animations |
| [Swiper.js 11](https://swiperjs.com/) | Photo carousel on tributes page |
| [Google Fonts](https://fonts.google.com/) | Fraunces (serif) + Inter (sans-serif) |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Accent | `#c01412` (deep red) |
| Background | `#151816` (near-black) |
| Surface | `#1e2120` |
| Text | `#e8e3dc` |
| Serif Font | Fraunces |
| Sans Font | Inter |

---

## 🚀 Getting Started

No build step required — open any HTML file directly in a browser.

```bash
# Option 1: Open directly
start index.html

# Option 2: Serve locally (recommended to avoid CORS issues with images)
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080` in your browser.

---

## 🖼️ Images

All photographs are stored in the `images/` folder and versioned with `?v=20260918` cache-busting query strings.

> **Note:** Images are private archival assets and are not included in version control.

---

## 🔗 External Links

- **Instagram:** [@shashiphotographs](https://www.instagram.com/shashiphotographs/)
- **Aarohan NGO Tribute:** [aarohanngo.org/shashi-sahai](https://aarohanngo.org/shashi-sahai/)

---

## 📝 Credits

- **Subject:** Shashi Sahai (1960 – 2026) — Photojournalist, Cannes Bronze Winner, Aarohan NGO Co-founder
- **Tribute authored by:** Rani Patel, Founder & President, Aarohan NGO
- Website built as a personal memorial and photographic archive.

---

*"A photograph is a pause button for time — it lets a single moment outlive the instant it was made in."*
— **Shashi Sahai Studio, Est. 1991**
