"use client";

/*
 * react-hooks/immutability is disabled for this file.
 *
 * react-three-fiber drives an imperative scene graph. the plate's uniforms are
 * handed to the GPU once and then mutated in place on every frame — that is
 * the entire point: it lets sixty updates a second happen without a single
 * React render. The rule is correct about ordinary components and wrong about
 * a frame loop, and there is no way to express this that satisfies it.
 */
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { readPalette, svgToTexture } from "@/lib/webgl";

/**
 * A project plate, rendered on the GPU.
 *
 * The artwork is the same SVG scene the DOM already draws — it's serialised to
 * a texture with the page's live tokens substituted in, so paper and ink
 * surfaces both come out right. What WebGL adds is physics: the plate bends
 * with scroll velocity, picks up a whisper of chromatic separation at speed,
 * and carries a ripple under the cursor.
 *
 * If WebGL is unavailable, or the reader asked for less motion, the DOM SVG
 * simply stays visible and nothing else happens.
 */

const VERTEX = /* glsl */ `
  uniform float uVelocity;
  uniform float uHover;

  varying vec2 vUv;

  void main() {
    vec3 p = position;

    // Bend the whole plate like a sheet being pulled past the viewer.
    float arc = sin(uv.x * 3.141592) * sin(uv.y * 3.141592);
    p.z += arc * uVelocity * 1.6;
    p.z += arc * uHover * 0.12;

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uPlaneAspect;
  uniform float uImageAspect;

  varying vec2 vUv;

  /* background-size: cover, in UV space. */
  vec2 cover(vec2 uv) {
    vec2 scale = uPlaneAspect > uImageAspect
      ? vec2(1.0, uImageAspect / uPlaneAspect)
      : vec2(uPlaneAspect / uImageAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = cover(vUv);

    // Hover eases the frame in a little and sends one slow ring out from the
    // cursor. Both are small enough to feel like material, not like an effect.
    uv = (uv - 0.5) / (1.0 + uHover * 0.045) + 0.5;

    vec2 toPointer = uv - uPointer;
    float d = length(toPointer);
    float ripple = sin(d * 22.0 - uTime * 2.6) * exp(-d * 7.0) * uHover * 0.010;
    uv += normalize(toPointer + 1e-5) * ripple;

    // Chromatic separation scaled to speed — invisible at rest by design.
    float shift = clamp(uVelocity, -1.0, 1.0) * 0.006;
    float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function Plate({
  texture,
  imageAspect,
  hovered,
  pointer,
}: {
  texture: THREE.Texture;
  imageAspect: number;
  hovered: React.RefObject<boolean>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const { viewport } = useThree();
  const lastScroll = useRef(0);
  const velocity = useRef(0);
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uVelocity: { value: 0 },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPlaneAspect: { value: 1 },
      uImageAspect: { value: imageAspect },
    }),
    [texture, imageAspect],
  );

  useEffect(() => {
    lastScroll.current = window.scrollY;
  }, []);

  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30);
    uniforms.uTime.value += step;
    uniforms.uPlaneAspect.value = viewport.width / viewport.height;

    const scrolled = window.scrollY - lastScroll.current;
    lastScroll.current = window.scrollY;
    // Normalise against viewport height so the bend feels the same on any screen.
    const target = THREE.MathUtils.clamp(scrolled / window.innerHeight, -0.6, 0.6);
    velocity.current += (target - velocity.current) * (1 - Math.pow(0.001, step));
    uniforms.uVelocity.value = velocity.current;

    const wantHover = hovered.current ? 1 : 0;
    uniforms.uHover.value += (wantHover - uniforms.uHover.value) * (1 - Math.pow(0.02, step));
    pointerTarget.current.set(pointer.current.x, pointer.current.y);
    uniforms.uPointer.value.lerp(pointerTarget.current, 1 - Math.pow(0.05, step));
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 40, 28]} />
      <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} />
    </mesh>
  );
}

/**
 * Builds the texture from the SVG the DOM has already drawn, then renders the
 * plate. Split from the gate so three.js is only fetched once a reader is
 * actually going to see one of these.
 */
export default function PlateScene({
  source,
  hovered,
  pointer,
  onFail,
  onReady,
}: {
  source: React.RefObject<HTMLDivElement | null>;
  hovered: React.RefObject<boolean>;
  pointer: React.RefObject<{ x: number; y: number }>;
  onFail: () => void;
  onReady: () => void;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [imageAspect, setImageAspect] = useState(1.6);

  useEffect(() => {
    const host = source.current;
    const svg = host?.querySelector("svg");
    if (!host || !svg) return;

    let cancelled = false;
    const box = (svg.getAttribute("viewBox") ?? "0 0 1200 750").split(/\s+/).map(Number);

    svgToTexture(svg, readPalette(host))
      .then((next) => {
        if (cancelled) {
          next.dispose();
          return;
        }
        setImageAspect(box[2] / box[3] || 1.6);
        setTexture(next);
        onReady();
      })
      .catch(onFail);

    return () => {
      cancelled = true;
    };
  }, [source, onFail, onReady]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <Canvas
      className="!absolute inset-0"
      style={{ pointerEvents: "none" }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ fov: 26, position: [0, 0, 6] }}
    >
      <Plate
        texture={texture}
        imageAspect={imageAspect}
        hovered={hovered}
        pointer={pointer}
      />
    </Canvas>
  );
}
