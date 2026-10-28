# 📷 Shashi Sahai — Three Decades of Perspective

A memorial photography website dedicated to **Shashi Sahai** (1961 – August 15, 2026) — veteran photojournalist, photographer, and philanthropist. The site celebrates his 35+ years behind the lens and his lasting impact through Aarohan NGO.

---

## 🌐 Live Pages & Collections

| Page | Description |
|------|-------------|
| `index.html` | Home — Hero narrative, photojournalist biography, preview strip, curated mosaic, and philosophy |
| `collections.html` | Collections Hub — 6 curated photographic collections: People, Everyday Life, Heritage, Nature, City Light, Wildlife |
| `stories.html` | Visual Essays Hub — Six in-depth visual essays exploring framing, lighting, movement, and looking techniques |
| `portfolio.html` | Portfolio Archive — Dedicated gallery featuring 27 photographs across 7 categories with dynamic filtering & lightbox |
| `archive.html` | Photo Archive & Timeline — Historical chronicles hero, synchronized 1991–2026 milestone spine, and visual history |
| `tributes.html` | Tributes & Reflections — Interactive Tribute Wall with local storage persistence, tabs, and Swiper archival carousel |
| `privacy.html` | Privacy Policy — Transparent data minimization policy, copyright notices, and institutional contact information |
| *Editorial essays* | `street-stories.html`, `human-connections.html`, `living-heritage.html`, `water-and-wings.html`, `light-and-shadow.html`, `ways-of-seeing.html` |
| *Collection galleries*| `people.html`, `everyday.html`, `heritage.html`, `nature.html`, `city-light.html`, `wildlife.html` |
| *Memorial essays* | `about-archive.html`, `behind-the-lens.html`, `community-and-trust.html`, `friendship.html`, `learning-to-look.html`, `legacy.html`, `life.html` |

---

## 🗂️ Project Structure

```
photography/
├── index.html              # Main landing page
├── collections.html        # Collections index (6 routes)
├── stories.html            # Visual essays index (6 essays)
├── portfolio.html          # Dedicated Portfolio Archive (7 categories)
├── archive.html            # Photo Archive & 1991–2026 timeline page
├── tributes.html           # Tributes & interactive remembrance wall
├── privacy.html            # Privacy Policy page
├── [editorial pages].html  # In-depth essays & collection pages
├── style.css               # Global unified stylesheet & design system
├── script.js               # Core JavaScript (Navbar, progress bar, lightbox, filters, tribute wall)
├── catalog.js              # Photo archive catalog & metadata
├── exhibition.js           # Dynamic exhibition gallery rendering
├── scroll.js               # Smooth scroll & parallax engine
├── favicon.svg             # Standard browser tab icon (aperture design)
└── images/                 # All active photography assets (WebP/SVG)
```

---

## ✨ Features & Design Improvements

- **Top Scroll Progress Line** — Subtle crimson-to-gold gradient scroll indicator pinned to the top of every page
- **Calligraphy Logo** — Handcrafted vector signature logo mark for Shashi Sahai in navbar and branding
- **Organized Photo Archive** — Seven distinct categories (*People*, *Nature*, *Travel*, *Heritage*, *City Lights*, *Wildlife*, *Culture*) with short editorial descriptions for every photo
- **Dedicated Portfolio Archive** — Standalone project showcase featuring the Cannes Lions Bronze project, Banaras series, and Aarohan NGO documentary work
- **Refined Typographic Hierarchy** — Bold headlines, semibold section markers, and expressive italic editorial emphasis
- **Privacy Policy Page** — Full transparency regarding data handling, zero third-party tracking, and photographic copyright
- **Lightbox Preview Modal** — Full-screen image inspector with keyboard navigation (←, →, ESC) and contextual caption details
- **Decade Timeline** — Synchronized scroll spine celebrating 35+ years (1991 → 2026)
- **Tribute Wall** — Client-side persistent remembrance messages powered by browser storage
- **Fully Responsive** — Mobile-first layout tested across desktop, laptop, tablet, and mobile with reduced-motion support

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
- **Aarohan NGO Tribute:** [aarohanngo.org/shashi-sahai](https://aarohanngo.org/)

---

## 📝 Credits

- **Subject:** Shashi Sahai (1961 – 2026) — Photojournalist, Cannes Bronze Winner, Aarohan NGO Co-founder
- **Tribute authored by:** Rani Patel, Founder & President, Aarohan NGO
- Website built as a personal memorial and photographic archive.

---

*"A photograph is a pause button for time — it lets a single moment outlive the instant it was made in."*
— **Shashi Sahai Studio, Est. 1991**
