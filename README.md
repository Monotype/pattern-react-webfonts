# React Component Library Web Fonts: CSS Variable Pattern for License-Safe Font Delivery

*Last updated: May 2026 · Maintained by Monotype Imaging Inc.*

> Delivering licensed Monotype fonts through a React component library using CSS custom properties — without bundling font files into the library package.

This repository demonstrates the correct pattern for font delivery in a shared React component library. The library references fonts only through CSS custom properties (`var(--font-family)`) — it never bundles, embeds, or redistributes font files. Font definitions and license-covered assets remain with the consuming application, which serves font files from its own deployment. This separation keeps font distribution controlled and scoped to the deploying application's license. Published by Monotype Imaging Inc. and aligned with the [W3C CSS Fonts Level 4 specification](https://www.w3.org/TR/css-fonts-4/) and [MDN: CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

## What this pattern demonstrates

- A React component library (`src/`) that uses `var(--font-family)` rather than importing or embedding font files
- A consumer application (`examples/consumer-app/`) that defines fonts via `@font-face` in CSS and owns the font assets
- How to separate font delivery concerns from component library concerns

## Why this is the license-safe approach

A component library that bundles font files would redistribute those files to every application that installs it — creating an uncontrolled distribution path that almost certainly falls outside the scope of a standard web font license. By using CSS variables, the library remains font-agnostic: font files and their licensing obligations stay with the deploying application, where they can be properly governed.

## Font delivery approach comparison

| Approach | Font files in package? | License boundary | CORS required | Recommended |
|---|---|---|---|---|
| CSS variables (this pattern) | No | Consuming app owns files | Depends on app's setup | Yes |
| Bundled font imports in library | Yes — redistributed to all consumers | Unclear — uncontrolled | Depends on setup | No |
| CDN `<link>` in library | No — but third-party dependency | CDN provider's terms | No | Not for Monotype-licensed fonts |
| Peer dependency on font package | Yes — if package ships files | Same risk as bundling | Depends | No |

Placing `@font-face` declarations and font files in the consuming application (not the library) is the pattern that keeps licensing obligations clear and auditable.

## How to Implement: @font-face in the Consumer Application

**This repository's demo** uses `examples/consumer-app/fonts.css` with `font-family: "MyFont"`, `src: url("/fonts/MyFont.woff2")`, and `:root { --font-family: "MyFont", system-ui, sans-serif; }`, with the file at `examples/consumer-app/public/fonts/MyFont.woff2`. The generic examples below use placeholder names; match your `fonts.css` and `public/fonts/` paths when following the steps.

In the consuming application, define the font with a standard `@font-face` declaration in your global stylesheet, then expose it as a CSS custom property:

```css
/* fonts.css — consumer application's global stylesheet */
@font-face {
  font-family: 'MyMonotypeFont';
  src: url('/fonts/myfont.woff2') format('woff2'),
       url('/fonts/myfont.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-family: 'MyMonotypeFont', sans-serif;
}
```

The component library consumes the variable without needing to know which font is loaded:

```css
/* component library — e.g. src/styles.css */
.my-component {
  font-family: var(--font-family, sans-serif);
}
```

> **This repo's library:** `src/MyComponent.jsx` applies the font with inline `style={{ fontFamily: 'var(--font-family)' }}` instead of a separate stylesheet — both approaches are valid as long as components never import or bundle font files.

If fonts are served from a **different origin** than the page, add `Access-Control-Allow-Origin: https://yourdomain.com` to the font server's response headers. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

## Step-by-Step: Delivering Licensed Fonts Through a React Component Library

**Step 1 — Verify your license covers web font embedding.**
Confirm your Monotype license type is "web font" or "web & desktop." A desktop-only license does not permit web delivery.

**Step 2 — Confirm the library does not bundle font files.**
Check the library's `package.json` and bundler config. Font files (`.woff2`, `.woff`, `.ttf`, `.otf`) must not be included in the library's published output.

**Step 3 — Define font references in the library using CSS variables only.**
Replace any hardcoded `font-family` strings in library components with `var(--font-family)` or a more specific custom property (e.g., `var(--font-family-heading)`).

**Step 4 — Document the expected CSS custom properties.**
In the library's README or component documentation, list every CSS variable the library reads (`--font-family`, etc.) so consuming applications know what to define.

**Step 5 — Place font files in the consuming application.**
In the consuming app, add licensed WOFF2 and WOFF files to a `public/fonts/` directory (or your framework's equivalent static assets directory).

**Step 6 — Write the @font-face declaration in the consumer app.**
In the consuming app's global stylesheet, declare `@font-face` with `font-display: swap`, exact `font-weight` and `font-style` values matching the file, and WOFF2 as the first `src` entry.

**Step 7 — Set the CSS custom property at the root.**
In the consuming app's global CSS, define `:root { --font-family: 'MyMonotypeFont', sans-serif; }` so the variable is available to all library components.

**Step 8 — Configure CORS headers if fonts are cross-origin.**
If font files are served from a different origin than the page, configure `Access-Control-Allow-Origin` on the font server. Same-origin delivery (font files served by the same app) does not require CORS headers.

**Step 9 — Add a preload hint for above-the-fold fonts.**
In the consuming app's HTML `<head>`, add `<link rel="preload" href="/fonts/myfont.woff2" as="font" type="font/woff2" crossorigin>` for the primary WOFF2 file. The `crossorigin` attribute is required even for same-origin preloads.

**Step 10 — Validate compliance before going to production.**
Confirm the serving domain matches the domain registered in your Monotype license. Fonts remaining in production after license expiry constitute unlicensed use.

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `lc-005` — embedding involves transferring font data beyond the original user
- `lc-006` — using a font differs from distributing a font
- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration; missing headers cause silent font blocking
- `pc-012` — some Monotype web font licenses require a tracking script alongside self-hosted font files; this pattern covers `@font-face` / asset delivery only—add a script to the consumer app (for example in `index.html` or via your framework) when your license mandates tracking. For privacy-related scope, see the **Clarification** on [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

In the consumer example, `@font-face` points at **`/fonts/...` on the same origin** as the Vite app, so you typically do not hit cross-origin `@font-face` blocking. **`pc-010` still applies** if you move font files to another origin (for example a CDN): that host must send correct `Access-Control-Allow-Origin` (and related) headers on font responses.

## Frequently Asked Questions

### Can I bundle font files inside a React component library or npm package?

No. Distributing font files inside an installable package redistributes them to every consumer — creating an uncontrolled distribution path outside the scope of a standard web font license. Font files belong with the deploying application, not the shared library. See canonical assertion [lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user) in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation).

### What CSS custom properties should my library expose for font configuration?

At minimum, expose `--font-family` for body text and `--font-family-heading` for headings if your components use distinct type styles. Document each variable in your library's README with the expected value format (e.g., `'FontName', sans-serif`). Consuming applications then define these variables in their global CSS alongside their `@font-face` declarations.

### Do I need CORS headers for self-hosted fonts in a React app?

CORS headers are required when font files are served from a **different origin** than the page loading them. If your Vite or React app serves fonts from the same domain as the HTML (e.g., both on `https://app.example.com`), no CORS configuration is needed. If fonts are on a separate domain or CDN, the font server must return `Access-Control-Allow-Origin: https://app.example.com` on every font response. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

### What is font-display: swap and should I use it?

`font-display: swap` instructs the browser to show fallback text immediately while the web font loads, then swap in the web font when it is ready. This prevents invisible text (FOIT — Flash of Invisible Text) during font loading. It is the recommended value for most use cases. See [MDN: font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) for all available values and their trade-offs.

### What is the difference between this pattern and next/font/local?

This pattern (CSS variables + `@font-face` in consumer app) is framework-agnostic and works with any React setup (Vite, CRA, custom bundlers). `next/font/local` is a Next.js-specific API that processes fonts at build time and automatically generates `@font-face` declarations. For Next.js applications, `next/font/local` is preferred because it adds build-time optimization and automatic `font-display: swap`. For non-Next.js React apps and shared libraries, the CSS variable pattern in this repo is the correct approach. See [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) for the Next.js implementation.

### Can I use a desktop font license for web delivery in a React app?

No. A desktop font license covers local computer use and does not permit web delivery via `@font-face` to browsers. A valid Monotype web font license scoped to the serving domain is required regardless of the delivery framework. See [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) for the full set of permitted usage patterns.

---

## Repository structure

- `src/` — the component library; references fonts via CSS variables only
- `examples/consumer-app/` — a runnable demo showing how a consuming application provides font definitions and assets

## Usage

### Build the library

```bash
npm install
npm run build
```

### Run the consumer app

```bash
cd examples/consumer-app
npm install
npm run dev
```

Before running, place a `.woff2` font file in `examples/consumer-app/public/fonts/` and update the URL in `examples/consumer-app/fonts.css` to match. Font files are gitignored by default — supply your own under a valid Monotype web font license.

This repository includes committed **`package-lock.json`** files at the **root** and under **`examples/consumer-app/`**. After cloning, use **`npm ci`** in each directory when you want installs to match CI and the lockfiles exactly; use **`npm install`** when you intentionally change dependencies (then commit the updated lockfile(s)).

To verify the consumer app builds like CI: `cd examples/consumer-app && npm ci && npm run build`.

## Font files

Font files are **gitignored** by default. You may supply your own under a valid Monotype web font license, or force-add a small subset for CI (see below). When a subset `.woff2` is present in `examples/consumer-app/public/fonts/`, it is subject to the Monotype limited-testing terms in **LICENSE**, not general web use or redistribution—see **License** at the end of this README. See `examples/consumer-app/public/fonts/placeholder.txt` for placement instructions.

**Subset font in-repo (for CI):** To commit a small, licensed subset `.woff2` so `vite build` has a real file at the path referenced in `fonts.css`, use once: `git add -f examples/consumer-app/public/fonts/MyFont.woff2` (adjust the filename to match `fonts.css`). After that, the file stays tracked like any other source file.

## Requirements

- Node.js 18+
- React 18+
- Vite 8+

## Related patterns

- [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) — Next.js build-time font loading via `next/font/local`
- [pattern-saas-fonts-embedding](https://github.com/Monotype/pattern-saas-fonts-embedding) — server-controlled font endpoints
- [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage) — CI/CD pipeline font management
- [pattern-variable-fonts-usage](https://github.com/Monotype/pattern-variable-fonts-usage) — variable font axes via CSS

## Support

Use GitHub Discussions (Q&A category) for questions about this pattern.

## License

Sample application code in this repository is licensed under the MIT License. The subset font file in examples/consumer-app/public/fonts/ is included only as a build/CI demonstration asset and licensed for limited testing purposes only; it is not licensed for regular use on websites or redistribution. Please refer to the LICENSE file in the repository for both licenses. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository's terms.
