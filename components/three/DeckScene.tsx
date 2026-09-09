"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { deck } from "@/lib/deck";
import { imageToTexture, readPalette, svgToTexture } from "@/lib/webgl";

/**
 * The deck.
 *
 * One arrangement, two readings of it. At rest — before the reader has
 * scrolled at all — the cards sit in a slow, continuously-turning circle to
 * the right of the hero copy: a calling card, not yet a case study. As the
 * reader scrolls, that wheel unrolls into the conveyor: cards arrive from the
 * lower left close to the lens, pass flat through the centre where they can
 * be read, and recede to the upper right. Card `i` sits at offset `i -
 * progress` in conveyor mode, and every per-card property — position,
 * rotation, scale, opacity — is a single `lerp` between its orbit value and
 * its conveyor value, driven by one `blend` number. Nothing here is two
 * systems handed off to each other; it is one arrangement read at two points.
 *
 * The auto-rotation runs on elapsed time, not on scroll, so the wheel keeps
 * turning whether or not the reader has touched anything — the "automated"
 * part of "automated carousel". It simply stops mattering once blend reaches
 * 1, because by then the orbit term no longer contributes to the lerp.
 *
 * The cards use a plain textured material rather than a custom shader. A
 * ShaderMaterial was tried first: its uniforms read back correctly in
 * JavaScript but never reached the GPU through react-three-fiber's prop
 * handling, so every card rendered fully transparent. `material.opacity` is a
 * first-class three property and is uploaded reliably; the per-card aspect is
 * handled by sizing the plane to the texture instead of by UV maths.
 */

const CARD_H = 0.96;
/** Cards further than this from the centre are not drawn at all, in conveyor mode. */
const RANGE = 3.6;
/** Radians per second of idle rotation — one turn every ~50s. Unhurried on purpose. */
const SPIN_SPEED = 0.13;

/**
 * Where a card sits in conveyor mode, given its distance from the centre.
 *
 * `spread` tightens the conveyor on a portrait screen. At full spread the
 * neighbouring cards sit entirely outside a narrow frame, and the deck stops
 * reading as a deck at all — you just get one card at a time.
 */
function conveyorPlace(u: number, width: number, spread: number) {
  const a = Math.min(Math.abs(u), RANGE + 1);
  const ease = Math.pow(a, 0.86);
  const turn = Math.min(a, 3);

  if (u >= 0) {
    // Not yet read: low and left, and nearer the lens, so it crops the frame.
    return {
      x: -1.5 * width * ease * spread,
      y: -1.0 * CARD_H * ease * spread,
      z: 0.72 * ease,
      rx: -0.26 * turn,
      ry: 0.4 * turn,
      rz: 0.09 * turn,
    };
  }
  // Already read: high and right, receding into a fan.
  return {
    x: 1.42 * width * ease * spread,
    y: 0.92 * CARD_H * ease * spread,
    z: -0.62 * ease,
    rx: 0.22 * turn,
    ry: -0.36 * turn,
    rz: -0.07 * turn,
  };
}

/**
 * Where a card sits in orbit mode: an ellipse, turning slowly, angled toward
 * camera.
 *
 * The radius has to clear the card's *own* footprint or the three cards just
 * sit on top of one another regardless of how small the whole wheel is drawn
 * — a card is ~1.5 units wide at this aspect, so a 0.62-unit radius (an
 * earlier version of this) put the far edge of each card well past its
 * neighbours' centres. `scale` here is a real per-card shrink (not the subtle
 * near/far variation it looks like) — it's what makes each card read as a
 * thumbnail rather than the full conveyor-mode card.
 */
function orbitPlace(index: number, count: number, spin: number) {
  const angle = (index / count) * Math.PI * 2 + spin;
  // 0 on the far side of the wheel, 1 on the near side — the nearer card
  // reads slightly larger, like it's genuinely closer.
  const depthT = (Math.sin(angle) + 1) / 2;
  return {
    x: Math.cos(angle) * 1.05,
    y: Math.sin(angle) * 0.55,
    z: Math.sin(angle) * 0.4,
    rotY: -angle * 0.55,
    scale: 0.36 + depthT * 0.12,
  };
}

function Card({
  texture,
  aspect,
  index,
  count,
  spread,
  progress,
  blend,
  spin,
  velocity,
  pointer,
}: {
  texture: THREE.Texture;
  aspect: number;
  index: number;
  count: number;
  spread: number;
  progress: React.RefObject<number>;
  blend: React.RefObject<number>;
  spin: React.RefObject<number>;
  velocity: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const width = CARD_H * aspect;

  useFrame(() => {
    const node = mesh.current;
    if (!node) return;

    const u = index - (progress.current ?? 0);
    const a = Math.abs(u);

    if (a > RANGE + 0.6) {
      node.visible = false;
      return;
    }
    node.visible = true;
    // Explicit, deterministic paint order — the orbit phase sits three cards
    // close together in Z, and leaving sort order to distance-from-camera
    // alone is one more variable removed from "why is nothing showing".
    node.renderOrder = index;

    const b = THREE.MathUtils.clamp(blend.current ?? 1, 0, 1);
    const orbit = orbitPlace(index, count, spin.current ?? 0);
    const conveyor = conveyorPlace(u, width, spread);

    // The lens drifts with the cursor, so the conveyor half of the blend has
    // parallax; the orbit half deliberately doesn't (a wheel that also chased
    // the cursor would read as jittery rather than considered).
    const px = (pointer.current?.x ?? 0) * 0.16;
    const py = (pointer.current?.y ?? 0) * 0.1;
    const depth = 1 + a * 0.3;

    node.position.set(
      THREE.MathUtils.lerp(orbit.x, conveyor.x + px * depth, b),
      THREE.MathUtils.lerp(orbit.y, conveyor.y + py * depth, b),
      THREE.MathUtils.lerp(orbit.z, conveyor.z, b),
    );
    node.rotation.set(
      THREE.MathUtils.lerp(0, conveyor.rx + py * 0.12, b),
      THREE.MathUtils.lerp(orbit.rotY, conveyor.ry - px * 0.18, b),
      THREE.MathUtils.lerp(0, conveyor.rz, b),
    );

    // Speed stretches the card very slightly along its travel, in conveyor mode.
    // `?? 0` only catches null/undefined — it does not catch NaN, which is
    // the one value that actually broke this before — so it's checked
    // explicitly. A single non-finite scale silently stops three.js from
    // drawing the mesh at all, with no error, which is what made this bug so
    // hard to see: everything upstream (position, opacity, texture) can be
    // perfectly correct while the card still never appears.
    const v = Number.isFinite(velocity.current) ? velocity.current : 0;
    const scaleX = THREE.MathUtils.lerp(orbit.scale, 1 + Math.abs(v) * 0.05, b);
    const scaleY = THREE.MathUtils.lerp(orbit.scale, 1 - Math.abs(v) * 0.03, b);
    node.scale.set(
      Number.isFinite(scaleX) ? scaleX : orbit.scale,
      Number.isFinite(scaleY) ? scaleY : orbit.scale,
      1,
    );

    const conveyorOpacity = 1 - THREE.MathUtils.smoothstep(a, RANGE - 1.1, RANGE);
    const material = node.material as THREE.MeshBasicMaterial;
    material.opacity = THREE.MathUtils.lerp(1, conveyorOpacity, b);
  });

  return (
    <mesh ref={mesh} visible={false}>
      <planeGeometry args={[width, CARD_H]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Stage({
  textures,
  progress,
  blend,
  pointer,
}: {
  textures: { texture: THREE.Texture; aspect: number }[];
  progress: React.RefObject<number>;
  blend: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const spin = useRef(0);
  const previous = useRef(0);

  useFrame((state, delta) => {
    const step = Math.min(delta, 1 / 30);

    /*
     * `delta` is 0 on r3f's very first frame (there's no previous frame to
     * measure from), which made `(now - previous.current) / step` divide by
     * zero — `0/0` is `NaN` in IEEE 754, not 0. That single NaN, once it
     * lands in `velocity.current`, never recovers: every later frame computes
     * `velocity.current += (target - velocity.current) * factor`, and once
     * the left-hand side is NaN, `NaN + anything` and `NaN * anything`
     * (including `* 0`) both stay NaN forever. It then poisons every card's
     * scale for the rest of the session, and three.js silently declines to
     * draw geometry with a NaN transform rather than erroring — hence a
     * canvas with a correct-looking scene graph that renders nothing at all.
     */
    const now = progress.current ?? 0;
    const target =
      step > 0 ? THREE.MathUtils.clamp((now - previous.current) / step / 12, -0.9, 0.9) : 0;
    previous.current = now;
    velocity.current += (target - velocity.current) * (1 - Math.pow(0.004, step));

    // Runs on elapsed time alone — this is what makes the wheel "automated"
    // rather than something the reader has to drive.
    spin.current += step * SPIN_SPEED;

    if (!group.current) return;
    const vw = state.viewport.width;
    const portrait = state.viewport.height > vw;

    /*
     * Fit the card to a share of the viewport *width* rather than to a fixed
     * world size. A single scale worked on a landscape screen and shrank the
     * card to a stamp on a phone, where the viewport is barely a world unit
     * wide. The orbit sits noticeably smaller than the conveyor — a wheel of
     * thumbnails beside the hero copy, not the full-bleed case-study frame.
     */
    const conveyorTarget = vw * (portrait ? 0.82 : 0.3);
    const conveyorScale = vw > 0 ? conveyorTarget / (CARD_H * 1.6) : 1;
    // A bigger group scale than the old, tighter wheel — the cards themselves
    // are much smaller now (see orbitPlace), so the wheel as a whole needs
    // more room to actually read as a wheel rather than a stamp.
    const orbitScale = conveyorScale * (portrait ? 0.85 : 1.05);

    // Orbit sits to the right on a landscape screen, where the hero copy
    // takes the left column; on portrait there's no side column to answer
    // to, so it settles low and centred instead.
    const orbitX = portrait ? 0 : vw * 0.29;
    const orbitY = portrait ? -0.42 : 0.02;
    const conveyorY = portrait ? 0.1 : 0.18;

    const b = THREE.MathUtils.clamp(blend.current ?? 1, 0, 1);
    group.current.position.set(
      THREE.MathUtils.lerp(orbitX, 0, b),
      THREE.MathUtils.lerp(orbitY, conveyorY, b),
      0,
    );
    group.current.scale.setScalar(THREE.MathUtils.lerp(orbitScale, conveyorScale, b));
  });

  const portrait = viewport.height > viewport.width;
  const spread = portrait ? 0.62 : 1;

  return (
    <group ref={group}>
      {textures.map((entry, i) => (
        <Card
          key={i}
          texture={entry.texture}
          aspect={entry.aspect}
          index={i}
          count={textures.length}
          spread={spread}
          progress={progress}
          blend={blend}
          spin={spin}
          velocity={velocity}
          pointer={pointer}
        />
      ))}
    </group>
  );
}

export default function DeckScene({
  source,
  progress,
  blend,
  pointer,
  active,
  onReady,
}: {
  source: React.RefObject<HTMLDivElement | null>;
  progress: React.RefObject<number>;
  blend: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  active: boolean;
  onReady: () => void;
}) {
  const [textures, setTextures] = useState<{ texture: THREE.Texture; aspect: number }[]>([]);

  useEffect(() => {
    const host = source.current;
    if (!host) return;
    /* One card, one texture — whichever kind of plate the card holds. A drawn
       plate is serialised from its <svg>; a captured one is read off the <img>
       the page has already loaded. Nested <svg> chrome inside a mockup is
       skipped, or the deck would sit waiting for textures that do not exist. */
    const cards = Array.from(host.querySelectorAll<HTMLElement>("[data-plate]"));
    if (cards.length !== deck.length) return;

    let cancelled = false;
    const palette = readPalette(host);

    Promise.all(
      cards.map(async (card) => {
        const svg = Array.from(card.querySelectorAll("svg")).find(
          (node) => !node.parentElement?.closest("svg"),
        );
        if (svg) {
          const box = (svg.getAttribute("viewBox") ?? "0 0 1200 750").split(/\s+/).map(Number);
          return {
            texture: await svgToTexture(svg, palette, 1400),
            aspect: box[2] / box[3] || 1.6,
          };
        }

        const image = card.querySelector("img");
        if (!image) throw new Error("card has no plate");
        const rect = card.getBoundingClientRect();
        return {
          texture: await imageToTexture(image),
          aspect: rect.width / rect.height || 1.6,
        };
      }),
    )
      .then((next) => {
        if (cancelled) {
          next.forEach((entry) => entry.texture.dispose());
          return;
        }
        setTextures(next);
        onReady();
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [source, onReady]);

  useEffect(() => () => textures.forEach((entry) => entry.texture.dispose()), [textures]);

  if (!textures.length) return null;

  return (
    <Canvas
      className="!absolute inset-0"
      style={{ pointerEvents: "none" }}
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 0, 4.6] }}
    >
      <Stage textures={textures} progress={progress} blend={blend} pointer={pointer} />
    </Canvas>
  );
}
