"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { arrive, inView, listStagger } from "@/lib/motion";

/**
 * Tags we animate. Kept as a union so `motion[tag]` stays typed and we use the
 * library's cached component proxy rather than creating one per render.
 */
type Tag =
  | "div"
  | "section"
  | "p"
  | "span"
  | "li"
  | "ul"
  | "ol"
  | "dl"
  | "h2"
  | "h3"
  | "figure";

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  /** Stagger direct children instead of animating this element as one block. */
  stagger?: number;
} & Pick<ComponentProps<"div">, "id">;

/**
 * The workhorse scroll reveal: opacity, a short lift and a resolving blur.
 * Under prefers-reduced-motion it renders the element plainly — no animation,
 * no hidden initial state that could strand content if JS is slow.
 */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  stagger,
  id,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Plain = as;
    return (
      <Plain id={id} className={className}>
        {children}
      </Plain>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      variants={stagger ? listStagger(stagger, delay) : arrive}
      initial="rest"
      whileInView="play"
      viewport={inView}
      transition={stagger ? undefined : { delay }}
    >
      {children}
    </Component>
  );
}

/** Child of a `<Reveal stagger>`. Arrives as part of the parent's sequence. */
export function RevealItem({
  children,
  as = "div",
  className,
}: Omit<RevealProps, "delay" | "stagger" | "id">) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component className={className} variants={arrive}>
      {children}
    </Component>
  );
}
