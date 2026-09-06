/**
 * The six planes of the craft stack. Stacked flat they read as one finished
 * component; pulled apart they show what each layer was contributing.
 */

import { q } from "./scene-utils";

const INK = "var(--ink)";
const SOFT = "var(--ink-soft)";
const MUTED = "var(--ink-muted)";
const RULE = "var(--rule)";
const ACCENT = "var(--accent)";

function Plane({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 720 440" className="block h-full w-full" role="presentation" focusable="false">
      {children}
    </svg>
  );
}

export function GridPlane() {
  return (
    <Plane>
      <rect width="720" height="440" fill="var(--paper-raised)" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={40 + i * 53.3} y1="24" x2={40 + i * 53.3} y2="416" stroke={RULE} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={40 + i * 53.3} y="24" width="37" height="392" fill={ACCENT} opacity="0.05" />
      ))}
      {Array.from({ length: 25 }, (_, i) => (
        <line key={i} x1="40" y1={24 + i * 16} x2="680" y2={24 + i * 16} stroke={RULE} opacity="0.4" />
      ))}
    </Plane>
  );
}

export function TypePlane() {
  return (
    <Plane>
      {[
        { w: 380, h: 26 },
        { w: 470, h: 14 },
        { w: 300, h: 14 },
      ].map((line, i) => (
        <rect key={i} x="56" y={54 + i * 44} width={line.w} height={line.h} fill={INK} opacity={i === 0 ? 0.92 : 0.4} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x="56" y={210 + i * 18} width={220 + ((i * 61) % 260)} height="6" fill={SOFT} opacity="0.32" />
      ))}
      {[10, 12, 15, 20, 28, 40].map((size, i) => (
        <rect key={i} x="470" y={200 + i * 34} width={size * 4} height={size / 3} fill={INK} opacity={0.7 - i * 0.07} />
      ))}
    </Plane>
  );
}

export function ColorPlane() {
  return (
    <Plane>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={56 + i * 62} y="90" width="52" height="150" fill={INK} opacity={0.06 + i * 0.115} />
      ))}
      <rect x="56" y="268" width="52" height="82" fill={ACCENT} />
      <rect x="126" y="268" width="52" height="82" fill={ACCENT} opacity="0.55" />
      <rect x="196" y="268" width="52" height="82" fill={ACCENT} opacity="0.22" />
      <rect x="300" y="268" width="220" height="6" fill={MUTED} opacity="0.5" />
      <rect x="300" y="288" width="150" height="6" fill={MUTED} opacity="0.3" />
    </Plane>
  );
}

export function ComponentPlane() {
  return (
    <Plane>
      <rect x="56" y="48" width="608" height="1" fill={RULE} />
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <rect x="56" y={82 + i * 62} width={190 + i * 40} height="8" fill={INK} opacity="0.62" />
          <rect x="440" y={82 + i * 62} width="70" height="8" fill={MUTED} opacity="0.4" />
          <rect x="560" y={78 + i * 62} width="104" height="26" fill={i === 0 ? ACCENT : INK} opacity={i === 0 ? 1 : 0.1} />
          <line x1="56" y1={122 + i * 62} x2="664" y2={122 + i * 62} stroke={RULE} />
        </g>
      ))}
      <rect x="56" y="352" width="240" height="34" fill={INK} opacity="0.08" />
      <rect x="70" y="364" width="120" height="8" fill={MUTED} opacity="0.5" />
    </Plane>
  );
}

export function InteractionPlane() {
  return (
    <Plane>
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <rect
            x="48"
            y={70 + i * 62}
            width={i === 1 ? 630 : 400}
            height="44"
            fill="none"
            stroke={i === 1 ? ACCENT : INK}
            strokeWidth={i === 1 ? "2" : "1"}
            strokeDasharray={i === 1 ? "0" : "3 4"}
            opacity={i === 1 ? 1 : 0.35}
          />
          <text
            x="58"
            y={98 + i * 62}
            fill={MUTED}
            fontSize="11"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1.6"
          >
            {["TAB 1", "FOCUS", "TAB 2", "TAB 3"][i]}
          </text>
        </g>
      ))}
      <rect x="48" y="336" width="88" height="44" fill={INK} opacity="0.1" />
      <rect x="60" y="348" width="64" height="20" fill={INK} opacity="0.28" />
      <text x="150" y="364" fill={MUTED} fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="1.6">
        44 × 44 MIN TARGET
      </text>
    </Plane>
  );
}

export function MotionPlane() {
  return (
    <Plane>
      <path
        d="M 56 366 C 200 366 260 90 664 90"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
      />
      <line x1="56" y1="366" x2="664" y2="366" stroke={RULE} />
      <line x1="56" y1="90" x2="664" y2="90" stroke={RULE} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const t = i / 7;
        const y = q(366 - (1 - Math.pow(1 - t, 3)) * 276);
        return <circle key={i} cx={q(56 + t * 608)} cy={y} r="4" fill={INK} opacity={q(0.2 + t * 0.7)} />;
      })}
      {["180", "260", "340", "520"].map((ms, i) => (
        <text
          key={ms}
          x={80 + i * 150}
          y="410"
          fill={MUTED}
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          letterSpacing="1.6"
        >
          {ms}MS
        </text>
      ))}
    </Plane>
  );
}

export const CRAFT_PLANES = [
  GridPlane,
  TypePlane,
  ColorPlane,
  ComponentPlane,
  InteractionPlane,
  MotionPlane,
];
