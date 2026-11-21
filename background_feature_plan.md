# Plan — Interactive Mountain Background (replaces curved-lines FlowField)

Source spec: `background_feature.md`

## Decisions (before building)

- **Animation library: Framer Motion `useScroll` + `useTransform` + `useSpring`** — already
  installed (`framer-motion@14`) and already used by the old `FlowField`. GSAP would add a new
  dependency + ScrollTrigger registration for no gain here. Scroll scrubbing = spring-smoothed
  `scrollYProgress`; mouse parallax = rAF lerp into motion values (spec asks for lerp anyway).
- **Old background removal surface**: `src/components/FlowField.tsx`, `src/styles/flow.css`,
  the import in `src/index.css`, the mount in `src/App.tsx`. Hero's decorative `TopoField`
  stays (it is section content, not the page background; spec says keep content intact).
- **New code lives in `src/scene/`** — one folder, small components, one theme config.
- **Contact data**: reuse the real values from `src/data/profile.ts` (email, phone, socials),
  with Instagram/GitHub/resume filled per spec placeholders in a single editable config object.
- **Existing dark/light UI theme is untouched** — the scene has its own independent
  time-of-day theme (morning/noon/sunset/night).

## Architecture

```
src/scene/
├── sceneTheme.ts        # 4 palettes (CSS var values), pose/prop/effect config, hour mapping
├── contactConfig.ts     # single editable contact object (resume/email/phone/socials)
├── SceneThemeContext.tsx# active time-of-day, auto local-hour default, localStorage, toggle
├── hooks.ts             # useScrollProgress(), useMouseParallax()
├── SceneBackground.tsx  # fixed full-screen stage: sky + mountains + camp + effects + toggle
├── Sky.tsx              # gradient sky, sun/moon, glow (SVG)
├── MountainLayer.tsx    # one parallax layer (path + pine silhouettes), scroll/mouse transforms
├── Camp.tsx             # ground, bike (once), rider pose + props swap, shadow-to-reveal
├── Bike.tsx             # reusable SVG group: GS-style bike w/ panniers, roll bag, top box
├── RiderPoses.tsx       # MorningRider, NoonRider, EveningRider, NightRider (flat silhouettes)
├── CampProps.tsx        # tent, bonfire, chair, tree, helmet, bottle, camera, milestone art
├── Effects.tsx          # Fireflies, Stars+shooting star, Birds, Clouds, Mist, Embers
├── ThemeToggle.tsx      # corner 4-icon time-of-day toggle
├── ContactMilestone.tsx # fixed km-stone button, revealed at end of scroll
└── ContactModal.tsx     # accessible modal: resume/email/phone/socials, copy-to-clipboard
CSS: src/styles/scene.css, scene-camp.css, scene-effects.css, scene-ui.css
```

### Scroll math (documented in code)

- `p = useScrollProgress()` → spring-smoothed `scrollYProgress` ∈ [0,1] over the whole page.
- Layer approach (per layer, far → near): `translateY(p * K)` with K = 30 / 70 / 130 / 190 and
  `scale(1 + p * f)` with f = 0.05 / 0.10 / 0.18 / 0.26 — near layers move/scale most.
- Mouse: each layer `translate(mx * depth)` where depth = 4px (far) … 20px (near), lerped in rAF.
- Camp reveal: `reveal = clamp((p − 0.78) / 0.20)` → opacity 0.10→1, blur 2.5px→0,
  brightness 0.35→1, translateY 18px→0 (scrub, transform/opacity only).
- Milestone interactive when `p > 0.86`.

---

## Stage 1 — Mountains, parallax, sky, 4 themes, toggle

- [x] **S1.1** Remove old background: delete `FlowField.tsx` + `flow.css`, drop import from
      `index.css`, swap mount in `App.tsx` for the new scene (placeholder OK at this stage).
- [x] **S1.2** `sceneTheme.ts` — 4 palettes as CSS-variable maps (sky top/bottom, sun/glow,
      4 mountain layers, mist, pine, camp fill, fire, text-on-scene), hour → theme mapping.
- [x] **S1.3** `SceneThemeContext.tsx` — default from visitor's local hour, `localStorage`
      persistence wrapped in try/catch, `setTheme` + `cycleTheme`.
- [x] **S1.4** `hooks.ts` — `useScrollProgress()` (spring-scrub) and `useMouseParallax()`
      (rAF lerp, disabled on touch/`prefers-reduced-motion`).
- [x] **S1.5** `Sky.tsx` + `MountainLayer.tsx` + `SceneBackground.tsx` — SVG stage, sky
      gradient + sun, 4 mountain layers (far hazy, mid ridge, near hills + pines, ground),
      2 mist bands; scroll scrub transform + mouse lerp per layer; ~1s color transitions.
- [x] **S1.6** `ThemeToggle.tsx` — 4 mini icons (dawn/noon/sunset/night) in a corner,
      aria-labels, active state, keyboard accessible.
- [x] **S1.7** Content readability: soft veil/gradient behind `.app` content so text stays
      legible over the scene; verify all existing sections untouched and readable.
- [x] **S1.8** Verify: `npm run lint` + `npm run build` pass; visually check scroll parallax,
      mouse drift, theme switch transition, auto time-of-day. **STOP — show stage 1.**

## Stage 2 — Bike + night camp + shadow-to-reveal

- [x] **S2.1** `Bike.tsx` — one reusable flat-silhouette group: GS-style adventure bike,
      beak, windscreen, panniers, roll bag, top box, headlight (accent glow at reveal).
- [x] **S2.2** `CampProps.tsx` (night subset) + `RiderPoses.tsx` `NightRider` — tent,
      bonfire, rider sitting by fire looking up.
- [x] **S2.3** `Camp.tsx` — mounts bike + active pose/props, applies shadow-to-reveal from
      scroll progress (single art set, filter/opacity/transform only) + "lit" finish at 100%.
- [x] **S2.4** Verify: camp barely visible as silhouette until ~80% scroll, lights up 80→100%.
      **STOP — show stage 2.**

## Stage 3 — Other three poses + per-theme effects

- [x] **S3.1** Morning pose: rider standing with chai mug facing sunrise; props: mist + birds.
- [x] **S3.2** Noon pose: rider on foldable camp chair under tree; helmet + bottle on ground;
      drifting clouds.
- [x] **S3.3** Evening pose: rider leaning on bike photographing sunset; long-shadow accent,
      birds home, few fireflies.
- [x] **S3.4** `Effects.tsx` — Fireflies (rAF drift + pulse + mouse repulsion, few/evening,
      many/night), Stars (CSS twinkle + shooting star every 8–15s), Birds, Clouds, Mist,
      Embers; all paused when `document.hidden`; lazy-mount only active theme's effects.
- [x] **S3.5** Verify pose crossfade + effects per theme. **STOP — show stage 3.**

## Stage 4 — Contact milestone + modal + polish

- [x] **S4.1** `contactConfig.ts` — single object: resume `/resume.pdf`, email, phone,
      Instagram, LinkedIn, GitHub (values from `profile.ts` where available).
- [x] **S4.2** `ContactMilestone.tsx` — trail km-stone "Let's connect" near the camp,
      real `<button>`, orange glow on hover/focus, revealed with the camp.
- [x] **S4.3** `ContactModal.tsx` — resume download, email/phone tel+mailto + copy buttons
      with "Copied!" feedback, Instagram/LinkedIn/GitHub links; focus trap, Esc close,
      aria-labels, visible focus; plus line "Thanks for scrolling this far. Let's talk."
- [x] **S4.4** Mobile pass: 3 mountain layers under 768px, fewer fireflies, no mouse effect,
      simpler transforms.
- [x] **S4.5** `prefers-reduced-motion`: no parallax/drift/flicker, static scene, camp fully
      lit at the bottom; effects paused when tab hidden; transform/opacity only, 60fps check.
- [x] **S4.6** Final verification: `npm run lint` + `npm run build` clean; list changed files.
      **STOP — show final result.**

---

## Status

| Stage | State |
|---|---|
| Stage 1 | ✅ done |
| Stage 2 | ✅ done |
| Stage 3 | ✅ done |
| Stage 4 | ✅ done |
