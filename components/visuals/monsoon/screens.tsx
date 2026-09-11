import { body, DARK, Footer, Label, LIGHT, type Palette, Phone, Row, Rule, Runway, u } from "./kit";

/**
 * The screens themselves.
 *
 * Content matches the SwiftUI build and the screen inventory: the same
 * numbers, the same copy, the same order. Each takes a palette so the night
 * theme is the same markup rather than a second design.
 */

const ROUND = "ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif";

/* ── A · First run ─────────────────────────────────────────────────────── */

export function Welcome({ dark = false, label }: { dark?: boolean; label?: string }) {
  const c = dark ? DARK : LIGHT;
  const bars = [0.38, 0.92, 0.3, 0.34, 0.44, 0.28, 0.8, 0.36, 0.3, 0.62, 0.98, 0.32];
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <div style={{ fontSize: u(11), letterSpacing: u(1), color: c.faint, paddingTop: u(10) }}>
          MONSOON
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: u(4), height: u(72), marginTop: u(58) }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h * 100}%`,
                borderRadius: u(3),
                background: i === 1 || i === 6 || i === 10 ? c.rain : c.hairline,
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontFamily: ROUND,
            fontSize: u(30),
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: u(-0.6),
            marginTop: u(28),
          }}
        >
          Money doesn&apos;t arrive on the first.
        </div>
        <div style={{ fontSize: u(13), lineHeight: 1.5, color: c.muted, marginTop: u(14) }}>
          So Monsoon doesn&apos;t ask you to pretend it does. No envelopes, no limits. One number: how
          many days you are safe for.
        </div>
      </div>
      <div style={{ marginTop: "auto", padding: `0 ${u(20)} ${u(30)}` }}>
        <div
          style={{
            background: c.safe,
            color: c.surface,
            borderRadius: u(12),
            textAlign: "center",
            padding: `${u(13)} 0`,
            fontSize: u(14),
            fontWeight: 600,
          }}
        >
          Set up — three steps
        </div>
        <div style={{ textAlign: "center", fontSize: u(12.5), color: c.safe, paddingTop: u(14) }}>
          I already track this somewhere
        </div>
      </div>
    </Phone>
  );
}

export function InHand({ dark = false, label }: { dark?: boolean; label?: string }) {
  const c = dark ? DARK : LIGHT;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <Step palette={c} step={1} />
        <div style={{ fontSize: u(19), fontWeight: 700, marginTop: u(18) }}>
          What&apos;s in hand right now?
        </div>
        <div style={{ fontSize: u(12.5), lineHeight: 1.5, color: c.muted, marginTop: u(8) }}>
          Cash, bank, wallet — everything you could spend today. A rough number is fine; you can change
          it whenever.
        </div>
        <Label palette={c}>Money in hand</Label>
        <div
          style={{
            fontFamily: ROUND,
            fontSize: u(34),
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            display: "flex",
            alignItems: "center",
            gap: u(3),
          }}
        >
          ₹86,400
          <span style={{ width: u(2), height: u(28), background: c.safe }} />
        </div>
      </div>
      <Keypad palette={c} keys={keys} action="Continue" />
    </Phone>
  );
}

export function Outgoings({ dark = false, label }: { dark?: boolean; label?: string }) {
  const c = dark ? DARK : LIGHT;
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <Step palette={c} step={2} />
        <div style={{ fontSize: u(19), fontWeight: 700, marginTop: u(18) }}>
          What goes out, and when?
        </div>
        <div style={{ fontSize: u(12.5), lineHeight: 1.5, color: c.muted, marginTop: u(8) }}>
          Only the ones that repeat. Everything else is just spending, and Monsoon watches that on its
          own.
        </div>
        <div style={{ marginTop: u(16) }}>
          <Row palette={c} title="Studio rent" meta="Monthly · 12th" value="₹22,000" />
          <Row palette={c} title="Groceries" meta="Weekly · about" value="₹9,000" />
          <Row palette={c} title="Adobe CC" meta="Monthly · 26th" value="₹4,230" />
          <Row palette={c} title="Phone" meta="Monthly · 5th" value="₹799" />
        </div>
        <div style={{ fontSize: u(13), color: c.safe, paddingTop: u(14) }}>+ Add an outgoing</div>
      </div>
      <div style={{ marginTop: "auto", padding: `0 ${u(20)} ${u(30)}` }}>
        <div style={{ fontSize: u(11), color: c.faint, paddingBottom: u(10) }}>
          That&apos;s ₹2,270 a day, at this rate
        </div>
        <div
          style={{
            background: c.safe,
            color: c.surface,
            borderRadius: u(12),
            textAlign: "center",
            padding: `${u(13)} 0`,
            fontSize: u(14),
            fontWeight: 600,
          }}
        >
          Continue
        </div>
      </div>
    </Phone>
  );
}

function Step({ palette, step }: { palette: Palette; step: number }) {
  return (
    <div style={{ paddingTop: u(8) }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: u(12.5) }}>
        <span style={{ color: palette.safe }}>Back</span>
        <span style={{ fontWeight: 600 }}>Step {step} of 3</span>
        <span style={{ opacity: 0 }}>Back</span>
      </div>
      <div style={{ display: "flex", gap: u(6), marginTop: u(12) }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: u(3),
              borderRadius: u(2),
              background: i < step ? palette.safe : palette.hairline,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── B · The daily loop ────────────────────────────────────────────────── */

export function Home({
  dark = false,
  tight = false,
  label,
}: {
  dark?: boolean;
  tight?: boolean;
  label?: string;
}) {
  const c = dark ? DARK : LIGHT;
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <div style={{ fontSize: u(11.5), color: c.faint, paddingTop: u(6) }}>Tuesday, 4 March</div>
        <div style={{ fontSize: u(21), fontWeight: 700, paddingTop: u(2), paddingBottom: u(14) }}>
          Runway
        </div>
        {tight ? (
          <Runway palette={c} days={9} date="13 March" inHand="₹20,430" perDay="₹2,270" fill={0.15} />
        ) : (
          <Runway palette={c} days={38} date="11 April" inHand="₹86,400" perDay="₹2,270" fill={0.62} />
        )}
        <Label palette={c}>What would move this</Label>
        <Rule palette={c} />
        {tight ? (
          <>
            <Row palette={c} title="Chase Meera Co." meta="₹40,000 · 4 days late" value="+18 days" tone={c.safe} />
            <Row palette={c} title="Move studio rent to the 20th" meta="₹22,000 · due 12 Mar" value="+8 days" tone={c.safe} />
            <div
              style={{
                background: c.raised,
                borderRadius: u(11),
                padding: u(12),
                marginTop: u(14),
                fontSize: u(12),
                lineHeight: 1.5,
              }}
            >
              Doing both takes you to 5 April.
              <br />
              <span style={{ color: c.muted }}>Neither is urgent today.</span>
            </div>
          </>
        ) : (
          <>
            <Row palette={c} title="Ravi Design invoice" meta="₹48,000 · 6 days late" value="+21 days" tone={c.safe} />
            <Row palette={c} title="Studio rent" meta="₹22,000 · due 12 Mar" value="−10 days" />
            <Label palette={c}>Recent</Label>
            <Row palette={c} title="Anand Studio" meta="Client payment · 28 Feb" value="₹32,000" tone={c.rain} />
            <Row palette={c} title="Adobe CC" meta="Subscription · 26 Feb" value="₹4,230" />
          </>
        )}
      </div>
      <Footer palette={c} action="Log a payment" />
    </Phone>
  );
}

export function LogPayment({ dark = false, label }: { dark?: boolean; label?: string }) {
  const c = dark ? DARK : LIGHT;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: u(13), paddingTop: u(8) }}>
          <span style={{ color: c.safe }}>Cancel</span>
          <span style={{ fontWeight: 600 }}>Log a payment</span>
          <span style={{ opacity: 0 }}>Cancel</span>
        </div>
        <Label palette={c}>Amount received</Label>
        <div
          style={{
            fontFamily: ROUND,
            fontSize: u(34),
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            display: "flex",
            alignItems: "center",
            gap: u(3),
          }}
        >
          ₹48,000
          <span style={{ width: u(2), height: u(28), background: c.safe }} />
        </div>
        <div style={{ marginTop: u(14) }}>
          {[
            ["From", "Ravi Design"],
            ["Date", "Today, 4 March"],
            ["Category", "Client payment"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: `${u(11)} 0`,
                borderBottom: `1px solid ${c.hairline}`,
                fontSize: u(13),
              }}
            >
              <span style={{ color: c.muted }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <Keypad palette={c} keys={keys} action="Save" sub="Runway +21 days" />
    </Phone>
  );
}

function Keypad({
  palette,
  keys,
  action,
  sub,
}: {
  palette: Palette;
  keys: string[];
  action: string;
  sub?: string;
}) {
  return (
    <div style={{ marginTop: "auto", padding: `0 ${u(20)} ${u(28)}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: u(7) }}>
        {keys.map((key) => (
          <div
            key={key}
            style={{
              height: u(38),
              borderRadius: u(19),
              background: palette.raised,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: ROUND,
              fontSize: u(17),
              color: key === "⌫" ? palette.muted : palette.ink,
            }}
          >
            {key}
          </div>
        ))}
      </div>
      <div
        style={{
          background: palette.safe,
          color: palette.surface,
          borderRadius: u(12),
          textAlign: "center",
          padding: `${u(11)} 0`,
          marginTop: u(14),
          lineHeight: 1.25,
        }}
      >
        <div style={{ fontSize: u(14), fontWeight: 600 }}>{action}</div>
        {sub && <div style={{ fontSize: u(11), opacity: 0.86 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── D · Plan ──────────────────────────────────────────────────────────── */

export function Plan({ dark = false, label }: { dark?: boolean; label?: string }) {
  const c = dark ? DARK : LIGHT;
  const bars = [0.35, 0.5, 0.28, 0.62, 0.44, 0.71, 0.3, 0.55, 0.48, 0.92, 0.4, 0.36, 0.58, 0.33];
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <div style={{ fontSize: u(21), fontWeight: 700, padding: `${u(8)} 0 ${u(14)}` }}>Plan</div>
        <Runway
          palette={c}
          days={59}
          date="2 May"
          inHand="₹1,34,400"
          perDay="₹2,270"
          delta="+21 days"
          fill={0.86}
        />
        <Label palette={c}>This month</Label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: u(4), height: u(62) }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h * 100}%`,
                borderRadius: u(3),
                background: i === 9 ? c.safe : c.hairline,
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: u(11),
            color: c.faint,
            paddingTop: u(9),
            fontVariantNumeric: "tabular-nums",
          }}
        >
          In ₹1.4L · out ₹68k · 9 days to next payment
        </div>
        <div
          style={{
            background: c.raised,
            borderRadius: u(11),
            padding: u(12),
            marginTop: u(14),
            fontSize: u(12),
            lineHeight: 1.5,
          }}
        >
          <b>One invoice still unpaid</b>
          <br />
          <span style={{ color: c.muted }}>₹26,000, 21 days late. Chasing it adds 14 days.</span>
        </div>
      </div>
      <Footer palette={c} active={2} />
    </Phone>
  );
}

export function Seasons({ dark = false, label }: { dark?: boolean; label?: string }) {
  const c = dark ? DARK : LIGHT;
  const months = [0.62, 0.8, 0.54, 0.9, 0.7, 0.34, 0.3, 0.48, 0.76, 0.86, 0.44, 0.4];
  const names = ["A", "S", "O", "N", "D", "J", "F", "M", "A", "M", "J", "J"];
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${u(8)} 0 ${u(14)}`,
          }}
        >
          <span style={{ fontSize: u(21), fontWeight: 700 }}>Plan</span>
          <span
            style={{
              display: "flex",
              background: c.raised,
              borderRadius: u(999),
              padding: u(2),
              fontSize: u(11),
            }}
          >
            <span style={{ padding: `${u(4)} ${u(10)}`, color: c.muted }}>Month</span>
            <span
              style={{
                padding: `${u(4)} ${u(10)}`,
                borderRadius: u(999),
                background: c.surface,
                fontWeight: 600,
              }}
            >
              Seasons
            </span>
          </span>
        </div>
        <Label palette={c}>Last twelve months · what landed</Label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: u(4), height: u(78) }}>
          {months.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h * 100}%`,
                borderRadius: u(3),
                background: i === 5 || i === 6 ? c.tight : c.rain,
                opacity: i === 5 || i === 6 ? 1 : 0.75,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: u(4), paddingTop: u(6) }}>
          {names.map((n, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: u(9), color: c.faint }}>
              {n}
            </div>
          ))}
        </div>
        <div
          style={{
            background: c.raised,
            borderRadius: u(11),
            padding: u(12),
            marginTop: u(16),
            fontSize: u(12),
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontSize: u(10.5), letterSpacing: u(1), color: c.faint, paddingBottom: u(5) }}>
            YOUR LEAN STRETCH
          </div>
          June and July have been your thinnest months two years running.
          <br />
          <span style={{ color: c.muted }}>Setting aside ₹1,900 a week from now would cover the gap.</span>
        </div>
      </div>
      <Footer palette={c} active={2} />
    </Phone>
  );
}

/** A month moved, with the delta recalculating in place. */
export function MoveBill({ dark = false, label }: { dark?: boolean; label?: string }) {
  const c = dark ? DARK : LIGHT;
  const days = [12, 14, 16, 18, 20, 22, 24];
  const names = ["Wed", "Fri", "Sun", "Tue", "Thu", "Sat", "Mon"];
  return (
    <Phone dark={dark} label={label}>
      <div style={body(c)}>
        <div style={{ fontSize: u(21), fontWeight: 700, padding: `${u(8)} 0 ${u(14)}` }}>Plan</div>
        <Runway palette={c} days={9} date="13 March" inHand="₹20,430" perDay="₹2,270" fill={0.15} />
      </div>
      <div
        style={{
          marginTop: "auto",
          background: c.raised,
          borderTopLeftRadius: u(18),
          borderTopRightRadius: u(18),
          padding: `${u(16)} ${u(20)} ${u(30)}`,
        }}
      >
        <div
          style={{
            width: u(38),
            height: u(4),
            borderRadius: u(2),
            background: c.hairline,
            margin: `0 auto ${u(14)}`,
          }}
        />
        <div style={{ fontSize: u(15), fontWeight: 700 }}>Move studio rent</div>
        <div style={{ fontSize: u(11.5), color: c.muted, paddingTop: u(3) }}>
          ₹22,000 · currently the 12th
        </div>
        <div style={{ display: "flex", gap: u(5), marginTop: u(14) }}>
          {days.map((d, i) => (
            <div
              key={d}
              style={{
                flex: 1,
                borderRadius: u(9),
                padding: `${u(7)} 0`,
                textAlign: "center",
                background: i === 4 ? c.safe : "transparent",
                color: i === 4 ? c.surface : c.ink,
                border: i === 4 ? "none" : `1px solid ${c.hairline}`,
              }}
            >
              <div style={{ fontSize: u(13), fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{d}</div>
              <div style={{ fontSize: u(8.5), opacity: 0.7 }}>{names[i]}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: u(10),
            marginTop: u(16),
            fontFamily: ROUND,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span style={{ fontSize: u(24), color: c.faint }}>9</span>
          <span style={{ fontSize: u(14), color: c.muted }}>→</span>
          <span style={{ fontSize: u(24), fontWeight: 700, color: c.safe }}>17 days</span>
        </div>
        <div
          style={{
            background: c.safe,
            color: c.surface,
            borderRadius: u(12),
            textAlign: "center",
            padding: `${u(12)} 0`,
            marginTop: u(14),
            fontSize: u(14),
            fontWeight: 600,
          }}
        >
          Move it to the 20th
        </div>
      </div>
    </Phone>
  );
}
