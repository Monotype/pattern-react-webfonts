// Font is referenced via a CSS custom property, not imported or bundled here.
// The consuming application defines --font-family in its own CSS (@font-face),
// keeping font files and licensing obligations out of the library entirely.
export default function MyComponent() {
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      React font pattern demo
    </div>
  )
}