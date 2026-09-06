"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";
import { craft } from "@/lib/content";
import { easeEditorial } from "@/lib/motion";
import { Marker } from "@/components/primitives/Marker";
import { CRAFT_PLANES } from "@/components/visuals/CraftPlanes";

const COUNT = CRAFT_PLANES.length;
/** Where in the scroll pass the stack finishes opening and starts closing. */
const OPEN = 0.16;
const CLOSE = 0.86;

/**
 * A single component, taken apart.
 *
 * Two presentations of the same argument:
 *  - the scroll sequence (lg and up, motion allowed) tilts a flat stack into an
 *    isometric view, separates the six layers one at a time, then reassembles;
 *  - the static index (everywhere else) sets the same six layers as an
 *    editorial list.
 *
 * The static version is never removed from the accessibility tree — on desktop
 * it becomes screen-reader-only — so the sequence can stay purely visual.
 */
export function Craft() {
  const reduced = useReducedMotion();

  return (
    <section id="craft" data-surface="ink" className="text-ink">
      <CraftIndex className={reduced ? undefined : "lg:sr-only"} />
      {!reduced && <CraftSequence />}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CraftIndex({ className }: { className?: string }) {
  return (
    <div className={`py-28 md:py-40 ${className ?? ""}`}>
      <div className="shell">
        <Marker index="04" label={craft.label} />
        <h2 className="font-display t-statement mt-14 max-w-[18ch] text-ink">
          {craft.heading}
        </h2>
        <p className="t-body mt-6 max-w-[44ch]">{craft.lede}</p>

        <ul className="mt-16 grid gap-x-10 gap-y-16 md:mt-24 md:grid-cols-2">
          {craft.layers.map((item, i) => {
            const Plane = CRAFT_PLANES[i];
            return (
              <li key={item.id}>
                <div className="aspect-[720/440] w-full overflow-hidden border border-rule bg-paper-raised">
                  <Plane />
                </div>
                <p className="t-label mt-5">
                  {String(i + 1).padStart(2, "0")} — {item.name}
                </p>
                <p className="t-body mt-3 max-w-[44ch] text-[0.9375rem]">{item.caption}</p>
                <p className="t-label mt-3">{item.detail}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CraftSequence() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.5,
  });

  const explode = useTransform(progress, [0.04, OPEN, CLOSE, 0.98], [0, 1, 1, 0]);
  const rotateX = useTransform(explode, [0, 1], [0, 52]);
  const rotateZ = useTransform(explode, [0, 1], [0, -24]);
  const stageScale = useTransform(explode, [0, 1], [1, 0.8]);

  useMotionValueEvent(progress, "change", (value) => {
    const span = (CLOSE - OPEN) / COUNT;
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor((value - OPEN) / span)));
    setIndex(next);
  });

  const layer = craft.layers[index];

  return (
    <div ref={track} aria-hidden className="relative hidden h-[440vh] lg:block">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="shell pt-24">
          <Marker index="04" label={craft.label} align="between">
            <span className="t-label">
              {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
            </span>
          </Marker>
        </div>

        <div className="shell relative flex flex-1 items-center">
          <div className="grid w-full items-center gap-10 lg:grid-cols-12">
            <div className="relative z-10 lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                  transition={{ duration: 0.42, ease: easeEditorial }}
                >
                  <h2 className="font-display t-title text-ink">{layer.name}</h2>
                  <p className="t-body mt-4 max-w-[36ch] text-[0.9375rem]">{layer.caption}</p>
                  <p className="t-label mt-6">{layer.detail}</p>
                </motion.div>
              </AnimatePresence>

              <ol className="mt-10 flex gap-3">
                {craft.layers.map((item, i) => (
                  <li key={item.id} className="flex-1">
                    <motion.span
                      className="block h-px origin-left bg-ink"
                      animate={{ opacity: i <= index ? 1 : 0.2, scaleY: i === index ? 3 : 1 }}
                      transition={{ duration: 0.4, ease: easeEditorial }}
                    />
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-7 lg:col-start-6" style={{ perspective: "1600px" }}>
              <motion.div
                className="craft-layer relative mx-auto aspect-[720/440] w-full max-w-[660px]"
                style={{ rotateX, rotateZ, scale: stageScale }}
              >
                {CRAFT_PLANES.map((Plane, i) => (
                  <CraftLayer key={i} index={i} active={index} explode={explode}>
                    <Plane />
                  </CraftLayer>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="shell pb-10">
          <p className="t-body max-w-[52ch] text-[0.9375rem]">{craft.lede}</p>
        </div>
      </div>
    </div>
  );
}

function CraftLayer({
  index,
  active,
  explode,
  children,
}: {
  index: number;
  active: number;
  explode: MotionValue<number>;
  children: React.ReactNode;
}) {
  // Separation runs back-to-front, so the stack appears to open from the top
  // plane rather than scatter from the middle.
  const y = useTransform(explode, [0, 1], [0, index * 92]);

  return (
    <motion.div
      className="absolute inset-0 border border-rule bg-paper-raised"
      style={{ y, zIndex: COUNT - index }}
      animate={{ opacity: index === active ? 1 : 0.3 }}
      transition={{ duration: 0.5, ease: easeEditorial }}
    >
      <div className="relative h-full w-full">{children}</div>
    </motion.div>
  );
}
