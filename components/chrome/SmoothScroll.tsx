"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Momentum scrolling.
 *
 * This is the single biggest contributor to how "expensive" a site feels, and
 * the easiest to get wrong. Lenis is used rather than a transform-based
 * approach because it drives the *real* scroll position — which keeps
 * `position: sticky` (the craft sequence), `position: fixed` (nav, cursor,
 * grain) and the native scrollbar all working exactly as they should.
 *
 * It never initialises for touch or for a reader who asked for less motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const wantsLessMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (wantsLessMotion || coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Long, decelerating — the same curve family as the reveals.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      syncTouch: false,
      anchors: { offset: -80 },
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
