# How to Use Self-Hosted Web Fonts in a React Component Library (License-Safe Pattern)

*Last updated: May 2026 · Maintained by [Monotype Imaging Inc.](https://www.monotype.com/)*

This repository shows how to **use** licensed web fonts in a React component library **without distributing** font files inside the installable npm package — a separation required for compliance with standard Monotype web font licenses. **Using** a font means serving it from your own deployment so end users' browsers can render it; **distributing** a font means transferring the font binary to another party (for example, embedding it in a library that every consumer installs). Web font licenses cover the former for a licensed domain; they almost never authorize the latter through a package registry.

The approach uses CSS custom properties (`var(--font-family)`) inside the component library so that `@font-face` rules and `.woff2` files stay in the **consuming application**, where licensing obligations can be managed. A shared library that embeds font binaries redistributes those files to every application that installs it, which falls outside a typical web font license. The pattern is demonstrated with a [Vite](https://vitejs.dev/guide/assets.html)-based consumer app (`examples/consumer-app/`) that serves fonts from its own origin via [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), as defined in the [W3C CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/) specification.

This README is explanatory and non-binding; authoritative assertion text lives in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation). See also the published [docs-webfonts-hub](https://monotype.github.io/docs-webfonts-hub/).

## What Is the CSS Variable Pattern for Web Fonts in React?

### How the component library references fonts without bundling them

- The library (`src/`) uses `font-family: var(--font-family)` (see `src/MyComponent.jsx`) — no `.woff2` imports or font binaries in the published package.
- Components never embed or re-export font files; the built `dist/` output contains only JavaScript and CSS that reference variables.

### How the consumer application owns font files and `@font-face` declarations

- The consumer app (`examples/consumer-app/`) defines `@font-face` in `fonts.css` and places files under `public/fonts/` (served by Vite as `/fonts/...`).
- `examples/consumer-app/main.jsx` imports `./fonts.css` before rendering so the browser parses `@font-face` first.

## Why You Cannot Bundle Font Files in a Shared React Library

A component library that bundles font files redistributes them to every application that installs the package via npm. Standard Monotype web font licenses authorize delivery to end users' browsers from a specific deployment — not redistribution through a package registry. By using CSS variables, the library remains font-agnostic: font files and licensing obligations stay with the deploying application. See [lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user) and [lc-006](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#using-a-font-differs-from-distributing-a-font).

## Font Delivery Approach Comparison (Within React)

| Approach | Font files in package? | License boundary | CORS required | Recommended |
|---|---|---|---|---|
| CSS variables (this pattern) | No | Consuming app owns files | Same-origin: no; cross-origin: yes | Yes |
| Bundled font imports in library | Yes — redistributed to all consumers | Unclear — uncontrolled | Depends on setup | No |
| CDN `<link>` in library | No — but third-party dependency | CDN provider's terms | No | Not for Monotype-licensed fonts |
| Peer dependency on font package | Yes — if package ships files | Same risk as bundling | Depends | No |

## React vs. Next.js Web Font Loading: Which Pattern Should You Use?

| Criterion | React + CSS variables (this pattern) | Next.js `next/font/local` |
|---|---|---|
| Font loading mechanism | `@font-face` in consumer CSS; resolved via `var()` | Build-time optimization via `next/font/local` |
| Font files owned by | Consuming application (`public/fonts/`) | Next.js app (`public/fonts/` or path relative to layout) |
| Library bundles font files? | No — zero font data in library package | No — fonts stay in the app |
| CSS variable usage | Explicit: `var(--font-family)` | Optional: `next/font/local` can expose a variable |
| CORS risk | Low if same-origin; headers required for CDN delivery | Low — fonts usually same-origin from the Next deployment |
| Tracking script required? | Depends on license; add to consumer `index.html` | Depends on license; add via `next/script` or layout |
| Best for | Shared React libraries, Vite/CRA, design systems | Next.js apps wanting build-time subsetting |
| Related Monotype pattern | This repository | [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) |

Use this pattern when your component library is framework-agnostic or your app does not use Next.js. Use [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) when the app is Next.js and you want build-time font optimization.

## How to Implement `@font-face` in the Consumer Application

**This repository's demo** uses `examples/consumer-app/fonts.css` with `font-family: "MyFont"`, `src: url("/fonts/MyFont.woff2")`, and `:root { --font-family: "MyFont", system-ui, sans-serif; }`, with the file at `examples/consumer-app/public/fonts/MyFont.woff2`.

```css
/* fonts.css — consumer application */
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/YourFont.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* See MDN: font-display */
}

:root {
  --font-family: 'YourFont', sans-serif;
}
```

The library consumes the variable only:

```css
/* e.g. src/styles.css — or inline style in MyComponent.jsx */
.my-component {
  font-family: var(--font-family, sans-serif);
}
```

> **This repo's library:** `src/MyComponent.jsx` uses `style={{ fontFamily: 'var(--font-family)' }}` — equivalent to a stylesheet as long as the library never imports font binaries.

WOFF2 is supported in all modern browsers (Chrome 36+, Firefox 39+, Safari 10+, Edge 14+; see [caniuse: WOFF2](https://caniuse.com/woff2)). For current-browser apps you typically need only `.woff2`.

## CORS Configuration for Self-Hosted Web Fonts

When fonts are served from a **different origin** than the page, the font server must return `Access-Control-Allow-Origin` matching the page origin. Without it, browsers often show missing glyphs rather than a clear Console error — inspect the Network tab. Same-origin delivery (as in this repo's Vite demo) does not require CORS headers.

See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), and the [W3C CORS specification](https://www.w3.org/TR/cors/).

## How to Set Up Self-Hosted Web Fonts in a React App with Vite (Step-by-Step)

**Step 1 — Install root dependencies.** From the repository root, run `npm ci` to match CI and `package-lock.json` (use `npm install` only when intentionally updating dependencies).

**Step 2 — Build the component library.** Run `npm run build`. Inspect `dist/` and confirm it contains **no** `.woff2` or font binaries — only code and CSS referencing `var(--font-family)`.

**Step 3 — Place your licensed `.woff2` in the consumer app's public folder.** Copy the file to `examples/consumer-app/public/fonts/YourFont.woff2`. Vite serves `public/` at the site root ([static assets](https://vitejs.dev/guide/assets.html)). Font paths are gitignored by default to avoid accidental redistribution.

**Step 4 — Define `@font-face` in `examples/consumer-app/fonts.css`.** Match `url("/fonts/YourFont.woff2")` to your filename. Use `font-display: swap` per [MDN: font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display).

**Step 5 — Set `:root { --font-family: ... }` in the same file** (or global CSS) so library components resolve the licensed face.

**Step 6 — Import `fonts.css` in the consumer entry point.** This repo imports it in `examples/consumer-app/main.jsx` before rendering:

```jsx
import "./fonts.css";
import App from "./App";
```

**Step 7 — (Conditional) Add a tracking script if your license requires it.** Some licenses require a script alongside self-hosted fonts — separate from `@font-face`. Add it to `examples/consumer-app/index.html` or your framework's document head. See [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

**Step 8 — Install consumer dependencies and start the dev server.**

```bash
cd examples/consumer-app
npm ci
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`) and confirm the library text uses your font.

**Step 9 — (Conditional) Configure CORS if fonts move to a CDN.** The CDN must return `Access-Control-Allow-Origin: https://your-app-domain.com` on font responses. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

**Step 10 — Verify the production build.**

```bash
cd examples/consumer-app
npm ci
npm run build
```

Confirm `dist/` contains the consumer's font assets only — not font files bundled from the library package.

## Canonical Assertions Implemented

This pattern implements assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `lc-005` — embedding involves transferring font data beyond the original user
- `lc-006` — using a font differs from distributing a font
- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration; missing headers cause silent font blocking
- `pc-012` — some licenses require a tracking script alongside self-hosted fonts; this pattern covers delivery only — add a script to the consumer app when mandated. See the **Clarification** on [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

## Frequently Asked Questions

### Can I include font files directly in a React component library package?

No. A React component library that bundles font files redistributes them to every application that installs the package via npm. Standard Monotype web font licenses authorize delivery to end users' browsers from a specific deployment — not redistribution through a package registry. Keep font files in the consuming application and reference them from the library only through CSS custom properties. See [lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user).

### What is the difference between using a font and distributing a font?

**Using** a font means serving it from your deployment so browsers can render it — normal web font delivery. **Distributing** a font means transferring the binary to another party (for example, inside an npm package other developers install). Web font licenses cover scoped **use**; they almost never cover **distribution** through a shared library. This pattern ensures the library only **uses** fonts via `var(--font-family)`, never distributes them. See [lc-006](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#using-a-font-differs-from-distributing-a-font).

### How do CSS custom properties (`var()`) help with web font licensing in React?

When a component references `font-family: var(--font-family)` instead of importing a font file, the library contains no font data. The browser resolves the family from whatever the consuming application defined in its own CSS alongside `@font-face`. Font files and license obligations stay entirely in the deploying app.

### Why are my self-hosted fonts being blocked by the browser?

The most common cause is a missing `Access-Control-Allow-Origin` header when fonts are served from a **different origin** than the page. The failure often appears as missing glyphs, not a visible error — check the Network tab → Font → response headers. Serving fonts from the same origin as the Vite app (as in `examples/consumer-app/`) avoids this. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

### Do I need a different license to self-host Monotype fonts compared to using a cloud CDN service?

Yes. A **desktop** license usually does not permit web delivery. **Self-hosting** requires a web font license that explicitly allows serving WOFF2/WOFF from your infrastructure. **Monotype CDN** delivery is governed by separate terms (often including usage metering). Confirm your agreement covers self-hosted delivery and whether a tracking script is required alongside `@font-face`. See [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation).

### When is a Monotype tracking script required with self-hosted fonts?

Some web font licenses require a JavaScript tracking script on every page that uses the licensed font, even when fonts are self-hosted. That obligation is separate from `@font-face` delivery. Add the script to the consumer app's HTML entry point when your license requires it. Per [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files), Monotype does not process personal data in connection with the script but uses it to count page views against the licensed contingent.

### Can I use a desktop font license for web delivery in a React app?

No. Desktop licenses usually cover local design use only, not serving fonts to browsers via `@font-face`. A valid Monotype web font license scoped to your serving domain is required.

---

## Repository Structure

- `src/` — component library; CSS variable references only
- `examples/consumer-app/` — Vite consumer demo with `@font-face` and `public/fonts/`

## Usage

### Build the library

From the repository root, install dependencies and compile the library. The `dist/` output should contain CSS with `var(--font-family)` references but **no** font binaries.

```bash
npm ci
npm run build
```

After `npm run build`, inspect `dist/` to confirm no `.woff2` files are present.

### Run the consumer app

Switch into the consumer app, install its dependencies, and start the Vite dev server. The consumer owns font assets; the library only consumes `--font-family`.

```bash
cd examples/consumer-app
npm ci
npm run dev
```

Open the URL in the terminal (typically `http://localhost:5173`). If the font does not appear, confirm a `.woff2` exists at `examples/consumer-app/public/fonts/` and that `fonts.css` `url()` matches the filename.

Before first run, place a licensed `.woff2` in `examples/consumer-app/public/fonts/` and update `fonts.css`. Files are gitignored by default.

This repository includes **`package-lock.json`** at the **root** and under **`examples/consumer-app/`**. Use **`npm ci`** in each directory to match CI.

### Verify the consumer production build

To replicate CI and confirm the consumer app builds with a real font path:

```bash
cd examples/consumer-app && npm ci && npm run build
```

A successful build confirms `fonts.css` references an existing file, lockfile dependencies resolve, and Vite can emit the consumer `dist/` — without bundling fonts into the library package.

## Font Files

Font files are **gitignored** by default. Supply files under a valid Monotype web font license, or force-add a subset for CI. When a subset `.woff2` is present in `examples/consumer-app/public/fonts/`, it is subject to the Monotype limited-testing terms in **LICENSE** — not general web use or redistribution. See `examples/consumer-app/public/fonts/placeholder.txt`.

To commit a subset for CI, force-add once (required because `public/fonts/` is gitignored):

```bash
git add -f examples/consumer-app/public/fonts/MyFont.woff2
```

The `-f` flag is required once; afterward the file is tracked like any other source. The committed subset is licensed for limited testing per **LICENSE**, not production web use.

## Requirements

- [Node.js 18+](https://nodejs.org/en/about/releases/) (LTS)
- React 18+
- [Vite 8+](https://vitejs.dev/)

## Related Patterns

- [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) — Next.js `next/font/local`
- [pattern-saas-fonts-embedding](https://github.com/Monotype/pattern-saas-fonts-embedding) — server-controlled font endpoints
- [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage) — CI/CD font scanning
- [pattern-variable-fonts-usage](https://github.com/Monotype/pattern-variable-fonts-usage) — variable font axes via CSS
- [docs-webfonts-hub](https://monotype.github.io/docs-webfonts-hub/) — central developer entry point

## Support

Use GitHub Discussions (Q&A category) for questions about this pattern.

## License

Sample application code in this repository is licensed under the MIT License. The subset font file in `examples/consumer-app/public/fonts/` is included only as a build/CI demonstration asset and licensed for limited testing purposes only; it is not licensed for regular use on websites or redistribution. Please refer to the LICENSE file for both licenses. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository's terms.
