# examples/consumer-app

A minimal runnable application that demonstrates how a consuming project provides font definitions and assets to the `pattern-react-webfonts` component library.

## What it shows

- `fonts.css` — defines the `@font-face` rule and sets the `--font-family` CSS variable that the library components consume
- `App.jsx` — imports `MyComponent` from the library and applies the font via the CSS variable
- `main.jsx` — mounts the app and imports `fonts.css`

This repository includes **`public/fonts/MyFont.woff2`**, a heavily subsetted version of Gotham Regular. **Redistribution rights for that file are not granted to you.** For your own project, replace the file and the `src:` path in `examples/consumer-app/fonts.css`. See `public/fonts/placeholder.txt` for placement notes.

## Running

```bash
npm install
npm run dev
```

Requires Node.js 18+.

## Notes

This app has no `vite.config.js`. Vite 8 processes `.jsx` files via esbuild by default, so builds and `npm run dev` work without `@vitejs/plugin-react`. The trade-off is no React Fast Refresh in dev mode — acceptable for a minimal demo.
