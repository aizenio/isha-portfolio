import {
  ACCENT,
  Divider,
  Frame,
  INK,
  Label,
  Meter,
  MONO,
  MUTED,
  Num,
  Panel,
  PhoneAndroid,
  PhoneIOS,
  Pill,
  RAISED,
  RULE,
  SOFT,
  T,
} from "../chrome";
import { q, seeded } from "../scene-utils";

/**
 * Monsoon — the mobile product.
 *
 * The deliverable was the interface for both platforms, so the screens are
 * drawn twice: an iPhone build with a large title and a tab bar, and an Android
 * build with a Material top bar, a floating action button and a navigation bar.
 * The content is identical on purpose — only the platform grammar changes.
 */

/* -------------------------------------------------------------------------- */
/*  Screens — written once, drawn inside either device                        */
/* -------------------------------------------------------------------------- */

/** Home: the runway, and the two things that would move it. */
function RunwayScreen({ w, android = false }: { w: number; android?: boolean }) {
  const pad = 18;
  const top = android ? 46 : 34;
  return (
    <g>
      {android ? (
        <>
          <T x={pad} y={22} size={15} weight={600}>
            Monsoon
          </T>
          <circle cx={w - 30} cy={22} r="11" fill={INK} opacity="0.08" />
          <T x={w - 30} y={22} size={10} anchor="middle" fill={SOFT}>
            IS
          </T>
        </>
      ) : (
        <>
          <T x={pad} y={16} size={11} fill={MUTED}>
            Tuesday, 4 March
          </T>
          <T x={pad} y={38} size={22} weight={700}>
            Runway
          </T>
        </>
      )}

      <T x={pad} y={top + 34} size={11.5} fill={MUTED}>
        You are safe for
      </T>
      <T x={pad} y={top + 76} size={46} weight={700} fill={INK}>
        38 days
      </T>
      <T x={pad} y={top + 110} size={12.5} fill={SOFT}>
        until 11 April, at your current rate
      </T>
      <Meter x={pad} y={top + 130} w={w - pad * 2} pct={0.62} tone="accent" h={8} />
      <T x={pad} y={top + 154} size={10} fill={MUTED} family={MONO}>
        ₹86,400 in hand · ₹2,270 a day
      </T>

      <Divider x1={pad} y={top + 176} x2={w - pad} />
      <Label x={pad} y={top + 196}>
        What would move this
      </Label>
      {[
        { title: "Ravi Design invoice", meta: "₹48,000 · 6 days late", delta: "+21 days" },
        { title: "Studio rent", meta: "₹22,000 · due 12 Mar", delta: "−10 days" },
      ].map((row, i) => (
        <g key={row.title}>
          <T x={pad} y={top + 226 + i * 46} size={13} weight={500}>
            {row.title}
          </T>
          <T x={pad} y={top + 244 + i * 46} size={10.5} fill={MUTED}>
            {row.meta}
          </T>
          <Num x={w - pad} y={top + 232 + i * 46} size={12} anchor="end" fill={i === 0 ? ACCENT : SOFT}>
            {row.delta}
          </Num>
          <Divider x1={pad} y={top + 258 + i * 46} x2={w - pad} soft />
        </g>
      ))}

      {android ? (
        <>
          <circle cx={w - 46} cy={352} r="26" fill={ACCENT} />
          <path d={`M ${w - 46} 340 v 24 M ${w - 58} 352 h 24`} stroke={RAISED} strokeWidth="2.4" strokeLinecap="round" />
          <Divider x1={0} y={396} x2={w} />
          {["Home", "Money", "Plan"].map((tab, i) => (
            <g key={tab}>
              {i === 0 && <rect x={q(w / 6 + i * (w / 3) - 26)} y={410} width="52" height="22" rx="11" fill={ACCENT} opacity="0.16" />}
              <circle cx={q(w / 6 + i * (w / 3))} cy={421} r="4" fill={i === 0 ? ACCENT : MUTED} opacity={i === 0 ? 1 : 0.7} />
              <T x={q(w / 6 + i * (w / 3))} y={442} size={9.5} anchor="middle" fill={i === 0 ? INK : MUTED}>
                {tab}
              </T>
            </g>
          ))}
        </>
      ) : (
        <>
          <rect x={pad} y={356} width={w - pad * 2} height="44" rx="12" fill={ACCENT} />
          <T x={q(w / 2)} y={378} size={13} weight={600} anchor="middle" fill={RAISED}>
            Log a payment
          </T>
          <Divider x1={0} y={414} x2={w} />
          {["Home", "Money", "Plan", "You"].map((tab, i) => (
            <g key={tab}>
              <circle cx={q(w / 8 + i * (w / 4))} cy={432} r="3.6" fill={i === 0 ? ACCENT : MUTED} opacity={i === 0 ? 1 : 0.7} />
              <T x={q(w / 8 + i * (w / 4))} y={450} size={9} anchor="middle" fill={i === 0 ? ACCENT : MUTED}>
                {tab}
              </T>
            </g>
          ))}
        </>
      )}
    </g>
  );
}

/** Entry: an amount, a payer, a date — three taps and done. */
function EntryScreen({ w, android = false }: { w: number; android?: boolean }) {
  const pad = 18;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
  return (
    <g>
      {android ? (
        <>
          <T x={pad + 26} y={22} size={15} weight={600}>
            Log a payment
          </T>
          <path d={`M ${pad + 10} 16 l -8 6 l 8 6`} fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : (
        <>
          <T x={pad} y={18} size={12.5} fill={ACCENT}>
            Cancel
          </T>
          <T x={q(w / 2)} y={18} size={13} weight={600} anchor="middle">
            Log a payment
          </T>
        </>
      )}

      <T x={pad} y={70} size={11} fill={MUTED}>
        Amount received
      </T>
      <T x={pad} y={106} size={38} weight={700}>
        ₹48,000
      </T>
      <rect x={pad + 122} y={86} width="2" height="30" fill={ACCENT} />
      <Divider x1={pad} y={132} x2={w - pad} />

      {[
        { k: "From", v: "Ravi Design" },
        { k: "Date", v: "Today, 4 March" },
        { k: "Category", v: "Client payment" },
      ].map((row, i) => (
        <g key={row.k}>
          <T x={pad} y={158 + i * 38} size={11.5} fill={MUTED}>
            {row.k}
          </T>
          <T x={w - pad} y={158 + i * 38} size={12.5} anchor="end" weight={500}>
            {row.v}
          </T>
          <Divider x1={pad} y={176 + i * 38} x2={w - pad} soft />
        </g>
      ))}

      {/* keypad, entirely inside the thumb arc */}
      {keys.map((key, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const kw = (w - pad * 2 - 16) / 3;
        const x = pad + col * (kw + 8);
        const y = 262 + row * 36;
        return (
          <g key={key}>
            {android && <rect x={x} y={y} width={kw} height="30" rx="15" fill={INK} opacity="0.05" />}
            <T x={q(x + kw / 2)} y={q(y + 15)} size={15} anchor="middle" weight={500} fill={key === "⌫" ? MUTED : INK}>
              {key}
            </T>
          </g>
        );
      })}

      {android ? (
        <>
          <rect x={pad} y={434} width={w - pad * 2} height="1" fill={RULE} />
          <circle cx={w - 46} cy={412} r="26" fill={ACCENT} />
          <path d={`M ${w - 56} 412 l 7 8 l 14 -16`} fill="none" stroke={RAISED} strokeWidth="2.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x={pad} y={412} width={w - pad * 2} height="44" rx="12" fill={ACCENT} />
          <T x={q(w / 2)} y={434} size={13} weight={600} anchor="middle" fill={RAISED}>
            Save · runway +21 days
          </T>
        </>
      )}
    </g>
  );
}

/** The answer: the number moved, and why. */
function ResultScreen({ w, android = false }: { w: number; android?: boolean }) {
  const pad = 18;
  const top = android ? 44 : 34;
  return (
    <g>
      {android ? (
        <T x={pad} y={22} size={15} weight={600}>
          Monsoon
        </T>
      ) : (
        <T x={pad} y={24} size={22} weight={700}>
          Runway
        </T>
      )}
      <T x={pad} y={top + 30} size={11.5} fill={MUTED}>
        You are safe for
      </T>
      <T x={pad} y={top + 72} size={46} weight={700} fill={ACCENT}>
        59 days
      </T>
      <Pill x={pad} y={top + 96} label="+21 days" tone="accent" />
      <T x={pad} y={top + 138} size={12.5} fill={SOFT}>
        until 2 May, at your current rate
      </T>
      <Meter x={pad} y={top + 158} w={w - pad * 2} pct={0.86} tone="accent" h={8} />

      <Divider x1={pad} y={top + 190} x2={w - pad} />
      <Label x={pad} y={top + 202}>
        This month
      </Label>
      {(() => {
        const rand = seeded(618);
        return Array.from({ length: 14 }, (_, i) => {
          const h = q(14 + rand() * 44);
          return (
            <rect
              key={i}
              x={q(pad + i * ((w - pad * 2) / 14))}
              y={q(top + 284 - h)}
              width={q((w - pad * 2) / 14 - 5)}
              height={h}
              rx="2"
              fill={i === 9 ? ACCENT : INK}
              opacity={i === 9 ? 1 : 0.18}
            />
          );
        });
      })()}
      <T x={pad} y={top + 300} size={10} fill={MUTED} family={MONO}>
        In ₹1.4L · out ₹68k · 9 days to next payment
      </T>

      <Divider x1={pad} y={top + 318} x2={w - pad} soft />
      <T x={pad} y={top + 340} size={11.5} fill={SOFT}>
        One invoice still unpaid · +14 days
      </T>

      {android ? (
        <>
          <Divider x1={0} y={396} x2={w} />
          {["Home", "Money", "Plan"].map((tab, i) => (
            <g key={tab}>
              <circle cx={q(w / 6 + i * (w / 3))} cy={421} r="4" fill={i === 0 ? ACCENT : MUTED} opacity={i === 0 ? 1 : 0.7} />
              <T x={q(w / 6 + i * (w / 3))} y={442} size={9.5} anchor="middle" fill={i === 0 ? INK : MUTED}>
                {tab}
              </T>
            </g>
          ))}
        </>
      ) : (
        <>
          <Divider x1={0} y={414} x2={w} />
          {["Home", "Money", "Plan", "You"].map((tab, i) => (
            <g key={tab}>
              <circle cx={q(w / 8 + i * (w / 4))} cy={432} r="3.6" fill={i === 0 ? ACCENT : MUTED} opacity={i === 0 ? 1 : 0.7} />
              <T x={q(w / 8 + i * (w / 4))} y={450} size={9} anchor="middle" fill={i === 0 ? ACCENT : MUTED}>
                {tab}
              </T>
            </g>
          ))}
        </>
      )}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Plates                                                                    */
/* -------------------------------------------------------------------------- */

const PW = 240;
const PH = 520;
const PY = 176;

/** The Android build: Material top bar, FAB, navigation bar. */
export function MonsoonAndroid() {
  const screens = [RunwayScreen, EntryScreen, ResultScreen];
  const captions = ["Runway — home", "Log a payment", "After the payment lands"];
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="var(--paper)" />
      <Label x={72} y={62}>
        Monsoon · Android 15 · Material 3
      </Label>
      <T x={72} y={104} size={24} weight={600}>
        Same answer, spoken in the platform&apos;s own grammar.
      </T>
      <Divider x1={72} y={140} x2={1128} />
      {screens.map((Screen, i) => {
        const x = 148 + i * 316;
        return (
          <g key={captions[i]}>
            <PhoneAndroid x={x} y={PY} w={PW} h={PH}>
              <Screen w={PW - 2} android />
            </PhoneAndroid>
            <T x={x} y={PY + PH + 30} size={12} fill={SOFT}>
              {captions[i]}
            </T>
            <Num x={x + PW} y={PY + PH + 30} size={11} fill={MUTED} anchor="end">
              {`0${i + 1}`}
            </Num>
          </g>
        );
      })}
    </Frame>
  );
}

/** The same screen, twice, with every deliberate divergence named. */
export function MonsoonParity() {
  const w = 252;
  const h = 546;
  const y = 156;
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="var(--paper)" />
      <Label x={72} y={58}>
        Platform parity · one screen, two builds
      </Label>
      <T x={72} y={98} size={22} weight={600}>
        Identical content. Different grammar.
      </T>
      <Divider x1={72} y={130} x2={1128} />

      <T x={96} y={y - 12} size={11.5} fill={MUTED} family={MONO}>
        iOS
      </T>
      <PhoneIOS x={96} y={y} w={w} h={h}>
        <RunwayScreen w={w - 2} />
      </PhoneIOS>

      <T x={420} y={y - 12} size={11.5} fill={MUTED} family={MONO}>
        Android
      </T>
      <PhoneAndroid x={420} y={y} w={w} h={h}>
        <RunwayScreen w={w - 2} android />
      </PhoneAndroid>

      {/* what changes, and why */}
      <line x1="740" y1="140" x2="740" y2="712" stroke={RULE} />
      <Label x={780} y={166}>
        Deliberate divergence
      </Label>
      {[
        {
          k: "Primary action",
          ios: "Full-width button above the tab bar",
          android: "Floating action button, bottom right",
        },
        {
          k: "Navigation",
          ios: "Four tabs, labels always visible",
          android: "Three destinations, active pill",
        },
        { k: "Title", ios: "Large title, collapses on scroll", android: "Top app bar, fixed" },
        { k: "Back", ios: "Cancel, top left · edge swipe", android: "System back · predictive" },
        { k: "Confirmation", ios: "Haptic + inline update", android: "Haptic + snackbar undo" },
        { k: "Type", ios: "Dynamic Type to 200%", android: "Font scale to 200%" },
      ].map((row, i) => {
        const ry = 206 + i * 82;
        return (
          <g key={row.k}>
            <T x={780} y={ry} size={12.5} weight={600}>
              {row.k}
            </T>
            <T x={780} y={ry + 22} size={11.5} fill={SOFT}>
              {`iOS — ${row.ios}`}
            </T>
            <T x={780} y={ry + 42} size={11.5} fill={SOFT}>
              {`Android — ${row.android}`}
            </T>
            <Divider x1={780} y={ry + 58} x2={1128} soft />
          </g>
        );
      })}
      <T x={780} y={700} size={11.5} fill={MUTED}>
        Everything else — copy, order, spacing, the number itself — is shared.
      </T>
    </Frame>
  );
}

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
