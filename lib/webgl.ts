"use client";

import * as THREE from "three";

/**
 * The bridge between the SVG scenes and the GPU.
 *
 * This module imports three, so it is only ever reached from a dynamically
 * imported scene — never from a component that decides whether to load one.
 */

const TOKENS = [
  "--paper",
  "--paper-raised",
  "--ink",
  "--ink-soft",
  "--ink-muted",
  "--rule",
  "--rule-soft",
  "--accent",
] as const;

export type Palette = Record<(typeof TOKENS)[number], string>;

/**
 * Read the live token values for whichever surface `el` sits on. The scenes are
 * authored against CSS variables, so this is what lets the same artwork render
 * correctly as a texture on paper and on ink.
 */
export function readPalette(el: Element): Palette {
  const styles = getComputedStyle(el);
  return Object.fromEntries(
    TOKENS.map((token) => [token, styles.getPropertyValue(token).trim()]),
  ) as Palette;
}

/**
 * Serialise a live <svg> into a texture.
 *
 * The scenes reference `var(--ink)` and friends, which mean nothing inside an
 * <img>, so the tokens are substituted for their resolved values on the way
 * out. Everything else — geometry, opacity, the seeded randomness — is exactly
 * what the DOM is already showing.
 */
export async function svgToTexture(
  svg: SVGSVGElement,
  palette: Palette,
  width = 1600,
): Promise<THREE.Texture> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const viewBox = (svg.getAttribute("viewBox") ?? "0 0 1200 750")
    .split(/\s+/)
    .map(Number);
  const ratio = viewBox[3] / viewBox[2] || 0.625;

  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(Math.round(width * ratio)));
  clone.removeAttribute("class");

  let markup = new XMLSerializer().serializeToString(clone);
  for (const token of TOKENS) {
    markup = markup.replaceAll(`var(${token})`, palette[token] || "#000");
  }

  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("scene texture failed to decode"));
      image.src = url;
    });

    // Draw to a canvas so the texture is a plain bitmap: Safari refuses to
    // upload an SVG-backed <img> directly in some versions.
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || width;
    canvas.height = image.naturalHeight || Math.round(width * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2d context unavailable");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Serialise a rendered <img> into a texture.
 *
 * Some plates are photographs — the live site in a browser, the app in a
 * simulator — so the deck has to be able to build a card from a bitmap as well
 * as from a drawing. Going through a canvas keeps both paths identical from
 * three's point of view.
 */
export async function imageToTexture(image: HTMLImageElement): Promise<THREE.Texture> {
  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => reject(new Error("plate image failed")), { once: true });
    });
  }

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  ctx.drawImage(image, 0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/** three.js wants linear-space colours; the tokens are authored in sRGB hex. */
export function toColor(value: string) {
  return new THREE.Color(value || "#000000");
}
