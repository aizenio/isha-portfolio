import type { ReactNode } from "react";
import { q, seeded } from "./scene-utils";

/**
 * The drawing kit every mockup is built from.
 *
 * The plates are screenshots of interfaces that do not exist, so they are drawn
 * rather than photographed — real type, real numbers, real chrome, at a size
 * that stays readable when the plate is scaled down. Everything paints with the
 * page's own tokens, which is what keeps a product shot inside the portfolio's
 * palette instead of importing a second one.
 */

export const INK = "var(--ink)";
export const SOFT = "var(--ink-soft)";
export const MUTED = "var(--ink-muted)";
export const RULE = "var(--rule)";
export const RULE_SOFT = "var(--rule-soft)";
export const ACCENT = "var(--accent)";
export const PAPER = "var(--paper)";
export const RAISED = "var(--paper-raised)";

/**
 * Generic families only. A plate is serialised into an <img> to become a WebGL
 * texture, and a webfont cannot follow it there — a generic stack resolves in
 * both places, so the texture matches what the DOM is showing.
 */
export const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
export const SERIF = "Georgia, 'Times New Roman', serif";

export type Fit = "slice" | "contain";

export function Frame({
  children,
  viewBox,
  fit = "slice",
}: {
  children: ReactNode;
  viewBox: string;
  fit?: Fit;
}) {
  return (
    <svg
      viewBox={viewBox}
      className="block h-full w-full"
      preserveAspectRatio={fit === "contain" ? "xMidYMid meet" : "xMidYMid slice"}
      role="presentation"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Type                                                                      */
/* -------------------------------------------------------------------------- */

type TextProps = {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  fill?: string;
  weight?: number;
  family?: string;
  opacity?: number;
  anchor?: "start" | "middle" | "end";
  tracking?: number;
};

/** One line of interface text. */
export function T({
  x,
  y,
  children,
  size = 13,
  fill = INK,
  weight = 400,
  family = SANS,
  opacity,
  anchor = "start",
  tracking,
}: TextProps) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={fill}
      fontWeight={weight}
      fontFamily={family}
      opacity={opacity}
      textAnchor={anchor}
      letterSpacing={tracking}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

/** An uppercase micro-label, the way real product UI sets one. */
export function Label({ x, y, children, fill = MUTED, size = 10 }: Omit<TextProps, "size"> & { size?: number }) {
  return (
    <T x={x} y={y} size={size} fill={fill} family={MONO} tracking={1.1} weight={500}>
      {String(children).toUpperCase()}
    </T>
  );
}

/** A number set for comparison: mono, so columns of them line up. */
export function Num({ x, y, children, size = 13, fill = INK, weight = 500, anchor = "start", opacity }: TextProps) {
  return (
    <T x={x} y={y} size={size} fill={fill} weight={weight} family={MONO} anchor={anchor} opacity={opacity}>
      {children}
    </T>
  );
}

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                  */
/* -------------------------------------------------------------------------- */

export function Panel({
  x,
  y,
  w,
  h,
  r = 8,
  fill = RAISED,
  stroke = RULE,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  fill?: string;
  stroke?: string;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} />;
}

export function Divider({ x1, y, x2, soft = false }: { x1: number; y: number; x2: number; soft?: boolean }) {
  return <line x1={x1} y1={y} x2={x2} y2={y} stroke={soft ? RULE_SOFT : RULE} />;
}

/** A pill. `tone` picks how loudly it reads, never which hue it is. */
export function Pill({
  x,
  y,
  label,
  tone = "quiet",
  w,
}: {
  x: number;
  y: number;
  label: string;
  tone?: "accent" | "solid" | "quiet";
  w?: number;
}) {
  const width = w ?? label.length * 5.8 + 22;
  const fill = tone === "accent" ? ACCENT : tone === "solid" ? INK : "none";
  const text = tone === "quiet" ? SOFT : PAPER;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height="20"
        rx="10"
        fill={fill}
        opacity={tone === "quiet" ? 1 : 0.92}
        stroke={tone === "quiet" ? RULE : "none"}
      />
      <T x={x + width / 2} y={y + 10.5} size={10} fill={text} weight={500} anchor="middle" family={MONO} tracking={0.6}>
        {label}
      </T>
    </g>
  );
}

/** A button. Filled buttons carry the accent; the rest are outlines. */
export function Button({
  x,
  y,
  w,
  h = 34,
  label,
  primary = false,
  size = 12,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  primary?: boolean;
  size?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={primary ? ACCENT : "none"} stroke={primary ? "none" : RULE} />
      <T x={x + w / 2} y={y + h / 2} size={size} fill={primary ? PAPER : INK} weight={500} anchor="middle">
        {label}
      </T>
    </g>
  );
}

/** A horizontal progress or capacity bar. */
export function Meter({
  x,
  y,
  w,
  pct,
  h = 5,
  tone = "ink",
}: {
  x: number;
  y: number;
  w: number;
  pct: number;
  h?: number;
  tone?: "ink" | "accent";
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={INK} opacity="0.1" />
      <rect x={x} y={y} width={q(w * pct)} height={h} rx={h / 2} fill={tone === "accent" ? ACCENT : INK} opacity={tone === "accent" ? 1 : 0.55} />
    </g>
  );
}

/** A sparkline, seeded so server and client draw the same one. */
export function Spark({
  x,
  y,
  w,
  h,
  seed,
  trend = 0,
  stroke = INK,
  fillArea = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
  trend?: number;
  stroke?: string;
  fillArea?: boolean;
}) {
  const rand = seeded(seed);
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => {
    const base = 0.5 + trend * (i / (n - 1) - 0.5) * 2;
    const v = Math.min(0.95, Math.max(0.05, base + (rand() - 0.5) * 0.34));
    return { x: q(x + (i / (n - 1)) * w), y: q(y + h - v * h) };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <g>
      {fillArea && (
        <polygon points={`${x},${y + h} ${line} ${x + w},${y + h}`} fill={stroke} opacity="0.08" />
      )}
      <polyline points={line} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Device and browser chrome                                                 */
/* -------------------------------------------------------------------------- */

/** A desktop browser window. The plates that are websites live inside one. */
export function BrowserWindow({
  x,
  y,
  w,
  h,
  url,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
  children: ReactNode;
}) {
  const bar = 34;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={RAISED} stroke={RULE} />
      <path
        d={`M ${x} ${y + 10} a 10 10 0 0 1 10 -10 h ${w - 20} a 10 10 0 0 1 10 10 v ${bar - 10} h ${-w} z`}
        fill={INK}
        opacity="0.05"
      />
      <Divider x1={x} y={y + bar} x2={x + w} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 20 + i * 15} cy={y + bar / 2} r="4" fill={MUTED} opacity={0.45} />
      ))}
      <rect x={x + 78} y={y + 9} width={q(w * 0.42)} height="17" rx="8.5" fill={INK} opacity="0.05" />
      <T x={x + 90} y={y + 17.5} size={10} fill={MUTED} family={MONO}>
        {url}
      </T>
      <svg x={x} y={y + bar} width={w} height={h - bar} viewBox={`0 0 ${w} ${h - bar}`}>
        {children}
      </svg>
    </g>
  );
}

const IOS_TIME = "9:41";

/** An iPhone. Status bar, home indicator, and the notch cut-out. */
export function PhoneIOS({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children: ReactNode;
}) {
  const r = q(w * 0.115);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={RAISED} stroke={RULE} strokeWidth="1.5" />
      {/* status bar */}
      <T x={x + 22} y={y + 20} size={11} weight={600}>
        {IOS_TIME}
      </T>
      <g transform={`translate(${x + w - 62} ${y + 14})`}>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4} y={q(7 - i * 1.8)} width="2.6" height={q(3 + i * 1.8)} rx="1" fill={INK} opacity="0.8" />
        ))}
        <path d="M20 4 a7 7 0 0 1 10 0" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.8" />
        <path d="M23 7.5 a3.4 3.4 0 0 1 4 0" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.8" />
        <rect x="35" y="3" width="15" height="8" rx="2.5" fill="none" stroke={INK} opacity="0.55" />
        <rect x="36.5" y="4.5" width="10" height="5" rx="1.2" fill={INK} opacity="0.8" />
      </g>
      {/* dynamic island */}
      <rect x={q(x + w / 2 - 26)} y={y + 9} width="52" height="16" rx="8" fill={INK} opacity="0.88" />
      <svg x={x + 1} y={y + 34} width={w - 2} height={h - 52} viewBox={`0 0 ${w - 2} ${h - 52}`}>
        {children}
      </svg>
      {/* home indicator */}
      <rect x={q(x + w / 2 - 42)} y={y + h - 12} width="84" height="4" rx="2" fill={INK} opacity="0.5" />
    </g>
  );
}

/** An Android device. Same content, Material chrome and navigation. */
export function PhoneAndroid({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children: ReactNode;
}) {
  const r = q(w * 0.075);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={RAISED} stroke={RULE} strokeWidth="1.5" />
      <T x={x + 18} y={y + 18} size={10.5} weight={600}>
        {IOS_TIME}
      </T>
      <circle cx={q(x + w / 2)} cy={y + 18} r="5" fill={INK} opacity="0.85" />
      <g transform={`translate(${x + w - 58} ${y + 12})`}>
        <path d="M0 11 L7 0 L14 11 z" fill={INK} opacity="0.75" />
        <path d="M20 2 a7 7 0 0 1 10 0" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.75" />
        <rect x="35" y="1.5" width="9" height="9" rx="2" fill={INK} opacity="0.75" />
      </g>
      <svg x={x + 1} y={y + 32} width={w - 2} height={h - 58} viewBox={`0 0 ${w - 2} ${h - 58}`}>
        {children}
      </svg>
      {/* gesture / nav bar */}
      <rect x={q(x + w / 2 - 46)} y={y + h - 14} width="92" height="4" rx="2" fill={INK} opacity="0.45" />
    </g>
  );
}
