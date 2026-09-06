"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { easeEditorial, springCursor } from "@/lib/motion";
import { useFinePointer } from "@/lib/use-fine-pointer";

type CursorMode = "default" | "link" | "view" | "muted";

const MODES: Record<CursorMode, { size: number; ring: number; fill: boolean }> = {
  default: { size: 10, ring: 1, fill: true },
  link: { size: 44, ring: 1, fill: false },
  view: { size: 108, ring: 1, fill: true },
  muted: { size: 6, ring: 1, fill: true },
};

/**
 * A single cursor element driven by delegation: any element can opt in with
 * `data-cursor="view"` and `data-cursor-label="View case study"`. No context,
 * no per-component wiring, and it keeps working for content rendered later.
 *
 * Only mounted for fine pointers, and never when the user asks for less motion.
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, springCursor);
  const smoothY = useSpring(y, springCursor);

  useEffect(() => {
    if (!enabled) return;

    // The `cursor: none` rule is scoped to this attribute so the native cursor
    // is never hidden on a device that can't render a replacement. It is
    // deliberately NOT `data-cursor`, which is the opt-in hook read below.
    document.documentElement.dataset.customCursor = "on";

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target as HTMLElement | null;
      const host = target?.closest<HTMLElement>("[data-cursor]");

      if (host) {
        const requested = host.dataset.cursor as CursorMode | undefined;
        setMode(requested && requested in MODES ? requested : "link");
        setLabel(host.dataset.cursorLabel ?? null);
        return;
      }

      const interactive = target?.closest("a, button, [role='button'], input, select, textarea");
      setMode(interactive ? "link" : "default");
      setLabel(null);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const shape = MODES[mode];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference"
      style={{ x: smoothX, y: smoothY }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-white text-center"
        animate={{
          width: shape.size,
          height: shape.size,
          opacity: visible ? 1 : 0,
          backgroundColor: shape.fill ? "#ffffff" : "rgba(255,255,255,0)",
          scale: pressed ? 0.86 : 1,
        }}
        transition={{ duration: 0.42, ease: easeEditorial }}
        style={{ marginLeft: -shape.size / 2, marginTop: -shape.size / 2 }}
      >
        <AnimatePresence>
          {label && mode === "view" && (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: easeEditorial }}
              className="px-3 font-mono text-[9px] uppercase leading-[1.3] tracking-[0.16em] text-black"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
