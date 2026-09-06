"use client";

import { motion, useReducedMotion } from "motion/react";
import { q, seeded } from "./scene-utils";

/**
 * The portrait plate.
 *
 * Rather than a stock headshot, this is a self-portrait drawn from the work: a
 * halftone field whose density traces an implied figure, annotated with the
 * facts that actually describe the practice. It carries subtle scroll-free
 * motion — the dot field breathes over 24 seconds, which you notice only if you
 * stay.
 *
 * To use a real photograph instead, drop it at `public/portrait.jpg` and
 * replace the <svg> below with a next/image fill inside the same wrapper; the
 * frame, ratio and motion all still apply.
 */
export function Portrait() {
  const reduced = useReducedMotion();
  const rand = seeded(8821);

  // A soft implied form: density falls off from an off-centre focus.
  const dots = Array.from({ length: 1500 }, () => {
    const x = rand() * 600;
    const y = rand() * 800;
    const d = Math.hypot((x - 300) / 240, (y - 330) / 300);
    const keep = rand() > d * 0.82;
    return keep ? { x: q(x), y: q(y), r: q(Math.max(0.7, 3.4 - d * 2.1)) } : null;
  }).filter(Boolean) as { x: number; y: number; r: number }[];

  return (
    <figure className="relative">
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-rule bg-paper-raised">
        <motion.svg
          viewBox="0 0 600 800"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="An abstract halftone self-portrait, drawn from project data"
          animate={reduced ? undefined : { scale: [1, 1.035, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        >
          {dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="var(--ink)"
              opacity={q(0.16 + dot.r * 0.16)}
            />
          ))}
          <circle cx="300" cy="330" r="120" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="330" x2="600" y2="330" stroke="var(--rule)" />
          <line x1="300" y1="0" x2="300" y2="800" stroke="var(--rule)" />
        </motion.svg>

        {/* Annotations, set like a technical plate. */}
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div className="flex justify-between">
            <span className="t-label">Fig. 01</span>
            <span className="t-label">8 yrs</span>
          </div>
          <div className="flex justify-between">
            <span className="t-label">Product · Editorial · Systems</span>
            <span className="t-label">Bengaluru</span>
          </div>
        </div>
      </div>

      <figcaption className="t-label mt-4">
        Self-portrait, drawn from eight years of project data
      </figcaption>
    </figure>
  );
}
