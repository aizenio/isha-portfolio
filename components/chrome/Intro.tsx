"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { designer } from "@/lib/content";
import { easeEditorial } from "@/lib/motion";
import { markReady, readyCount, readyCountOnServer, subscribeReady, TASKS } from "@/lib/loading";

/**
 * The opening sequence.
 *
 * A site like this gets one chance to set expectations, so the first visit of a
 * session gets a curated entrance: a count that tracks real loading progress,
 * the name, and then the panel splits and clears out of the way.
 *
 * It runs once per session, is skipped under prefers-reduced-motion, and gates
 * the first screen's own reveal through context so the two never overlap.
 */

const IntroContext = createContext(true);

/** True once the reader is looking at the page and the scene may begin. */
export const useIntroReady = () => useContext(IntroContext);

const SESSION_KEY = "isha:intro-played";
/** Long enough to read the name; short enough not to be a toll gate. */
const MIN_MS = 1400;
/**
 * Never trap the reader behind a texture that will not arrive.
 *
 * This used to be five seconds, which was five seconds of dark screen whenever
 * the deck's textures were slow — a cold load on a real connection, in other
 * words. The panel is an introduction, not a loading screen: past this it
 * clears whether or not the work behind it has landed.
 */
const MAX_MS = 2000;

/**
 * Decided once per page load, at module scope.
 *
 * This used to be read from sessionStorage inside the effect, which also wrote
 * to it — so React's development double-invoke read back its own write on the
 * second pass and skipped the sequence entirely. The flag is now written when
 * the intro *finishes*, and the decision itself is memoised so it cannot flip
 * mid-mount.
 */
let alreadyPlayed: boolean | null = null;

export function IntroProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"pending" | "playing" | "done">("pending");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (alreadyPlayed === null) {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    }
    if (alreadyPlayed || reduced) {
      setPhase("done");
      return;
    }
    setPhase("playing");
    document.documentElement.classList.add("intro-locked");
  }, [reduced]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (phase !== "playing") document.documentElement.classList.remove("intro-locked");
  }, [phase]);

  /*
   * Stable across renders: the curtain's counter loop keys off this, and a new
   * identity on every render restarted the count from zero.
   */
  const finish = useCallback(() => {
    alreadyPlayed = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode — the intro simply plays again next load */
    }
    setPhase("done");
  }, []);

  return (
    <IntroContext.Provider value={phase === "done"}>
      <AnimatePresence>
        {phase === "playing" && <IntroCurtain key="intro" onFinish={finish} />}
      </AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}

function IntroCurtain({ onFinish }: { onFinish: () => void }) {
  const ready = useSyncExternalStore(subscribeReady, readyCount, readyCountOnServer);
  const [count, setCount] = useState(0);

  /* The display face is one of the two things worth waiting for. */
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) markReady("fonts");
    });
    // A stalled texture must never hold the page hostage.
    const bail = window.setTimeout(() => {
      TASKS.forEach(markReady);
    }, MAX_MS);
    /*
     * And a hard stop. The counter is driven by requestAnimationFrame, which a
     * backgrounded tab pauses outright — without this the page stays locked
     * behind the panel until the reader comes back and frames resume.
     */
    const hardStop = window.setTimeout(onFinish, MAX_MS + 600);
    return () => {
      cancelled = true;
      window.clearTimeout(bail);
      window.clearTimeout(hardStop);
    };
  }, [onFinish]);

  /*
   * The counter chases real progress rather than replaying a canned animation:
   * it eases toward whatever fraction of the work is done and only reaches 100
   * when everything has actually landed and the floor has elapsed.
   */
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let value = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const real = ready / TASKS.length;
      const floor = Math.min(1, elapsed / MIN_MS);
      const target = Math.min(real, floor) * 100;

      value += (target - value) * 0.09;
      setCount(Math.round(value));

      if (value > 99.4 && real >= 1 && elapsed >= MIN_MS) {
        setCount(100);
        onFinish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready, onFinish]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" data-surface="ink">
      {/* Two halves that clear in opposite directions — the page is revealed
          from the middle out rather than wiped in one direction. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 origin-top bg-paper"
        exit={{ y: "-100%" }}
        transition={{ duration: 1, ease: easeEditorial }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-paper"
        exit={{ y: "100%" }}
        transition={{ duration: 1, ease: easeEditorial }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col justify-between px-[clamp(1.25rem,5vw,5.5rem)] py-8 text-ink"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: easeEditorial }}
      >
        <motion.span
          className="t-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {designer.role}
        </motion.span>

        <div className="flex items-end justify-between gap-8">
          <span className="word-mask">
            <motion.span
              className="font-display block text-[clamp(3rem,11vw,9rem)] leading-[0.9]"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.05, ease: easeEditorial }}
            >
              {designer.name}
            </motion.span>
          </span>
          <span className="t-label pb-2 tabular-nums text-ink">
            {String(count).padStart(3, "0")}
          </span>
        </div>

        <span aria-hidden className="block h-px w-full bg-rule">
          <motion.span
            className="block h-px origin-left bg-accent"
            initial={false}
            animate={{ scaleX: count / 100 }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
        </span>
      </motion.div>
    </div>
  );
}
