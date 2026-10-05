# Riyasdeen Samsudeen — Engineering Portfolio

A single-page portfolio site (Mechatronics · ICT Innovation · Product Development), built from a Stitch design export.

## Files

| File                 | Purpose                                                        |
| -------------------- | ------------------------------------------------------------- |
| `index.html`         | The whole page — all sections, semantic markup                |
| `styles.css`         | Base overrides, smooth scroll, reduced-motion, active-nav CSS |
| `tailwind.config.js` | The custom Tailwind theme (colors, fonts, spacing)            |
| `main.js`            | Optional JS: active nav highlighting + accordion behavior     |

The site uses the **Tailwind CDN** plus Google Fonts and Material Symbols, so it runs with no build step and no `npm install`. An internet connection is required for the CDN assets.

## Preview locally

Open `index.html` directly in a browser, or serve it (recommended, so relative paths and fonts behave):

```powershell
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000

## Customizing content

Everything is plain HTML in `index.html`. Common edits:

- **Portrait photo** — In the hero, find the comment `To use a real photo` and swap the placeholder block for:
  ```html
  <img src="assets/portrait.jpg" alt="Riyasdeen Samsudeen" class="absolute inset-0 w-full h-full object-cover" />
  ```
  Create an `assets/` folder and drop the image in.
- **CV download** — Replace the `href="#"` on the two "CV" / "Download Curriculum Vitae" links with `href="assets/cv.pdf" download`.
- **LinkedIn / GitHub** — Replace `https://linkedin.com` and `https://github.com` with your real profile URLs (header, contact section, footer).
- **Email** — Search-replace `contact@riyasdeen.dev` with your real address.
- **Project images** — Each project's "Media Viewport" placeholder can be replaced with an `<img>` the same way as the portrait.
- **Achievement proofs** — Each award tile has a "Certificate / Award Proof" placeholder ready for a scanned image.

## Going to a build step (optional, later)

If you want to remove the CDN dependency and ship a minified CSS bundle, install Tailwind locally and compile against the same `tailwind.config.js`. Not required for the site to work.

## Deploy

Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages. Just upload the folder — no server needed.
