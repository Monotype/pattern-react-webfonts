# pattern-react-webfonts

> License-safe web font delivery in a React component library using CSS variables.

This repository demonstrates the correct pattern for font delivery in a shared React component library. The library references fonts only through CSS custom properties — it never bundles, embeds, or redistributes font files. Font definitions and license-covered assets remain with the consuming application, which serves font files from its own deployment (end users’ browsers still download font data for rendering — that is normal for the web; the pattern avoids putting font binaries inside the installable library package).

## What this pattern demonstrates

- A React component library (`src/`) that uses `var(--font-family)` rather than importing or embedding font files
- A consumer application (`examples/consumer-app/`) that defines fonts via `@font-face` in CSS and owns the font assets
- How to separate font delivery concerns from component library concerns

## Why this is the license-safe approach

A component library that bundles font files would redistribute those files to every application that installs it — creating an uncontrolled distribution path that almost certainly falls outside the scope of a standard web font license. By using CSS variables, the library remains font-agnostic: font files and their licensing obligations stay with the deploying application, where they can be properly governed.

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `lc-005` — embedding involves transferring font data beyond the original user
- `lc-006` — using a font differs from distributing a font
- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration

In the consumer example, `@font-face` points at **`/fonts/...` on the same origin** as the Vite app, so you typically do not hit cross-origin `@font-face` blocking. **`pc-010` still applies** if you move font files to another origin (for example a CDN): that host must send correct `Access-Control-Allow-Origin` (and related) headers on font responses.

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

Sample application code in this repository is licensed under the MIT License. The subset font file in examples/consumer-app/public/fonts/ is included only as a build/CI demonstration asset and licensed for limited testing purposes only; it is not licensed for regular use on websites or redistribution. Please refer to the LICENSE file in the repository for both licenses. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository’s terms.
