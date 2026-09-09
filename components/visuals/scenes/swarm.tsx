import { Frame, MONO, SANS, T } from "../chrome";
import { q, seeded } from "../scene-utils";

/**
 * Agent Swarm — supply chain control.
 *
 * Drawn from the running product: the same four headline metrics, the same
 * five agents on the A2A bus, the same read-only GOD panel with its four tabs.
 * Numbers come from a single simulation tick, so they agree with each other.
 *
 * This project has its own palette and does not inherit the portfolio's. An
 * operations console needs semantic colour — critical, warning, healthy — and
 * an agent needs an identity you can track down a feed of a thousand events.
 * Painting it in the site's near-achromatic ink would have been a lie about
 * how the product actually looks.
 */

/* -------------------------------------------------------------------------- */
/*  The product's palette                                                     */
/* -------------------------------------------------------------------------- */

const BG = "#0B0F14";
const PANEL = "#121922";
const PANEL_2 = "#182230";
const LINE = "rgba(226,238,252,0.10)";
const LINE_2 = "rgba(226,238,252,0.06)";

const FG = "#E6EDF3";
const FG_2 = "rgba(230,237,243,0.62)";
const FG_3 = "rgba(230,237,243,0.40)";

/** Agent identity, matching the badge colours the product ships. */
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
  simulation: FG_3,
};

/* -------------------------------------------------------------------------- */
/*  A small kit, painted in that palette                                      */
/* -------------------------------------------------------------------------- */

function Panel({
  x,
  y,
  w,
  h,
  r = 10,
  fill = PANEL,
  stroke = LINE,
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

function Rule({ x1, y, x2, soft = false }: { x1: number; y: number; x2: number; soft?: boolean }) {
  return <line x1={x1} y1={y} x2={x2} y2={y} stroke={soft ? LINE_2 : LINE} />;
}

function Tag({
  x,
  y,
  label,
  tone = FG_2,
  solid = false,
}: {
  x: number;
  y: number;
  label: string;
  tone?: string;
  solid?: boolean;
}) {
  const w = label.length * 5.6 + 20;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="20"
        rx="6"
        fill={solid ? tone : "none"}
        opacity={solid ? 0.16 : 1}
        stroke={solid ? "none" : LINE}
      />
      <T x={x + w / 2} y={y + 10.5} size={10} fill={solid ? tone : FG_2} anchor="middle" family={MONO} weight={500}>
        {label}
      </T>
    </g>
  );
}

function Meter({
  x,
  y,
  w,
  pct,
  tone = BRAND,
  h = 6,
}: {
  x: number;
  y: number;
  w: number;
  pct: number;
  tone?: string;
  h?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={FG} opacity="0.08" />
      <rect x={x} y={y} width={q(w * pct)} height={h} rx={h / 2} fill={tone} />
    </g>
  );
}

function Spark({
  x,
  y,
  w,
  h,
  seed,
  trend = 0,
  stroke = BRAND,
  area = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
  trend?: number;
  stroke?: string;
  area?: boolean;
}) {
  const rand = seeded(seed);
  const n = 30;
  const pts = Array.from({ length: n }, (_, i) => {
    const base = 0.5 + trend * (i / (n - 1) - 0.5) * 2;
    const v = Math.min(0.94, Math.max(0.06, base + (rand() - 0.5) * 0.32));
    return `${q(x + (i / (n - 1)) * w)},${q(y + h - v * h)}`;
  });
  return (
    <g>
      {area && <polygon points={`${x},${y + h} ${pts.join(" ")} ${x + w},${y + h}`} fill={stroke} opacity="0.12" />}
      <polyline points={pts.join(" ")} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
    </g>
  );
}

/** The app window the console lives in. */
function AppWindow({
  x,
  y,
  w,
  h,
  title,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  children: React.ReactNode;
}) {
  const bar = 32;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill={PANEL} stroke={LINE} />
      <path
        d={`M ${x} ${y + 12} a 12 12 0 0 1 12 -12 h ${w - 24} a 12 12 0 0 1 12 12 v ${bar - 12} h ${-w} z`}
        fill="#0E141B"
      />
      <Rule x1={x} y={y + bar} x2={x + w} />
      {[CRIT, WARN, OK].map((tone, i) => (
        <circle key={tone} cx={x + 20 + i * 15} cy={y + bar / 2} r="4" fill={tone} opacity="0.75" />
      ))}
      <T x={x + w / 2} y={y + bar / 2} size={10.5} fill={FG_3} anchor="middle" family={MONO}>
        {title}
      </T>
      <svg x={x} y={y + bar} width={w} height={h - bar} viewBox={`0 0 ${w} ${h - bar}`}>
        {children}
      </svg>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data — one tick of the simulation                                         */
/* -------------------------------------------------------------------------- */

const WIN = { x: 40, y: 26, w: 1120, h: 698 };
const IW = WIN.w;

const METRICS = [
  { label: "Fill rate", value: "94.2%", sub: "Demand met from stock", tone: OK, trend: 0.3, seed: 11 },
  { label: "Stockouts", value: "12", sub: "Unfulfilled SKU-days", tone: CRIT, trend: -0.28, seed: 23 },
  { label: "Inventory", value: "84.3k", sub: "₹2.1Cr at cost", tone: GOD, trend: 0.12, seed: 37 },
  { label: "In transit", value: "37", sub: "12.4k units moving", tone: BRAND, trend: 0.2, seed: 51 },
];

const RISK_ROWS = [
  { sku: "Cold-chain vials", loc: "Pune DC", pct: 0.08, risk: "Critical", tone: CRIT },
  { sku: "Insulin pens 3ml", loc: "Chennai Port", pct: 0.16, risk: "Critical", tone: CRIT },
  { sku: "Saline 500ml", loc: "Bengaluru WH-2", pct: 0.29, risk: "Low", tone: WARN },
  { sku: "Syringes 5cc", loc: "Nashik Supplier", pct: 0.34, risk: "Low", tone: WARN },
  { sku: "Gloves, nitrile", loc: "Hyderabad DC", pct: 0.62, risk: "Healthy", tone: OK },
  { sku: "Surgical masks", loc: "Pune DC", pct: 0.94, risk: "Excess", tone: BRAND },
];

const FEED = [
  { agent: "anomaly", text: "Demand spike, z = 3.4 · cold-chain vials", ago: "2s" },
  { agent: "god", text: "Stockout predicted · Pune DC in 4 days", ago: "3s" },
  { agent: "logistics", text: "SH-4471 delayed at Chennai Port", ago: "6s" },
  { agent: "inventory", text: "Reorder point crossed · saline 500ml", ago: "9s" },
  { agent: "demand", text: "Forecast revised +18% · Bengaluru", ago: "12s" },
  { agent: "logistics", text: "Reroute accepted · SH-4390 via Mumbai", ago: "15s" },
];

/* -------------------------------------------------------------------------- */
/*  Plates                                                                    */
/* -------------------------------------------------------------------------- */

/** The whole console at rest, one tick into a running simulation. */
export function SwarmConsole() {
  const rand = seeded(4406);
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="#070A0E" />
      <AppWindow {...WIN} title="Agent Swarm — Supply Chain Control">
        <rect width={IW} height="666" fill={BG} />

        {/* top bar */}
        <rect x="20" y="14" width="26" height="26" rx="8" fill={BRAND} opacity="0.18" />
        <circle cx="33" cy="27" r="2.6" fill={BRAND} />
        <circle cx="33" cy="20" r="1.7" fill={BRAND} opacity="0.6" />
        <circle cx="39" cy="31" r="1.7" fill={BRAND} opacity="0.6" />
        <circle cx="27" cy="31" r="1.7" fill={BRAND} opacity="0.6" />
        <T x={56} y={21} size={12.5} weight={600} fill={FG}>
          Agent Swarm
        </T>
        <T x={137} y={21} size={12.5} fill={FG_3}>
          Supply Chain Control
        </T>
        <circle cx="62" cy="39" r="3.4" fill={OK} />
        <T x={72} y={39} size={10} fill={OK} family={MONO}>
          Running
        </T>
        <T x={132} y={39} size={10} fill={FG_3} family={MONO}>
          Tick 148 · 14 Mar
        </T>
        <Tag x={IW - 348} y={16} label="1× speed" />
        <Tag x={IW - 268} y={16} label="Pause" />
        <Tag x={IW - 196} y={16} label="Reset" />
        <Tag x={IW - 118} y={16} label="Connected" tone={OK} solid />
        <Rule x1={0} y={56} x2={IW} />

        {/* metric row */}
        {METRICS.map((metric, i) => {
          const x = 20 + i * 176;
          return (
            <g key={metric.label}>
              <Panel x={x} y={72} w={164} h={106} />
              <T x={x + 14} y={92} size={10.5} fill={FG_3}>
                {metric.label}
              </T>
              <circle cx={x + 150} cy={92} r="3.4" fill={metric.tone} />
              <T x={x + 14} y={118} size={24} weight={600} fill={FG} family={MONO}>
                {metric.value}
              </T>
              <T x={x + 14} y={140} size={9.5} fill={FG_3}>
                {metric.sub}
              </T>
              <Spark x={x + 14} y={150} w={136} h={20} seed={metric.seed} trend={metric.trend} stroke={metric.tone} />
            </g>
          );
        })}

        {/* network */}
        <Panel x={20} y={190} w={484} h={268} />
        <T x={34} y={212} size={12.5} weight={600} fill={FG}>
          Supply chain network
        </T>
        <T x={34} y={230} size={10} fill={FG_3}>
          Nodes coloured by remaining capacity; lines are active shipments
        </T>
        <Tag x={428} y={202} label="Live" tone={OK} solid />
        <Rule x1={20} y={244} x2={504} soft />
        {(() => {
          const nodes = Array.from({ length: 14 }, (_, i) => ({
            x: q(52 + (i % 5) * 100 + rand() * 34),
            y: q(280 + Math.floor(i / 5) * 60 + rand() * 24),
            tone: i === 3 ? CRIT : i === 9 ? WARN : i % 4 === 0 ? BRAND : OK,
            hot: i === 3 || i === 9,
          }));
          return (
            <g>
              {nodes.slice(0, 11).map((n, i) => {
                const m = nodes[(i * 3 + 4) % nodes.length];
                return (
                  <path
                    key={i}
                    d={`M ${n.x} ${n.y} Q ${q((n.x + m.x) / 2)} ${q(Math.min(n.y, m.y) - 18)} ${m.x} ${m.y}`}
                    fill="none"
                    stroke={i % 3 === 0 ? WARN : BRAND}
                    strokeWidth="0.9"
                    opacity="0.35"
                    strokeDasharray={i % 3 === 0 ? "3 3" : undefined}
                  />
                );
              })}
              {nodes.map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={n.hot ? 7 : 4.5} fill={n.tone} opacity={n.hot ? 1 : 0.7} />
                  {n.hot && <circle cx={n.x} cy={n.y} r="12" fill="none" stroke={n.tone} opacity="0.4" />}
                </g>
              ))}
              <T x={52} y={438} size={9.5} fill={FG_3} family={MONO}>
                14 nodes · 37 shipments · 2 at risk
              </T>
            </g>
          );
        })()}

        {/* inventory risk */}
        <Panel x={516} y={190} w={324} h={268} />
        <T x={530} y={212} size={12.5} weight={600} fill={FG}>
          Inventory risk
        </T>
        <T x={530} y={230} size={10} fill={FG_3}>
          SKU × location, worst first
        </T>
        <Tag x={752} y={202} label="6 at risk" tone={CRIT} solid />
        <Rule x1={516} y={244} x2={840} soft />
        {RISK_ROWS.map((row, i) => {
          const y = 266 + i * 32;
          return (
            <g key={row.sku}>
              <T x={530} y={y} size={11} fill={FG} weight={row.tone === CRIT ? 600 : 400}>
                {row.sku}
              </T>
              <T x={530} y={y + 13} size={9.5} fill={FG_3}>
                {row.loc}
              </T>
              <Meter x={660} y={y - 3} w={92} pct={row.pct} tone={row.tone} />
              <T x={826} y={y + 2} size={10} fill={row.tone} anchor="end" family={MONO}>
                {row.risk}
              </T>
              <Rule x1={530} y={y + 22} x2={826} soft />
            </g>
          );
        })}

        {/* performance */}
        <Panel x={20} y={470} w={820} h={180} />
        <T x={34} y={492} size={12.5} weight={600} fill={FG}>
          Performance over time
        </T>
        <T x={34} y={510} size={10} fill={FG_3}>
          Fill rate against inventory level and stockout events
        </T>
        <Rule x1={20} y={524} x2={840} soft />
        <Spark x={40} y={538} w={780} h={76} seed={99} trend={0.34} stroke={OK} />
        <Spark x={40} y={548} w={780} h={60} seed={77} trend={-0.14} stroke={GOD} area={false} />
        {["Tick 100", "110", "120", "130", "140", "148"].map((tick, i) => (
          <T key={tick} x={40 + i * 156} y={632} size={9.5} fill={FG_3} family={MONO}>
            {tick}
          </T>
        ))}

        {/* GOD rail */}
        <line x1="852" y1="56" x2="852" y2="666" stroke={LINE} />
        <rect x={870} y={76} width="22" height="22" rx="7" fill={GOD} opacity="0.18" />
        <circle cx="881" cy="87" r="4" fill={GOD} />
        <T x={902} y={82} size={12} weight={600} fill={FG}>
          GOD Agent insights
        </T>
        <T x={902} y={98} size={9.5} fill={FG_3}>
          Read-only analysis · never mutates state
        </T>
        <Tag x={IW - 100} y={76} label="87% conf." tone={GOD} solid />
        <rect x={870} y={116} width={IW - 890} height="46" rx="8" fill={GOD} opacity="0.08" />
        <T x={882} y={132} size={10} fill={FG_2}>
          Demand for cold-chain vials is running 3.4σ above
        </T>
        <T x={882} y={148} size={10} fill={FG_2}>
          forecast while SH-4471 sits delayed at Chennai Port.
        </T>
        {["Stockouts", "Risks", "Root cause", "Actions"].map((tab, i) => (
          <g key={tab}>
            <T x={874 + i * 66} y={184} size={10.5} fill={i === 0 ? FG : FG_3} weight={i === 0 ? 600 : 400}>
              {tab}
            </T>
            {i === 0 && <rect x={870} y={196} width="58" height="2" rx="1" fill={GOD} />}
          </g>
        ))}
        <Rule x1={852} y={198} x2={IW} />
        {[
          { sku: "Cold-chain vials", loc: "Pune DC", p: 0.92, days: "4 days", tone: CRIT },
          { sku: "Insulin pens 3ml", loc: "Chennai Port", p: 0.78, days: "6 days", tone: WARN },
          { sku: "Saline 500ml", loc: "Bengaluru WH-2", p: 0.41, days: "11 days", tone: BRAND },
        ].map((pred, i) => {
          const y = 226 + i * 62;
          return (
            <g key={pred.sku}>
              <T x={870} y={y} size={11} weight={500} fill={FG}>
                {pred.sku}
              </T>
              <T x={IW - 24} y={y} size={11} anchor="end" fill={pred.tone} family={MONO}>
                {`${Math.round(pred.p * 100)}%`}
              </T>
              <T x={870} y={y + 15} size={9.5} fill={FG_3}>
                {`${pred.loc} · stockout in ${pred.days}`}
              </T>
              <Meter x={870} y={y + 28} w={IW - 894} pct={pred.p} tone={pred.tone} h={5} />
              <Rule x1={870} y={y + 44} x2={IW - 24} soft />
            </g>
          );
        })}

        {/* activity */}
        <Rule x1={852} y={422} x2={IW} />
        <T x={870} y={446} size={12} weight={600} fill={FG}>
          Agent activity
        </T>
        <T x={IW - 24} y={446} size={9.5} fill={FG_3} anchor="end" family={MONO}>
          1,284 events on the A2A bus
        </T>
        {FEED.map((event, i) => {
          const y = 480 + i * 30;
          return (
            <g key={event.text}>
              <circle cx={874} cy={y} r="3.4" fill={AGENT[event.agent]} />
              <T x={888} y={y} size={10} fill={AGENT[event.agent]} family={MONO}>
                {event.agent}
              </T>
              <T x={IW - 24} y={y} size={9.5} fill={FG_3} anchor="end" family={MONO}>
                {event.ago}
              </T>
              <T x={888} y={y + 13} size={10} fill={FG_2}>
                {event.text.slice(0, 40)}
              </T>
              <Rule x1={888} y={y + 22} x2={IW - 24} soft />
            </g>
          );
        })}
      </AppWindow>
    </Frame>
  );
}

/** One insight, end to end: prediction, evidence, cause, priced actions. */
export function SwarmInsights() {
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="#070A0E" />
      <Panel x={56} y={40} w={1088} h={670} r={14} />

      <rect x={88} y={72} width="30" height="30" rx="9" fill={GOD} opacity="0.18" />
      <circle cx="103" cy="87" r="5" fill={GOD} />
      <T x={132} y={80} size={16} weight={600} fill={FG}>
        GOD Agent insights
      </T>
      <T x={132} y={100} size={11.5} fill={FG_3}>
        Read-only analysis · never mutates state · tick 148
      </T>
      <Tag x={1008} y={76} label="87% confidence" tone={GOD} solid />
      <Rule x1={88} y={126} x2={1112} />

      <T x={88} y={158} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        STOCKOUT PREDICTION
      </T>
      <T x={88} y={194} size={20} weight={600} fill={FG}>
        Cold-chain vials · Pune DC
      </T>
      <T x={88} y={238} size={40} weight={700} fill={CRIT} family={MONO}>
        92%
      </T>
      <T x={196} y={228} size={12.5} fill={FG_2}>
        probability of stockout
      </T>
      <T x={196} y={248} size={12.5} fill={FG_2}>
        in 4 days — 18 Mar
      </T>
      <Meter x={88} y={272} w={420} pct={0.92} tone={CRIT} h={8} />

      <T x={88} y={318} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        EVIDENCE
      </T>
      {[
        { k: "Units on hand", v: "640", note: "Pune DC · 14 Mar 06:00", tone: FG_2 },
        { k: "Daily demand, 7-day mean", v: "172", note: "up from 118", tone: WARN },
        { k: "Inbound, next 7 days", v: "0", note: "SH-4471 delayed", tone: CRIT },
        { k: "Days of cover", v: "3.7", note: "reorder point 14 days", tone: CRIT },
      ].map((row, i) => (
        <g key={row.k}>
          <T x={88} y={350 + i * 32} size={12} fill={FG_2}>
            {row.k}
          </T>
          <T x={404} y={350 + i * 32} size={12} anchor="end" fill={row.tone} family={MONO}>
            {row.v}
          </T>
          <T x={424} y={350 + i * 32} size={10.5} fill={FG_3} family={MONO}>
            {row.note}
          </T>
          <Rule x1={88} y={366 + i * 32} x2={508} soft />
        </g>
      ))}

      <line x1="556" y1="150" x2="556" y2="470" stroke={LINE} />

      <T x={596} y={158} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        ROOT CAUSE · CONTRIBUTION
      </T>
      {[
        { factor: "Demand spike, Bengaluru region", pct: 0.46, tone: CRIT },
        { factor: "SH-4471 delayed at Chennai Port", pct: 0.31, tone: WARN },
        { factor: "Reorder point set for old lead time", pct: 0.15, tone: BRAND },
        { factor: "Unexplained", pct: 0.08, tone: FG_3 },
      ].map((cause, i) => (
        <g key={cause.factor}>
          <T x={596} y={196 + i * 42} size={12.5} fill={i === 0 ? FG : FG_2} weight={i === 0 ? 500 : 400}>
            {cause.factor}
          </T>
          <Meter x={596} y={210 + i * 42} w={400} pct={cause.pct} tone={cause.tone} h={5} />
          <T x={1112} y={202 + i * 42} size={11.5} fill={FG_3} anchor="end" family={MONO}>
            {`${Math.round(cause.pct * 100)}%`}
          </T>
        </g>
      ))}

      <Rule x1={88} y={470} x2={1112} />
      <T x={88} y={500} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        RECOMMENDED ACTIONS · RANKED BY EXPECTED IMPACT
      </T>
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
      ].map((action, i) => {
        const y = 538 + i * 56;
        return (
          <g key={action.title}>
            <Tag x={88} y={y - 10} label={action.type} tone={action.tone} solid />
            <T x={200} y={y} size={13.5} weight={i === 0 ? 600 : 500} fill={FG}>
              {action.title}
            </T>
            <T x={604} y={y} size={12} fill={FG_2}>
              {action.impact}
            </T>
            <T x={940} y={y} size={12} fill={FG_3} anchor="end" family={MONO}>
              {action.cost}
            </T>
            <T x={1112} y={y} size={11} fill={action.tone} anchor="end" family={MONO}>
              {action.priority}
            </T>
            <Rule x1={88} y={y + 22} x2={1112} soft />
          </g>
        );
      })}
      <T x={88} y={692} size={11.5} fill={FG_3}>
        Every action names its cost. An operator approves it; the swarm never acts on its own.
      </T>
    </Frame>
  );
}

/** The bus: five agents, one direction of travel, everything observable. */
export function SwarmGraph() {
  const agents = [
    { id: "demand", name: "Demand", note: "Forecast per SKU × location", x: 176, y: 254 },
    { id: "inventory", name: "Inventory", note: "Positions, reorder points", x: 176, y: 430 },
    { id: "logistics", name: "Logistics", note: "Shipments, lanes, ETAs", x: 452, y: 342 },
    { id: "anomaly", name: "Anomaly", note: "z-score on every stream", x: 728, y: 254 },
    { id: "god", name: "GOD", note: "Analysis only, never mutates", x: 728, y: 430 },
  ];
  const edges: [number, number][] = [
    [0, 2],
    [1, 2],
    [2, 3],
    [0, 3],
    [3, 4],
    [1, 4],
  ];
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="#070A0E" />
      <Panel x={56} y={40} w={1088} h={670} r={14} fill={BG} />
      <T x={88} y={76} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        A2A MESSAGE BUS · NO AGENT CALLS ANOTHER DIRECTLY
      </T>
      <T x={88} y={112} size={22} weight={600} fill={FG}>
        Five agents, one bus, every message visible.
      </T>
      <Rule x1={88} y={150} x2={1112} />

      {edges.map(([a, b], i) => {
        const from = agents[a];
        const to = agents[b];
        return (
          <g key={i}>
            <path
              d={`M ${from.x + 92} ${from.y} C ${from.x + 170} ${from.y} ${to.x - 170} ${to.y} ${to.x - 92} ${to.y}`}
              fill="none"
              stroke={AGENT[from.id]}
              strokeWidth="1.2"
              opacity="0.4"
            />
            <circle cx={q((from.x + to.x) / 2 + 46)} cy={q((from.y + to.y) / 2)} r="3" fill={AGENT[from.id]} opacity={i % 2 ? 0.55 : 1} />
          </g>
        );
      })}

      {agents.map((agent) => (
        <g key={agent.id}>
          <Panel x={agent.x - 92} y={agent.y - 44} w={184} h={88} fill={PANEL_2} />
          <circle cx={agent.x - 68} cy={agent.y - 18} r="5" fill={AGENT[agent.id]} />
          <T x={agent.x - 52} y={agent.y - 18} size={14} weight={600} fill={FG}>
            {agent.name}
          </T>
          <T x={agent.x - 68} y={agent.y + 6} size={10.5} fill={FG_2}>
            {agent.note}
          </T>
          <T x={agent.x - 68} y={agent.y + 26} size={9.5} fill={FG_3} family={MONO}>
            on_message · process · emit
          </T>
        </g>
      ))}

      <Rule x1={88} y={532} x2={1112} />
      <T x={88} y={562} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        ONE EVENT, FOLLOWED ACROSS THE BUS
      </T>
      {[
        { t: "12:04:02.118", agent: "demand", msg: "forecast.revised · +18% Bengaluru" },
        { t: "12:04:02.140", agent: "anomaly", msg: "anomaly.detected · z = 3.4" },
        { t: "12:04:02.191", agent: "inventory", msg: "reorder.crossed · cold-chain vials" },
        { t: "12:04:02.244", agent: "god", msg: "insight.emitted · stockout in 4 days" },
      ].map((row, i) => (
        <g key={row.t}>
          <T x={88} y={598 + i * 28} size={11} fill={FG_3} family={MONO}>
            {row.t}
          </T>
          <circle cx={222} cy={598 + i * 28} r="3.2" fill={AGENT[row.agent]} />
          <T x={236} y={598 + i * 28} size={11} fill={AGENT[row.agent]} family={MONO}>
            {row.agent}
          </T>
          <T x={348} y={598 + i * 28} size={12} fill={i === 3 ? FG : FG_2} weight={i === 3 ? 500 : 400}>
            {row.msg}
          </T>
          {i < 3 && <line x1={222} y1={606 + i * 28} x2={222} y2={624 + i * 28} stroke={LINE} />}
        </g>
      ))}
      <T x={772} y={640} size={11.5} fill={FG_3}>
        126ms from signal to insight. The operator sees every hop.
      </T>
    </Frame>
  );
}

/** What the research produced: the questions a shift actually asks. */
export function SwarmResearch() {
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
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="#070A0E" />
      <Panel x={56} y={40} w={1088} h={670} r={14} fill={BG} />
      <T x={88} y={76} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        TASK ANALYSIS · 31 OPERATORS · 4 SITES · 9 DAYS ON THE FLOOR
      </T>
      <T x={88} y={116} size={24} weight={600} fill={FG}>
        Nobody browsed. Everybody answered one of six questions.
      </T>
      <Rule x1={88} y={154} x2={1112} />
      <T x={88} y={182} size={10} fill={FG_3} family={MONO} tracking={1.2}>
        QUESTION
      </T>
      <T x={780} y={182} size={10} fill={FG_3} family={MONO} tracking={1.2}>
        SESSIONS OBSERVED
      </T>
      <T x={1040} y={182} size={10} fill={FG_3} family={MONO} tracking={1.2}>
        DEFAULT VIEW
      </T>

      {questions.map((row, i) => {
        const y = 220 + i * 46;
        return (
          <g key={row.q}>
            <T x={88} y={y} size={14} fill={row.keep ? FG : FG_3} weight={row.keep ? 500 : 400}>
              {row.q}
            </T>
            <rect x={780} y={y - 6} width={q(row.n * 4.4)} height="12" rx="3" fill={row.keep ? OK : FG_3} opacity={row.keep ? 0.9 : 0.35} />
            <T x={996} y={y} size={11.5} fill={FG_3} anchor="end" family={MONO}>
              {String(row.n)}
            </T>
            <T x={1040} y={y} size={11.5} fill={row.keep ? OK : CRIT} family={MONO}>
              {row.keep ? "yes" : "no"}
            </T>
            <Rule x1={88} y={y + 22} x2={1112} soft />
          </g>
        );
      })}

      <Rule x1={88} y={596} x2={1112} />
      <T x={88} y={628} size={13} fill={FG_2}>
        The legacy overview showed 62 elements. Replay over 18 months showed action taken on four.
      </T>
      <T x={88} y={652} size={13} fill={FG_2}>
        The handover spreadsheet — nine columns, maintained by hand since 2019 — did the rest.
      </T>
      <T x={1112} y={628} size={26} weight={600} anchor="end" fill={OK} family={MONO}>
        62 → 6
      </T>
      <T x={1112} y={654} size={11} fill={FG_3} family={MONO} anchor="end">
        elements on the default view
      </T>
    </Frame>
  );
}

/** The system: palette, density, risk ranks, component anatomy. */
export function SwarmSystem() {
  const densities = [
    { name: "Comfortable", row: 30, rows: 5, note: "44px · default" },
    { name: "Compact", row: 23, rows: 7, note: "32px · power users" },
    { name: "Condensed", row: 18, rows: 9, note: "24px · wall display" },
  ];
  return (
    <Frame viewBox="0 0 1200 750" fit="contain">
      <rect width="1200" height="750" fill="#070A0E" />
      <Panel x={56} y={40} w={1088} h={670} r={14} fill={BG} />
      <T x={88} y={76} size={10.5} fill={FG_3} family={MONO} tracking={1.2}>
        AGENT SWARM · INTERFACE SYSTEM
      </T>
      <T x={88} y={112} size={22} weight={600} fill={FG}>
        Colour means something here, so it is spent carefully.
      </T>
      <Rule x1={88} y={148} x2={1112} />

      {/* palette */}
      <T x={88} y={176} size={10} fill={FG_3} family={MONO} tracking={1.2}>
        PALETTE
      </T>
      {[
        { hex: "#0B0F14", name: "Ground", tone: BG, stroke: LINE },
        { hex: "#121922", name: "Panel", tone: PANEL, stroke: LINE },
        { hex: "#6E8BFF", name: "Demand", tone: BRAND },
        { hex: "#3ECF8E", name: "Inventory · healthy", tone: OK },
        { hex: "#F5A524", name: "Logistics · low", tone: WARN },
        { hex: "#FF6B6B", name: "Anomaly · critical", tone: CRIT },
        { hex: "#A78BFA", name: "GOD · insight", tone: GOD },
      ].map((swatch, i) => (
        <g key={swatch.hex}>
          <rect x={88 + i * 104} y={200} width={88} height="54" rx="8" fill={swatch.tone} stroke={swatch.stroke ?? "none"} />
          <T x={88 + i * 104} y={272} size={10.5} fill={FG_2}>
            {swatch.name.split(" · ")[0]}
          </T>
          <T x={88 + i * 104} y={288} size={9.5} fill={FG_3} family={MONO}>
            {swatch.hex}
          </T>
        </g>
      ))}
      <T x={856} y={210} size={11.5} fill={FG_2}>
        Five agent hues, doubled as the
      </T>
      <T x={856} y={228} size={11.5} fill={FG_2}>
        severity scale — so the colour that
      </T>
      <T x={856} y={246} size={11.5} fill={FG_2}>
        marks a critical row is the colour of
      </T>
      <T x={856} y={264} size={11.5} fill={FG_2}>
        the agent that raised it.
      </T>
      <Rule x1={88} y={312} x2={1112} />

      {/* density */}
      <T x={88} y={340} size={10} fill={FG_3} family={MONO} tracking={1.2}>
        DENSITY · ONE GEOMETRY
      </T>
      {densities.map((mode, m) => {
        const x = 88 + m * 200;
        return (
          <g key={mode.name}>
            <T x={x} y={368} size={12} weight={500} fill={FG}>
              {mode.name}
            </T>
            <T x={x} y={384} size={10} fill={FG_3} family={MONO}>
              {mode.note}
            </T>
            {Array.from({ length: mode.rows }, (_, i) => {
              const y = 408 + i * mode.row;
              return (
                <g key={i}>
                  <circle cx={x + 4} cy={y} r="2.6" fill={i === 0 ? CRIT : i === 1 ? WARN : OK} />
                  <T x={x + 16} y={y} size={q(mode.row * 0.36)} fill={FG_2}>
                    Pune DC · vials
                  </T>
                  <T x={x + 168} y={y} size={q(mode.row * 0.34)} fill={FG_3} anchor="end" family={MONO}>
                    {`${(i + 3) * 128}`}
                  </T>
                  <Rule x1={x} y={q(y + mode.row / 2 - 2)} x2={x + 168} soft />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* rank + numerals */}
      <line x1="700" y1="326" x2="700" y2="600" stroke={LINE} />
      <T x={736} y={340} size={10} fill={FG_3} family={MONO} tracking={1.2}>
        RANK · POSITION FIRST, COLOUR SECOND
      </T>
      {[
        { name: "Critical", note: "Top of list, weight, red", tone: CRIT, pct: 0.08 },
        { name: "Low", note: "Amber, normal weight", tone: WARN, pct: 0.28 },
        { name: "Healthy", note: "Green, muted", tone: OK, pct: 0.64 },
        { name: "Excess", note: "Blue, sorted last", tone: BRAND, pct: 0.96 },
      ].map((rank, i) => (
        <g key={rank.name}>
          <T x={736} y={374 + i * 46} size={12.5} fill={FG} weight={i === 0 ? 600 : 400}>
            {rank.name}
          </T>
          <T x={736} y={390 + i * 46} size={10} fill={FG_3}>
            {rank.note}
          </T>
          <Meter x={952} y={378 + i * 46} w={160} pct={rank.pct} tone={rank.tone} h={5} />
        </g>
      ))}
      <T x={736} y={578} size={10} fill={FG_3} family={MONO} tracking={1.2}>
        NUMERALS · TABULAR, RIGHT-ALIGNED
      </T>
      <T x={736} y={606} size={16} fill={FG} family={MONO}>
        94.2%   12   84.3k   ₹2.1Cr
      </T>

      {/* metric card anatomy */}
      <Rule x1={88} y={620} x2={700} />
      <Panel x={88} y={636} w={210} h={56} />
      <T x={102} y={652} size={9.5} fill={FG_3}>
        Fill rate
      </T>
      <T x={102} y={672} size={18} weight={600} fill={FG} family={MONO}>
        94.2%
      </T>
      <circle cx={282} cy={652} r="3.4" fill={OK} />
      <Spark x={180} y={664} w={104} h={18} seed={11} trend={0.3} stroke={OK} />
      <T x={318} y={652} size={11} fill={FG_2}>
        Eight states per component: rest, hover,
      </T>
      <T x={318} y={670} size={11} fill={FG_2}>
        focus, loading, empty, error, stale, too-much-data.
      </T>
      <T x={318} y={688} size={11} fill={FG_3} family={SANS}>
        Every one keyboard-complete — the night shift does not use a mouse.
      </T>
    </Frame>
  );
}
