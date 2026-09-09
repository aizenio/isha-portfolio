# Isha — portfolio

The work first, then the story.

The landing is **the deck**: every project as a card on one conveyor, scrubbed
by scroll. Once the reader reaches the last card the page keeps going into the
chapters — how I think, how I work, the craft, who I am, and how to get in
touch. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind v4,
Motion and three.js.

```bash
npm run dev
```

## Structure

| Path | What lives there |
| --- | --- |
| `lib/content.ts` | **Every word on the site.** Copy, projects, case studies, archive, process, about. Edit the narrative here, not in components. |
| `lib/motion.ts` | The motion vocabulary — three easings, four durations, the shared viewport trigger. |
| `app/globals.css` | Design tokens, type scale, and the CSS-driven interactions (process drawers, hover-gated metadata, reduced motion). |
| `lib/deck.ts` | The deck: featured projects (which carry case studies) followed by archive work (which says so rather than offering a dead click). |
| `components/sections/` | One file per chapter of the home page. `app/page.tsx` lists them in order. |
| `public/shots/` | Real captures. `zane-atlas/` is the live site through headless Chrome; `monsoon/` is the SwiftUI build in the iOS simulator. Re-take both with `scripts/capture-shots.sh`. |
| `components/visuals/` | The plates. `chrome.tsx` is the drawing kit (type, panels, browser and device frames); `scenes/` holds one file per project. A plate declares `contain` (a mockup, shown whole) or `slice` (a texture, cropped to fill). |
| `components/case/` | The case-study renderer. A case study is a sequence of *movements* (`chapter`, `statement`, `visual`, `pair`, `sequence`, `research`, `system`, `metrics`) declared in `lib/content.ts`. |
| `components/visuals/` | Every image on the site, drawn as inline SVG. |
| `components/primitives/` | Reveal, RevealText, ScrollHighlight, Parallax, Marker, MagneticLink. |
| `components/chrome/` | Nav, custom cursor, route transition, opening sequence, smooth scroll, global motion policy. |
| `components/three/` | The WebGL layer. Each scene is split into a **gate** (no three.js import, decides whether to load) and a **scene** (dynamically imported). |

## Design system

Two art-directed surfaces — `paper` (cool porcelain) and `ink` (a deep, faintly
green-black graphite). A section opts in with `data-surface`; every token
cascades, so a component written once reads correctly on either ground.

The palette is almost achromatic on purpose. The single accent is a desaturated
eucalyptus (`#3f5c55` on porcelain, `#8fb0a6` on graphite) that reads as
considered rather than branded, and never competes with the typography. Both
accents clear AA against their own ground.

Type is Instrument Serif for display, Geist for body, Geist Mono for metadata.

The page ground is **one fixed element** (`SurfaceBackdrop`), not a background
on each section — that is what lets the sculpture sit behind every chapter. It
does not paint a single colour: it paints a **band per section**, positioned
exactly where that section currently sits on screen. A single colour was tried
first and is wrong, because whenever two chapters share the viewport one of them
ends up on the wrong ground with its type unreadable.

## Imagery

There are no photographs or bitmap assets. Every visual is a generated inline
SVG in `components/visuals/`, drawn from the same palette variables as the page.
They scale to any viewport without art-direction crops, cost nothing to load,
and re-theme automatically between surfaces. Randomness is seeded
(`scene-utils.ts`) so server and client render identical markup.

## The WebGL layer

Two moments are rendered on the GPU.

**The deck** (`DeckScene`) is the landing. Cards arrive from the lower left
close to the lens, pass flat through the centre where they can be read, and
recede to the upper right. Scroll drives a single `progress` value — card `i`
sits at offset `i - progress` — so the whole arrangement is one pure function of
one number, which is what keeps it smooth under a flung scroll. The card artwork
is drawn on the **ink** surface even though the page around it is porcelain:
near-white plates on a near-white ground had no presence at all.

Cards use a plain textured material rather than a custom shader. A
ShaderMaterial was tried first and its uniforms read back correctly in
JavaScript but never reached the GPU through react-three-fiber's prop handling,
so every card rendered fully transparent. `material.opacity` is a first-class
three property and uploads reliably; per-card aspect is handled by sizing the
plane to its texture instead of by UV maths.

Card size is fitted to a share of the viewport *width*, and the conveyor
tightens on portrait — a single world-space scale shrank the card to a stamp on
a phone, where the viewport is barely one world unit wide.

There is no second WebGL scene. An earlier build had a narrative sculpture
behind the story chapters; it was removed so the deck is the only thing on the
page rendered on the GPU, and everything after it rests on typography, reveals
and one interaction.


**The project plates** (`PlateScene`) take the SVG scene the DOM has already
drawn, serialise it to a texture with the page's live tokens substituted in,
and hand it to a shader that bends the plate with scroll velocity, adds a
whisper of chromatic separation at speed, and ripples under the cursor.

### How it stays cheap

- three.js is **not in the initial bundle**. Every scene sits behind a gate
  component that imports nothing from three; the gate decides (WebGL available,
  motion allowed) and only then does `next/dynamic` fetch the renderer as its
  own chunk. Readers who would never see it never download it.
- A plate only holds a WebGL context while it is within 60% of the viewport;
  the hero stops rendering entirely once it scrolls away (`frameloop="never"`).
- The DOM SVG underneath every plate is the fallback. If WebGL is missing or
  the texture fails to decode, it simply stays visible and nothing else happens.
  For the deck that fallback is a plain vertical list of plates with captions —
  nothing about the work is only reachable through the animation.

`components/three/*Scene.tsx` files disable `react-hooks/immutability` at file
scope, with the reasoning inline: a react-three-fiber frame loop mutates its
uniform objects in place sixty times a second, which is the entire point, and
there is no way to express that which satisfies the rule.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The deck, then the story: statement, philosophy, process, craft, contact. |
| `/about` | Who she is — the statement, how she got here, the plate you can open, toolkit, an index of other work. |
| `/work/[slug]` | The three case studies. |

## Opening and transitions

The first visit of a session plays a loader that tracks **real** progress: it
waits on `document.fonts.ready` and on the deck's card textures, reported
through `lib/loading.ts`. A preloader on a fixed timer is either lying about
progress or wasting the reader's time. There is a floor so it can't flash, a
bail so a stalled texture can't hold the page, and a hard stop because a
backgrounded tab pauses `requestAnimationFrame` outright and would otherwise
leave the page locked behind the panel. It ends by splitting in two and
clearing from the middle out.

Navigation is a wipe (`Transition.tsx`). The App Router renders the next
segment immediately, so an exit animation after the click cannot be
synchronised — instead the provider owns the navigation: a panel travels up to
cover the page carrying the name of where you are going, the route changes
underneath it, and the same panel keeps travelling in the same direction to
reveal the new page. One continuous movement rather than two opposed ones.
Ordinary `<Link>`s still cut; `<TransitionLink>` plays the move.

## The About page

Its centrepiece is the portrait plate. At rest it is a halftone self-portrait
drawn from project data rather than a photograph. Press it and the field
scatters and the things that end up in the work without being invited come out
— what she is reading, listening to, learning, still bad at. It is a toggle
rather than a one-shot, so nothing is lost by pressing it, and the content is
real list markup underneath.

## Motion

Scrolling is smoothed with Lenis, which drives the *real* scroll position — so
`position: sticky` (the craft sequence), `position: fixed` (nav, cursor, grain)
and the native scrollbar all keep working. It never initialises for touch or
for reduced motion.

The first visit of a session plays a short opening sequence before the hero
begins; the hero's own reveal is gated on it through context so the two never
overlap.

`MotionConfig reducedMotion="user"` in the root layout makes every Motion
component honour the OS preference; a global CSS rule covers transitions and
keyframes. Components additionally branch on `useReducedMotion` where the
*structure* changes — the craft sequence falls back to a static index, the
custom cursor doesn't mount at all.

Hover-dependent behaviour (custom cursor, the archive's cursor-following
preview, hover-gated project metadata) is gated on
`(hover: hover) and (pointer: fine)`, never on viewport width.

## Before this goes live

These are deliberate placeholders:

- **Biography and location** — `designer` and `about` in `lib/content.ts`.
- **Contact links** — `designer.links`; the LinkedIn, Dribbble and Read.cv URLs
  are invented, as is the email address.

There is no employment history on the site by design — the work speaks through
the project showcase, and `designer.availability` states what Isha is open to
without labelling it.
- **Projects** — Zane Atlas is the real agency at zaneatlas.com, captured live.
  Agent Swarm is the multi-agent supply chain platform in
  `experiments/agent_swarm` (same five agents, same four headline metrics, same
  read-only GOD panel). Monsoon's iOS screens are captures of the SwiftUI UI
  build in `experiments/monsoon-ios`; its Android screens are drawn from the
  parity spec, because there is no Android toolchain on this machine. The six
  archive entries are still placeholders.
- **Portrait** — `components/visuals/Portrait.tsx` draws a halftone plate. To
  use a photograph, drop it at `public/portrait.jpg` and swap the `<svg>` for a
  `next/image` fill inside the same wrapper; frame, ratio and motion still apply.

## Plates: drawn, and photographed

A plate is one of two things, and the registry in `components/visuals/ProjectVisual.tsx`
says which:

- **Drawn** (`svg`) — mockups and textures, painted from tokens. These are handed
  to the GPU layer, which serialises the live `<svg>` into a texture.
- **Photographed** (`shot`) — a real capture. The Zane Atlas plates are the live
  site captured with headless Chrome; the Monsoon plates are the SwiftUI UI
  build captured with `simctl io screenshot`. A shot is never uploaded to the
  GPU layer on a case-study page; it is mounted in a browser or device frame
  (`components/visuals/ShotFrame.tsx`) and drifts with a translate-only
  parallax, because scaling a screenshot to fake depth crops its edges.

The deck's WebGL conveyor builds one texture per card and can read either kind —
an `<svg>` when the card is drawn, the loaded `<img>` when it is not. A card
whose plate is a composition rather than a single image (Monsoon's three phones)
supplies a pre-composed landscape `cover` instead; `scripts/cover.html` is what
builds it.

**Each project keeps its own palette.** The portfolio is near-achromatic with a
single eucalyptus accent; Zane Atlas is near-black with a mint, Agent Swarm is
deep slate with five agent hues doubling as its severity scale, and Monsoon is
warm paper with a teal. A product shot painted in the portfolio's ink would be a
lie about what the product looks like.

## Generated coordinates and hydration

`Math.sin`, `Math.cos` and `Math.pow` may differ in their last bit between
JavaScript engines, and Node and Chrome do. React compares the *serialised*
attribute, so an unrounded trig result in a generated scene is a guaranteed
hydration mismatch. Every computed SVG coordinate goes through `q()` in
`components/visuals/scene-utils.ts`, which quantises to three decimals — far
below a pixel at these viewBoxes.
