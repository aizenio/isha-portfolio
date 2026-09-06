"use client";

/**
 * What the opening sequence is actually waiting for.
 *
 * The loader used to run on a fixed timer, which is the thing that makes a
 * preloader feel fake — it is either lying about progress or wasting the
 * reader's time. These are the two pieces of work that genuinely have to
 * finish before the first screen is worth showing: the display face, and the
 * deck's card textures.
 */

export const TASKS = ["fonts", "deck"] as const;
export type Task = (typeof TASKS)[number];

const done = new Set<Task>();
const listeners = new Set<() => void>();

export function markReady(task: Task) {
  if (done.has(task)) return;
  done.add(task);
  listeners.forEach((listener) => listener());
}

export function subscribeReady(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const readyCount = () => done.size;
export const readyCountOnServer = () => 0;
