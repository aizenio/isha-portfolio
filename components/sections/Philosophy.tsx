import { philosophy } from "@/lib/content";
import { Marker } from "@/components/primitives/Marker";
import { Reveal, RevealItem } from "@/components/primitives/Reveal";
import { ScrollHighlight } from "@/components/primitives/ScrollHighlight";

/**
 * How I think. The statement resolves word by word as the reader arrives at it,
 * then the four principles are set as a numbered editorial list — the only
 * place on the site where roman numerals appear, which is the point.
 */
export function Philosophy() {
  return (
    <section
      id="philosophy"
      data-surface="paper"
      className="relative scroll-mt-24 py-28 md:py-44"
    >
      <div className="shell">
        <Marker index="01" label="How I think" />

        <ScrollHighlight
          as="h2"
          lines={philosophy.statement}
          className="font-display t-statement mt-16 max-w-[22ch] text-ink md:mt-24"
        />

        <div className="mt-20 grid gap-x-10 gap-y-14 md:mt-32 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-1" stagger={0.12}>
            {philosophy.body.map((paragraph) => (
              <RevealItem as="p" key={paragraph} className="t-body mb-5 max-w-[46ch] last:mb-0">
                {paragraph}
              </RevealItem>
            ))}
          </Reveal>

          <Reveal as="ul" className="md:col-span-6 md:col-start-7" stagger={0.1}>
            {philosophy.principles.map((principle) => (
              <RevealItem
                as="li"
                key={principle.n}
                className="rule grid grid-cols-[2.5rem_1fr] gap-x-4 py-7 first:border-t-0 first:pt-0 md:gap-x-8"
              >
                <span className="t-label pt-1">{principle.n}</span>
                <div>
                  <h3 className="font-display text-[1.5rem] leading-[1.15] text-ink md:text-[1.75rem]">
                    {principle.title}
                  </h3>
                  <p className="t-body mt-3 max-w-[48ch] text-[0.975rem] md:text-[1.0625rem]">
                    {principle.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
