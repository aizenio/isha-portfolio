import { ACCENT, Divider, Frame, INK, Label, MONO, MUTED, Num, Panel, SOFT, T } from "../chrome";
import { q } from "../scene-utils";

/**
 * Zane Atlas — the drawn plates.
 *
 * The site itself is shown as real screenshots captured from zaneatlas.com;
 * what is drawn here is the work around it — the message audit that produced
 * the positioning, and the system sheet, set in the product's own palette
 * rather than the portfolio's.
 */

/** The research artefact: eleven first screens, coded by claim. */
export function AtlasAudit() {
  const rows = [
    { claim: "“Digital solutions for modern business”", n: 4, same: true },
    { claim: "“We build beautiful, bespoke websites”", n: 3, same: true },
    { claim: "“Your partner in digital transformation”", n: 2, same: true },
    { claim: "“Award-winning creative studio”", n: 1, same: true },
    { claim: "“We replace three tools and a VA”", n: 1, same: false },
  ];
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="var(--paper)" />
      <Panel x={56} y={40} w={1088} h={670} r={10} />
      <Label x={88} y={78}>
        Message audit · 11 agency homepages · first screen only
      </Label>
      <T x={88} y={120} size={26} weight={600}>
        Ten of eleven said the same sentence.
      </T>
      <Divider x1={88} y={156} x2={1112} />

      {/* the coded claims */}
      <Label x={88} y={186}>
        Claim on the first screen
      </Label>
      <Label x={760} y={186}>
        Sites
      </Label>
      <Label x={900} y={186}>
        Recalled in 5s test
      </Label>
      {rows.map((row, i) => {
        const y = 224 + i * 52;
        return (
          <g key={row.claim}>
            <T x={88} y={y} size={14} fill={row.same ? SOFT : INK} weight={row.same ? 400 : 600}>
              {row.claim}
            </T>
            <Num x={772} y={y} size={13} fill={SOFT} anchor="end">
              {String(row.n)}
            </Num>
            <rect x={900} y={y - 5} width={row.same ? q(row.n * 14) : 168} height="10" rx="5" fill={row.same ? INK : ACCENT} opacity={row.same ? 0.16 : 1} />
            <Divider x1={88} y={y + 24} x2={1112} soft />
          </g>
        );
      })}

      {/* what the five-second test returned */}
      <Divider x1={88} y={512} x2={1112} />
      <Label x={88} y={542}>
        Five-second test · n = 40 · “What do they sell?”
      </Label>
      {[
        { answer: "“Websites”", n: 31 },
        { answer: "“Not sure”", n: 6 },
        { answer: "“Software / automation”", n: 3 },
      ].map((row, i) => (
        <g key={row.answer}>
          <T x={88} y={588 + i * 34} size={13} fill={SOFT}>
            {row.answer}
          </T>
          <rect x={320} y={580 + i * 34} width={q(row.n * 9.6)} height="16" rx="3" fill={i === 2 ? ACCENT : INK} opacity={i === 2 ? 1 : 0.2} />
          <Num x={q(332 + row.n * 9.6)} y={588 + i * 34} size={12} fill={MUTED}>
            {`${row.n} of 40`}
          </Num>
        </g>
      ))}
      <T x={760} y={588} size={13} fill={SOFT}>
        The distinguishing half of the business —
      </T>
      <T x={760} y={610} size={13} fill={SOFT}>
        automation, internal software, the fact
      </T>
      <T x={760} y={632} size={13} fill={SOFT}>
        that it arrives as one system — never
      </T>
      <T x={760} y={654} size={13} fill={SOFT}>
        reached the first impression.
      </T>
    </Frame>
  );
}

/**
 * The system sheet, in the product's own palette.
 *
 * This is the one plate in the case study that shows the site's design system
 * rather than the site, so it is painted in the real tokens — the near-black
 * ground, the four text opacities, the mint that marks an action and the blue
 * and amber that mark a category — not in the portfolio's.
 */
const BG = "#08090B";
const CARD = "#101215";
const LINE = "rgba(255,255,255,0.10)";
const W100 = "#FFFFFF";
const W65 = "rgba(255,255,255,0.65)";
const W40 = "rgba(255,255,255,0.40)";
const MINT = "#7CF5D0";
const BLUE = "#5B8CFF";
const AMBER = "#F59E0B";

export function AtlasSystem() {
  const type = [
    { name: "Display", spec: "Inter 600 · 58/61 · −1.45px", size: 26 },
    { name: "Heading", spec: "Inter 600 · 44/48", size: 20 },
    { name: "Subhead", spec: "Inter 600 · 24/32", size: 15 },
    { name: "Body", spec: "Inter 400 · 17/28", size: 12.5 },
    { name: "Small", spec: "Inter 400 · 15/24", size: 11 },
    { name: "Label", spec: "JetBrains Mono · 14 · +8%", size: 10 },
  ];
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill={BG} />
      <circle cx="72" cy="62" r="4" fill={MINT} />
      <T x={88} y={62} size={11} fill={W65} family={MONO} tracking={1.2}>
        DESIGN SYSTEM
      </T>
      <T x={72} y={106} size={26} weight={600} fill={W100}>
        Inter, JetBrains Mono, and one mint.
      </T>
      <line x1="72" y1="142" x2="1128" y2="142" stroke={LINE} />

      {/* type specimen */}
      <T x={72} y={172} size={10.5} fill={W40} family={MONO} tracking={1.2}>
        TYPE
      </T>
      {type.map((step, i) => (
        <g key={step.name}>
          <T x={72} y={206 + i * 44} size={step.size} weight={i < 3 ? 600 : 400} fill={i < 3 ? W100 : W65}>
            Engineered systems
          </T>
          <T x={392} y={206 + i * 44} size={10.5} fill={W40} family={MONO}>
            {step.name}
          </T>
          <T x={472} y={206 + i * 44} size={10.5} fill={W40} family={MONO}>
            {step.spec}
          </T>
          <line x1="72" y1={226 + i * 44} x2="676" y2={226 + i * 44} stroke={LINE} />
        </g>
      ))}

      {/* colour */}
      <line x1="716" y1="156" x2="716" y2="500" stroke={LINE} />
      <T x={752} y={172} size={10.5} fill={W40} family={MONO} tracking={1.2}>
        COLOUR
      </T>
      {[
        { hex: "#08090B", name: "Ground", fill: BG, stroke: LINE },
        { hex: "#101215", name: "Card", fill: CARD, stroke: LINE },
        { hex: "#7CF5D0", name: "Action", fill: MINT },
        { hex: "#5B8CFF", name: "Automation", fill: BLUE },
        { hex: "#F59E0B", name: "Engineering", fill: AMBER },
      ].map((swatch, i) => (
        <g key={swatch.hex}>
          <rect x={752} y={200 + i * 54} width="44" height="40" rx="8" fill={swatch.fill} stroke={swatch.stroke ?? "none"} />
          <T x={812} y={214 + i * 54} size={12.5} fill={W100} weight={500}>
            {swatch.name}
          </T>
          <T x={812} y={232 + i * 54} size={10.5} fill={W40} family={MONO}>
            {swatch.hex}
          </T>
        </g>
      ))}
      <T x={984} y={214} size={11.5} fill={W65}>
        Text is one colour at four
      </T>
      <T x={984} y={234} size={11.5} fill={W65}>
        opacities — 100, 65, 55, 40 —
      </T>
      <T x={984} y={254} size={11.5} fill={W65}>
        so hierarchy survives on a
      </T>
      <T x={984} y={274} size={11.5} fill={W65}>
        ground this dark.
      </T>
      {[100, 65, 55, 40].map((step, i) => (
        <g key={step}>
          <rect x={984 + i * 38} y={306} width="30" height="30" rx="6" fill={W100} opacity={step / 100} />
          <T x={984 + i * 38} y={352} size={9.5} fill={W40} family={MONO}>
            {String(step)}
          </T>
        </g>
      ))}

      {/* components */}
      <line x1="72" y1="524" x2="1128" y2="524" stroke={LINE} />
      <T x={72} y={554} size={10.5} fill={W40} family={MONO} tracking={1.2}>
        COMPONENTS
      </T>
      <rect x={72} y={582} width="188" height="44" rx="22" fill={W100} />
      <T x={166} y={604} size={13} weight={600} fill={BG} anchor="middle">
        Get a Free Digital Audit
      </T>
      <rect x={280} y={582} width="152" height="44" rx="22" fill="none" stroke={LINE} />
      <T x={356} y={604} size={13} weight={500} fill={W100} anchor="middle">
        See What We Build
      </T>
      <rect x={456} y={582} width="196" height="44" rx="10" fill={CARD} stroke={LINE} />
      <circle cx={480} cy={604} r="4" fill={MINT} />
      <T x={496} y={604} size={11} fill={W65} family={MONO}>
        WEBSITES IN 2–3 WEEKS
      </T>
      <rect x={676} y={582} width="200" height="44" rx="10" fill={CARD} stroke={LINE} />
      <rect x={694} y={594} width="20" height="20" rx="6" fill={BLUE} opacity="0.22" />
      <T x={726} y={604} size={12} fill={W100} weight={500}>
        Service card
      </T>
      <rect x={900} y={582} width="228" height="44" rx="10" fill={CARD} stroke={LINE} />
      <T x={918} y={604} size={11.5} fill={W65}>
        Quoted per project · fixed scope
      </T>
      <T x={72} y={672} size={11.5} fill={W40}>
        Nine components. Every state documented. Nothing on the page that does not answer an objection.
      </T>
    </Frame>
  );
}
