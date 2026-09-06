import type { Metadata } from "next";
import { about, archive, designer } from "@/lib/content";
import { Marker } from "@/components/primitives/Marker";
import { Reveal, RevealItem } from "@/components/primitives/Reveal";
import { RevealText } from "@/components/primitives/RevealText";
import { PortraitReveal } from "@/components/sections/PortraitReveal";
import { TransitionLink } from "@/components/chrome/Transition";

export const metadata: Metadata = {
  title: "About",
  description: about.statement,
};

/**
 * About, as its own destination.
 *
 * The home page answers "what has she made". This answers "who is she" — the
 * statement, the route in, the plate you can open, and an index of everything
 * that didn't warrant a full case study.
 */
export default function AboutPage() {
  return (
    <article>
      <section
        data-surface="paper"
        className="shell flex min-h-[86svh] flex-col justify-between pb-16 pt-32 md:pt-40"
      >
        <Marker label="About" />

        <div className="mt-16">
          <RevealText
            as="h1"
            onMount
            delay={0.15}
            className="font-display t-chapter max-w-[20ch] text-ink"
            lines={["I'm interested in the space", "between people, technology", "and design."]}
            accentWords={["people,", "technology"]}
          />
        </div>

        <Reveal
          as="ul"
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4"
          stagger={0.07}
          delay={0.5}
        >
          {about.facts.map((fact) => (
            <RevealItem as="li" key={fact.label} className="rule pt-3">
              <span className="t-label">{fact.label}</span>
              <p className="mt-2 text-[0.9375rem] leading-[1.45] text-ink-soft">{fact.value}</p>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* The route in */}
      <section data-surface="paper" className="shell py-20 md:py-28">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="t-label rule pt-3">How I got here</p>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <Reveal stagger={0.12}>
              {about.story.map((paragraph) => (
                <RevealItem as="p" key={paragraph} className="t-body mb-6 max-w-[56ch] last:mb-0">
                  {paragraph}
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* The plate you can open */}
      <section data-surface="paper" className="shell py-20 md:py-28">
        <PortraitReveal />
      </section>

      {/* Toolkit */}
      <section data-surface="ink" className="py-20 text-ink md:py-28">
        <div className="shell">
          <Reveal>
            <div className="rule grid gap-x-10 gap-y-6 pt-4 md:grid-cols-12">
              <p className="t-label md:col-span-3">Toolkit</p>
              <p className="font-display max-w-[24ch] text-[1.5rem] leading-[1.3] text-ink md:col-span-8 md:col-start-5 md:text-[1.875rem]">
                {about.toolkit.join(" · ")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Everything else */}
      <section data-surface="paper" className="shell py-20 md:py-28">
        <Marker label="Selected other work" align="between">
          <span className="t-label hidden sm:inline">2023 — 2026</span>
        </Marker>

        <Reveal as="ul" className="mt-12" stagger={0.06}>
          {archive.map((item) => (
            <RevealItem as="li" key={item.name} className="rule">
              <div className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 py-6 md:grid-cols-[6rem_1.1fr_1fr_auto] md:gap-x-8 md:py-7">
                <span className="t-label">{item.year}</span>
                <h2 className="font-display text-[1.5rem] leading-[1.1] text-ink md:text-[2rem]">
                  {item.name}
                </h2>
                <p className="col-start-2 mt-2 text-[0.9375rem] text-ink-soft md:col-start-3 md:mt-0">
                  {item.discipline}
                </p>
                <p className="col-start-2 mt-1 max-w-[46ch] text-[0.875rem] text-ink-muted md:col-start-4 md:mt-0 md:max-w-[34ch] md:text-right">
                  {item.note}
                </p>
              </div>
            </RevealItem>
          ))}
        </Reveal>

        <p className="t-label mt-10">
          Case studies on request —{" "}
          <a href={`mailto:${designer.email}`} className="link-underline text-ink">
            {designer.email}
          </a>
        </p>
      </section>

      {/* Out */}
      <section data-surface="ink" className="py-24 text-ink md:py-32">
        <div className="shell">
          <Reveal>
            <p className="t-label rule pt-4">Next</p>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
              <TransitionLink href="/" label="Work" className="group">
                <h2 className="font-display t-chapter text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                  The work
                </h2>
              </TransitionLink>
              <a
                href={`mailto:${designer.email}`}
                className="link-underline text-[1.125rem] text-ink"
              >
                {designer.email} ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
