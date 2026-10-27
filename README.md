# Farhan Ali — Studio 3D Portfolio

A premium editorial portfolio inspired by the *3D Modeling Trial* visual reference provided by the user. The website is a new, original implementation; the reference PSD is **not** an HTML or 3D template.

## Open it (no npm needed)

1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.
3. That's it. All photos, styles, scripts and the procedural WebGL icosahedron are included locally.

You can also preview it with a local web server (optional):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a new public GitHub repository.
2. Upload everything in this folder **including** `index.html`, `styles.css`, `app.js`, and the `assets` folder to the repository root.
3. In **Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Wait for GitHub Pages deployment and open the provided URL.

No build step, no package.json, and no `node_modules` are needed.

## Features

- Responsive design in the reference's pale blue, graphite and silver palette.
- All seven personal portfolio portraits embedded in optimized WebP format.
- Real procedural WebGL 3D metallic icosahedron on the hero (works offline); CSS fallback for devices with WebGL disabled.
- CSS perspective objects, metallic chrome accents, reveal animations and interactions.
- Working internal navigation, mobile menu, mailto, GitHub and LinkedIn links.
- Respects reduced-motion preferences; images have descriptions and lazy loading.
- Portfolio content transcribed and summarized from the provided resume, without invented project URLs.

## Important distinction

The provided PSD/JPG is a **static promotional banner**. This site recreates its visual language (colors, circular portrait masks, floating silver shapes) but is built from original code, and is not an extraction of a nonexistent website template.

## Screenshot files

`previews/desktop-home.png` and `previews/mobile-home.png` are screenshots of the **actual HTML rendered by Chromium**, not generated mockups, if they appear in this distribution.

## Personalize

Replace `assets/images/*.webp` if desired. Edit project descriptions, certification titles and contact links in `index.html`.
