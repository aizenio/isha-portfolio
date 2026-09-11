import { Board } from "./kit";
import { Home, InHand, LogPayment, MoveBill, Outgoings, Plan, Seasons, Welcome } from "./screens";

/** The plates: a row of screens on a ground, sized by the plate's own width. */

export function BoardIOS() {
  return (
    <Board>
      <Home label="Runway" />
      <LogPayment label="Log a payment" />
      <Plan label="After it lands" />
    </Board>
  );
}

export function BoardNight() {
  return (
    <Board>
      <Home dark label="Night" />
      <Home tight label="Nine days left" />
      <Plan dark label="Plan, at night" />
    </Board>
  );
}

export function BoardFirstRun() {
  return (
    <Board label="A · First run" heading="Three steps, no account, nothing called a budget.">
      <Welcome label="Welcome" />
      <InHand label="What's in hand" />
      <Outgoings label="What goes out" />
    </Board>
  );
}

export function BoardLoop() {
  return (
    <Board label="B · The daily loop" heading="Open, read one number, log what landed, close.">
      <Home label="Runway — healthy" />
      <Home tight label="Runway — tight" />
      <LogPayment label="Log a payment" />
    </Board>
  );
}

export function BoardPlan() {
  return (
    <Board label="D · Plan" heading="A month is a shape, not a verdict.">
      <Plan label="Plan — this month" />
      <MoveBill label="Move a bill — live delta" />
      <Seasons label="Plan — the seasons" />
    </Board>
  );
}
