# pattern-react-webfonts

> License-safe web font delivery in a React component library using CSS variables.

This repository demonstrates the correct pattern for font delivery in a shared React component library. The library references fonts only through CSS custom properties — it never bundles, embeds, or redistributes font files. Font definitions and license-covered assets remain with the consuming application.

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

Before running, place a `.woff2` font file in `examples/consumer-app/public/fonts/` and update the `src` path in `examples/consumer-app/fonts.css` to match. Font files are gitignored — supply your own under a valid Monotype web font license.

## Font files

Font files are intentionally excluded from this repository via `.gitignore`. The consuming application is responsible for providing font files under a valid license. See `examples/consumer-app/public/fonts/placeholder.txt` for placement instructions.

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

Code in this repository is provided for educational and interoperability purposes. Font files are not included. Canonical guidance © Monotype Imaging Inc.