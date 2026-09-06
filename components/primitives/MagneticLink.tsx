"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useFinePointer } from "@/lib/use-fine-pointer";

/** Hoisted: creating this inside the component would remount the link each render. */
const MotionLink = motion.create(Link);

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** How far the element leans toward the cursor, as a fraction of offset. */
  pull?: number;
  external?: boolean;
  cursor?: string;
};

/**
 * A link that leans slightly toward the cursor. The pull is capped low enough
 * that the hit area never drifts away from where the user is aiming.
 */
export function MagneticLink({
  href,
  children,
  className,
  pull = 0.28,
  external,
  cursor,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const active = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * pull);
    y.set((event.clientY - (rect.top + rect.height / 2)) * pull);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={ref}
      href={href}
      className={className}
      data-cursor={cursor ?? "link"}
      style={active ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
    </MotionLink>
  );
}
