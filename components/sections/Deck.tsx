"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { TransitionLink } from "@/components/chrome/Transition";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { deck, DECK_COUNT } from "@/lib/deck";
import { designer } from "@/lib/content";
import { duration, easeEditorial } from "@/lib/motion";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { RevealText } from "@/components/primitives/RevealText";
import { useEnhancedVisuals } from "@/lib/use-enhanced-visuals";
import { useIntroReady } from "@/components/chrome/Intro";
import { markReady } from "@/lib/loading";

/**
 * The landing experience: the hero and the work, as one continuous piece.
 *
 * At rest the reader sees a hero — name, statement, role — beside a wheel of
 * the three projects, turning slowly on its own. Scrolling doesn't leave that
 * scene for a new one; it unrolls the wheel into a conveyor, the hero copy
 * gives way to it, and the reader ends up scrubbing through the same three
 * cards as full case-study introductions. One `blend` value (0 = wheel,
 * 1 = conveyor) drives the whole handover, and `progress` — unchanged from
 * before — drives which card is centred once the conveyor has taken over.
 *
 * Without WebGL, or with reduced motion, the same content renders as the hero
 * copy followed by a plain vertical list of plates. Nothing is only available
 * through the animation.
 */
const DeckScene = dynamic(() => import("@/components/three/DeckScene"), {
  ssr: false,
});

/** How much scrolling each card gets, once the conveyor has taken over. */
const STEP_VH = 0.72;
/** How much scrolling the wheel-to-conveyor handover itself gets. */
const UNROLL_VH = 1.15;

export function Deck() {
  const track = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const blend = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const heroBlend = useMotionValue(0);

  const enabled = useEnhancedVisuals();
  const reduced = useReducedMotion();
  const introReady = useIntroReady();
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(true);
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);

  const onReady = useCallback(() => {
    setLive(true);
    markReady("deck");
  }, []);

  // No WebGL, or reduced motion: there are no textures to wait for.
  useEffect(() => {
    if (!enabled) markReady("deck");
  }, [enabled]);

  /* Scroll drives progress and blend; only the rounded index and the engaged
     threshold become React state — everything continuous stays in refs and
     one motion value, so this never re-renders on every pixel of scroll. */
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const node = track.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const travel = node.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      const unrollPx = window.innerHeight * UNROLL_VH;

      let ratio: number;
      if (scrolled <= unrollPx) {
        const b = unrollPx > 0 ? scrolled / unrollPx : 1;
        blend.current = b;
        progress.current = 0;
        heroBlend.set(b);
      } else {
        blend.current = 1;
        heroBlend.set(1);
        const remaining = travel - unrollPx;
        ratio = remaining > 0 ? (scrolled - unrollPx) / remaining : 0;
        progress.current = ratio * (DECK_COUNT - 1);
      }

      setIndex(Math.round(progress.current));
      setEngaged(blend.current > 0.5);
      setActive(rect.top < window.innerHeight && rect.bottom > 0);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, heroBlend]);

  /* Cursor drifts the lens. */
  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth - 0.5;
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  /* Arrow keys step the deck. They land after the wheel has unrolled — the
     conveyor is the only state a "previous/next project" control describes. */
  const stepTo = useCallback((next: number) => {
    const node = track.current;
    if (!node) return;
    const travel = node.offsetHeight - window.innerHeight;
    const unrollPx = window.innerHeight * UNROLL_VH;
    const remaining = Math.max(0, travel - unrollPx);
    const target =
      node.offsetTop +
      unrollPx +
      (Math.min(Math.max(next, 0), DECK_COUNT - 1) / (DECK_COUNT - 1)) * remaining;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const heroOpacity = useTransform(heroBlend, [0, 0.55], [1, 0]);
  const heroShift = useTransform(heroBlend, [0, 1], [0, -32]);
  const deckOpacity = useTransform(heroBlend, [0.4, 1], [0, 1]);

  const card = deck[Math.min(index, DECK_COUNT - 1)];

  return (
    <section
      id="deck"
      data-surface="paper"
      ref={track}
      className="relative"
      // The track only needs its full height once the deck is actually
      // running; until then the fallback content flows normally.
      style={
        live
          ? {
              height: `calc(100svh + ${UNROLL_VH * 100}svh + ${
                (DECK_COUNT - 1) * STEP_VH * 100
              }svh)`,
            }
          : undefined
      }
    >
      {/* The artwork. Always in the DOM: it is the texture source, the
          no-WebGL fallback, and the only copy of the work. */}
      {/*
       * The card artwork is drawn on the ink surface even though the page
       * around it is porcelain. Near-white plates on a near-white ground had
       * almost no presence — the reference gets its weight from photography,
       * and this is where ours comes from instead.
       */}
      <div
        ref={source}
        data-surface="ink"
        aria-hidden={live ? true : undefined}
        className={
          live
            ? "pointer-events-none invisible absolute h-px w-px overflow-hidden"
            : "shell flex flex-col gap-16 pt-32"
        }
      >
        {!live && (
          <div className="mb-4 max-w-[46ch]">
            <p className="t-label">
              {designer.role} — {designer.location}
            </p>
            <RevealText
              as="h1"
              onMount
              play={introReady}
              delay={0.15}
              className="font-display t-hero mt-10 max-w-[15ch] text-ink"
              lines={["I design digital", "experiences that make", "complex things", "feel simple."]}
              accentWords={["simple"]}
            />
            <p className="t-lede mt-10 max-w-[36ch]">{designer.supporting}</p>
          </div>
        )}

        {deck.map((item) => (
          <figure key={item.id} className={live ? "" : "w-full"}>
            <div
              data-plate
              className="aspect-[16/10] w-full overflow-hidden border border-rule bg-paper-raised"
            >
              <ProjectVisual visual={item.visual} />
            </div>
            {!live && (
              <figcaption className="mt-4">
                <span className="t-label">
                  {item.label} — {item.category} — {item.year}
                </span>
                <p className="font-display mt-2 text-[1.75rem] leading-none text-ink">
                  {item.href ? (
                    <Link href={item.href}>{item.name}</Link>
                  ) : (
                    item.name
                  )}
                </p>
                <p className="t-body mt-2 max-w-[46ch] text-[0.9375rem]">
                  {item.blurb}
                </p>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* The scene mounts as soon as the reader qualifies — it is what reports
          `live`, so gating it on `live` would deadlock. Until its textures are
          built it renders nothing and the fallback above stands in. */}
      {enabled && (
        <div
          className={
            live
              ? "sticky top-0 h-[100svh] overflow-hidden"
              : "pointer-events-none absolute inset-0 opacity-0"
          }
        >
          <DeckScene
            source={source}
            progress={progress}
            blend={blend}
            pointer={pointer}
            active={active}
            onReady={onReady}
          />

          {live && (
            <>
              {/* Hero: the wheel's caption. Fades out as the reader scrolls
                  the wheel into the conveyor.
                  Anchored from the top with a fixed offset, not centred: a
                  centred flex box overflows *upward* — past the nav, off the
                  top of the screen — the moment its content is taller than
                  the container, which four lines of t-hero plus a label,
                  a paragraph and a scroll cue reliably are. Anchoring from
                  the top means the worst case is running close to the
                  bottom edge, not intruding on the nav. */}
              <motion.div
                style={{ opacity: heroOpacity, y: heroShift }}
                className="shell pointer-events-none absolute inset-0 flex flex-col pb-24 pt-28 md:max-w-[52%] md:pb-0 md:pt-40"
              >
                <p className="t-label">
                  {designer.role} — {designer.location}
                </p>
                <RevealText
                  as="h1"
                  onMount
                  play={introReady}
                  delay={0.15}
                  className="font-display t-hero mt-10 max-w-[15ch] text-ink"
                  lines={["I design digital", "experiences that make", "complex things", "feel simple."]}
                  accentWords={["simple"]}
                />
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={introReady ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: duration.scene, delay: 0.85, ease: easeEditorial }}
                  className="t-lede mt-10 max-w-[36ch]"
                >
                  {designer.supporting}
                </motion.p>
                <motion.div
                  initial={reduced ? false : { opacity: 0 }}
                  animate={introReady ? { opacity: 1 } : undefined}
                  transition={{ duration: duration.slow, delay: 1.1 }}
                  className="mt-14 flex items-center gap-3"
                >
                  <span className="t-label">Scroll to explore</span>
                  <motion.span
                    aria-hidden
                    className="text-ink-muted"
                    animate={reduced ? undefined : { y: [0, 6, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↓
                  </motion.span>
                </motion.div>
              </motion.div>

              {/* Counter */}
              <motion.div
                style={{ opacity: deckOpacity }}
                className="shell pointer-events-none absolute inset-x-0 top-0 pt-24 md:pt-28"
              >
                <div className="flex items-start gap-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={card.label}
                      initial={reduced ? false : { y: "60%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={
                        reduced ? { opacity: 0 } : { y: "-60%", opacity: 0 }
                      }
                      transition={{ duration: 0.5, ease: easeEditorial }}
                      className="font-display block text-[clamp(3rem,7vw,5.5rem)] leading-[0.8] text-ink"
                    >
                      {card.label}
                    </motion.span>
                  </AnimatePresence>
                  <span className="t-label pt-1">
                    /{String(DECK_COUNT).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>

              {/* The card the reader is looking at */}
              <motion.div
                style={{ opacity: deckOpacity }}
                className="shell absolute inset-x-0 bottom-0 pb-12 md:pb-16"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={card.id}
                    initial={
                      reduced
                        ? false
                        : { opacity: 0, y: 16, filter: "blur(5px)" }
                    }
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, y: -12, filter: "blur(5px)" }
                    }
                    transition={{ duration: 0.42, ease: easeEditorial }}
                    className="mx-auto max-w-[46ch] text-center"
                  >
                    <p className="t-label">{card.category}</p>

                    {card.href ? (
                      <TransitionLink
                        href={card.href}
                        label={card.name}
                        data-cursor="view"
                        data-cursor-label="View case study"
                        className="group mt-3 inline-block"
                        tabIndex={engaged ? 0 : -1}
                      >
                        <h2 className="font-display t-title text-ink">
                          {card.name}
                        </h2>
                        <span className="t-label mt-3 flex items-center justify-center gap-2 text-ink">
                          View case study
                          <span
                            aria-hidden
                            className="text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </span>
                      </TransitionLink>
                    ) : (
                      <>
                        <h2 className="font-display t-title mt-3 text-ink">
                          {card.name}
                        </h2>
                        <span className="t-label mt-3 block">{card.meta}</span>
                      </>
                    )}

                    <p className="t-body mx-auto mt-5 max-w-[42ch] text-[0.9375rem]">
                      {card.blurb}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Chrome */}
              {/* Kept to the right: the incoming card crops into the lower
                  left corner, and dark chrome on a dark plate is unreadable.
                  Only actually clickable once the conveyor has taken over —
                  before that, "previous/next project" describes nothing. */}
              <motion.div
                style={{ opacity: deckOpacity }}
                className="shell pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end gap-5 pb-12 md:pb-16"
              >
                <span className="t-label hidden sm:block">Scroll</span>
                <div
                  className={`flex items-center gap-2 ${
                    engaged ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => stepTo(index - 1)}
                    disabled={index === 0 || !engaged}
                    tabIndex={engaged ? 0 : -1}
                    aria-label="Previous project"
                    className="t-label px-2 py-1 transition-colors hover:text-ink disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => stepTo(index + 1)}
                    disabled={index === DECK_COUNT - 1 || !engaged}
                    tabIndex={engaged ? 0 : -1}
                    aria-label="Next project"
                    className="t-label px-2 py-1 transition-colors hover:text-ink disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
