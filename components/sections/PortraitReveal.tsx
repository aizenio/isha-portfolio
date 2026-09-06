"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { beyond } from "@/lib/content";
import { easeEditorial } from "@/lib/motion";
import { seeded } from "@/components/visuals/scene-utils";
import { q } from "@/components/visuals/scene-utils";

/**
 * The portrait, and what is inside it.
 *
 * At rest it's a halftone plate — a self-portrait drawn from project data
 * rather than a photograph. Press it and the field scatters, and the things
 * that end up in the work without being invited come out: what she's reading,
 * listening to, learning, still bad at.
 *
 * It's the one deliberately playful moment on the site, and it is a toggle
 * rather than a one-shot, so nothing is lost by pressing it.
 */

const rand = seeded(8821);

/** A soft implied form: density falls off from an off-centre focus. */
const DOTS = Array.from({ length: 1400 }, () => {
  const x = rand() * 600;
  const y = rand() * 800;
  const d = Math.hypot((x - 300) / 240, (y - 330) / 300);
  if (rand() <= d * 0.82) return null;
  return {
    x: q(x),
    y: q(y),
    r: q(Math.max(0.7, 3.4 - d * 2.1)),
    // Where this dot flies to when the plate opens.
    dx: q((x - 300) * 0.55 + (rand() - 0.5) * 90),
    dy: q((y - 330) * 0.5 - 120 - rand() * 90),
  };
}).filter(Boolean) as { x: number; y: number; r: number; dx: number; dy: number }[];

/** Flattened once, but kept grouped: the label belongs to the group, not to
 *  every line under it. */
const GROUPS = beyond.items.map((group, groupIndex) => ({
  ...group,
  // A running index so the whole reveal staggers as one sequence rather than
  // five sequences that all start together.
  offset: beyond.items
    .slice(0, groupIndex)
    .reduce((total, previous) => total + previous.lines.length + 1, 0),
}));

/** Shared reveal state, so the label and its lines move as one. */
const reveal = (open: boolean, reduced: boolean | null) =>
  open
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : { opacity: 0, y: reduced ? 0 : 12, filter: reduced ? "none" : "blur(4px)" };

const timing = (open: boolean, index: number) => ({
  duration: 0.55,
  ease: easeEditorial,
  delay: open ? 0.3 + index * 0.04 : 0,
});

export function PortraitReveal() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid items-start gap-10 md:grid-cols-12 md:gap-x-10">
      <figure className="md:col-span-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="beyond-list"
          data-cursor="view"
          data-cursor-label={open ? "Close" : "Open"}
          className="group relative block aspect-[3/4] w-full overflow-hidden border border-rule bg-paper-raised"
        >
          <svg
            viewBox="0 0 600 800"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="An abstract halftone self-portrait, drawn from project data"
          >
            {DOTS.map((dot, i) => (
              <motion.circle
                key={i}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fill="var(--ink)"
                initial={false}
                animate={
                  reduced
                    ? { opacity: open ? 0.06 : q(0.16 + dot.r * 0.16) }
                    : {
                        x: open ? dot.dx : 0,
                        y: open ? dot.dy : 0,
                        opacity: open ? 0 : q(0.16 + dot.r * 0.16),
                      }
                }
                transition={{
                  duration: open ? 1.1 : 0.85,
                  // A long tail on the way out, a quick settle on the way back.
                  ease: easeEditorial,
                  delay: reduced ? 0 : (i % 24) * 0.006,
                }}
              />
            ))}
            <circle cx="300" cy="330" r="120" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="330" x2="600" y2="330" stroke="var(--rule)" />
            <line x1="300" y1="0" x2="300" y2="800" stroke="var(--rule)" />
          </svg>

          <span className="absolute inset-0 flex flex-col justify-between p-5">
            <span className="flex justify-between">
              <span className="t-label">Fig. 01</span>
              <span className="t-label">8 yrs</span>
            </span>
            <span className="flex justify-between">
              <span className="t-label">Product · Editorial · Systems</span>
              <span className="t-label transition-colors group-hover:text-ink">
                {open ? "Close ↑" : "Open ↓"}
              </span>
            </span>
          </span>
        </button>

        <figcaption className="t-label mt-4">
          Self-portrait, drawn from eight years of project data. Press it.
        </figcaption>
      </figure>

      <div id="beyond-list" className="md:col-span-7 md:col-start-6">
        <p className="t-label">{beyond.label}</p>
        <h2 className="font-display t-title mt-4 max-w-[22ch] text-ink">{beyond.heading}</h2>

        <dl className="mt-10">
          {GROUPS.map((group) => (
            <div
              key={group.label}
              className="rule grid grid-cols-1 gap-x-8 py-4 sm:grid-cols-[9rem_1fr]"
            >
              <motion.dt
                initial={false}
                animate={reveal(open, reduced)}
                transition={timing(open, group.offset)}
                aria-hidden={!open}
                className="t-label pt-0.5"
              >
                {group.label}
              </motion.dt>
              <dd>
                {group.lines.map((line, i) => (
                  <motion.p
                    key={line}
                    initial={false}
                    animate={reveal(open, reduced)}
                    transition={timing(open, group.offset + i + 1)}
                    aria-hidden={!open}
                    className="text-[0.9375rem] leading-[1.7] text-ink"
                  >
                    {line}
                  </motion.p>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <motion.p
          initial={false}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className="t-body mt-10 max-w-[38ch] text-[0.9375rem]"
        >
          Everything in the work comes from somewhere. Press the plate to see
          where this lot came from.
        </motion.p>
      </div>
    </div>
  );
}
