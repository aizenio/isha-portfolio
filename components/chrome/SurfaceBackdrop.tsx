"use client";

import { useEffect, useRef } from "react";

/**
 * The page's ground, as one fixed element.
 *
 * Sections used to paint their own backgrounds, which meant nothing could ever
 * sit behind them — no persistent object, no continuity between chapters. But a
 * single flat colour is wrong too: whenever two chapters share the screen, one
 * of them ends up with the wrong ground and its type goes unreadable.
 *
 * So this paints a *band per section*, positioned exactly where that section
 * currently is on screen. The ground is always correct to the pixel, and the
 * sculpture still gets to live behind all of it.
 */
export function SurfaceBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const paper = root.getPropertyValue("--paper").trim() || "#e7e8e5";
    const inkHost = document.querySelector('[data-surface="ink"]');
    const ink = inkHost
      ? getComputedStyle(inkHost).getPropertyValue("--paper").trim()
      : "#0e100f";

    let frame = 0;
    let last = "";

    const paint = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;

      const height = window.innerHeight;
      const stops: string[] = [];

      for (const section of document.querySelectorAll<HTMLElement>("main [data-surface]")) {
        // Only top-level chapters define ground; nested plates do not. The
        // lookup is scoped to main because <html> also carries a data-surface,
        // and an unscoped closest() matches it for every section.
        if (section.parentElement?.closest("main [data-surface]")) continue;

        const rect = section.getBoundingClientRect();
        const start = Math.max(0, Math.min(height, rect.top));
        const end = Math.max(0, Math.min(height, rect.bottom));
        if (end <= start) continue;

        const colour = section.dataset.surface === "ink" ? ink : paper;
        stops.push(`${colour} ${start.toFixed(1)}px`, `${colour} ${end.toFixed(1)}px`);
      }

      const image =
        stops.length >= 2 ? `linear-gradient(to bottom, ${stops.join(", ")})` : "none";

      if (image !== last) {
        node.style.backgroundImage = image;
        last = image;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} aria-hidden className="fixed inset-0 -z-20 bg-paper" />;
}
