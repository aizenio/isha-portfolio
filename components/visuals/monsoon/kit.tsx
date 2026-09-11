import type { CSSProperties, ReactNode } from "react";

/**
 * Monsoon, built rather than photographed.
 *
 * These screens were captures until the plates outgrew them: a screenshot
 * scaled into a 1200px slot is a screenshot at the wrong resolution, and no
 * amount of encoder quality fixes it. Rendered as markup they stay sharp at
 * any size, re-flow on a phone, and cost a few kilobytes instead of a
 * megabyte.
 *
 * Sizing is expressed in container-query units against a fixed design width,
 * so the whole board scales as one drawing with the type locked to the layout.
 * `u(24)` means "24 pixels at design size" and stays proportional everywhere.
 */

const DESIGN = 1180;

export const u = (px: number) => `${((px / DESIGN) * 100).toFixed(4)}cqw`;

/** The app's own palette — nothing here comes from the portfolio's tokens. */
export const LIGHT = {
  surface: "#FFFDF9",
  raised: "#F5EEE4",
  ink: "#17130F",
  muted: "#6B625A",
  faint: "#9C9188",
  hairline: "rgba(23,19,15,0.10)",
  safe: "#0E7C66",
  tight: "#C2571A",
  rain: "#3E5C9A",
};

export const DARK = {
  surface: "#14100D",
  raised: "#1E1915",
  ink: "#F7F2EC",
  muted: "#A79C91",
  faint: "#726A62",
  hairline: "rgba(247,242,236,0.12)",
  safe: "#3FBFA0",
  tight: "#E8874A",
  rain: "#7C9BD6",
};

export type Palette = typeof LIGHT;

const SANS = "ui-sans-serif, -apple-system, 'SF Pro Text', system-ui, sans-serif";
const ROUND = "ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif";

/* -------------------------------------------------------------------------- */
/*  Device                                                                    */
/* -------------------------------------------------------------------------- */

/** An iPhone. Bezel, dynamic island, status bar, home indicator. */
export function Phone({
  dark = false,
  label,
  children,
}: {
  dark?: boolean;
  label?: string;
  children: ReactNode;
}) {
  const c = dark ? DARK : LIGHT;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u(12) }}>
      <div
        style={{
          position: "relative",
          width: u(250),
          aspectRatio: "1206 / 2622",
          borderRadius: u(34),
          background: "#22201d",
          boxShadow: `0 ${u(2)} ${u(6)} rgba(0,0,0,.18), 0 ${u(26)} ${u(52)} ${u(-14)} rgba(0,0,0,.36), 0 ${u(52)} ${u(104)} ${u(-40)} rgba(0,0,0,.40)`,
          outline: "1px solid rgba(0,0,0,.10)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: u(6),
            borderRadius: u(28),
            overflow: "hidden",
            background: c.surface,
            color: c.ink,
            fontFamily: SANS,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <StatusBar palette={c} />
          {children}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: u(7),
              width: u(94),
              height: u(4),
              borderRadius: u(2),
              background: c.ink,
              opacity: 0.45,
            }}
          />
        </div>
      </div>
      {label && (
        <span
          className="t-label"
          style={{ fontSize: u(11), letterSpacing: u(1.4), lineHeight: 1.2 }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function StatusBar({ palette }: { palette: Palette }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${u(13)} ${u(20)} ${u(2)}`,
        fontSize: u(11.5),
        fontWeight: 600,
        letterSpacing: u(0.1),
      }}
    >
      <span>9:41</span>
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: u(9),
          transform: "translateX(-50%)",
          width: u(58),
          height: u(17),
          borderRadius: u(9),
          background: "#0b0b0b",
        }}
      />
      <span style={{ display: "flex", alignItems: "center", gap: u(4) }}>
        <svg width={u(15)} height={u(10)} viewBox="0 0 15 10" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4}
              y={7 - i * 2}
              width="2.6"
              height={3 + i * 2}
              rx="0.7"
              fill={palette.ink}
              opacity={i === 3 ? 0.35 : 1}
            />
          ))}
        </svg>
        <svg width={u(13)} height={u(10)} viewBox="0 0 13 10" aria-hidden>
          <path d="M1 3.6a8 8 0 0 1 11 0" fill="none" stroke={palette.ink} strokeWidth="1.4" />
          <path d="M3.4 6.2a4.6 4.6 0 0 1 6.2 0" fill="none" stroke={palette.ink} strokeWidth="1.4" />
          <circle cx="6.5" cy="8.6" r="1.1" fill={palette.ink} />
        </svg>
        <svg width={u(20)} height={u(10)} viewBox="0 0 20 10" aria-hidden>
          <rect x="0.5" y="0.5" width="16" height="9" rx="2.6" fill="none" stroke={palette.ink} opacity="0.4" />
          <rect x="2" y="2" width="13" height="6" rx="1.6" fill={palette.ink} />
          <path d="M18 3.4v3.2c.8-.3 1.4-1 1.4-1.6s-.6-1.3-1.4-1.6Z" fill={palette.ink} opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screen furniture                                                          */
/* -------------------------------------------------------------------------- */

export const body = (c: Palette): CSSProperties => ({
  flex: 1,
  minHeight: 0,
  padding: `${u(6)} ${u(20)} 0`,
  color: c.ink,
  overflow: "hidden",
});

export function Label({ children, palette }: { children: ReactNode; palette: Palette }) {
  return (
    <div
      style={{
        fontSize: u(11),
        letterSpacing: u(1),
        textTransform: "uppercase",
        color: palette.faint,
        margin: `${u(16)} 0 ${u(6)}`,
      }}
    >
      {children}
    </div>
  );
}

export function Rule({ palette }: { palette: Palette }) {
  return <div style={{ height: 1, background: palette.hairline }} />;
}

/** The number, its date, and the meter underneath. */
export function Runway({
  palette,
  days,
  date,
  inHand,
  perDay,
  delta,
  fill,
}: {
  palette: Palette;
  days: number;
  date: string;
  inHand: string;
  perDay: string;
  delta?: string;
  fill: number;
}) {
  const tight = days < 14;
  const tone = tight ? palette.tight : palette.safe;
  return (
    <>
      <div style={{ fontSize: u(13), color: palette.muted }}>You are safe for</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: u(9), paddingTop: u(2) }}>
        <div
          style={{
            fontFamily: ROUND,
            fontSize: delta ? u(38) : u(46),
            fontWeight: 700,
            letterSpacing: u(-1),
            lineHeight: 1.08,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            color: tight ? palette.tight : palette.ink,
          }}
        >
          {days} days
        </div>
        {delta && (
          <span
            style={{
              fontSize: u(12),
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              color: tone,
              background: tight ? "rgba(194,87,26,.14)" : "rgba(14,124,102,.14)",
              padding: `${u(3)} ${u(9)}`,
              borderRadius: u(999),
              whiteSpace: "nowrap",
            }}
          >
            {delta}
          </span>
        )}
      </div>
      <div style={{ fontSize: u(13), color: palette.muted, paddingTop: u(6) }}>
        until {date}, at your current rate
      </div>
      <Meter palette={palette} fill={fill} tone={tone} />
      <div
        style={{
          fontSize: u(11),
          color: palette.faint,
          paddingTop: u(9),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {inHand} in hand · {perDay} a day
      </div>
    </>
  );
}

export function Meter({ palette, fill, tone }: { palette: Palette; fill: number; tone: string }) {
  return (
    <div
      style={{
        height: u(7),
        borderRadius: u(999),
        background: palette.hairline,
        marginTop: u(12),
        overflow: "hidden",
      }}
    >
      <div style={{ height: "100%", width: `${fill * 100}%`, borderRadius: u(999), background: tone }} />
    </div>
  );
}

/** A row that says what would move the number, or what already did. */
export function Row({
  palette,
  title,
  meta,
  value,
  tone,
}: {
  palette: Palette;
  title: string;
  meta: string;
  value: string;
  tone?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: u(10),
        padding: `${u(9)} 0`,
        borderBottom: `1px solid ${palette.hairline}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: u(13.5), fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: u(11), color: palette.faint, paddingTop: u(2) }}>{meta}</div>
      </div>
      <div
        style={{
          fontSize: u(12.5),
          fontWeight: 600,
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
          color: tone ?? palette.muted,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/** The primary action, and the tab bar it sits above. */
export function Footer({
  palette,
  action,
  sub,
  active = 0,
}: {
  palette: Palette;
  action?: string;
  sub?: string;
  active?: number;
}) {
  const tabs = ["Home", "Money", "Plan", "You"];
  return (
    <div style={{ marginTop: "auto" }}>
      {action && (
        <div style={{ padding: `0 ${u(20)} ${u(12)}` }}>
          <div
            style={{
              background: palette.safe,
              color: palette.surface,
              borderRadius: u(12),
              textAlign: "center",
              padding: `${u(13)} 0`,
              lineHeight: 1.2,
            }}
          >
            <div style={{ fontSize: u(14), fontWeight: 600 }}>{action}</div>
            {sub && <div style={{ fontSize: u(11), opacity: 0.86, paddingTop: u(2) }}>{sub}</div>}
          </div>
        </div>
      )}
      <Rule palette={palette} />
      <div style={{ display: "flex", padding: `${u(8)} 0 ${u(18)}` }}>
        {tabs.map((tab, i) => (
          <div
            key={tab}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: u(4),
              fontSize: u(9.5),
              color: i === active ? palette.safe : palette.faint,
            }}
          >
            <span
              style={{
                width: u(6),
                height: u(6),
                borderRadius: "50%",
                background: "currentColor",
              }}
            />
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The ground a row of phones stands on. */
export function Board({
  label,
  heading,
  children,
}: {
  label?: string;
  heading?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{ containerType: "inline-size" }}
      className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,var(--paper-raised)_0%,var(--paper)_72%)]"
    >
      {(label || heading) && (
        <div style={{ padding: `${u(30)} ${u(52)} 0` }}>
          {label && (
            <div className="t-label" style={{ fontSize: u(11), letterSpacing: u(1.6) }}>
              {label}
            </div>
          )}
          {heading && (
            <div
              className="font-display text-ink"
              style={{ fontSize: u(26), lineHeight: 1.1, paddingTop: u(8) }}
            >
              {heading}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: u(40),
          padding: `${u(22)} ${u(46)} ${u(26)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
