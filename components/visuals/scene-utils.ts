/**
 * Deterministic pseudo-randomness for the generated scenes.
 *
 * Every visual is drawn from these helpers rather than Math.random so the
 * server and client render byte-identical markup — a hydration mismatch in a
 * full-bleed SVG is very visible.
 */
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function series(seed: number, count: number, map: (r: number, i: number) => number) {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => map(rand(), i));
}

/**
 * Quantise a computed coordinate.
 *
 * Math.sin, Math.cos and Math.pow are permitted to differ in their last bit
 * between JavaScript engines, and Node and Chrome do. React compares the
 * *serialised* attribute, so an unrounded trig result is a guaranteed
 * hydration mismatch. Three decimals is far below a pixel at these viewBoxes.
 */
export const q = (value: number) => Math.round(value * 1000) / 1000;
