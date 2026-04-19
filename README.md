# Website

Homepage-first SvelteKit rebuild of `galuhsahid.com`.

## Stack

- SvelteKit 2
- Svelte 5
- Vite 7
- `@sveltejs/adapter-static`
- Shared local design-system styles from `../design-system`

## Commands

```sh
npm install
npm run dev
npm run build
```

## Maps

- Maps use MapLibre.
- Preferred provider is MapTiler via `VITE_MAPTILER_KEY`.
- Put the key in `website/.env.local`.
- Shared map decisions live in `src/lib/map-system.js` and `src/lib/styles/global.css`.
- Map pages should use the shared `.map-surface`, `.map-frame`, and `.map-pill` patterns instead of page-local map control styling.
- Map info should default to an overlay card inside the map area, using `.map-info-card`.
- Map metadata rows should use `.map-meta-list` and `.map-meta-item` with Material Symbols for items like location and date.

## Material Icons

- Use Material Symbols Outlined via the shared `.material-symbol` class in `src/lib/styles/fonts.css`.
- Prefer them for small functional UI affordances and metadata, not as decorative illustration.
- On map/detail surfaces, keep icons inline with text, single-color, and token-driven through the surrounding text color.

## Scope

This first pass only ships the homepage at `/`.

Deferred sections from the previous Eleventy site, such as field notes, sketches, writing,
projects, and photography, remain in the repo for later migration but are not part of the active
SvelteKit app yet.
