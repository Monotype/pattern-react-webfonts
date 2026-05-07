# examples/consumer-app

A minimal runnable application that demonstrates how a consuming project provides font definitions and assets to the `pattern-react-webfonts` component library.

## What it shows

- `fonts.css` — defines the `@font-face` rule and sets the `--font-family` CSS variable that the library components consume
- `App.jsx` — imports `MyComponent` from the library and applies the font via the CSS variable
- `main.jsx` — mounts the app and imports `fonts.css`

The font file itself is not included. Place a `.woff2` file in `public/fonts/` and update the `src` path in `fonts.css` to match.

## Running

```bash
npm install
npm run dev
```

Requires Node.js 18+.
