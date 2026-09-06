"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** A one-pixel reading progress rule. The only chrome a case study adds. */
export function CaseProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
