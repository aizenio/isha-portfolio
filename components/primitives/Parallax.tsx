"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Total travel in pixels across the element's full scroll pass. */
  distance?: number;
  /** Scale applied at the start of the pass, easing to 1 by the end. */
  from?: number;
};

/**
 * Scroll-linked vertical drift. Deliberately small — parallax reads as quality
 * at 40–80px and as a gimmick past that.
 */
export function Parallax({
  children,
  className,
  distance = 60,
  from,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const y = useTransform(smooth, [0, 1], [distance / 2, -distance / 2]);
  const scale = useTransform(smooth, [0, 1], [from ?? 1, 1]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
