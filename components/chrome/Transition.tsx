"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { easeEditorial } from "@/lib/motion";

/**
 * Navigation as travel, not as a page swap.
 *
 * Two things sell "you are moving to that place" rather than "the page just
 * changed":
 *
 *  - An iris. A circular mask grows from the exact point you clicked until it
 *    swallows the screen, carrying the destination's name; once the new route
 *    has mounted underneath, the same iris shrinks back to nothing from that
 *    same point. The click point is real viewport pixels on a `position:fixed`
 *    layer, so this part is geometrically exact — the portal genuinely opens
 *    where your cursor was.
 *
 *  - Depth. The page itself eases back — a touch smaller, softly blurred,
 *    dimmed — while the iris is closing over it, then eases back into sharp
 *    focus once the iris opens on the new route. This is deliberately a
 *    generic recede-and-arrive rather than a geometrically precise zoom: the
 *    page is a tall scrolling column, not a viewport-sized plane, so scaling
 *    it around the exact click point would need the document's live scroll
 *    height and would drift the moment the destination page is a different
 *    length. Centring it keeps the effect robust across every route.
 *
 * The App Router renders the next segment immediately, so an exit animation
 * that runs *after* the click is impossible to synchronise — this owns the
 * navigation instead: cover, then push, then reveal.
 *
 * Ordinary <Link>s still work — they just cut. Use <TransitionLink> for the
 * ones that deserve the full journey, and render <TransitionMain> once, in
 * the root layout, around the routed page content.
 */

type Point = { x: number; y: number };
type Phase = "idle" | "depart" | "covered" | "arrive";
type Navigate = (href: string, label?: string, point?: Point) => void;

const TransitionContext = createContext<Navigate | null>(null);
const PhaseContext = createContext<Phase>("idle");

/** How long the iris takes to close over the page. */
const DEPART_MS = 640;
/** How long it takes to open back up on the new one. */
const ARRIVE_MS = 720;
/** A short beat once the new route has mounted, so its own layout settles
 *  before the iris starts opening on it. */
const SETTLE_MS = 70;

const REST_POSE = { scale: 1, opacity: 1, filter: "blur(0px)" };
const RECEDED_POSE = { scale: 0.95, opacity: 0.5, filter: "blur(16px)" };

/** Distance from `point` to the farthest corner of the viewport — the radius
 *  the iris needs to fully cover the screen from there. */
function coverRadius(point: Point) {
  const dx = Math.max(point.x, window.innerWidth - point.x);
  const dy = Math.max(point.y, window.innerHeight - point.y);
  return Math.hypot(dx, dy);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const [state, setState] = useState<{
    phase: Phase;
    label: string | null;
    point: Point;
    radius: number;
  }>({ phase: "idle", label: null, point: { x: 0, y: 0 }, radius: 0 });

  const pendingHref = useRef<string | null>(null);

  const navigate = useCallback<Navigate>(
    (href, label, point) => {
      if (href === pathname) return;
      if (reduced) {
        router.push(href);
        return;
      }
      const origin = point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      pendingHref.current = href;
      setState({ phase: "depart", label: label ?? null, point: origin, radius: coverRadius(origin) });
    },
    [pathname, reduced, router],
  );

  /* The iris has closed — hand off to the router and hold the cover. */
  useEffect(() => {
    if (state.phase !== "depart") return;
    const timer = window.setTimeout(() => {
      if (pendingHref.current) router.push(pendingHref.current);
      setState((s) => ({ ...s, phase: "covered" }));
    }, DEPART_MS);
    return () => window.clearTimeout(timer);
  }, [state.phase, router]);

  /* The new route has actually mounted — start opening onto it. */
  useEffect(() => {
    if (state.phase !== "covered" || !pendingHref.current) return;
    const [targetPath] = pendingHref.current.split("#");
    if (pathname !== (targetPath || "/")) return;
    pendingHref.current = null;
    const timer = window.setTimeout(() => setState((s) => ({ ...s, phase: "arrive" })), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, state.phase]);

  useEffect(() => {
    if (state.phase !== "arrive") return;
    const timer = window.setTimeout(
      () => setState({ phase: "idle", label: null, point: { x: 0, y: 0 }, radius: 0 }),
      ARRIVE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase]);

  const covering = state.phase === "depart" || state.phase === "covered";

  return (
    <TransitionContext.Provider value={navigate}>
      <PhaseContext.Provider value={state.phase}>{children}</PhaseContext.Provider>

      <motion.div
        aria-hidden
        data-surface="ink"
        className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center bg-paper text-ink"
        initial={false}
        animate={{
          clipPath: `circle(${covering ? state.radius : 0}px at ${state.point.x}px ${state.point.y}px)`,
        }}
        transition={{
          duration: (state.phase === "depart" ? DEPART_MS : state.phase === "arrive" ? ARRIVE_MS : 0) / 1000,
          ease: easeEditorial,
        }}
      >
        {state.label && (
          <motion.span
            className="font-display t-chapter px-6 text-center"
            initial={false}
            animate={{ opacity: covering ? 1 : 0, y: covering ? 0 : 14 }}
            transition={{ duration: 0.4, ease: easeEditorial, delay: covering ? 0.2 : 0 }}
          >
            {state.label}
          </motion.span>
        )}
      </motion.div>
    </TransitionContext.Provider>
  );
}

/**
 * The routed page, wrapped once in the root layout.
 *
 * This — not the provider — is what actually carries the depth cue, because
 * it has to be the element that persists across a navigation while its
 * `children` (the page segment) swap underneath it. Nav and the cursor sit
 * outside it deliberately: they're chrome, not the place being travelled to.
 */
export function TransitionMain({ children }: { children: ReactNode }) {
  const phase = useContext(PhaseContext);
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <main id="main" className="relative z-0 flex-1">
        {children}
      </main>
    );
  }

  const receded = phase === "depart" || phase === "covered";

  return (
    <motion.main
      id="main"
      className="relative z-0 flex-1"
      initial={false}
      animate={receded ? RECEDED_POSE : REST_POSE}
      transition={{
        duration: (phase === "depart" ? DEPART_MS : phase === "arrive" ? ARRIVE_MS : 260) / 1000,
        ease: easeEditorial,
      }}
    >
      {children}
    </motion.main>
  );
}

/** A link that plays the journey. `label` is what the iris announces. */
export function TransitionLink({
  href,
  label,
  children,
  onClick,
  ...rest
}: { href: string; label?: string } & Omit<ComponentProps<typeof Link>, "href">) {
  const navigate = useContext(TransitionContext);
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);

        // Let the browser handle new-tab and modified clicks.
        if (
          !navigate ||
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }

        // A same-page anchor — "#deck", or "/about#x" while already on
        // /about — is a scroll, not a journey. Leave it to the browser.
        const [path] = href.split("#");
        if ((path || pathname) === pathname) return;

        event.preventDefault();

        // Keyboard activation reports (0, 0) in some browsers; aim the portal
        // at the control itself rather than the corner of the screen.
        const rect = event.currentTarget.getBoundingClientRect();
        const point =
          event.clientX === 0 && event.clientY === 0
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : { x: event.clientX, y: event.clientY };

        navigate(href, label, point);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
