import type { Transition, Variants } from "motion/react";

/**
 * A small, opinionated motion vocabulary.
 *
 * Three easings and four durations cover the whole site. Anything that needs
 * its own curve is usually a sign the interaction is doing too much.
 */

/** Long decelerating curve — entrances, reveals, anything arriving. */
export const easeEditorial = [0.16, 1, 0.3, 1] as const;
/** Symmetrical — state changes on something already on screen. */
export const easeCalm = [0.4, 0, 0.2, 1] as const;
/** Slight overshoot — small, direct, tactile responses. */
export const easeSnap = [0.34, 1.24, 0.64, 1] as const;

export const duration = {
  quick: 0.18,
  base: 0.32,
  slow: 0.52,
  scene: 0.9,
} as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 22,
  mass: 0.9,
};

export const springCursor: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 42,
  mass: 0.6,
};

/**
 * Default viewport trigger.
 *
 * Amount-based rather than a negative bottom margin: a margin that shrinks the
 * root can never be satisfied by content sitting in the page's final screen —
 * the contact links at the very bottom would stay at opacity 0 forever. 0.2
 * keeps the "wait until it's properly in view" feel and only fails for elements
 * more than five viewports tall, which nothing here is.
 */
export const inView = { once: true, amount: 0.2 } as const;

/** Word-level display reveal. Parent staggers, child rises out of its mask. */
export const wordStagger = (delay = 0, stagger = 0.045): Variants => ({
  rest: {},
  play: {
    transition: { delayChildren: delay, staggerChildren: stagger },
  },
});

export const wordRise: Variants = {
  rest: { y: "110%" },
  play: {
    y: "0%",
    transition: { duration: duration.scene, ease: easeEditorial },
  },
};

/** Generic arrival: opacity, a short lift, and a blur that resolves. */
export const arrive: Variants = {
  rest: { opacity: 0, y: 22, filter: "blur(6px)" },
  play: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.scene, ease: easeEditorial },
  },
};

export const fade: Variants = {
  rest: { opacity: 0 },
  play: { opacity: 1, transition: { duration: duration.slow, ease: easeCalm } },
};

/** Used where a group of small items should arrive in sequence. */
export const listStagger = (stagger = 0.07, delay = 0): Variants => ({
  rest: {},
  play: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
