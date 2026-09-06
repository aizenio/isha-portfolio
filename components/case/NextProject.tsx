import { TransitionLink } from "@/components/chrome/Transition";
import type { Project } from "@/lib/content";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { Reveal } from "@/components/primitives/Reveal";

/** The end of one story hands directly to the next. No footer in between. */
export function NextProject({ project }: { project: Project }) {
  return (
    <section data-surface="ink" className="bg-paper text-ink">
      <TransitionLink
        href={`/work/${project.slug}`}
        label={project.name}
        data-cursor="view"
        data-cursor-label="Next case study"
        className="group block py-20 md:py-28"
        aria-label={`Next project: ${project.name}`}
      >
        <div className="shell">
          <Reveal>
            <div className="rule flex items-baseline justify-between pt-4">
              <span className="t-label">Next project</span>
              <span className="t-label">{project.index}</span>
            </div>
          </Reveal>

          <div className="mt-12 grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-display t-chapter text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                {project.name}
              </h2>
              <p className="t-lede mt-6 max-w-[32ch]">{project.tagline}</p>
              <span className="t-label mt-8 inline-flex items-center gap-2 text-ink">
                Read the case study
                <span
                  aria-hidden
                  className="text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
                >
                  →
                </span>
              </span>
            </div>

            <div className="aspect-[4/3] overflow-hidden border border-rule md:col-span-5 md:col-start-8">
              <div className="h-full w-full transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                <ProjectVisual visual={project.visual} />
              </div>
            </div>
          </div>
        </div>
      </TransitionLink>
    </section>
  );
}
