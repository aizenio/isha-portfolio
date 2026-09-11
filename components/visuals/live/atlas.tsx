import { Bar, Board, Eyebrow, Heading, Rule, Text, u } from "./kit";

/**
 * Zane Atlas — the two boards that are not the site itself.
 *
 * The site is shown as real captures. These are the work around it: the
 * message audit that produced the positioning, and the system sheet, which is
 * painted in the product's own tokens rather than the portfolio's because it
 * is describing that product's palette.
 */

/* ── The message audit ─────────────────────────────────────────────────── */

export function AuditBoard() {
  const claims = [
    { claim: "“Digital solutions for modern business”", n: 4, same: true },
    { claim: "“We build beautiful, bespoke websites”", n: 3, same: true },
    { claim: "“Your partner in digital transformation”", n: 2, same: true },
    { claim: "“Award-winning creative studio”", n: 1, same: true },
    { claim: "“We replace three tools and a VA”", n: 1, same: false },
  ];
  const recall = [
    { answer: "“Websites”", n: 31 },
    { answer: "“Not sure”", n: 6 },
    { answer: "“Software / automation”", n: 3, key: true },
  ];

  return (
    <Board>
      <Eyebrow>Message audit · 11 agency homepages · first screen only</Eyebrow>
      <Heading size={27}>Ten of eleven said the same sentence.</Heading>
      <Rule style={{ marginTop: u(18) }} />

      <div style={{ display: "flex", gap: u(16), padding: `${u(14)} 0 ${u(4)}` }}>
        <span style={{ flex: 1 }}>
          <Eyebrow>Claim on the first screen</Eyebrow>
        </span>
        <span style={{ width: u(70), textAlign: "right" }}>
          <Eyebrow>Sites</Eyebrow>
        </span>
        <span style={{ width: u(230) }}>
          <Eyebrow>Recalled in the 5s test</Eyebrow>
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {claims.map((row) => (
          <div
            key={row.claim}
            style={{
              display: "flex",
              alignItems: "center",
              gap: u(16),
              padding: `${u(10)} 0`,
              borderBottom: "1px solid var(--rule-soft)",
            }}
          >
            <Text
              size={14}
              color={row.same ? "var(--ink-soft)" : "var(--ink)"}
              weight={row.same ? 400 : 600}
              style={{ flex: 1 }}
            >
              {row.claim}
            </Text>
            <Text size={12.5} mono color="var(--ink-muted)" style={{ width: u(70), textAlign: "right" }}>
              {row.n}
            </Text>
            <span style={{ width: u(230) }}>
              <Bar
                fill={row.same ? row.n / 11 : 1}
                height={10}
                tone={row.same ? "color-mix(in srgb, var(--ink) 22%, transparent)" : "var(--accent)"}
                track="color-mix(in srgb, var(--ink) 6%, transparent)"
              />
            </span>
          </div>
        ))}
      </div>

      <Rule style={{ marginTop: u(14) }} />
      <div style={{ display: "flex", gap: u(40), paddingTop: u(16) }}>
        <div style={{ flex: 1 }}>
          <Eyebrow>Five-second test · n = 40 · “What do they sell?”</Eyebrow>
          <div style={{ paddingTop: u(12) }}>
            {recall.map((row) => (
              <div
                key={row.answer}
                style={{ display: "flex", alignItems: "center", gap: u(14), padding: `${u(6)} 0` }}
              >
                <Text size={13} style={{ width: u(170) }}>
                  {row.answer}
                </Text>
                <span style={{ flex: 1 }}>
                  <Bar
                    fill={row.n / 40}
                    height={14}
                    tone={row.key ? "var(--accent)" : "color-mix(in srgb, var(--ink) 22%, transparent)"}
                    track="color-mix(in srgb, var(--ink) 6%, transparent)"
                  />
                </span>
                <Text size={12} mono color="var(--ink-muted)" style={{ width: u(70) }}>
                  {row.n} of 40
                </Text>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: u(330) }}>
          <Text size={13} style={{ display: "block" }}>
            The distinguishing half of the business — automation, internal software, the fact that it
            arrives as one system — never reached the first impression.
          </Text>
        </div>
      </div>
    </Board>
  );
}

/* ── The system sheet, in the site's own palette ───────────────────────── */

const BG = "#08090B";
const CARD = "#101215";
const LINE = "rgba(255,255,255,0.10)";
const W100 = "#FFFFFF";
const W65 = "rgba(255,255,255,0.65)";
const W40 = "rgba(255,255,255,0.40)";
const MINT = "#7CF5D0";
const BLUE = "#5B8CFF";
const AMBER = "#F59E0B";
const MONO = "var(--font-mono), ui-monospace, monospace";

export function AtlasSystemBoard() {
  const type = [
    { name: "Display", spec: "Inter 600 · 58/61 · −1.45px", size: 26 },
    { name: "Heading", spec: "Inter 600 · 44/48", size: 20 },
    { name: "Subhead", spec: "Inter 600 · 24/32", size: 15 },
    { name: "Body", spec: "Inter 400 · 17/28", size: 13 },
    { name: "Label", spec: "JetBrains Mono · 14 · +8%", size: 10.5 },
  ];
  const swatches = [
    { hex: "#08090B", name: "Ground", tone: BG, border: true },
    { hex: "#101215", name: "Card", tone: CARD, border: true },
    { hex: "#7CF5D0", name: "Action", tone: MINT },
    { hex: "#5B8CFF", name: "Automation", tone: BLUE },
    { hex: "#F59E0B", name: "Engineering", tone: AMBER },
  ];

  return (
    <Board tone="product" background={BG} border={LINE} color={W100}>
      <div style={{ display: "flex", alignItems: "center", gap: u(8) }}>
        <span style={{ width: u(7), height: u(7), borderRadius: "50%", background: MINT }} />
        <span style={{ fontFamily: MONO, fontSize: u(11), letterSpacing: u(1.5), color: W65 }}>
          DESIGN SYSTEM
        </span>
      </div>
      <div style={{ fontSize: u(26), fontWeight: 600, paddingTop: u(10), letterSpacing: u(-0.5) }}>
        Inter, JetBrains Mono, and one mint.
      </div>
      <div style={{ borderTop: `1px solid ${LINE}`, margin: `${u(16)} 0` }} />

      <div style={{ display: "flex", gap: u(34), flex: 1, minHeight: 0 }}>
        {/* type specimen */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: MONO, fontSize: u(10.5), letterSpacing: u(1.4), color: W40 }}>TYPE</span>
          <div style={{ paddingTop: u(10) }}>
            {type.map((step) => (
              <div
                key={step.name}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: u(16),
                  padding: `${u(7)} 0`,
                  borderBottom: `1px solid ${LINE}`,
                }}
              >
                <span style={{ fontSize: u(step.size), fontWeight: step.size > 14 ? 600 : 400 }}>
                  Engineered systems
                </span>
                <span style={{ display: "flex", gap: u(14), whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: MONO, fontSize: u(10.5), color: W40 }}>{step.name}</span>
                  <span style={{ fontFamily: MONO, fontSize: u(10.5), color: W40, width: u(170) }}>
                    {step.spec}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* colour */}
        <div style={{ width: u(420), borderLeft: `1px solid ${LINE}`, paddingLeft: u(26) }}>
          <span style={{ fontFamily: MONO, fontSize: u(10.5), letterSpacing: u(1.4), color: W40 }}>COLOUR</span>
          <div style={{ paddingTop: u(10) }}>
            {swatches.map((swatch) => (
              <div key={swatch.hex} style={{ display: "flex", alignItems: "center", gap: u(12), padding: `${u(5)} 0` }}>
                <span
                  style={{
                    width: u(44),
                    height: u(30),
                    borderRadius: u(7),
                    background: swatch.tone,
                    border: swatch.border ? `1px solid ${LINE}` : "none",
                  }}
                />
                <span style={{ flex: 1, fontSize: u(12.5), fontWeight: 500 }}>{swatch.name}</span>
                <span style={{ fontFamily: MONO, fontSize: u(10.5), color: W40 }}>{swatch.hex}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: u(11.5), color: W65, lineHeight: 1.5, paddingTop: u(12) }}>
            Text is one colour at four opacities — 100, 65, 55, 40 — so hierarchy survives on a ground
            this dark.
          </div>
          <div style={{ display: "flex", gap: u(8), paddingTop: u(10) }}>
            {[100, 65, 55, 40].map((step) => (
              <div key={step} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: u(38),
                    height: u(26),
                    borderRadius: u(6),
                    background: W100,
                    opacity: step / 100,
                  }}
                />
                <span style={{ fontFamily: MONO, fontSize: u(9.5), color: W40 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* components */}
      <div style={{ borderTop: `1px solid ${LINE}`, marginTop: u(14), paddingTop: u(14) }}>
        <span style={{ fontFamily: MONO, fontSize: u(10.5), letterSpacing: u(1.4), color: W40 }}>COMPONENTS</span>
        <div style={{ display: "flex", alignItems: "center", gap: u(12), paddingTop: u(12) }}>
          <span
            style={{
              background: W100,
              color: BG,
              borderRadius: u(999),
              padding: `${u(11)} ${u(20)}`,
              fontSize: u(12.5),
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Get a Free Digital Audit
          </span>
          <span
            style={{
              border: `1px solid ${LINE}`,
              borderRadius: u(999),
              padding: `${u(11)} ${u(20)}`,
              fontSize: u(12.5),
              whiteSpace: "nowrap",
            }}
          >
            See What We Build
          </span>
          <span
            style={{
              background: CARD,
              border: `1px solid ${LINE}`,
              borderRadius: u(10),
              padding: `${u(10)} ${u(14)}`,
              fontFamily: MONO,
              fontSize: u(11),
              color: W65,
              display: "flex",
              alignItems: "center",
              gap: u(8),
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ width: u(7), height: u(7), borderRadius: "50%", background: MINT }} />
            WEBSITES IN 2–3 WEEKS
          </span>
          <span
            style={{
              background: CARD,
              border: `1px solid ${LINE}`,
              borderRadius: u(10),
              padding: `${u(10)} ${u(14)}`,
              fontSize: u(12),
              color: W65,
              whiteSpace: "nowrap",
            }}
          >
            Quoted per project · fixed scope
          </span>
        </div>
        <div style={{ fontSize: u(11.5), color: W40, paddingTop: u(12) }}>
          Nine components. Every state documented. Nothing on the page that does not answer an objection.
        </div>
      </div>
    </Board>
  );
}
