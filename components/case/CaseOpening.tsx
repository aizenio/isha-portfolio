import type { Project } from "@/lib/content";
import { RevealText } from "@/components/primitives/RevealText";
import { Reveal, RevealItem } from "@/components/primitives/Reveal";
import { Plate, plateBox } from "@/components/case/Plate";
import { TransitionLink } from "@/components/chrome/Transition";

/** The case study's own opening scene — title, premise, credits, then the plate. */
export function CaseOpening({ project }: { project: Project }) {
  return (
    <>
      <section
        data-surface="paper"
        className="shell flex min-h-[86svh] flex-col justify-between pb-16 pt-32 md:pt-40"
      >
        <div>
          <TransitionLink
            href="/#deck"
            label="Work"
            className="t-label group inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
          >
            <span
              aria-hidden
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
            >
              ←
            </span>
            All work
          </TransitionLink>

          <div className="rule mt-8 flex items-baseline gap-6 pt-4">
            <span className="t-label">Project {project.index}</span>
            <span className="t-label">{project.year}</span>
            <span className="t-label">{project.discipline}</span>
          </div>
        </div>

        <div className="mt-14">
          <RevealText
            as="h1"
            onMount
            delay={0.2}
            className="font-display t-chapter text-ink"
            lines={[project.name]}
          />
          <Reveal delay={0.5}>
            <p className="t-lede mt-8 max-w-[46ch]">{project.premise}</p>
          </Reveal>
          {project.link && (
            <Reveal delay={0.6}>
              <a
                href={project.link.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline t-label mt-8 inline-flex items-center gap-2 text-ink"
              >
                {project.link.label}
                <span aria-hidden className="text-accent">
                  ↗
                </span>
              </a>
            </Reveal>
          )}
        </div>

        <Reveal
          as="ul"
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4"
          stagger={0.07}
          delay={0.7}
        >
          {[
            { term: "Role", value: project.role },
            { term: "Product", value: project.product },
            { term: "Scope", value: project.scope.join(", ") },
            { term: "Outcome", value: project.outcome },
          ].map((item) => (
            <RevealItem as="li" key={item.term} className="rule pt-3">
              <span className="t-label">{item.term}</span>
              <p className="mt-2 text-[0.9375rem] leading-[1.45] text-ink-soft">{item.value}</p>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <figure data-surface="ink" className="bg-paper pb-16 text-ink">
        <div
          className={`${plateBox(project.visual)} w-full overflow-hidden border-y border-rule`}
        >
          <Plate visual={project.visual} />
        </div>
        <div className="shell">
          <figcaption className="t-label mt-5 max-w-[52ch] leading-[1.8]">
            {project.tagline}
          </figcaption>
        </div>
      </figure>
    </>
  );
}
