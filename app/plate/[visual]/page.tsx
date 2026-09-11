import { notFound } from "next/navigation";
import { ProjectVisual, VISUAL_KEYS } from "@/components/visuals/ProjectVisual";
import type { VisualKey } from "@/lib/content";

/**
 * A capture harness.
 *
 * The deck's WebGL conveyor builds each card's texture from an `<svg>` or an
 * `<img>`, and cannot read a plate that is markup. So a card whose plate is
 * built supplies a pre-composed cover instead, and this route is where that
 * cover is photographed from: one plate, full bleed, nothing else on the page.
 *
 *     scripts/capture-shots.sh covers
 */
export function generateStaticParams() {
  return VISUAL_KEYS.map((visual) => ({ visual }));
}

export default async function PlatePage({ params }: PageProps<"/plate/[visual]">) {
  const { visual } = await params;
  if (!VISUAL_KEYS.includes(visual as VisualKey)) notFound();

  return (
    <main data-surface="paper" className="plate-capture h-screen w-full overflow-hidden">
      <ProjectVisual visual={visual as VisualKey} priority />
    </main>
  );
}
