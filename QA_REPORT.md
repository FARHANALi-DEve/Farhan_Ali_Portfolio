# Quality assurance — Farhan Ali Studio 3D Portfolio

Date: 26 October 2026

## Confirmed passing

- JavaScript syntax: `node --check app.js` — PASS
- All seven optimized portrait assets exist — PASS
- Main content sections: 7 — PASS
- Internal anchor links resolve — PASS
- Browser JavaScript runtime errors: none in tested configurations — PASS
- Responsive browser checks: 320, 390, 768, 1024, 1440, 1920 px — PASS
- No horizontal overflow at tested widths — PASS
- Mobile menu opening and closing — PASS
- Screenshots of Chromium-rendered HTML/CSS/image/JS design: `previews/desktop-home.png`, `previews/mobile-home.png`, `previews/desktop-full.png`, `previews/mobile-full.png` — PASS
- Dependencies: none, and no npm install is required — PASS

## Environment-specific limitations

- The browser environment restricts opening `file://` and `localhost` pages. For visual tests, the **same** HTML, CSS, JS, and image bytes were supplied to Chromium as inline content, which did render successfully. The screenshots show that rendered design and are **not AI-generated mockups**.
- The test browser reports `WebGL: unavailable` due to its GPU/browser configuration. The website displays a decorative fallback sphere there. The WebGL rendering implementation exists in `app.js`, but WebGL GPU-specific runtime behavior **has not been verified** in this environment. In a browser that supports WebGL, the metallic rotating icosahedron should be shown automatically.
- Actual deployment to GitHub Pages and external services has not been performed.

## Reference image usage

The supplied 3D Modeling Trial asset consists of JPG/PSD banner artwork. It is *not* website source. The delivered HTML/CSS/JS site is an original, interactive website using its cool blue / silver / dark graphite visual theme as reference. The original JPG reference is in `assets/reference/inspiration-banner.jpg`.
