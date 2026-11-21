ROLE
You are a senior React front-end engineer with strong SVG and animation skills.
Task: replace the existing curved-lines background of my portfolio with an
interactive, scroll-driven mountain scene that ends with an adventure biker
and a contact "milestone". Do NOT use any backend.

STACK
- React (keep my existing setup and routing; don't restructure the app)
- Animation: GSAP + ScrollTrigger (or Framer Motion useScroll if GSAP conflicts
  with my setup; tell me which you chose and why)
- Pure SVG + CSS variables for art. No image-generation, no heavy libraries.
- First, inspect how the current curved-lines background is implemented and
  remove/replace it cleanly. Keep all my existing content sections intact.

CONCEPT
A fixed full-screen background scene. My page content scrolls over it.
As the user scrolls, mountains drift/scale as if the viewer is approaching them.
At the very end of the page, a biker's camp is revealed (silhouette first, then
lit up) next to a trail milestone that opens my contact details.

1) MOUNTAIN PARALAX
- 4-5 SVG layers: sky gradient, far peaks (hazy, low contrast), mid ridge,
  near hills with pine silhouettes, plus 1-2 mist layers between ranges.
- Scroll: each layer translates at a different speed (far slowest, near fastest)
  and scales up slightly (approaching effect). Use scrub, not jumpy triggers.
- Mouse: each layer shifts 5-20px max (far less, near more), smoothed with lerp
  inside requestAnimationFrame. Subtle, floaty, never jittery.
- Disable mouse effect on touch devices.

2) TIME-OF-DAY THEMES
- Four themes: morning, noon, sunset (evening), night.
- Defaults to the visitor's local time (hour-based), with a small toggle button
  (sun/moon icon, cycles or 4 mini icons) in a corner. Remember choice in
  localStorage, wrapped in try/catch.
- All colors come from CSS variables (sky top/bottom, each mountain layer, mist,
  glow). Switching theme = changing variables with a ~1s CSS transition.
- Palette: black + orange brand. Orange is the constant accent in every theme
  (buttons, sun glow, fire, highlights). UI text stays dark/black-orange.
  Background colors shift per time of day. Keep text readable over the scene
  (use soft overlay gradients behind content sections where needed).

3) THE CAMP (END OF SCROLL)
Shared across all themes: an adventure bike (BMW GS style) with panniers, a
roll bag and a top box. Draw it ONCE as a reusable SVG group.
The rider and props change per theme:
- Morning: rider standing beside the bike holding a chai mug, facing the
  sunrise. Soft mist, a few birds.
- Noon: rider sitting on a small foldable trekking camp chair under a tree
  (tree gives shade; an umbrella is an acceptable simpler fallback). Helmet
  and water bottle on the ground. Clear sky, drifting clouds.
- Evening: rider leaning on the bike, taking a photo of the sunset with a
  camera/phone. Warm orange glow on bike and luggage, long shadows, birds
  flying home, a few fireflies appear.
- Night: bike, a small tent, and a bonfire. Rider sitting by the fire looking up
  at the stars. Fire flicker, rising smoke/embers, many fireflies (jugnu),
  occasional shooting star, twinkling stars.
Structure: each rider pose and prop is a separate SVG group/component. The
active theme config decides which mount. Bike and mountains stay mounted; only
the rider/props/effects swap with a short crossfade.
Use a flat vector silhouette style. Keep the drawings simple and clean rather
than detailed and risky.

4) SHADOW-TO-REVEAL ANIMATION
- Scroll 0-80%: the camp is a dark silhouette (very low opacity, slightly
  blurred), barely noticeable in the foreground.
- Scroll 80-100%: it lights up. Opacity, brightness and color fade in, it
  slides up a few px and sharpens. Tie this to scroll progress (scrub).
- Implement with a single SVG per scene using filter/brightness or a color
  variable transition, not two duplicated art sets.
- At 100%: finishing touches per theme (bonfire ignites at night, headlight
  turns on, sun glow in morning, etc.).
- Animate only transform and opacity wherever possible.

5) EFFECTS (lightweight)
- Fireflies: 20-30 small glowing dots with slow random drift and pulsing
  opacity, gently pushed away from the mouse. Few at evening, many at night.
  Canvas or CSS, whichever is lighter.
- Stars (night only): twinkle via CSS; one shooting star every ~8-15s at random.
- Birds (morning/evening), clouds (noon), mist (morning), embers (night).
- Pause or reduce effects when the tab is hidden.

6) CONTACT MILESTONE (no backend)
- Near the bike, draw a trail milestone stone (like a km marker) with a short
  label such as "Let's connect".
- Hover/focus: it glows orange. Click/Enter: opens a contact card (modal or
  slide-up panel) with:
  - Resume: download button -> [/resume.pdf]
  - Email: mailto link + copy-to-clipboard button -> [EMAIL]
  - Phone: tel link + copy button -> [PHONE]
  - Instagram -> [INSTAGRAM URL]
  - LinkedIn -> [LINKEDIN URL]
  - GitHub -> [GITHUB URL]
- Show a "Copied!" confirmation on copy. All data lives in one config object at
  the top of the file so I can edit it easily.
- Accessible: it's a real <button>, focus trap in the modal, Esc to close,
  aria-labels, visible focus states.
- Also add a short line near the camp: "Thanks for scrolling this far. Let's talk."

7) PERFORMANCE, MOBILE, ACCESSIBILITY
- Use transform/opacity, requestAnimationFrame, and passive scroll listeners.
  No layout thrashing. Target 60fps on a mid-range laptop.
- Mobile: fewer layers (3), fewer fireflies, no mouse effect, simpler animation.
- Respect prefers-reduced-motion: no parallax, no drift or flicker, show a
  static scene and the camp fully lit at the bottom.
- The scene must be decorative: aria-hidden on the art, content stays readable.
- Lazy-mount effects for the non-active themes.

BUILD IN STAGES (stop and show me after each stage)
Stage 1: Mountains, parallax, scroll scale, mouse movement, sky + 4 themes,
         toggle, auto time-of-day.
Stage 2: Bike + night scene (bonfire, tent, stargazing rider) + shadow-to-reveal.
Stage 3: Other three poses (morning, noon, evening) + per-theme effects.
Stage 4: Contact milestone + modal, then mobile, reduced-motion and perf polish.

OUTPUT EXPECTATIONS
- Small, well-named components (MountainLayer, Sky, Camp, Rider poses,
  Fireflies, ThemeToggle, ContactMilestone, useScrollProgress, useMouseParallax).
- A single theme config file for colors, poses, props and effects.
- Brief comments on the scroll math. Tell me which files you changed.
- Don't change my existing content, fonts or routing.