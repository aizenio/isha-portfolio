import type { VisualKey } from "@/lib/content";
import { BrowserShot, PhoneShot, PlainShot } from "./ShotFrame";
import { ACCENT, type Fit, Frame, INK, RAISED } from "./chrome";
import { q, seeded } from "./scene-utils";
import { AtlasAudit, AtlasSystem } from "./scenes/atlas";
import { SwarmConsole, SwarmGraph, SwarmInsights, SwarmResearch, SwarmSystem } from "./scenes/swarm";
import { MonsoonResearch, MonsoonSystem } from "./scenes/monsoon";
import {
  BoardFirstRun,
  BoardIOS,
  BoardLoop,
  BoardNight,
  BoardPlan,
} from "./monsoon/boards";

/**
 * Every image on this site is drawn, not photographed.
 *
 * The project plates are mockups: real interface text, real numbers, real
 * device and browser chrome, painted with the page's own tokens so a product
 * shot never drags a second palette onto the page. They stay sharp at any
 * viewport, cost nothing over the network, and re-theme on ink and paper.
 *
 * A plate declares how it wants to be fitted. A mockup is a whole screen, so it
 * is contained — the reader has to see all of it. The small archive marks are
 * textures rather than screens, so they still slice to fill their card.
 */

/* -------------------------------------------------------------------------- */
/*  Archive marks — small, distinct, legible at 300px wide                     */
/* -------------------------------------------------------------------------- */

function ArchiveScene({ seed, variant }: { seed: number; variant: number }) {
  const rand = seeded(seed);
  return (
    <Frame viewBox="0 0 400 300">
      <rect width="400" height="300" fill={RAISED} />
      {variant === 0 && (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x="40" y={54 + i * 28} width={q(60 + rand() * 240)} height="7" fill={INK} opacity={0.18 + i * 0.09} />
          ))}
          <rect x="40" y="40" width="46" height="7" fill={ACCENT} />
        </>
      )}
      {variant === 1 && (
        <>
          <circle cx="200" cy="150" r="88" fill="none" stroke={INK} strokeWidth="1" opacity="0.4" />
          <circle cx="200" cy="150" r="54" fill="none" stroke={INK} strokeWidth="1" opacity="0.3" />
          <circle cx="200" cy="150" r="20" fill={ACCENT} />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={q(200 + Math.cos(a) * 118)} cy={q(150 + Math.sin(a) * 88)} r="2.5" fill={INK} opacity="0.5" />;
          })}
        </>
      )}
      {variant === 2 && (
        <>
          {Array.from({ length: 24 }, (_, i) => (
            <rect
              key={i}
              x={36 + (i % 6) * 55}
              y={44 + Math.floor(i / 6) * 55}
              width="44"
              height="44"
              fill={i === 9 ? ACCENT : INK}
              opacity={i === 9 ? 1 : q(0.07 + rand() * 0.22)}
            />
          ))}
        </>
      )}
      {variant === 3 && (
        <>
          <polyline
            points={Array.from({ length: 30 }, (_, i) => `${q(30 + i * 12.4)},${q(220 - Math.sin(i / 3) * 60 - rand() * 40)}`).join(" ")}
            fill="none"
            stroke={INK}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line x1="30" y1="244" x2="370" y2="244" stroke="var(--rule)" />
          <rect x="30" y="40" width="88" height="6" fill={ACCENT} />
        </>
      )}
      {variant === 4 && (
        <>
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={40 + i * 66} y="70" width="52" height="160" fill={INK} opacity={0.08 + i * 0.16} />
          ))}
          <rect x="40" y="248" width="120" height="6" fill={ACCENT} />
        </>
      )}
      {variant === 5 && (
        <>
          {Array.from({ length: 60 }, (_, i) => (
            <circle key={i} cx={q(40 + rand() * 320)} cy={q(40 + rand() * 220)} r={rand() > 0.92 ? 6 : 2} fill={rand() > 0.92 ? ACCENT : INK} opacity="0.45" />
          ))}
          <line x1="40" y1="150" x2="360" y2="150" stroke="var(--rule)" />
        </>
      )}
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * A plate is either drawn or photographed.
 *
 * `svg` plates are artwork this file renders — mockups and textures. `shot`
 * plates are real screenshots: the live site captured in a browser, the app
 * captured in the simulator. A shot is never handed to the GPU layer, because
 * there is nothing to gain from re-uploading a bitmap that is already one.
 */
type Scene =
  | { kind: "svg"; render: () => React.JSX.Element; fit: Fit }
  /** Built in the page: real markup, sharp at any size, no bitmap at all. */
  | { kind: "live"; render: () => React.JSX.Element }
  | {
      kind: "shot";
      frame: "browser" | "phone" | "plain";
      /** One image for a browser shot; a row of screens for a phone shot. */
      shots: { src: string; width: number; height: number; alt: string; caption?: string }[];
      url?: string;
    };

const mock = (render: () => React.JSX.Element): Scene => ({ kind: "svg", render, fit: "contain" });
const mark = (render: () => React.JSX.Element): Scene => ({ kind: "svg", render, fit: "slice" });
const live = (render: () => React.JSX.Element): Scene => ({ kind: "live", render });

const browserShot = (src: string, alt: string, url: string, width = 2160, height = 1350): Scene => ({
  kind: "shot",
  frame: "browser",
  url,
  shots: [{ src, width, height, alt }],
});

const plainShot = (src: string, alt: string, width = 2160, height = 1350): Scene => ({
  kind: "shot",
  frame: "plain",
  shots: [{ src, width, height, alt }],
});


const SCENES: Record<VisualKey, Scene> = {
  "atlas-shot-hero": browserShot(
    "/shots/zane-atlas/hero.webp",
    "The Zane Atlas homepage: Engineered systems for scalable growth, with the system diagram beside it.",
    "zaneatlas.com",
  ),
  "atlas-shot-services": browserShot(
    "/shots/zane-atlas/services.webp",
    "The services section: four cards — websites, AI and automation, custom software, engineering productivity.",
    "zaneatlas.com/#services",
  ),
  "atlas-shot-demos": browserShot(
    "/shots/zane-atlas/demos.webp",
    "The demos section, where each service is shown working rather than described.",
    "zaneatlas.com/#demos",
  ),
  "atlas-shot-process": browserShot(
    "/shots/zane-atlas/process.webp",
    "The process section: the engagement laid out step by step.",
    "zaneatlas.com/#process",
  ),
  "atlas-shot-pricing": browserShot(
    "/shots/zane-atlas/pricing.webp",
    "The pricing section: three packages, each quoted per project against a fixed scope.",
    "zaneatlas.com/#pricing",
  ),
  "atlas-audit": mock(AtlasAudit),
  "atlas-system": mock(AtlasSystem),

  "swarm-console": mock(SwarmConsole),
  "swarm-insights": mock(SwarmInsights),
  "swarm-graph": mock(SwarmGraph),
  "swarm-research": mock(SwarmResearch),
  "swarm-system": mock(SwarmSystem),

  "app-ios": live(BoardIOS),
  "app-night": live(BoardNight),
  "app-deck-firstrun": live(BoardFirstRun),
  "app-deck-loop": live(BoardLoop),
  "app-deck-plan": live(BoardPlan),
  "app-cover": plainShot(
    "/shots/monsoon/cover.webp",
    "Three Monsoon screens on iPhone: the runway, logging a payment, and the month after it lands.",
  ),
  "app-research": mock(MonsoonResearch),
  "app-system": mock(MonsoonSystem),

  "archive-a": mark(() => <ArchiveScene seed={101} variant={0} />),
  "archive-b": mark(() => <ArchiveScene seed={202} variant={1} />),
  "archive-c": mark(() => <ArchiveScene seed={303} variant={2} />),
  "archive-d": mark(() => <ArchiveScene seed={404} variant={3} />),
  "archive-e": mark(() => <ArchiveScene seed={505} variant={4} />),
  "archive-f": mark(() => <ArchiveScene seed={606} variant={5} />),
};

/** Whether a plate is drawn artwork or a captured screenshot. */
export const visualKind = (visual: VisualKey) => SCENES[visual].kind;

/** For a captured plate, how it is mounted. */
export const visualFrame = (visual: VisualKey) => {
  const scene = SCENES[visual];
  return scene.kind === "shot" ? scene.frame : null;
};

/** How a plate should be fitted to its container. */
export const visualFit = (visual: VisualKey): Fit => {
  const scene = SCENES[visual];
  return scene.kind === "svg" ? scene.fit : "contain";
};

export function ProjectVisual({
  visual,
  className,
  priority,
}: {
  visual: VisualKey;
  className?: string;
  /** Set on the plate that opens a page, so it is not lazy-loaded. */
  priority?: boolean;
}) {
  const scene = SCENES[visual];

  if (scene.kind === "live") {
    const Scene = scene.render;
    return (
      <div className={`h-full w-full overflow-hidden ${className ?? ""}`}>
        <Scene />
      </div>
    );
  }

  if (scene.kind === "shot") {
    return (
      <div className={`h-full w-full ${className ?? ""}`}>
        {scene.frame === "browser" ? (
          <BrowserShot {...scene.shots[0]} url={scene.url ?? ""} priority={priority} />
        ) : scene.frame === "phone" ? (
          <PhoneShot shots={scene.shots} priority={priority} />
        ) : (
          <PlainShot {...scene.shots[0]} priority={priority} />
        )}
      </div>
    );
  }

  const Scene = scene.render;
  return (
    <div className={`h-full w-full overflow-hidden ${className ?? ""}`}>
      <Scene />
    </div>
  );
}
