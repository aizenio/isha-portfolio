import type { CSSProperties, ReactNode } from "react";
import { Bar, seeded, u } from "./kit";

/**
 * Agent Swarm, built rather than drawn.
 *
 * The product has its own palette and does not inherit the portfolio's: an
 * operations console needs semantic colour, and an agent needs an identity you
 * can track down a feed of a thousand events. Numbers are one simulation tick,
 * so they agree with each other.
 */

const BG = "#0B0F14";
const PANEL = "#121922";
const PANEL_2 = "#182230";
const LINE = "rgba(226,238,252,0.10)";
const LINE_2 = "rgba(226,238,252,0.06)";
const FG = "#E6EDF3";
const FG_2 = "rgba(230,237,243,0.62)";
const FG_3 = "rgba(230,237,243,0.40)";

const BRAND = "#6E8BFF"; // demand
const OK = "#3ECF8E"; // inventory
const WARN = "#F5A524"; // logistics
const CRIT = "#FF6B6B"; // anomaly
const GOD = "#A78BFA"; // god

const AGENT: Record<string, string> = {
  demand: BRAND,
  inventory: OK,
  logistics: WARN,
  anomaly: CRIT,
  god: GOD,
};

const MONO = "var(--font-mono), ui-monospace, monospace";
const SANS = "var(--font-sans), ui-sans-serif, system-ui, sans-serif";

/* -------------------------------------------------------------------------- */
/*  Local kit, in the product's palette                                       */
/* -------------------------------------------------------------------------- */

function Shell({ children, chrome }: { children: ReactNode; chrome?: string }) {
  return (
    <div
      style={{ containerType: "inline-size", position: "relative" }}
      className="h-full w-full overflow-hidden bg-[#070A0E]"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          margin: u(26),
          borderRadius: u(14),
          border: `1px solid ${LINE}`,
          background: BG,
          color: FG,
          fontFamily: SANS,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {chrome && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: u(8),
              padding: `${u(9)} ${u(14)}`,
              background: "#0E141B",
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            {[CRIT, WARN, OK].map((tone) => (
              <span
                key={tone}
                style={{ width: u(8), height: u(8), borderRadius: "50%", background: tone, opacity: 0.75 }}
              />
            ))}
            <span style={{ flex: 1, textAlign: "center", fontFamily: MONO, fontSize: u(10.5), color: FG_3 }}>
              {chrome}
            </span>
            <span style={{ width: u(40) }} />
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{children}</div>
      </div>
    </div>
  );
}

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${LINE}`,
        borderRadius: u(10),
        padding: u(12),
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, color = FG_3 }: { children: ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: u(10), letterSpacing: u(1.2), textTransform: "uppercase", color }}>
      {children}
    </span>
  );
}

function Tag({ children, tone, solid }: { children: ReactNode; tone?: string; solid?: boolean }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: u(10),
        padding: `${u(3)} ${u(8)}`,
        borderRadius: u(6),
        whiteSpace: "nowrap",
        color: solid ? tone : FG_2,
        background: solid ? `color-mix(in srgb, ${tone} 18%, transparent)` : "transparent",
        border: solid ? "none" : `1px solid ${LINE}`,
      }}
    >
      {children}
    </span>
  );
}

function Spark({ seed, trend, tone, height = 22 }: { seed: number; trend: number; tone: string; height?: number }) {
  const rand = seeded(seed);
  const n = 30;
  const pts = Array.from({ length: n }, (_, i) => {
    const base = 0.5 + trend * (i / (n - 1) - 0.5) * 2;
    return Math.min(0.94, Math.max(0.06, base + (rand() - 0.5) * 0.32));
  });
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5%", height: u(height) }}>
      {pts.map((v, i) => (
        <span key={i} style={{ flex: 1, height: `${v * 100}%`, background: tone, opacity: 0.25 + v * 0.6, borderRadius: u(1) }} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data — one tick                                                           */
/* -------------------------------------------------------------------------- */

const METRICS = [
  { label: "Fill rate", value: "94.2%", sub: "Demand met from stock", tone: OK, trend: 0.3, seed: 11 },
  { label: "Stockouts", value: "12", sub: "Unfulfilled SKU-days", tone: CRIT, trend: -0.28, seed: 23 },
  { label: "Inventory", value: "84.3k", sub: "₹2.1Cr at cost", tone: GOD, trend: 0.12, seed: 37 },
  { label: "In transit", value: "37", sub: "12.4k units moving", tone: BRAND, trend: 0.2, seed: 51 },
];

const RISK = [
  { sku: "Cold-chain vials", loc: "Pune DC", pct: 0.08, risk: "Critical", tone: CRIT },
  { sku: "Insulin pens 3ml", loc: "Chennai Port", pct: 0.16, risk: "Critical", tone: CRIT },
  { sku: "Saline 500ml", loc: "Bengaluru WH-2", pct: 0.29, risk: "Low", tone: WARN },
  { sku: "Syringes 5cc", loc: "Nashik Supplier", pct: 0.34, risk: "Low", tone: WARN },
  { sku: "Gloves, nitrile", loc: "Hyderabad DC", pct: 0.62, risk: "Healthy", tone: OK },
];

const FEED = [
  { agent: "anomaly", text: "Demand spike, z = 3.4 · cold-chain vials", ago: "2s" },
  { agent: "god", text: "Stockout predicted · Pune DC in 4 days", ago: "3s" },
  { agent: "logistics", text: "SH-4471 delayed at Chennai Port", ago: "6s" },
  { agent: "inventory", text: "Reorder point crossed · saline 500ml", ago: "9s" },
  { agent: "demand", text: "Forecast revised +18% · Bengaluru", ago: "12s" },
];

/* -------------------------------------------------------------------------- */
/*  Plates                                                                    */
/* -------------------------------------------------------------------------- */

/** The console at rest, one tick into a running simulation. */
export function ConsoleBoard() {
  const rand = seeded(4406);
  const nodes = Array.from({ length: 14 }, (_, i) => ({
    left: 6 + (i % 5) * 20 + rand() * 7,
    top: 12 + Math.floor(i / 5) * 30 + rand() * 12,
    tone: i === 3 ? CRIT : i === 9 ? WARN : i % 4 === 0 ? BRAND : OK,
    hot: i === 3 || i === 9,
  }));

  return (
    <Shell chrome="Agent Swarm — Supply Chain Control">
      {/* top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: u(10),
          padding: `${u(10)} ${u(14)}`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <span
          style={{
            width: u(24),
            height: u(24),
            borderRadius: u(7),
            background: `color-mix(in srgb, ${BRAND} 20%, transparent)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ width: u(7), height: u(7), borderRadius: "50%", background: BRAND }} />
        </span>
        <span style={{ fontSize: u(12.5), fontWeight: 600 }}>Agent Swarm</span>
        <span style={{ fontSize: u(12.5), color: FG_3 }}>Supply Chain Control</span>
        <Tag tone={OK} solid>
          Running
        </Tag>
        <span style={{ fontFamily: MONO, fontSize: u(10.5), color: FG_3 }}>Tick 148 · 14 Mar</span>
        <span style={{ flex: 1 }} />
        <Tag>1× speed</Tag>
        <Tag>Pause</Tag>
        <Tag tone={OK} solid>
          Connected
        </Tag>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* main column */}
        <div style={{ flex: 1, minWidth: 0, padding: u(12), display: "flex", flexDirection: "column", gap: u(10) }}>
          <div style={{ display: "flex", gap: u(10) }}>
            {METRICS.map((metric) => (
              <Panel key={metric.label} style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: u(10.5), color: FG_3 }}>{metric.label}</span>
                  <span style={{ width: u(7), height: u(7), borderRadius: "50%", background: metric.tone }} />
                </div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: u(22),
                    fontWeight: 600,
                    paddingTop: u(6),
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {metric.value}
                </span>
                <span style={{ fontSize: u(9.5), color: FG_3, paddingBottom: u(6) }}>{metric.sub}</span>
                <Spark seed={metric.seed} trend={metric.trend} tone={metric.tone} />
              </Panel>
            ))}
          </div>

          <div style={{ display: "flex", gap: u(10), flex: 1, minHeight: 0 }}>
            <Panel style={{ flex: 1.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span>
                  <span style={{ display: "block", fontSize: u(12), fontWeight: 600 }}>Supply chain network</span>
                  <span style={{ display: "block", fontSize: u(9.5), color: FG_3, paddingTop: u(2) }}>
                    Nodes coloured by remaining capacity; lines are active shipments
                  </span>
                </span>
                <Tag tone={OK} solid>
                  Live
                </Tag>
              </div>
              <div style={{ position: "relative", flex: 1, minHeight: 0, marginTop: u(10) }}>
                {nodes.map((n, i) => (
                  <span
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${n.left}%`,
                      top: `${n.top}%`,
                      width: u(n.hot ? 13 : 9),
                      height: u(n.hot ? 13 : 9),
                      borderRadius: "50%",
                      background: n.tone,
                      opacity: n.hot ? 1 : 0.7,
                      boxShadow: n.hot ? `0 0 0 ${u(5)} color-mix(in srgb, ${n.tone} 22%, transparent)` : undefined,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontFamily: MONO, fontSize: u(9.5), color: FG_3 }}>
                14 nodes · 37 shipments · 2 at risk
              </span>
            </Panel>

            <Panel style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span>
                  <span style={{ display: "block", fontSize: u(12), fontWeight: 600 }}>Inventory risk</span>
                  <span style={{ display: "block", fontSize: u(9.5), color: FG_3, paddingTop: u(2) }}>
                    SKU × location, worst first
                  </span>
                </span>
                <Tag tone={CRIT} solid>
                  6 at risk
                </Tag>
              </div>
              <div style={{ paddingTop: u(8) }}>
                {RISK.map((row) => (
                  <div
                    key={row.sku}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: u(10),
                      padding: `${u(6)} 0`,
                      borderBottom: `1px solid ${LINE_2}`,
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: u(11),
                          fontWeight: row.tone === CRIT ? 600 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.sku}
                      </span>
                      <span style={{ display: "block", fontSize: u(9.5), color: FG_3 }}>{row.loc}</span>
                    </span>
                    <span style={{ width: u(70) }}>
                      <Bar fill={row.pct} tone={row.tone} track="rgba(230,237,243,0.08)" height={5} />
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: u(10), color: row.tone, width: u(48), textAlign: "right" }}>
                      {row.risk}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* the GOD rail */}
        <div
          style={{
            width: u(300),
            borderLeft: `1px solid ${LINE}`,
            padding: u(12),
            display: "flex",
            flexDirection: "column",
            gap: u(8),
            minHeight: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: u(8) }}>
            <span
              style={{
                width: u(22),
                height: u(22),
                borderRadius: u(7),
                background: `color-mix(in srgb, ${GOD} 20%, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ width: u(7), height: u(7), borderRadius: "50%", background: GOD }} />
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: u(12), fontWeight: 600 }}>GOD Agent insights</span>
              <span style={{ display: "block", fontSize: u(9.5), color: FG_3 }}>
                Read-only analysis · never mutates state
              </span>
            </span>
            <Tag tone={GOD} solid>
              87% conf.
            </Tag>
          </div>

          <div
            style={{
              background: `color-mix(in srgb, ${GOD} 9%, transparent)`,
              borderRadius: u(8),
              padding: u(10),
              fontSize: u(10),
              lineHeight: 1.5,
              color: FG_2,
            }}
          >
            Demand for cold-chain vials is running 3.4σ above forecast while SH-4471 sits delayed at
            Chennai Port.
          </div>

          <div style={{ display: "flex", gap: u(14), borderBottom: `1px solid ${LINE}`, paddingBottom: u(6) }}>
            {["Stockouts", "Risks", "Root cause", "Actions"].map((tab, i) => (
              <span
                key={tab}
                style={{
                  fontSize: u(10.5),
                  color: i === 0 ? FG : FG_3,
                  fontWeight: i === 0 ? 600 : 400,
                  borderBottom: i === 0 ? `${u(2)} solid ${GOD}` : "none",
                  paddingBottom: u(5),
                }}
              >
                {tab}
              </span>
            ))}
          </div>

          {[
            { sku: "Cold-chain vials", loc: "Pune DC", p: 0.92, days: "4 days", tone: CRIT },
            { sku: "Insulin pens 3ml", loc: "Chennai Port", p: 0.78, days: "6 days", tone: WARN },
            { sku: "Saline 500ml", loc: "Bengaluru WH-2", p: 0.41, days: "11 days", tone: BRAND },
          ].map((pred) => (
            <div key={pred.sku} style={{ paddingBottom: u(4) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: u(11), fontWeight: 500 }}>{pred.sku}</span>
                <span style={{ fontFamily: MONO, fontSize: u(11), color: pred.tone }}>
                  {Math.round(pred.p * 100)}%
                </span>
              </div>
              <div style={{ fontSize: u(9.5), color: FG_3, padding: `${u(2)} 0 ${u(5)}` }}>
                {pred.loc} · stockout in {pred.days}
              </div>
              <Bar fill={pred.p} tone={pred.tone} track="rgba(230,237,243,0.08)" height={5} />
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: u(8), marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: u(12), fontWeight: 600 }}>Agent activity</span>
              <span style={{ fontFamily: MONO, fontSize: u(9.5), color: FG_3 }}>1,284 events</span>
            </div>
            {FEED.map((event) => (
              <div key={event.text} style={{ padding: `${u(5)} 0`, borderBottom: `1px solid ${LINE_2}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: u(6) }}>
                  <span style={{ width: u(6), height: u(6), borderRadius: "50%", background: AGENT[event.agent] }} />
                  <span style={{ fontFamily: MONO, fontSize: u(9.5), color: AGENT[event.agent] }}>{event.agent}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: MONO, fontSize: u(9.5), color: FG_3 }}>{event.ago}</span>
                </div>
                <div style={{ fontSize: u(10), color: FG_2, paddingTop: u(2) }}>{event.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

/** One insight, end to end: prediction, evidence, cause, priced actions. */
export function InsightsBoard() {
  return (
    <Shell>
      <div style={{ padding: u(24), display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: u(10) }}>
          <span
            style={{
              width: u(26),
              height: u(26),
              borderRadius: u(8),
              background: `color-mix(in srgb, ${GOD} 20%, transparent)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ width: u(9), height: u(9), borderRadius: "50%", background: GOD }} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: u(16), fontWeight: 600 }}>GOD Agent insights</span>
            <span style={{ display: "block", fontSize: u(11.5), color: FG_3 }}>
              Read-only analysis · never mutates state · tick 148
            </span>
          </span>
          <Tag tone={GOD} solid>
            87% confidence
          </Tag>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}`, margin: `${u(16)} 0`, height: 0 }} />

        <div style={{ display: "flex", gap: u(36), flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Label>Stockout prediction</Label>
            <div style={{ fontSize: u(19), fontWeight: 600, paddingTop: u(8) }}>Cold-chain vials · Pune DC</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: u(12), paddingTop: u(10) }}>
              <span style={{ fontFamily: MONO, fontSize: u(38), fontWeight: 700, color: CRIT }}>92%</span>
              <span style={{ fontSize: u(12.5), color: FG_2 }}>
                probability of stockout
                <br />
                in 4 days — 18 Mar
              </span>
            </div>
            <div style={{ paddingTop: u(12) }}>
              <Bar fill={0.92} tone={CRIT} track="rgba(230,237,243,0.08)" height={8} />
            </div>

            <div style={{ paddingTop: u(20) }}>
              <Label>Evidence</Label>
              {[
                { k: "Units on hand", v: "640", note: "Pune DC · 14 Mar 06:00", tone: FG_2 },
                { k: "Daily demand, 7-day mean", v: "172", note: "up from 118", tone: WARN },
                { k: "Inbound, next 7 days", v: "0", note: "SH-4471 delayed", tone: CRIT },
                { k: "Days of cover", v: "3.7", note: "reorder point 14 days", tone: CRIT },
              ].map((row) => (
                <div
                  key={row.k}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: u(12),
                    padding: `${u(7)} 0`,
                    borderBottom: `1px solid ${LINE_2}`,
                  }}
                >
                  <span style={{ flex: 1, fontSize: u(12), color: FG_2 }}>{row.k}</span>
                  <span style={{ fontFamily: MONO, fontSize: u(12), color: row.tone }}>{row.v}</span>
                  <span style={{ fontFamily: MONO, fontSize: u(10.5), color: FG_3, width: u(150) }}>{row.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: u(470), borderLeft: `1px solid ${LINE}`, paddingLeft: u(30) }}>
            <Label>Root cause · contribution</Label>
            <div style={{ paddingTop: u(10) }}>
              {[
                { factor: "Demand spike, Bengaluru region", pct: 0.46, tone: CRIT },
                { factor: "SH-4471 delayed at Chennai Port", pct: 0.31, tone: WARN },
                { factor: "Reorder point set for old lead time", pct: 0.15, tone: BRAND },
                { factor: "Unexplained", pct: 0.08, tone: FG_3 },
              ].map((cause) => (
                <div key={cause.factor} style={{ paddingBottom: u(12) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: u(5) }}>
                    <span style={{ fontSize: u(12.5), color: FG_2 }}>{cause.factor}</span>
                    <span style={{ fontFamily: MONO, fontSize: u(11.5), color: FG_3 }}>
                      {Math.round(cause.pct * 100)}%
                    </span>
                  </div>
                  <Bar fill={cause.pct} tone={cause.tone} track="rgba(230,237,243,0.08)" height={5} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}`, marginTop: u(8), paddingTop: u(14) }}>
          <Label>Recommended actions · ranked by expected impact</Label>
          {[
            {
              type: "expedite",
              title: "Upgrade SH-4471 to air freight",
              impact: "Stockout risk 92% → 24%",
              cost: "₹1.8L",
              priority: "Critical",
              tone: CRIT,
            },
            {
              type: "rebalance",
              title: "Move 900 units from Hyderabad DC",
              impact: "Covers 5 days of demand",
              cost: "₹42k",
              priority: "High",
              tone: WARN,
            },
            {
              type: "reorder",
              title: "Raise reorder point to 14 days",
              impact: "Prevents recurrence",
              cost: "—",
              priority: "Medium",
              tone: BRAND,
            },
          ].map((action) => (
            <div
              key={action.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: u(14),
                padding: `${u(8)} 0`,
                borderBottom: `1px solid ${LINE_2}`,
              }}
            >
              <span style={{ width: u(86) }}>
                <Tag tone={action.tone} solid>
                  {action.type}
                </Tag>
              </span>
              <span style={{ flex: 1, fontSize: u(13.5), fontWeight: 600 }}>{action.title}</span>
              <span style={{ width: u(230), fontSize: u(12), color: FG_2 }}>{action.impact}</span>
              <span style={{ fontFamily: MONO, fontSize: u(12), color: FG_3, width: u(60), textAlign: "right" }}>
                {action.cost}
              </span>
              <span style={{ fontFamily: MONO, fontSize: u(11), color: action.tone, width: u(70), textAlign: "right" }}>
                {action.priority}
              </span>
            </div>
          ))}
          <div style={{ fontSize: u(11.5), color: FG_3, paddingTop: u(10) }}>
            Every action names its cost. An operator approves it; the swarm never acts on its own.
          </div>
        </div>
      </div>
    </Shell>
  );
}

/** The bus: five agents, one direction of travel, everything observable. */
export function GraphBoard() {
  const agents = [
    { id: "demand", name: "Demand", note: "Forecast per SKU × location" },
    { id: "inventory", name: "Inventory", note: "Positions, reorder points" },
    { id: "logistics", name: "Logistics", note: "Shipments, lanes, ETAs" },
    { id: "anomaly", name: "Anomaly", note: "z-score on every stream" },
    { id: "god", name: "GOD", note: "Analysis only, never mutates" },
  ];
  return (
    <Shell>
      <div style={{ padding: u(26), display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <Label>A2A message bus · no agent calls another directly</Label>
        <div style={{ fontSize: u(22), fontWeight: 600, paddingTop: u(10) }}>
          Five agents, one bus, every message visible.
        </div>
        <div style={{ borderTop: `1px solid ${LINE}`, margin: `${u(16)} 0` }} />

        <div style={{ display: "flex", gap: u(14), paddingBottom: u(20) }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                flex: 1,
                background: PANEL_2,
                border: `1px solid ${LINE}`,
                borderTop: `${u(3)} solid ${AGENT[agent.id]}`,
                borderRadius: u(10),
                padding: u(12),
                minWidth: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: u(7) }}>
                <span style={{ width: u(9), height: u(9), borderRadius: "50%", background: AGENT[agent.id] }} />
                <span style={{ fontSize: u(14), fontWeight: 600 }}>{agent.name}</span>
              </div>
              <div style={{ fontSize: u(10.5), color: FG_2, paddingTop: u(6) }}>{agent.note}</div>
              <div style={{ fontFamily: MONO, fontSize: u(9.5), color: FG_3, paddingTop: u(8) }}>
                on_message · process · emit
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: u(16), flex: 1, minHeight: 0 }}>
          <Label>One event, followed across the bus</Label>
          <div style={{ paddingTop: u(12) }}>
            {[
              { t: "12:04:02.118", agent: "demand", msg: "forecast.revised · +18% Bengaluru" },
              { t: "12:04:02.140", agent: "anomaly", msg: "anomaly.detected · z = 3.4" },
              { t: "12:04:02.191", agent: "inventory", msg: "reorder.crossed · cold-chain vials" },
              { t: "12:04:02.244", agent: "god", msg: "insight.emitted · stockout in 4 days" },
            ].map((row, i, all) => (
              <div key={row.t} style={{ display: "flex", alignItems: "center", gap: u(16), padding: `${u(7)} 0` }}>
                <span style={{ fontFamily: MONO, fontSize: u(11), color: FG_3, width: u(110) }}>{row.t}</span>
                <span style={{ display: "flex", alignItems: "center", gap: u(7), width: u(120) }}>
                  <span
                    style={{
                      width: u(8),
                      height: u(8),
                      borderRadius: "50%",
                      background: AGENT[row.agent],
                      outline: i < all.length - 1 ? `1px solid ${LINE}` : "none",
                    }}
                  />
                  <span style={{ fontFamily: MONO, fontSize: u(11), color: AGENT[row.agent] }}>{row.agent}</span>
                </span>
                <span style={{ fontSize: u(12.5), color: i === 3 ? FG : FG_2, fontWeight: i === 3 ? 500 : 400 }}>
                  {row.msg}
                </span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: u(11.5), color: FG_3, paddingTop: u(10) }}>
            126ms from signal to insight. The operator sees every hop.
          </div>
        </div>
      </div>
    </Shell>
  );
}

/** What the research produced: the questions a shift actually asks. */
export function SwarmResearchBoard() {
  const questions = [
    { q: "What will miss its window today?", n: 41, keep: true },
    { q: "What is stuck, and who is holding it?", n: 33, keep: true },
    { q: "Which lane is drifting from its ETA?", n: 27, keep: true },
    { q: "What changed overnight?", n: 24, keep: true },
    { q: "What do I hand to the next shift?", n: 19, keep: true },
    { q: "What should I reorder now?", n: 16, keep: true },
    { q: "Where is every SKU right now?", n: 3, keep: false },
    { q: "What did we ship last quarter?", n: 1, keep: false },
  ];
  return (
    <Shell>
      <div style={{ padding: u(26), display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <Label>Task analysis · 31 operators · 4 sites · 9 days on the floor</Label>
        <div style={{ fontSize: u(24), fontWeight: 600, paddingTop: u(10) }}>
          Nobody browsed. Everybody answered one of six questions.
        </div>
        <div style={{ borderTop: `1px solid ${LINE}`, margin: `${u(16)} 0 ${u(10)}` }} />

        <div style={{ display: "flex", gap: u(16), paddingBottom: u(6) }}>
          <span style={{ flex: 1 }}>
            <Label>Question</Label>
          </span>
          <span style={{ width: u(230) }}>
            <Label>Sessions observed</Label>
          </span>
          <span style={{ width: u(90), textAlign: "right" }}>
            <Label>Default view</Label>
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          {questions.map((row) => (
            <div
              key={row.q}
              style={{
                display: "flex",
                alignItems: "center",
                gap: u(16),
                padding: `${u(8)} 0`,
                borderBottom: `1px solid ${LINE_2}`,
              }}
            >
              <span style={{ flex: 1, fontSize: u(14), color: row.keep ? FG : FG_3, fontWeight: row.keep ? 500 : 400 }}>
                {row.q}
              </span>
              <span style={{ width: u(230), display: "flex", alignItems: "center", gap: u(10) }}>
                <span style={{ flex: 1 }}>
                  <Bar fill={row.n / 45} tone={row.keep ? OK : FG_3} track="rgba(230,237,243,0.07)" height={9} />
                </span>
                <span style={{ fontFamily: MONO, fontSize: u(11.5), color: FG_3, width: u(22), textAlign: "right" }}>
                  {row.n}
                </span>
              </span>
              <span
                style={{
                  width: u(90),
                  textAlign: "right",
                  fontFamily: MONO,
                  fontSize: u(11.5),
                  color: row.keep ? OK : CRIT,
                }}
              >
                {row.keep ? "yes" : "no"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${LINE}`, marginTop: u(10), paddingTop: u(14), display: "flex", gap: u(30) }}>
          <div style={{ flex: 1, fontSize: u(13), color: FG_2, lineHeight: 1.55 }}>
            The legacy overview showed 62 elements. Replay over 18 months showed action taken on four.
            The handover spreadsheet — nine columns, maintained by hand since 2019 — did the rest.
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: MONO, fontSize: u(26), fontWeight: 600, color: OK }}>62 → 6</div>
            <div style={{ fontFamily: MONO, fontSize: u(11), color: FG_3 }}>elements on the default view</div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/** The system: palette, density, rank, and the metric card. */
export function SwarmSystemBoard() {
  const densities = [
    { name: "Comfortable", rows: 5, pad: 9, note: "44px · default" },
    { name: "Compact", rows: 7, pad: 5.5, note: "32px · power users" },
    { name: "Condensed", rows: 9, pad: 3, note: "24px · wall display" },
  ];
  return (
    <Shell>
      <div style={{ padding: u(26), display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <Label>Agent Swarm · interface system</Label>
        <div style={{ fontSize: u(22), fontWeight: 600, paddingTop: u(10) }}>
          Colour means something here, so it is spent carefully.
        </div>
        <div style={{ borderTop: `1px solid ${LINE}`, margin: `${u(16)} 0` }} />

        {/* palette */}
        <div style={{ display: "flex", gap: u(20) }}>
          <div style={{ flex: 1, display: "flex", gap: u(10) }}>
            {[
              { hex: "#0B0F14", name: "Ground", tone: BG, border: true },
              { hex: "#121922", name: "Panel", tone: PANEL, border: true },
              { hex: "#6E8BFF", name: "Demand", tone: BRAND },
              { hex: "#3ECF8E", name: "Inventory", tone: OK },
              { hex: "#F5A524", name: "Logistics", tone: WARN },
              { hex: "#FF6B6B", name: "Anomaly", tone: CRIT },
              { hex: "#A78BFA", name: "GOD", tone: GOD },
            ].map((swatch) => (
              <div key={swatch.hex} style={{ flex: 1 }}>
                <div
                  style={{
                    height: u(50),
                    borderRadius: u(8),
                    background: swatch.tone,
                    border: swatch.border ? `1px solid ${LINE}` : "none",
                  }}
                />
                <div style={{ fontSize: u(10.5), color: FG_2, paddingTop: u(6) }}>{swatch.name}</div>
                <div style={{ fontFamily: MONO, fontSize: u(9.5), color: FG_3 }}>{swatch.hex}</div>
              </div>
            ))}
          </div>
          <div style={{ width: u(250), fontSize: u(11.5), color: FG_2, lineHeight: 1.55 }}>
            Five agent hues, doubled as the severity scale — so the colour that marks a critical row is
            the colour of the agent that raised it.
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}`, margin: `${u(18)} 0` }} />

        <div style={{ display: "flex", gap: u(30), flex: 1, minHeight: 0 }}>
          {/* density */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Label>Density · one geometry</Label>
            <div style={{ display: "flex", gap: u(16), paddingTop: u(12) }}>
              {densities.map((mode) => (
                <div key={mode.name} style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: u(12), fontWeight: 500 }}>{mode.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: u(10), color: FG_3, paddingBottom: u(8) }}>{mode.note}</div>
                  {Array.from({ length: mode.rows }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: u(6),
                        padding: `${u(mode.pad)} 0`,
                        borderBottom: `1px solid ${LINE_2}`,
                      }}
                    >
                      <span
                        style={{
                          width: u(5),
                          height: u(5),
                          borderRadius: "50%",
                          background: i === 0 ? CRIT : i === 1 ? WARN : OK,
                        }}
                      />
                      <span style={{ flex: 1, fontSize: u(10), color: FG_2, whiteSpace: "nowrap" }}>Pune DC · vials</span>
                      <span style={{ fontFamily: MONO, fontSize: u(9.5), color: FG_3 }}>{(i + 3) * 128}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* rank and the metric card */}
          <div style={{ width: u(430), borderLeft: `1px solid ${LINE}`, paddingLeft: u(26) }}>
            <Label>Rank · position first, colour second</Label>
            <div style={{ paddingTop: u(10) }}>
              {[
                { name: "Critical", note: "Top of list, weight, red", tone: CRIT, pct: 0.08 },
                { name: "Low", note: "Amber, normal weight", tone: WARN, pct: 0.28 },
                { name: "Healthy", note: "Green, muted", tone: OK, pct: 0.64 },
                { name: "Excess", note: "Blue, sorted last", tone: BRAND, pct: 0.96 },
              ].map((rank) => (
                <div key={rank.name} style={{ display: "flex", alignItems: "center", gap: u(14), padding: `${u(6)} 0` }}>
                  <span style={{ width: u(130) }}>
                    <span style={{ display: "block", fontSize: u(12.5), fontWeight: 500 }}>{rank.name}</span>
                    <span style={{ display: "block", fontSize: u(10), color: FG_3 }}>{rank.note}</span>
                  </span>
                  <span style={{ flex: 1 }}>
                    <Bar fill={rank.pct} tone={rank.tone} track="rgba(230,237,243,0.08)" height={5} />
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${LINE_2}`, marginTop: u(12), paddingTop: u(12) }}>
              <Label>Metric card · anatomy</Label>
              <div style={{ display: "flex", gap: u(16), paddingTop: u(10), alignItems: "flex-start" }}>
                <Panel style={{ width: u(150) }}>
                  <span style={{ fontSize: u(9.5), color: FG_3 }}>Fill rate</span>
                  <span style={{ fontFamily: MONO, fontSize: u(18), fontWeight: 600 }}>94.2%</span>
                  <Spark seed={11} trend={0.3} tone={OK} height={16} />
                </Panel>
                <span style={{ flex: 1, fontSize: u(11), color: FG_2, lineHeight: 1.5 }}>
                  Eight states per component: rest, hover, focus, loading, empty, error, stale,
                  too-much-data — every one keyboard-complete, because the night shift does not use a
                  mouse.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
