import { Bar, Board, Eyebrow, Heading, Rule, Text, seeded, u } from "./kit";

/**
 * Monsoon's two research and system boards, built rather than drawn.
 *
 * The numbers are the study's: 1,411 entries over six weeks, 71% of them after
 * 9pm. The scatter is laid out from a seeded generator so the same night
 * cluster appears on the server and in the browser.
 */

/* ── The diary study ───────────────────────────────────────────────────── */

export function ResearchBoard() {
  const rand = seeded(917);
  const points = Array.from({ length: 190 }, () => {
    const night = rand() > 0.31;
    const hour = night ? 21 + rand() * 4.4 : rand() * 21;
    return {
      left: (hour / 25.5) * 100,
      top: rand() * 100,
      size: rand() > 0.94 ? 7 : 4,
      night,
    };
  });

  return (
    <Board>
      <Eyebrow>Diary study · 22 participants · 6 weeks · 1,411 entries</Eyebrow>
      <Heading size={27}>71% of money decisions happen after 9pm, one-handed.</Heading>
      <Rule style={{ marginTop: u(18) }} />

      <div style={{ display: "flex", gap: u(40), paddingTop: u(18), flex: 1, minHeight: 0 }}>
        {/* what they said, and how they held the phone */}
        <div style={{ width: u(300), display: "flex", flexDirection: "column" }}>
          <Eyebrow>What they said</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: u(12), paddingTop: u(12) }}>
            {[
              "“I just want to know if I'm okay till the 15th.”",
              "“It went red, so I closed it.”",
              "“I already track it. In my notes app.”",
            ].map((quote) => (
              <Text key={quote} size={13.5}>
                {quote}
              </Text>
            ))}
          </div>

          <div style={{ paddingTop: u(24) }}>
            <Eyebrow>Grip observed</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: u(10), paddingTop: u(12) }}>
              {[
                { k: "One hand, thumb only", v: 0.78 },
                { k: "Two hands", v: 0.14 },
                { k: "Propped / table", v: 0.08 },
              ].map((row, i) => (
                <div key={row.k}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: u(5) }}>
                    <Text size={12.5}>{row.k}</Text>
                    <Text size={12} mono color="var(--ink-muted)">
                      {Math.round(row.v * 100)}%
                    </Text>
                  </div>
                  <Bar fill={row.v} height={8} tone={i === 0 ? "var(--accent)" : "var(--ink-muted)"} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* every entry, by the hour it was made */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: u(8) }}>
            <Text size={11.5} mono color="var(--ink)">
              21:00 — 01:30
            </Text>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
            <div
              style={{
                position: "absolute",
                left: `${(21 / 25.5) * 100}%`,
                width: `${(4.4 / 25.5) * 100}%`,
                top: 0,
                bottom: 0,
                background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                borderRadius: u(4),
              }}
            />
            {points.map((p, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: u(p.size),
                  height: u(p.size),
                  borderRadius: "50%",
                  background: p.night ? "var(--accent)" : "var(--ink)",
                  opacity: p.night ? 0.78 : 0.26,
                }}
              />
            ))}
          </div>
          <Rule style={{ marginTop: u(6) }} />
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: u(8) }}>
            {["00:00", "06:00", "12:00", "18:00", "24:00"].map((hour) => (
              <Text key={hour} size={11} mono color="var(--ink-muted)">
                {hour}
              </Text>
            ))}
          </div>
        </div>
      </div>

      {/* what it changed */}
      <Rule style={{ marginTop: u(18) }} />
      <div style={{ display: "flex", gap: u(40), paddingTop: u(16) }}>
        {[
          { t: "The month became the bug", b: "Budgets assume a salary. Runway does not." },
          { t: "Nothing turns red", b: "Alerts closed the app. The number just recalculates." },
          { t: "Everything within the thumb arc", b: "The top third of the screen is display only." },
        ].map((item) => (
          <div key={item.t} style={{ flex: 1 }}>
            <span
              style={{
                display: "block",
                width: u(8),
                height: u(8),
                background: "var(--accent)",
                marginBottom: u(10),
              }}
            />
            <Text size={14} weight={600} color="var(--ink)" style={{ display: "block" }}>
              {item.t}
            </Text>
            <Text size={12.5} style={{ display: "block", paddingTop: u(4) }}>
              {item.b}
            </Text>
          </div>
        ))}
      </div>
    </Board>
  );
}

/* ── The system ────────────────────────────────────────────────────────── */

export function SystemBoard() {
  const type = [
    { name: "Runway", spec: "64pt · 700 · tabular", size: 30 },
    { name: "Title", spec: "22pt · 600", size: 17 },
    { name: "Body", spec: "17pt · 400 · 1.5", size: 13 },
    { name: "Caption", spec: "12pt · mono", size: 11 },
  ];
  const targets = [
    { size: 48, label: "48dp", ok: true },
    { size: 40, label: "40dp", ok: false },
    { size: 32, label: "32dp", ok: false },
  ];

  return (
    <Board>
      <Eyebrow>Monsoon · mobile system</Eyebrow>
      <Heading size={24}>A system that fits in one hand.</Heading>
      <Rule style={{ marginTop: u(16) }} />

      <div style={{ display: "flex", gap: u(40), paddingTop: u(20), flex: 1, minHeight: 0 }}>
        {/* reach */}
        <div style={{ width: u(220), display: "flex", flexDirection: "column" }}>
          <Eyebrow>Reach · 6.1in, right hand</Eyebrow>
          <div
            style={{
              position: "relative",
              marginTop: u(12),
              flex: 1,
              minHeight: 0,
              borderRadius: u(18),
              border: "1px solid var(--rule)",
              overflow: "hidden",
              background: "var(--paper)",
            }}
          >
            <div
              style={{
                height: "33%",
                background: "color-mix(in srgb, var(--ink) 5%, transparent)",
                borderBottom: "1px dashed var(--rule)",
                padding: u(12),
              }}
            >
              <Text size={11} color="var(--ink-muted)">
                Display only
              </Text>
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "45%",
                bottom: 0,
                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                borderTop: "1px dashed color-mix(in srgb, var(--accent) 60%, transparent)",
                padding: u(12),
              }}
            >
              <Text size={11} color="var(--ink)">
                Everything actionable
              </Text>
              <div
                style={{
                  position: "absolute",
                  left: u(14),
                  right: u(14),
                  bottom: u(14),
                  height: u(30),
                  borderRadius: u(8),
                  background: "var(--accent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* targets, type and feedback */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: u(18) }}>
          <div>
            <Eyebrow>Touch targets</Eyebrow>
            <div style={{ display: "flex", gap: u(22), paddingTop: u(12), alignItems: "flex-end" }}>
              {targets.map((target) => (
                <div key={target.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: u(58),
                      height: u(58),
                      border: "1px dashed var(--rule)",
                      borderRadius: u(6),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: u(target.size * 0.92),
                        height: u(target.size * 0.92),
                        borderRadius: u(6),
                        background: target.ok ? "var(--accent)" : "var(--ink)",
                        opacity: target.ok ? 1 : 0.22,
                      }}
                    />
                  </div>
                  <Text size={11} mono color="var(--ink-muted)" style={{ display: "block", paddingTop: u(6) }}>
                    {target.label}
                  </Text>
                  <Text size={10.5} color={target.ok ? "var(--ink)" : "var(--ink-muted)"} style={{ display: "block" }}>
                    {target.ok ? "ships" : "rejected"}
                  </Text>
                </div>
              ))}
              <div style={{ flex: 1, paddingBottom: u(6) }}>
                <Text size={12}>
                  Minimum 48 × 48dp, 8dp apart, verified with wet and gloved hands. Anything smaller
                  failed often enough to be cut.
                </Text>
              </div>
            </div>
          </div>

          <Rule color="var(--rule-soft)" />

          <div>
            <Eyebrow>Type · 100% and 200%</Eyebrow>
            <div style={{ display: "flex", gap: u(34), paddingTop: u(12) }}>
              <div style={{ flex: 1 }}>
                {type.map((step) => (
                  <div
                    key={step.name}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: u(16),
                      padding: `${u(5)} 0`,
                      borderBottom: "1px solid var(--rule-soft)",
                    }}
                  >
                    <Text size={step.size} weight={step.size > 20 ? 700 : 400} color="var(--ink)">
                      38 days
                    </Text>
                    <span style={{ display: "flex", gap: u(14) }}>
                      <Text size={11} mono color="var(--ink-muted)">
                        {step.name}
                      </Text>
                      <Text size={11} mono color="var(--ink-muted)">
                        {step.spec}
                      </Text>
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ width: u(210) }}>
                <Text size={12} style={{ display: "block" }}>
                  At 200% every screen reflows to a single column. Nothing truncates and nothing
                  scrolls sideways.
                </Text>
                <Text size={30} weight={700} color="var(--ink)" style={{ display: "block", paddingTop: u(10) }}>
                  38 days
                </Text>
              </div>
            </div>
          </div>

          <Rule color="var(--rule-soft)" />

          <div>
            <Eyebrow>Feedback · three patterns</Eyebrow>
            <div style={{ display: "flex", gap: u(28), paddingTop: u(10) }}>
              {[
                { k: "Tap", v: "Light haptic" },
                { k: "Saved", v: "Success haptic, number updates in place" },
                { k: "Under 14 days", v: "Warning haptic, once per crossing" },
              ].map((row) => (
                <div key={row.k} style={{ flex: 1 }}>
                  <Text size={12} weight={600} color="var(--ink)" style={{ display: "block" }}>
                    {row.k}
                  </Text>
                  <Text size={11.5} style={{ display: "block", paddingTop: u(2) }}>
                    {row.v}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Board>
  );
}
