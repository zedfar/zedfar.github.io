# zedfar.github.io

Personal portfolio website — [zedfar.github.io](https://zedfar.github.io)

Built with **Vite + TypeScript**. Deployed automatically to GitHub Pages via GitHub Actions.

## Features

- Neural schematic canvas — animated bezier wires with flowing data packets and mouse repel physics
- Scroll reveal animations — nodes fade + slide in via IntersectionObserver
- Custom scrollbar + scroll progress bar
- SVG favicon and OG image (1200×630)
- SEO, Open Graph, Twitter Card, and JSON-LD structured data
- Fully responsive

## Stack

- Vite + TypeScript (no framework)
- Canvas API — neural wire animation
- Google Fonts — Inter + Fira Code

## Structure

```
zedfar.github.io/
├── .github/workflows/deploy.yml   # CI/CD → GitHub Pages
├── src/
│   ├── main.ts                    # entry point
│   ├── canvas.ts                  # neural wire animation
│   ├── scroll.ts                  # scroll progress + reveal
│   └── style.css
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   └── og-image.png
├── index.html
├── vite.config.ts
└── tsconfig.json
```

## Development

```bash
npm install
npm run dev       # dev server at localhost:5173
npm run build     # type check + production build → dist/
npm run gen-og    # regenerate og-image.png from og-image.svg (requires Chromium)
```

## Deploy

Push to `main` → GitHub Actions runs `tsc && vite build` → deploys `dist/` to GitHub Pages.

> Go to **Settings → Pages → Source** and set to **GitHub Actions** on first setup.

---

> [zedfar](https://github.com/zedfar)
