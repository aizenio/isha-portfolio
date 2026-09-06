"use client";

import { useEffect, useState } from "react";

export type Surface = "paper" | "ink";

/**
 * Which surface is passing a given height on screen.
 *
 * Two callers want different probes. The navigation asks about the top band,
 * so the bar is never the wrong colour while a section slides under it. The
 * page ground asks about the middle of the viewport, so it flips only once the
 * incoming section genuinely dominates — which, given how much air sits
 * between chapters, means the change lands on whitespace rather than on text.
 */
export function useSurface({ px, ratio }: { px?: number; ratio?: number }) {
  const [surface, setSurface] = useState<Surface>("paper");

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const probe = px ?? window.innerHeight * (ratio ?? 0.5);

      let current: Surface = "paper";
      for (const section of document.querySelectorAll<HTMLElement>("main [data-surface]")) {
        // Only top-level chapters set the ambient surface; a nested plate
        // (a dark card face inside a light section, say) does not. Scoped to
        // main because <html> also carries a data-surface, and an unscoped
        // closest() would match it for every section.
        if (section.parentElement?.closest("main [data-surface]")) continue;

        const rect = section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          current = (section.dataset.surface as Surface) ?? "paper";
        }
      }
      setSurface(current);
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
  }, [px, ratio]);

  return surface;
}
