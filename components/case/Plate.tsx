import type { VisualKey } from "@/lib/content";
import { Parallax } from "@/components/primitives/Parallax";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ProjectVisual, visualFit, visualKind } from "@/components/visuals/ProjectVisual";

/**
 * A plate in its frame.
 *
 * Everything drifts a little as it passes — but a screenshot must not be
 * scaled or cropped to do it, so a shot is laid on an over-tall ground and
 * translated inside it. The frame clips the overhang; the mockup keeps every
 * one of its pixels.
 */
export function Plate({ visual }: { visual: VisualKey }) {
  if (visualKind(visual) === "shot") {
    return (
      <div className="h-full w-full overflow-hidden">
        <Parallax distance={56} className="-mt-7 h-[calc(100%+3.5rem)] w-full">
          <ProjectVisual visual={visual} />
        </Parallax>
      </div>
    );
  }

  if (visualFit(visual) === "contain") {
    return (
      <div className="h-full w-full overflow-hidden">
        <Parallax distance={56} className="-mt-7 h-[calc(100%+3.5rem)] w-full">
          <SceneCanvas visual={visual} />
        </Parallax>
      </div>
    );
  }

  return (
    <Parallax distance={70} from={1.06} className="h-full w-full">
      <SceneCanvas visual={visual} />
    </Parallax>
  );
}

/** The frame a plate wants: a fixed ratio for mockups, viewport height for textures. */
export function plateBox(visual: VisualKey, scale?: "wide" | "bleed" | "inset") {
  if (visualKind(visual) === "shot") return "aspect-[16/10] w-full";
  if (visualFit(visual) === "contain") return "aspect-[16/10] w-full";
  if (scale === "bleed") return "h-[64svh] md:h-[92svh]";
  if (scale === "inset") return "h-[42svh] md:h-[60svh]";
  return "h-[52svh] md:h-[74svh]";
}
