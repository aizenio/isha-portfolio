import type { VisualKey } from "@/lib/content";
import { q, seeded, series } from "./scene-utils";

/**
 * Every image on this site is drawn, not photographed.
 *
 * Each scene is an abstraction of the real artefact it stands for — a console,
 * an audit, a token layer — built from the same palette variables as the rest
 * of the page. They scale to any viewport without art-direction crops, carry no
 * network cost, and re-theme automatically on ink and paper surfaces.
 */

const INK = "var(--ink)";
const SOFT = "var(--ink-soft)";
const MUTED = "var(--ink-muted)";
const RULE = "var(--rule)";
const ACCENT = "var(--accent)";
const RAISED = "var(--paper-raised)";

type SceneProps = { className?: string };

function Frame({
  children,
  viewBox,
  className,
}: {
  children: React.ReactNode;
  viewBox: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={`block h-full w-full ${className ?? ""}`}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Zane Atlas                                                                */
/* -------------------------------------------------------------------------- */

/** The answer console: six resolved statements, evidence beneath, network right. */
function AtlasConsole() {
  const answers = [
    { w: 300, sev: 3 },
    { w: 246, sev: 1 },
    { w: 278, sev: 2 },
    { w: 214, sev: 0 },
    { w: 262, sev: 0 },
    { w: 190, sev: 0 },
  ];
  const spark = series(41, 46, (r, i) => q(96 - Math.sin(i / 3.4) * 26 - r * 22));

  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      {/* rail */}
      <line x1="128" y1="0" x2="128" y2="750" stroke={RULE} />
      {series(7, 7, (_, i) => i).map((i) => (
        <rect
          key={i}
          x="44"
          y={92 + i * 46}
          width={i === 1 ? 54 : 38}
          height="5"
          fill={i === 1 ? INK : MUTED}
          opacity={i === 1 ? 1 : 0.5}
        />
      ))}
      <rect x="44" y="44" width="22" height="22" fill={ACCENT} />

      {/* header */}
      <line x1="128" y1="104" x2="1200" y2="104" stroke={RULE} />
      <rect x="176" y="60" width="152" height="9" fill={INK} />
      <rect x="1024" y="62" width="120" height="5" fill={MUTED} opacity="0.6" />

      {/* six answers */}
      {answers.map((a, i) => {
        const y = 152 + i * 84;
        return (
          <g key={i}>
            <line x1="176" y1={y + 58} x2="768" y2={y + 58} stroke={RULE} />
            <rect x="176" y={y} width="8" height="8" fill={i < 3 ? ACCENT : MUTED} opacity={i < 3 ? 1 : 0.5} />
            <rect x="200" y={y} width={a.w} height="8" fill={INK} opacity={0.92} />
            <rect x="200" y={y + 22} width={a.w * 0.62} height="5" fill={SOFT} opacity="0.5" />
            {a.sev > 0 &&
              series(90 + i, a.sev, (_, k) => k).map((k) => (
                <rect key={k} x={640 + k * 22} y={y + 1} width="12" height="6" fill={ACCENT} opacity={0.25 + k * 0.3} />
              ))}
          </g>
        );
      })}

      {/* network panel */}
      <line x1="816" y1="104" x2="816" y2="750" stroke={RULE} />
      <rect x="864" y="152" width="88" height="6" fill={MUTED} opacity="0.6" />
      <polyline
        points={spark.map((v, i) => `${864 + i * 6},${v + 156}`).join(" ")}
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
      />
      <line x1="864" y1="322" x2="1144" y2="322" stroke={RULE} />
      {series(12, 40, (r) => r).map((r, i) => (
        <circle
          key={i}
          cx={880 + (i % 8) * 36}
          cy={370 + Math.floor(i / 8) * 44}
          r={r > 0.86 ? 6 : 2.5}
          fill={r > 0.86 ? ACCENT : MUTED}
          opacity={r > 0.86 ? 1 : 0.35 + r * 0.4}
        />
      ))}
      <line x1="864" y1="608" x2="1144" y2="608" stroke={RULE} />
      <rect x="864" y="636" width="180" height="6" fill={SOFT} opacity="0.45" />
      <rect x="864" y="656" width="126" height="6" fill={SOFT} opacity="0.28" />
    </Frame>
  );
}

/** Nine days of shadowing: every path taken to answer a single question. */
function AtlasBefore() {
  const rand = seeded(613);
  const nodes = Array.from({ length: 22 }, (_, i) => ({
    x: 90 + (i % 6) * 200 + rand() * 70,
    y: 90 + Math.floor(i / 6) * 170 + rand() * 60,
  }));
  const edges = Array.from({ length: 44 }, () => ({
    a: Math.floor(rand() * nodes.length),
    b: Math.floor(rand() * nodes.length),
  })).filter((e) => e.a !== e.b);

  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      {edges.map((e, i) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const mx = (a.x + b.x) / 2;
        return (
          <path
            key={i}
            d={`M ${a.x} ${a.y} Q ${mx} ${a.y} ${b.x} ${b.y}`}
            fill="none"
            stroke={INK}
            strokeWidth="0.75"
            opacity="0.28"
          />
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={i === 4 ? 9 : 4} fill={i === 4 ? ACCENT : INK} opacity={i === 4 ? 1 : 0.65} />
          <rect x={n.x + 14} y={n.y - 3} width={26 + (i % 4) * 14} height="4" fill={MUTED} opacity="0.4" />
        </g>
      ))}
      <rect x="72" y="686" width="140" height="6" fill={MUTED} opacity="0.5" />
    </Frame>
  );
}

/** Sixty-two elements, ranked by how often anyone acted on them. */
function AtlasHierarchy() {
  const bars = series(88, 62, (r, i) => q(Math.max(3, (1 - i / 62) ** 2.6 * 300 + r * 14)));
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      <line x1="72" y1="560" x2="1128" y2="560" stroke={RULE} />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={72 + i * 17}
          y={560 - h}
          width="10"
          height={h}
          fill={i < 4 ? ACCENT : INK}
          opacity={i < 4 ? 1 : 0.2}
        />
      ))}
      <line x1="72" y1="196" x2="140" y2="196" stroke={ACCENT} strokeWidth="1.5" />
      <rect x="72" y="612" width="118" height="6" fill={INK} opacity="0.7" />
      <rect x="72" y="632" width="240" height="5" fill={MUTED} opacity="0.45" />
      <rect x="1010" y="612" width="118" height="6" fill={MUTED} opacity="0.35" />
    </Frame>
  );
}

/** The console at rest — answers first, evidence expanded on one row. */
function AtlasProduct() {
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      <line x1="0" y1="88" x2="1200" y2="88" stroke={RULE} />
      <rect x="72" y="46" width="128" height="8" fill={INK} />
      <rect x="1024" y="47" width="104" height="6" fill={MUTED} opacity="0.5" />

      {/* collapsed answers */}
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x="72" y={140 + i * 72} width={i === 0 ? 420 : 356} height="9" fill={INK} opacity="0.9" />
          <rect x="72" y={164 + i * 72} width={220} height="5" fill={SOFT} opacity="0.4" />
          <line x1="72" y1={196 + i * 72} x2="1128" y2={196 + i * 72} stroke={RULE} />
        </g>
      ))}

      {/* one expanded answer, with its evidence growing beneath the sentence */}
      <rect x="72" y="292" width="470" height="9" fill={ACCENT} />
      <rect x="72" y="316" width="286" height="5" fill={SOFT} opacity="0.5" />
      <rect x="72" y="348" width="1056" height="240" fill={INK} opacity="0.05" />
      {series(31, 5, (_, i) => i).map((i) => (
        <g key={i}>
          <line x1="104" y1={392 + i * 44} x2="1096" y2={392 + i * 44} stroke={RULE} />
          <rect x="104" y={374 + i * 44} width={140 + i * 26} height="6" fill={INK} opacity="0.55" />
          <rect x="720" y={374 + i * 44} width="64" height="6" fill={MUTED} opacity="0.4" />
          <rect x="880" y={374 + i * 44} width="90" height="6" fill={MUTED} opacity="0.3" />
          <rect x={1036} y={374 + i * 44} width="60" height="6" fill={i < 2 ? ACCENT : MUTED} opacity={i < 2 ? 0.9 : 0.3} />
        </g>
      ))}
      <line x1="72" y1="628" x2="1128" y2="628" stroke={RULE} />
      <rect x="72" y="656" width="180" height="6" fill={MUTED} opacity="0.4" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Verse                                                                     */
/* -------------------------------------------------------------------------- */

/** The reading column: measure, rhythm, and a piece that announces its shape. */
function VerseColumn() {
  const lines = series(17, 30, (r) => 300 + r * 120);
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      {/* structural spine */}
      <line x1="132" y1="96" x2="132" y2="654" stroke={RULE} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="126" y={110 + i * 112} width="13" height={i === 1 ? 96 : 72} fill={i === 1 ? ACCENT : INK} opacity={i === 1 ? 1 : 0.16} />
      ))}
      {/* opening line, set large */}
      <rect x="248" y="120" width="640" height="16" fill={INK} />
      <rect x="248" y="152" width="450" height="16" fill={INK} />
      {/* body measure */}
      {lines.map((w, i) => (
        <rect key={i} x="248" y={224 + i * 15} width={w} height="4" fill={SOFT} opacity={0.34} />
      ))}
      {/* image landing */}
      <rect x="740" y="300" width="388" height="248" fill={INK} opacity="0.08" />
      <line x1="740" y1="300" x2="1128" y2="548" stroke={RULE} />
      <rect x="740" y="568" width="180" height="5" fill={MUTED} opacity="0.5" />
    </Frame>
  );
}

/** Forty years of publishing, mapped by subject instead of by date. */
function VerseArchive() {
  const rand = seeded(2024);
  const points = Array.from({ length: 190 }, () => {
    const cluster = Math.floor(rand() * 5);
    const cx = 190 + cluster * 210;
    const cy = 250 + Math.sin(cluster * 1.6) * 130;
    return {
      x: q(cx + (rand() - 0.5) * 210),
      y: q(cy + (rand() - 0.5) * 250),
      r: rand() > 0.94 ? 6 : 2,
      hot: rand() > 0.94,
    };
  });
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={190 + i * 210} y1="70" x2={190 + i * 210} y2="600" stroke={RULE} />
      ))}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.hot ? ACCENT : INK} opacity={p.hot ? 1 : 0.3} />
      ))}
      <line x1="72" y1="640" x2="1128" y2="640" stroke={RULE} />
      {["1984", "1994", "2004", "2014", "2024"].map((_, i) => (
        <rect key={i} x={172 + i * 210} width="36" y="664" height="5" fill={MUTED} opacity="0.5" />
      ))}
    </Frame>
  );
}

/** Reading view: spine on the left, 62-character measure, nothing else. */
function VerseReader() {
  const lines = series(53, 34, (r) => 380 + r * 150);
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      <line x1="112" y1="70" x2="112" y2="680" stroke={RULE} />
      <rect x="108" y="70" width="9" height="248" fill={ACCENT} />
      <rect x="164" y="72" width="72" height="5" fill={MUTED} opacity="0.6" />
      {lines.map((w, i) => (
        <rect
          key={i}
          x="332"
          y={110 + i * 17}
          width={w}
          height="5"
          fill={i < 2 ? INK : SOFT}
          opacity={i < 2 ? 0.85 : 0.32}
        />
      ))}
      <rect x="332" y="700" width="120" height="5" fill={MUTED} opacity="0.4" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Northbound                                                                */
/* -------------------------------------------------------------------------- */

/** One language across eleven products. */
function NorthSystem() {
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      {series(3, 11, (_, i) => i).map((i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 96 + col * 262;
        const y = 110 + row * 200;
        return (
          <g key={i}>
            <rect x={x} y={y} width="212" height="150" fill={INK} opacity="0.05" />
            <line x1={x} y1={y + 34} x2={x + 212} y2={y + 34} stroke={RULE} />
            <rect x={x + 16} y={y + 14} width={i === 0 ? 74 : 52} height="6" fill={i === 0 ? ACCENT : INK} opacity={i === 0 ? 1 : 0.6} />
            <rect x={x + 16} y={y + 56} width="140" height="5" fill={SOFT} opacity="0.4" />
            <rect x={x + 16} y={y + 74} width="104" height="5" fill={SOFT} opacity="0.28" />
            <rect x={x + 16} y={y + 108} width="66" height="20" fill={INK} opacity="0.75" />
            <rect x={x + 92} y={y + 108} width="66" height="20" fill={INK} opacity="0.12" />
          </g>
        );
      })}
    </Frame>
  );
}

/** Every primary button in production, sampled in one week. */
function NorthDrift() {
  const buttons = series(77, 28, (r) => r);
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      {buttons.map((r, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const w = 108 + r * 40;
        const h = 30 + r * 18;
        return (
          <g key={i}>
            <rect
              x={92 + col * 150}
              y={140 + row * 130}
              width={w}
              height={h}
              rx={r * 16}
              fill={INK}
              opacity={0.24 + r * 0.5}
            />
            <rect x={92 + col * 150} y={140 + row * 130 + h + 14} width={44 + r * 30} height="4" fill={MUTED} opacity="0.35" />
          </g>
        );
      })}
      <rect x="92" y="60" width="176" height="7" fill={ACCENT} />
      <line x1="92" y1="94" x2="1108" y2="94" stroke={RULE} />
    </Frame>
  );
}

/** The token layer everything downstream derives from. */
function NorthTokens() {
  return (
    <Frame viewBox="0 0 1200 750">
      <rect width="1200" height="750" fill={RAISED} />
      {/* neutral ramp */}
      {series(5, 9, (_, i) => i).map((i) => (
        <rect key={i} x={92 + i * 84} y="110" width="72" height="120" fill={INK} opacity={0.06 + i * 0.11} />
      ))}
      <rect x="884" y="110" width="72" height="120" fill={ACCENT} />
      <line x1="92" y1="278" x2="1108" y2="278" stroke={RULE} />

      {/* type scale */}
      {[48, 36, 27, 20, 15, 11].map((size, i) => (
        <rect
          key={i}
          x="92"
          y={322 + i * 54}
          width={size * 9}
          height={size / 3.4}
          fill={INK}
          opacity={0.85 - i * 0.09}
        />
      ))}
      <line x1="620" y1="310" x2="620" y2="672" stroke={RULE} />

      {/* spacing ticks */}
      {[4, 8, 12, 16, 24, 32, 48].map((step, i) => (
        <g key={i}>
          <rect x="676" y={330 + i * 48} width={step * 6} height="10" fill={INK} opacity="0.5" />
          <rect x={676 + step * 6 + 16} y={332 + i * 48} width="34" height="5" fill={MUTED} opacity="0.4" />
        </g>
      ))}
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Archive previews — small, distinct, legible at 300px wide                  */
/* -------------------------------------------------------------------------- */

function ArchiveScene({ seed, variant }: { seed: number; variant: number }) {
  const rand = seeded(seed);
  return (
    <Frame viewBox="0 0 400 300">
      <rect width="400" height="300" fill={RAISED} />
      {variant === 0 && (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x="40" y={54 + i * 28} width={60 + rand() * 240} height="7" fill={INK} opacity={0.18 + i * 0.09} />
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
              opacity={i === 9 ? 1 : 0.07 + rand() * 0.22}
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
          <line x1="30" y1="244" x2="370" y2="244" stroke={RULE} />
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
          <line x1="40" y1="150" x2="360" y2="150" stroke={RULE} />
        </>
      )}
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */

const SCENES: Record<VisualKey, () => React.JSX.Element> = {
  "atlas-console": AtlasConsole,
  "atlas-before": AtlasBefore,
  "atlas-hierarchy": AtlasHierarchy,
  "atlas-product": AtlasProduct,
  "verse-column": VerseColumn,
  "verse-archive": VerseArchive,
  "verse-reader": VerseReader,
  "north-system": NorthSystem,
  "north-drift": NorthDrift,
  "north-tokens": NorthTokens,
  "archive-a": () => <ArchiveScene seed={101} variant={0} />,
  "archive-b": () => <ArchiveScene seed={202} variant={1} />,
  "archive-c": () => <ArchiveScene seed={303} variant={2} />,
  "archive-d": () => <ArchiveScene seed={404} variant={3} />,
  "archive-e": () => <ArchiveScene seed={505} variant={4} />,
  "archive-f": () => <ArchiveScene seed={606} variant={5} />,
};

export function ProjectVisual({ visual, className }: { visual: VisualKey } & SceneProps) {
  const Scene = SCENES[visual];
  return (
    <div className={`h-full w-full overflow-hidden ${className ?? ""}`}>
      <Scene />
    </div>
  );
}
