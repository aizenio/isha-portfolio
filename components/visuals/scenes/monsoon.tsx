import { ACCENT, Divider, Frame, INK, Label, Meter, MONO, MUTED, Panel, PhoneIOS, RULE, SOFT, T } from "../chrome";
import { q, seeded } from "../scene-utils";

/**
 * Monsoon — the drawn plates.
 *
 * Both builds are shown as captures now: iOS from the simulator, Android and
 * the parity sheet composed from the same design tokens. What stays drawn is
 * the work around them — the diary study, and the system sheet whose subject
 * is the rules themselves rather than any one screen.
 */

/** The diary study, plotted: when a money decision actually happens. */
export function MonsoonResearch() {
  const rand = seeded(917);
  const plotL = 300;
  const plotW = 600;
  const hourX = (hour: number) => q(plotL + (hour / 25.5) * plotW);
  const points = Array.from({ length: 200 }, () => {
    const night = rand() > 0.31;
    const hour = night ? 21 + rand() * 4.4 : rand() * 21;
    return { x: hourX(hour), y: q(214 + rand() * 260), night, r: rand() > 0.94 ? 4.5 : 2.4 };
  });
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="var(--paper)" />
      <Panel x={56} y={40} w={1088} h={670} r={10} />
      <Label x={88} y={76}>
        Diary study · 22 participants · 6 weeks · 1,411 entries
      </Label>
      <T x={88} y={116} size={24} weight={600}>
        71% of money decisions happen after 9pm, one-handed.
      </T>
      <Divider x1={88} y={154} x2={1112} />

      <rect x={hourX(21)} y="188" width={q((4.4 / 25.5) * plotW)} height="300" fill={ACCENT} opacity="0.1" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.night ? ACCENT : INK} opacity={p.night ? 0.72 : 0.24} />
      ))}
      <Divider x1={plotL} y={500} x2={plotL + plotW} />
      {[0, 6, 12, 18, 24].map((hour) => (
        <T key={hour} x={hourX(hour)} y={518} size={10} fill={MUTED} family={MONO} anchor="middle">
          {`${String(hour).padStart(2, "0")}:00`}
        </T>
      ))}
      <T x={hourX(23)} y={172} size={11} fill={INK} anchor="middle" family={MONO}>
        21:00 – 01:30
      </T>

      {/* the quotes that changed the design */}
      <Label x={88} y={196}>
        What they said
      </Label>
      {[
        "“I just want to know if I'm okay till the 15th.”",
        "“It went red, so I closed it.”",
        "“I already track it. In my notes app.”",
      ].map((quote, i) => (
        <T key={quote} x={88} y={236 + i * 52} size={12.5} fill={SOFT}>
          {quote}
        </T>
      ))}
      <Label x={88} y={412}>
        Grip observed
      </Label>
      {[
        { k: "One hand, thumb only", pct: 0.78 },
        { k: "Two hands", pct: 0.14 },
        { k: "Propped / table", pct: 0.08 },
      ].map((row, i) => (
        <g key={row.k}>
          <T x={88} y={444 + i * 30} size={11.5} fill={SOFT}>
            {row.k}
          </T>
          <Meter x={88} y={456 + i * 30} w={150} pct={row.pct} tone={i === 0 ? "accent" : "ink"} />
        </g>
      ))}

      <Divider x1={88} y={556} x2={1112} />
      <Label x={88} y={584}>
        What it changed
      </Label>
      {[
        { title: "The month became the bug", body: "Budgets assume a salary. Runway does not." },
        { title: "Nothing turns red", body: "Alerts closed the app. The number just recalculates." },
        { title: "Everything within the thumb arc", body: "The top third of the screen is display only." },
      ].map((row, i) => (
        <g key={row.title}>
          <rect x={88 + i * 348} y={606} width="8" height="8" fill={ACCENT} />
          <T x={88 + i * 348} y={634} size={13.5} weight={600}>
            {row.title}
          </T>
          <T x={88 + i * 348} y={658} size={12} fill={SOFT}>
            {row.body}
          </T>
        </g>
      ))}
    </Frame>
  );
}

/** The mobile system: reach, targets, type, and the platform mapping. */
export function MonsoonSystem() {
  const w = 232;
  const h = 494;
  const py = 176;
  const px = 96;
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="var(--paper)" />
      <Label x={72} y={58}>
        Monsoon · mobile system
      </Label>
      <T x={72} y={98} size={22} weight={600}>
        A system that fits in one hand.
      </T>
      <Divider x1={72} y={130} x2={1128} />

      {/* reach map */}
      <PhoneIOS x={px} y={py} w={w} h={h}>
        <rect x="0" y="0" width={w - 2} height={q((h - 52) / 3)} fill={INK} opacity="0.05" />
        <T x={16} y={26} size={11} fill={MUTED}>
          Display only
        </T>
        <line x1="0" y1={q((h - 52) / 3)} x2={w - 2} y2={q((h - 52) / 3)} stroke={RULE} strokeDasharray="4 4" />
        <rect x="0" y={q((h - 52) * 0.45)} width={w - 2} height={q((h - 52) * 0.55)} fill={ACCENT} opacity="0.08" />
        <line x1="0" y1={q((h - 52) * 0.45)} x2={w - 2} y2={q((h - 52) * 0.45)} stroke={ACCENT} strokeDasharray="4 4" opacity="0.6" />
        <T x={16} y={q((h - 52) * 0.45) + 20} size={11} fill={INK}>
          Everything actionable
        </T>
        <rect x={16} y={q(h - 52 - 120)} width={w - 34} height="40" rx="10" fill={INK} opacity="0.08" />
        <rect x={16} y={q(h - 52 - 68)} width={w - 34} height="40" rx="10" fill={ACCENT} />
      </PhoneIOS>
      <path
        d={`M ${q(px + w / 2 - 168)} ${py + h - 28} a 168 168 0 0 1 336 0`}
        fill="none"
        stroke={ACCENT}
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.6"
      />
      <T x={px} y={py + h + 34} size={11} fill={MUTED} family={MONO}>
        Thumb arc · 6.1in · right hand
      </T>

      {/* targets */}
      <line x1="392" y1="150" x2="392" y2="700" stroke={RULE} />
      <Label x={428} y={176}>
        Touch targets
      </Label>
      {[
        { size: 48, label: "48dp", ok: true },
        { size: 40, label: "40dp", ok: false },
        { size: 32, label: "32dp", ok: false },
      ].map((target, i) => (
        <g key={target.label}>
          <rect x={428 + i * 92} y={200} width="62" height="62" rx="6" fill="none" stroke={RULE} strokeDasharray="3 4" />
          <rect
            x={q(428 + i * 92 + (62 - target.size * 1.1) / 2)}
            y={q(200 + (62 - target.size * 1.1) / 2)}
            width={q(target.size * 1.1)}
            height={q(target.size * 1.1)}
            rx="6"
            fill={target.ok ? ACCENT : INK}
            opacity={target.ok ? 1 : 0.2}
          />
          <T x={428 + i * 92} y={282} size={10.5} fill={MUTED} family={MONO}>
            {target.label}
          </T>
          <T x={428 + i * 92} y={300} size={10} fill={target.ok ? INK : MUTED}>
            {target.ok ? "ships" : "rejected"}
          </T>
        </g>
      ))}

      {/* type */}
      <Divider x1={428} y={330} x2={1128} soft />
      <Label x={428} y={356}>
        Type · 100% and 200%
      </Label>
      {[
        { name: "Runway", size: 30, spec: "64pt · 700 · tabular" },
        { name: "Title", size: 17, spec: "22pt · 600" },
        { name: "Body", size: 13, spec: "17pt · 400 · 1.5" },
        { name: "Caption", size: 11, spec: "12pt · mono" },
      ].map((step, i) => (
        <g key={step.name}>
          <T x={428} y={392 + i * 40} size={step.size} weight={i === 0 ? 700 : 400}>
            38 days
          </T>
          <T x={620} y={392 + i * 40} size={10.5} fill={MUTED} family={MONO}>
            {step.name}
          </T>
          <T x={700} y={392 + i * 40} size={10.5} fill={MUTED} family={MONO}>
            {step.spec}
          </T>
          <Divider x1={428} y={410 + i * 40} x2={860} soft />
        </g>
      ))}
      <T x={880} y={392} size={11.5} fill={SOFT}>
        At 200% every screen reflows to a
      </T>
      <T x={880} y={412} size={11.5} fill={SOFT}>
        single column. Nothing truncates and
      </T>
      <T x={880} y={432} size={11.5} fill={SOFT}>
        nothing scrolls sideways.
      </T>
      <T x={880} y={470} size={30} weight={700}>
        38 days
      </T>

      {/* platform mapping */}
      <Divider x1={428} y={566} x2={1128} />
      <Label x={428} y={592}>
        One component, two platforms
      </Label>
      {[
        { k: "Primary action", ios: "Filled button", android: "FAB" },
        { k: "Undo", ios: "Inline revert", android: "Snackbar" },
        { k: "Sheet", ios: "Detent, 280ms", android: "Bottom sheet, 250ms" },
        { k: "Feedback", ios: "Haptic light", android: "Haptic + ripple" },
      ].map((row, i) => (
        <g key={row.k}>
          <T x={428} y={624 + i * 26} size={11.5} fill={SOFT}>
            {row.k}
          </T>
          <T x={720} y={624 + i * 26} size={11.5} weight={500}>
            {row.ios}
          </T>
          <T x={920} y={624 + i * 26} size={11.5} weight={500}>
            {row.android}
          </T>
        </g>
      ))}
      <Label x={720} y={604}>
        iOS
      </Label>
      <Label x={920} y={604}>
        Android
      </Label>
    </Frame>
  );
}
