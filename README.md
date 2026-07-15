# How to Use Self-Hosted Web Fonts in a React Component Library (License-Safe Pattern)

*Last updated: May 2026 · Maintained by [Monotype Imaging Inc.](https://www.monotype.com/)*

This repository shows how to deliver licensed web fonts in a React component library **without redistributing font binaries inside the installable npm package** — a separation required for compliance with standard Monotype web font licenses.

**Web font use and distribution.** Rendering text for visitors requires **use** of the font software in each end user's browser. That use requires **distribution** of the font software (the `.woff2` binary) from your deployment to the browser — that authorized delivery is what a **web font license** covers. This pattern keeps that licensed delivery in the **consuming application** (via `@font-face`), not in the library package.

**Distribution this pattern avoids.** Embedding font files in a shared npm library **transfers font software to every developer** who installs the package — a separate form of distribution outside the scope of a typical web font license. The library references `var(--font-family)` only; the consumer app owns `@font-face` and font files. See [lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user) and [lc-006](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#using-a-font-differs-from-distributing-a-font).

The approach uses CSS custom properties (`var(--font-family)`) inside the component library so that `@font-face` rules and `.woff2` files stay in the **consuming application**, where web font licensing and delivery are managed. A shared library that embeds font binaries transfers those files to every application that installs it, which falls outside a typical web font license. The pattern is demonstrated with a [Vite](https://vitejs.dev/guide/assets.html)-based consumer app (`examples/consumer-app/`) that serves fonts from its own origin via [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), as defined in the [W3C CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/) specification.

This README is explanatory and non-binding; authoritative assertion text lives in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation). See also the published [docs-webfonts-hub](https://monotype.github.io/docs-webfonts-hub/).

## What Is the CSS Variable Pattern for Web Fonts in React?

### How the component library references fonts without bundling them

- The library (`src/`) uses `font-family: var(--font-family)` (see `src/MyComponent.jsx`) — no `.woff2` imports or font binaries in the published package.
- Components never embed or re-export font files; the built `dist/` output contains only JavaScript and CSS that reference variables.

### How the consumer application owns font files and `@font-face` declarations

- The consumer app (`examples/consumer-app/`) defines `@font-face` in `fonts.css` and places files under `public/fonts/` (served by Vite as `/fonts/...`).
- `examples/consumer-app/main.jsx` imports `./fonts.css` before rendering so the browser parses `@font-face` first.

## Why You Cannot Bundle Font Files in a Shared React Library

A component library that bundles font files transfers font software to every developer who installs the package via npm. Standard Monotype web font licenses authorize distribution of font software to **end users' browsers** from a licensed deployment — not transfer of font binaries through a package registry to unrelated developers. By using CSS variables, the library remains font-agnostic: authorized web delivery and license obligations stay with the deploying consumer application. See [lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user) and [lc-006](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#using-a-font-differs-from-distributing-a-font).

## Font Delivery Approach Comparison (Within React)

| Approach | Font files in package? | License boundary | CORS required | Recommended |
|---|---|---|---|---|
| CSS variables (this pattern) | No | Consumer app owns authorized web delivery | Same-origin: no; cross-origin host provider: yes | Yes |
| Bundled font imports in library | Yes — font software transferred to all npm consumers | Outside typical web font scope | Depends on setup | No |
| Monotype font delivery embed in library | No — but ties app to Monotype delivery service | Web font license / delivery terms | Handled by Monotype | Valid path — not this pattern |
| Unrelated third-party font service in library | No — but external font platform | Not authorized for Monotype font software | N/A | No |
| Peer dependency on font package | Yes — if package ships files | Same risk as bundling | Depends | No |

## React vs. Next.js Web Font Loading: Which Pattern Should You Use?

| Criterion | React + CSS variables (this pattern) | Next.js `next/font/local` |
|---|---|---|
| Font loading mechanism | `@font-face` in consumer CSS; resolved via `var()` | Build-time optimization via `next/font/local` |
| Font files owned by | Consuming application (`public/fonts/`) | Next.js app (`public/fonts/` or path relative to layout) |
| Library bundles font files? | No — zero font data in library package | No — fonts stay in the app |
| CSS variable usage | Explicit: `var(--font-family)` | Optional: `next/font/local` can expose a variable |
| CORS risk | Low if same-origin; headers required for authorized host provider | Low — fonts usually same-origin from the Next deployment |
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

## How do I add proprietary fonts with CSS Modules in React?

CSS Modules style **components**; they do not replace `@font-face` ownership. For proprietary Monotype fonts, keep the same split as this pattern: the **consumer application** loads the licensed `.woff2` and declares `@font-face` in **global** CSS; CSS Modules (in the library or the app) only apply `font-family` — preferably via `var(--font-family)`.

| Layer | What belongs here | What does not |
|---|---|---|
| **Consumer global CSS** (e.g. `fonts.css` imported from `main.jsx`) | `@font-face`, `:root { --font-family: ... }`, file under `public/fonts/` | Library `dist/` or npm package contents |
| **CSS Module** (e.g. `Title.module.css`) | `font-family: var(--font-family, sans-serif);` on local class names | `url(...woff2)` imports, `@font-face` that pulls binaries into the library bundle |
| **Shared React library** | Modules or inline styles that reference the variable only | Any `.woff2` / font import |

**Consumer app — global face (same as this repo's `fonts.css`):**

```css
/* fonts.css — imported once from main.jsx; not a CSS Module */
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/YourFont.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-family: 'YourFont', system-ui, sans-serif;
}
```

**Consumer or library — CSS Module (classes only):**

```css
/* Title.module.css */
.title {
  font-family: var(--font-family, sans-serif);
  font-weight: 600;
}
```

```jsx
import styles from './Title.module.css';

export function Title({ children }) {
  return <h1 className={styles.title}>{children}</h1>;
}
```

**Why not put `@font-face` + `url(./MyFont.woff2)` inside a library CSS Module?** Bundlers often emit that file into the published package. That redistributes font software to every npm consumer — outside a typical web font license ([lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user), [lc-006](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#using-a-font-differs-from-distributing-a-font)). Put faces in the deploying app’s global CSS; use Modules for presentation only.

You still need a **web font license** for browser delivery ([pc-008](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#self-hosting-web-fonts-requires-a-web-font-license-desktop-licenses-do-not-permit-web-delivery)). CSS Modules do not change license type.

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

**Step 9 — (Conditional) Configure CORS if fonts move to an authorized host provider.** If fonts are served from a different origin than the page, the host must return a scoped `Access-Control-Allow-Origin: https://your-app-domain.com` on font responses. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation#monotype-font-delivery-vs-self-hosting).

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

No. A React component library that bundles font files transfers font software to every developer who installs the package via npm. Standard Monotype web font licenses authorize distribution of font software to end users' browsers from a licensed deployment — not transfer through a package registry. Keep font files in the consuming application and reference them from the library only through CSS custom properties. See [lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user).

### What is the difference between using a font and distributing a font?

In Monotype license terms, **use** of font software means employing it to generate content — for web fonts, rendering happens in the end user's browser after the font is loaded. **Distribution** of font software means transferring the font software itself (the binary), not only the visual output.

Web font delivery **is** distribution: serving a `.woff2` from your deployment to a visitor's browser transfers font software. A **web font license** authorizes that distribution (typically scoped by domain and/or page views). Web font use always requires that distribution — the license exists to permit it.

The distinction relevant to **this pattern** is *who receives* the font software:

- **Authorized web distribution** — the consumer app delivers font files to **end users** under your web font license.
- **Unlicensed redistribution (this pattern avoids)** — the library embeds font binaries in an npm package, transferring font software to **other developers** who install the package.

The library must not bundle font files; the consumer app performs licensed delivery via `@font-face`. See [lc-006](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#using-a-font-differs-from-distributing-a-font).

### Do I need a different license to self-host Monotype fonts compared to using Monotype font delivery?

You need a **web font license** for either path — not a desktop license. A desktop license usually covers local design and print workflows only, with no further distribution to web users.

**Self-hosting** (your infrastructure or an **authorized third-party host provider** under a written agreement) and **Monotype font delivery service** (authorized embed) are both delivery options under a web font license. They differ in **who operates delivery**, not in whether a web font license is required. Confirm your agreement covers your chosen delivery method, licensed domain(s), and whether a tracking script is required alongside self-hosted files. See [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation#monotype-font-delivery-vs-self-hosting) and [pc-008](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#self-hosting-web-fonts-requires-a-web-font-license-desktop-licenses-do-not-permit-web-delivery).

### How do CSS custom properties (`var()`) help with web font licensing in React?

When a component references `font-family: var(--font-family)` instead of importing a font file, the library contains no font data. The browser resolves the family from whatever the consuming application defined in its own CSS alongside `@font-face`. Font files and license obligations stay entirely in the deploying app.

### How do I add proprietary fonts with CSS Modules in React?

Use CSS Modules for component class names only. Declare `@font-face` and `--font-family` in the consumer app’s **global** stylesheet (this repo: `examples/consumer-app/fonts.css`), serve the `.woff2` from the app’s `public/fonts/`, and set `font-family: var(--font-family)` inside `*.module.css`. Do not import font binaries into a library CSS Module — that redistributes files via npm. See [How do I add proprietary fonts with CSS Modules in React?](#how-do-i-add-proprietary-fonts-with-css-modules-in-react).

### Why are my self-hosted fonts being blocked by the browser?

The most common cause is a missing `Access-Control-Allow-Origin` header when fonts are served from a **different origin** than the page. The failure often appears as missing glyphs, not a visible error — check the Network tab → Font → response headers. Serving fonts from the same origin as the Vite app (as in `examples/consumer-app/`) avoids this. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

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
