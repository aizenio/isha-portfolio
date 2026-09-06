"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { beyond } from "@/lib/content";
import { easeEditorial, inView } from "@/lib/motion";
import { Marker } from "@/components/primitives/Marker";

/**
 * The person, not the résumé. Five short columns of inputs.
 *
 * Each line responds independently — a small indent and an accent mark — so the
 * section rewards a slow read without ever animating as a block.
 */
export function Beyond() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section data-surface="paper" className="relative pb-28 md:pb-44">
      <div className="shell">
        <Marker index="07" label={beyond.label} align="between">
          <span className="t-label hidden sm:inline">Updated monthly</span>
        </Marker>

        <h2 className="font-display t-title mt-12 max-w-[24ch] text-ink">
          {beyond.heading}
        </h2>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {beyond.items.map((item, columnIndex) => (
            <motion.div
              key={item.label}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.7, delay: columnIndex * 0.06, ease: easeEditorial }}
            >
              <h3 className="t-label">{item.label}</h3>
              <ul className="mt-4 space-y-2.5">
                {item.lines.map((line) => {
                  const id = `${item.label}-${line}`;
                  const isActive = active === id;
                  return (
                    <li key={line}>
                      <motion.span
                        className="flex cursor-default items-baseline gap-2 text-[0.9375rem] leading-[1.45]"
                        onHoverStart={() => setActive(id)}
                        onHoverEnd={() => setActive(null)}
                        animate={{
                          x: isActive && !reduced ? 6 : 0,
                          color: isActive ? "var(--ink)" : "var(--ink-soft)",
                        }}
                        transition={{ duration: 0.4, ease: easeEditorial }}
                      >
                        <motion.span
                          aria-hidden
                          className="text-accent"
                          animate={{ opacity: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          ·
                        </motion.span>
                        {line}
                      </motion.span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
