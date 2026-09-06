import Link from "next/link";
import type { Project } from "@/lib/content";
import { designer } from "@/lib/content";
import { Reveal } from "@/components/primitives/Reveal";

/** Credits and a way out. Kept small — the story has already ended above. */
export function CaseClose({ project }: { project: Project }) {
  return (
    <section data-surface="paper" className="shell py-20 md:py-28">
      <Reveal>
        <div className="rule grid gap-x-10 gap-y-8 pt-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="t-label">Credits</span>
          </div>
          <div className="md:col-span-5">
            <p className="text-[0.9375rem] leading-[1.6] text-ink-soft">
              {project.role} — {designer.name}, {project.year}.
            </p>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <Link
              href={`mailto:${designer.email}?subject=${encodeURIComponent(project.name)}`}
              className="link-underline text-[0.9375rem] text-ink"
            >
              Ask me about this project ↗
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
