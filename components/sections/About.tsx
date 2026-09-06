import { about } from "@/lib/content";
import { Marker } from "@/components/primitives/Marker";
import { Reveal, RevealItem } from "@/components/primitives/Reveal";
import { RevealText } from "@/components/primitives/RevealText";
import { Parallax } from "@/components/primitives/Parallax";
import { Portrait } from "@/components/visuals/Portrait";

/**
 * About, without the introduction paragraph.
 *
 * The statement lands first, the portrait plate anchors the left column, and
 * the biography is allowed to be specific — the engineering degree, the kind of
 * user, the reason the work looks the way it does.
 */
export function About() {
  return (
    <section
      id="about"
      data-surface="paper"
      className="relative scroll-mt-24 py-28 md:py-44"
    >
      <div className="shell">
        <Marker index="06" label="About" />

        <RevealText
          as="h2"
          className="font-display t-statement mt-16 max-w-[20ch] text-ink md:mt-24"
          lines={["I'm interested in the space", "between people, technology", "and design."]}
          accentWords={["people,", "technology"]}
        />

        <div className="mt-20 grid gap-x-10 gap-y-16 md:mt-32 md:grid-cols-12">
          <div className="md:col-span-4 md:col-start-1">
            <Parallax distance={70}>
              <Portrait />
            </Parallax>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal stagger={0.12}>
              {about.story.map((paragraph) => (
                <RevealItem as="p" key={paragraph} className="t-body mb-6 max-w-[52ch] last:mb-0">
                  {paragraph}
                </RevealItem>
              ))}
            </Reveal>

            <Reveal as="ul" className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7" stagger={0.07}>
              {about.facts.map((fact) => (
                <RevealItem as="li" key={fact.label} className="rule pt-3">
                  <span className="t-label">{fact.label}</span>
                  <p className="mt-2 text-[0.9375rem] text-ink-soft">{fact.value}</p>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal className="rule mt-14 pt-4">
              <span className="t-label">Toolkit</span>
              <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                {about.toolkit.join("  ·  ")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
