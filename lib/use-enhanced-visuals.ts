"use client";

import { useSyncExternalStore } from "react";
import { supportsWebGL } from "./webgl-support";

/**
 * Whether this reader should get the WebGL layer.
 *
 * Read through useSyncExternalStore rather than an effect: the server snapshot
 * is `false`, so the DOM fallback is what gets rendered and hydrated, and the
 * upgrade happens in the same commit as hydration instead of a frame later.
 * It also re-evaluates if the reader changes their motion preference mid-visit.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () => !window.matchMedia(REDUCED).matches && supportsWebGL();

const getServerSnapshot = () => false;

export function useEnhancedVisuals() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
