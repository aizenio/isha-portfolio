"use client";

import { useState } from "react";
import { process } from "@/lib/content";
import { Marker } from "@/components/primitives/Marker";
import { Reveal } from "@/components/primitives/Reveal";

/**
 * How I work, as six panels rather than a skills list.
 *
 * On a wide screen the panels behave like a set of drawers: the one you're
 * pointing at opens and the rest compress. Below 900px every panel is fully
 * open — nothing here is gated behind a hover a touch device can't perform.
 */
export function Process() {
  const [active, setActive] = useState(0);

  return (
    <section id="process" data-surface="paper" className="relative scroll-mt-24 py-28 md:py-44">
      <div className="shell">
        <Marker index="03" label="How I work" align="between">
          <span className="t-label hidden sm:inline">Six movements</span>
        </Marker>

        <Reveal className="mt-14 grid gap-8 md:mt-20 md:grid-cols-12">
          <h2 className="font-display t-statement max-w-[14ch] text-ink md:col-span-6">
            Discover, define, explore, design, refine, deliver.
          </h2>
          <p className="t-body max-w-[42ch] self-end md:col-span-5 md:col-start-8">
            {process.intro}
          </p>
        </Reveal>
      </div>

      <div className="shell mt-16 md:mt-24">
        <ol className="flex flex-col border-t border-rule lg:h-[clamp(560px,64svh,680px)] lg:flex-row lg:border-l">
          {process.stages.map((stage, index) => (
            <li
              key={stage.id}
              className="stage overflow-hidden border-b border-rule lg:border-b-0 lg:border-r"
              data-active={active === index}
            >
              <button
                type="button"
                className="flex h-full w-full flex-col items-start p-5 text-left md:p-7"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-expanded={active === index}
              >
                <span className="t-label">{String(index + 1).padStart(2, "0")}</span>

                <h3 className="font-display mt-6 whitespace-nowrap text-[1.75rem] leading-none text-ink lg:mt-10 lg:text-[2rem]">
                  {stage.name}
                </h3>

                {/* Compressed state: a single line, so a shut drawer still says something. */}
                <p className="stage-compact mt-4 hidden text-[0.8125rem] leading-[1.5] text-ink-muted lg:block">
                  {stage.artifacts.length} artifacts
                </p>

                <div className="stage-detail mt-5 w-full lg:mt-7 lg:max-w-[36ch]">
                  <p className="t-label mb-4 text-accent">{stage.duration}</p>
                  <p className="text-[0.9375rem] leading-[1.5] text-ink-soft lg:text-[0.875rem]">
                    {stage.what}
                  </p>

                  <p className="t-label mt-5">Questions I ask</p>
                  <ul className="mt-2.5 space-y-1.5">
                    {stage.questions.map((question) => (
                      <li
                        key={question}
                        className="flex gap-2.5 text-[0.875rem] leading-[1.45] text-ink-soft lg:text-[0.8125rem]"
                      >
                        <span aria-hidden className="text-accent">
                          —
                        </span>
                        {question}
                      </li>
                    ))}
                  </ul>

                  <p className="t-label mt-5">Artifacts</p>
                  <p className="mt-2 text-[0.875rem] leading-[1.45] text-ink-soft lg:text-[0.8125rem]">
                    {stage.artifacts.join(" · ")}
                  </p>

                  <p className="t-label mt-5">How decisions are made</p>
                  <p className="mt-2 text-[0.875rem] leading-[1.45] text-ink-soft lg:text-[0.8125rem]">
                    {stage.decisions}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
