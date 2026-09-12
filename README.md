# EDU-1 — Modular Orbital Platform

A scroll-driven, 3D product showcase for a fictional educational CubeSat kit.
Built as a portfolio piece demonstrating the "interactive 3D + motion
narrative" pattern used on hardware/deep-tech product sites — a rotatable,
procedurally-built satellite model whose subsystems open, extend, and light
up as you scroll, ending in a drag-to-rotate exploded view.

## Stack

- **React 19 + Vite** — app shell and build tooling
- **React Three Fiber + drei** — Three.js/WebGL scene, in a component model
- **GSAP + ScrollTrigger** — scroll-scrubbed camera and model animation
- No external 3D model file — the satellite is built from primitives
  (boxes, cylinders) directly in Three.js, so there's nothing to download
  and no model-loading step. Swap in a real glTF via `useGLTF` from drei
  if you want to replace it with an actual asset later.

## What's demonstrated

- Scroll-scrubbed motion (GSAP ScrollTrigger `scrub`) driving Three.js
  object properties directly via refs — not React state — to stay smooth
  under fast scrolling.
- A grouped-pivot rig (chassis / solar panels / antenna / sensor tray) so
  each subsystem animates around its own hinge, the same way a real
  CubeSat's parts do.
- An exploded view with camera drag re-enabled only in that section
  (`OrbitControls` toggled on/off by `ScrollTrigger.onToggle`).
- A WebGL-support check with a static fallback background for devices
  that can't run the 3D scene.
- `prefers-reduced-motion` respected — scroll animations snap instead of
  scrub when the user has that OS setting on.
- A HUD clock isolated into its own component specifically so its
  per-second re-render never touches the Canvas/Html tree above it —
  worth reading `src/components/HudClock.jsx` and the comment in
  `src/components/Scene.jsx` if you're curious why that split exists.

## Project structure

```
src/
  App.jsx                    → page layout, section refs, wiring
  content.js                 → all copy/specs (edit this to reskin the copy)
  styles.css                 → design tokens + layout
  components/
    Scene.jsx                → R3F Canvas, lighting, camera, part labels
    SatelliteModel.jsx       → the procedural 3D model + exposed refs
    HudClock.jsx             → isolated live-clock HUD readout
  hooks/
    useScrollTimeline.js     → all GSAP ScrollTrigger wiring
```

## Setup

Requires Node 18+ (Node 20/22 recommended).

```bash
npm install
```

## Run locally (dev server with hot reload)

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Production build

```bash
npm run build
```

Outputs static files to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Deploy

This is a static Vite app, so any static host works. Two of the fastest:

**Vercel**
```bash
npm install -g vercel
vercel
```
Accept the defaults — Vercel auto-detects Vite (`build` command
`vite build`, output directory `dist`).

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --build --prod
```
Or drag-and-drop the `dist/` folder onto the Netlify dashboard after
running `npm run build`.

**GitHub Pages / any static host**
Run `npm run build`, then upload the contents of `dist/` as-is — there's
no server-side code, so nothing else is required.

## Extending this into a real portfolio piece

- Swap the copy in `content.js` for a real product you want to showcase.
- Replace the procedural `SatelliteModel` with a real glTF via drei's
  `useGLTF`, and run it through Draco compression if the file is large —
  the JD-style requirement this project is aimed at explicitly calls
  out model optimisation (glTF, Draco, LOD, texture/draw-call budgets),
  which this demo intentionally sidesteps by not shipping a model file.
- Add a Lighthouse pass and note the before/after in your case-study
  write-up — performance evidence is what separates a demo from a
  hireable sample for this kind of role.
