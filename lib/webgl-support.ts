"use client";

/**
 * WebGL capability probe.
 *
 * Deliberately in its own module with no three.js import: this is what the
 * gating components call, and pulling three into that path would defeat the
 * code-splitting it exists to enable.
 */

let cached: boolean | null = null;

export function supportsWebGL() {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
}
