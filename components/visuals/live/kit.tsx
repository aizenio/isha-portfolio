import type { CSSProperties, ReactNode } from "react";

/**
 * The kit the built plates are made from.
 *
 * A plate used to be an SVG drawing: crisp, but frozen — text that could not be
 * selected or read aloud, a layout that could not reflow, and a diagram that
 * had to be redrawn by hand whenever a number changed. These are markup.
 *
 * Sizing is container-query units against a fixed design width, so a whole
 * board scales as one drawing: `u(24)` means "24 pixels at design size" and
 * stays proportional at every plate size.
 */

const DESIGN = 1180;

export const u = (px: number) => `${((px / DESIGN) * 100).toFixed(4)}cqw`;

/** Deterministic jitter, so server and client lay out the same dots. */
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/*  Ground                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A board: the sheet, inset from the plate's edge, on its own ground.
 *
 * `tone` chooses whose surface it is — "paper" for the designer's own
 * artefacts, which belong to the portfolio, and "product" for a plate showing
 * someone's interface, which carries that product's palette instead.
 */
export function Board({
  children,
  tone = "paper",
  background,
  border,
  color,
  pad = 30,
}: {
  children: ReactNode;
  tone?: "paper" | "product";
  background?: string;
  border?: string;
  color?: string;
  pad?: number;
}) {
  return (
    <div
      style={{ containerType: "inline-size", position: "relative" }}
      className={`h-full w-full overflow-hidden ${
        tone === "paper"
          ? "bg-[radial-gradient(120%_120%_at_50%_0%,var(--paper-raised)_0%,var(--paper)_72%)]"
          : ""
      }`}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          margin: u(32),
          borderRadius: u(14),
          padding: `${u(pad)} ${u(34)}`,
          background: background ?? "var(--paper-raised)",
          border: `1px solid ${border ?? "var(--rule)"}`,
          color,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Type                                                                      */
/* -------------------------------------------------------------------------- */

export function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        fontSize: u(11),
        letterSpacing: u(1.5),
        textTransform: "uppercase",
        color: color ?? "var(--ink-muted)",
      }}
    >
      {children}
    </div>
  );
}

export function Heading({
  children,
  size = 26,
  color,
  display = true,
  pad = 10,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
  display?: boolean;
  pad?: number;
}) {
  return (
    <div
      className={display ? "font-display" : undefined}
      style={{
        fontSize: u(size),
        lineHeight: display ? 1.1 : 1.2,
        fontWeight: display ? 400 : 600,
        letterSpacing: display ? u(-0.4) : u(-0.2),
        color: color ?? "var(--ink)",
        paddingTop: u(pad),
        textWrap: "pretty",
      }}
    >
      {children}
    </div>
  );
}

export function Text({
  children,
  size = 13,
  color,
  weight,
  mono,
  style,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  mono?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: mono ? "var(--font-mono), ui-monospace, monospace" : undefined,
        fontSize: u(size),
        lineHeight: 1.45,
        fontWeight: weight,
        color: color ?? "var(--ink-soft)",
        fontVariantNumeric: mono ? "tabular-nums" : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Rule({ color, style }: { color?: string; style?: CSSProperties }) {
  return <div style={{ height: 1, background: color ?? "var(--rule)", ...style }} />;
}

/* -------------------------------------------------------------------------- */
/*  Data marks                                                                */
/* -------------------------------------------------------------------------- */

/** A bar, used for counts, shares and capacity alike. */
export function Bar({
  fill,
  tone,
  track,
  height = 12,
}: {
  fill: number;
  tone?: string;
  track?: string;
  height?: number;
}) {
  return (
    <div
      style={{
        height: u(height),
        borderRadius: u(height / 2),
        background: track ?? "color-mix(in srgb, var(--ink) 10%, transparent)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(1, fill)) * 100}%`,
          height: "100%",
          borderRadius: u(height / 2),
          background: tone ?? "var(--accent)",
        }}
      />
    </div>
  );
}
