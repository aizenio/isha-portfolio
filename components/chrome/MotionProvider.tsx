"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * One global motion policy.
 *
 * `reducedMotion="user"` makes every motion component on the site honour the
 * OS preference automatically — transforms and layout animations are dropped,
 * opacity is kept. Components still branch on `useReducedMotion` where the
 * *structure* needs to change too (the craft sequence, the custom cursor),
 * but nothing has to remember to handle the simple cases.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
