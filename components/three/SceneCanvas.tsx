"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VisualKey } from "@/lib/content";
import { ProjectVisual, visualFit } from "@/components/visuals/ProjectVisual";
import { useEnhancedVisuals } from "@/lib/use-enhanced-visuals";

/**
 * A project plate.
 *
 * The DOM SVG is always rendered — it is the artwork, the fallback, and the
 * source the texture is serialised from. When the reader can take it, the
 * plate is handed to the GPU and gains physics: it bends with scroll velocity,
 * picks up a whisper of chromatic separation at speed, and ripples under the
 * cursor. Nothing from three.js is imported on this side of the gate.
 */
const PlateScene = dynamic(() => import("./PlateScene"), { ssr: false });

export function SceneCanvas({
  visual,
  hovered = false,
  className,
}: {
  visual: VisualKey;
  hovered?: boolean;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  const contain = visualFit(visual) === "contain";
  const capable = useEnhancedVisuals();
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const [live, setLive] = useState(false);

  const enabled = capable && !failed;

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  /* Only hold a WebGL context while the plate is anywhere near the screen. */
  useEffect(() => {
    const node = host.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "60% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  const onFail = useCallback(() => setFailed(true), []);
  const onReady = useCallback(() => setLive(true), []);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = (event.clientX - rect.left) / rect.width;
    pointerRef.current.y = 1 - (event.clientY - rect.top) / rect.height;
  };

  return (
    <div
      ref={host}
      className={`relative h-full w-full ${className ?? ""}`}
      onPointerMove={onPointerMove}
    >
      <div
        ref={source}
        aria-hidden={live ? true : undefined}
        className={`absolute inset-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          live ? "invisible" : hovered ? "scale-[1.03]" : ""
        }`}
      >
        <ProjectVisual visual={visual} />
      </div>

      {enabled && near && (
        <PlateScene
          source={source}
          contain={contain}
          hovered={hoveredRef}
          pointer={pointerRef}
          onFail={onFail}
          onReady={onReady}
        />
      )}
    </div>
  );
}
