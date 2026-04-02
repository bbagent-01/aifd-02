# BB DS3 — Brightbase Design System v3

## Summary
A living design system reference site for Brightbase. Cream-first warm palette with cool dark teal sections, 12-column + bento + line grid layouts, isometric/UI/diagram SVG illustrations, and a full GSAP + Lenis animation stack. Used as the pattern library for building Brightbase client sites.

## Tech Stack
- **Language:** HTML, CSS, vanilla JS (no framework, no build step)
- **Fonts:** Geist (sans) + Fragment Mono (mono) via Google Fonts
- **Animations:** GSAP 3.12.5, ScrollTrigger, SplitType, Lenis 1.1.13 — all CDN
- **Hosting:** Cloudflare Pages (auto-deploy on push)
- **Repo:** github.com/bbagent-01/ds3

## File Structure
```
ds3/
├── index.html              ← Full reference site (1632 lines, all styles inlined)
├── css/
│   ├── bb-tokens.css       ← Design tokens — colors, spacing, radius, shadows, easings
│   ├── bb-type.css         ← Typography classes + Google Fonts import
│   ├── bb-grid.css         ← Line grid, 12-col, bento, dot overlay
│   └── bb-components.css   ← Buttons, cards, inputs, badges, tags, links
├── js/
│   └── bb-animations.js    ← Lenis init, GSAP headline/body/stagger/parallax animations
├── svg/
│   └── illustrations.svg   ← Placeholder (real SVGs are inline in index.html)
├── .github/workflows/
│   └── deploy.yml          ← Cloudflare Pages deploy on push to main
└── PROJECT.md
```

## Architecture

### Design Tokens (`--bb-*` CSS custom properties)
- **Colors:** Primary `#FE4E18` (orange), Secondary `#34474E` (teal), Cream scale `#E8E4DD`→`#FFFDF6`, Dark scale `#0D1E24`→`#1A3540`
- **Spacing:** 4–160px scale (8px rhythm)
- **Radius:** 2–32px + full (100vw)
- **Easings:** Standard (material), Bounce (0.23,1,0.32,1), Custom (adjustable via UI)
- **Shadows:** Warm card, dark card, glow-primary, inset variants

### Surface Themes
- `.bg-cream` / `.bg-cream-deep` / `.bg-white` — warm defaults
- `.bg-dark` / `.bg-dark-2` — cool dark teal sections
- Page alternates cream→dark→cream→dark for rhythm

### Grid Systems (3 types)
1. **Line grid** (`.bb-grid`) — 1px gap creates visible lines, `.bb-grid--dark`/`--warm` themes, `.bb-dots` overlay
2. **12-column** (`.bb-cols`) — standard layout grid, `.col-1`–`.col-12` spans, responsive collapse
3. **Bento** (`.bb-bento`) — rounded 16px cells, 16px gap, `.bb-bento--dark`/`--warm`
4. **Grid overlay** — toggleable 12-col guide (`#grid-overlay`)

### Animation System (`bb-animations.js`)
- **h1/h2** → word slide-up from baseline (SplitType + overflow clip, 40ms stagger)
- **All other text** → scroll-driven opacity+y fade (scrub-linked)
- **Element groups** → stagger load (grid cells, card grids, swatch rows, demo rows)
- **All animations** retrigger on scroll back up (`play reverse play reverse`)
- **Parallax** → `data-speed` attribute on `.bb-parallax` elements

### Illustration Types (inline SVGs)
1. **Semi-flat diagrams** — flow charts, architecture maps, node+connector style
2. **UI mockups** — dashboard windows, widget cards, sparklines (Transistor-inspired)
3. **Isometric geometric** — stacked platforms, 30° angles, grid lines on surfaces

### Components
- Buttons: `.bb-btn-primary` (orange), `.bb-btn-secondary` (teal), `.bb-btn-ghost`, `.bb-btn-ghost-dark`
- Cards: `.bb-card` (warm), `.bb-card-dark` (teal)
- Inputs: `.bb-input`, `.bb-input-dark` — focus ring uses primary color
- Badges: `.bb-badge-primary`, `.bb-badge-secondary`, `.bb-badge-neutral`
- Tags: `.bb-tag-warm`, `.bb-tag-cool`
- Links: `.bb-link` with arrow SVG
- Grid links: `.bb-grid-link` — hover lifts 4px + shadow

### Page Modules (in reference site)
1. Hero (cream) — display type + CTA
2. Typography (dark) — full type scale + font specimens
3. Colors (cream) — swatches + surface demos
4. Grid (dark) — line grid + 12-col + bento demos
5. Components (cream) — buttons, cards, inputs, badges
6. Spacing & Radius (dark) — visual scales
7. Motion (cream) — text reveal, stagger, easing editor, parallax split
8. Illustrations (dark) — 3 types with descriptions
9. Hero Variants (dark) — split, centered, full-width warm
10. CTA (cream) — dark block + inline warm
11. Testimonials (dark) — pull quote + card grid
12. Pricing (cream) — 3-tier with featured highlight
13. Footer (dark) — 4-column links + social + copyright

## Local Development
No build step. Open `index.html` in a browser or:
```bash
cd ~/Dropbox/Claude/Projects/ds3
npx serve .
# or: python3 -m http.server 8000
```
Edit `index.html` directly. Styles are inlined. The `css/` and `js/` files are the portable versions for use in other projects.

## Deployment
- **Live URL:** https://style.bbase.ai
- **Pages.dev URL:** https://ds3-23r.pages.dev
- **Deploy:** Push to `main` → GitHub Actions → Cloudflare Pages (deploys root directory as-is)
- **DNS:** CNAME `style` → `ds3-23r.pages.dev` on bbase.ai zone
- **Secrets:** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set on repo

## Current State
- **Version:** v3.5
- **Status:** Reference site complete with all 13 sections
- **Ready for:** Packaging tokens/components into a reusable template, then building the actual Brightbase site

### Known items for next session
- Loren wants to fine-tune styles before building — expect adjustments to colors, spacing, animation timing
- The `css/` files are standalone but slightly out of sync with inlined styles in `index.html` — the HTML is the source of truth
- Grid overlay button uses inline `onclick` — works but could be cleaner
- No mobile nav/hamburger menu yet
- No form validation states yet
- CDN caching can delay updates — hard refresh (`Cmd+Shift+R`) after deploys

## Version History
- **v3.0** — Initial deploy. Dark-first palette (b150 colors), Raycast line grid, GSAP text reveals
- **v3.1** — Cream-first palette shift (`#FE4E18` primary, `#0D1E24` dark teal), isometric SVG illustrations
- **v3.2** — Easing curve fix, parallax split layout, hero variants, CTA, testimonials, pricing, footer
- **v3.3** — New text animations (slide-up headlines, scroll-fade body), 3 illustration types, stagger fix
- **v3.4** — Universal text animations on all elements, scroll retrigger, illustrations section, grid hover, custom easing editor, removed external references
- **v3.5** — Label padding, bounce easing on all hovers, 12-column grid + bento layout + grid overlay toggle
