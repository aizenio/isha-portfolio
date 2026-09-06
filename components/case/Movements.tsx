import type { Movement } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/primitives/Reveal";
import { RevealText } from "@/components/primitives/RevealText";
import { Parallax } from "@/components/primitives/Parallax";
import { SceneCanvas } from "@/components/three/SceneCanvas";

/**
 * A case study is a sequence of movements, not a template.
 *
 * Each kind has its own pacing and its own share of the viewport, so the same
 * renderer can produce a dense argument, a full-bleed pause, or a single line
 * of type holding a whole screen — which is what makes the three case studies
 * read differently despite sharing this file.
 */
export function Movements({ movements }: { movements: Movement[] }) {
  return (
    <>
      {movements.map((movement, index) => (
        <MovementBlock key={index} movement={movement} />
      ))}
    </>
  );
}

function MovementBlock({ movement }: { movement: Movement }) {
  switch (movement.kind) {
    case "chapter":
      return (
        <section data-surface="paper" className="shell py-20 md:py-32">
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="t-label rule pt-3">{movement.label}</p>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <Reveal>
                <h2 className="font-display t-title max-w-[20ch] text-ink">
                  {movement.heading}
                </h2>
              </Reveal>
              <Reveal className="mt-8" stagger={0.1}>
                {movement.body.map((paragraph) => (
                  <RevealItem as="p" key={paragraph} className="t-body mb-5 max-w-[58ch] last:mb-0">
                    {paragraph}
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      );

    case "statement":
      return (
        <section
          data-surface="paper"
          className="shell flex min-h-[68svh] flex-col justify-center py-20 md:min-h-[80svh]"
        >
          <RevealText
            as="p"
            className="font-display t-chapter max-w-[15ch] text-ink"
            lines={splitStatement(movement.text)}
            stagger={0.05}
          />
          {movement.note && (
            <Reveal delay={0.35}>
              <p className="t-label mt-10 max-w-[40ch] leading-[1.8]">{movement.note}</p>
            </Reveal>
          )}
        </section>
      );

    case "visual": {
      const surface = movement.surface ?? "paper";
      const height =
        movement.scale === "bleed"
          ? "h-[64svh] md:h-[92svh]"
          : movement.scale === "inset"
            ? "h-[42svh] md:h-[60svh]"
            : "h-[52svh] md:h-[74svh]";

      return (
        <figure
          data-surface={surface}
          className={`${surface === "ink" ? "bg-paper text-ink" : ""} py-14 md:py-20`}
        >
          <div className={movement.scale === "bleed" ? "px-0" : "shell"}>
            <div className={`${height} w-full overflow-hidden border-y border-rule md:border`}>
              <Parallax distance={70} from={1.06} className="h-full w-full">
                <SceneCanvas visual={movement.visual} />
              </Parallax>
            </div>
          </div>
          {movement.caption && (
            <div className="shell">
              <figcaption className="t-label mt-5 max-w-[52ch] leading-[1.8]">
                {movement.caption}
              </figcaption>
            </div>
          )}
        </figure>
      );
    }

    case "pair":
      return (
        <section data-surface="paper" className="shell py-20 md:py-32">
          <p className="t-label rule pt-3">{movement.label}</p>
          <Reveal className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16" stagger={0.14}>
            {movement.items.map((item, index) => (
              <RevealItem key={item.label} as="div">
                <div className="flex items-baseline gap-4">
                  <span className={index === 1 ? "text-accent" : "text-ink-muted"}>
                    {index === 1 ? "→" : "×"}
                  </span>
                  <span className="t-label">{item.label}</span>
                </div>
                <p
                  className={`font-display mt-5 text-[1.375rem] leading-[1.24] md:text-[1.75rem] ${
                    index === 1 ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {item.text}
                </p>
              </RevealItem>
            ))}
          </Reveal>
        </section>
      );

    case "sequence":
      return (
        <section data-surface="paper" className="shell py-20 md:py-32">
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="t-label rule pt-3">{movement.label}</p>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <Reveal>
                <h2 className="font-display t-title max-w-[20ch] text-ink">
                  {movement.heading}
                </h2>
              </Reveal>
              <Reveal as="ol" className="mt-12" stagger={0.1}>
                {movement.steps.map((step, index) => (
                  <RevealItem
                    as="li"
                    key={step.title}
                    className="rule grid grid-cols-[2.5rem_1fr] gap-x-4 py-7 md:gap-x-8"
                  >
                    <span className="t-label pt-1">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-[1.375rem] leading-[1.2] text-ink md:text-[1.625rem]">
                        {step.title}
                      </h3>
                      <p className="t-body mt-3 max-w-[56ch] text-[0.9375rem] md:text-base">
                        {step.body}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      );

    case "metrics":
      return (
        <section data-surface="ink" className="bg-paper py-20 text-ink md:py-32">
          <div className="shell">
            <p className="t-label rule pt-3">The numbers</p>
            <Reveal
              as="ul"
              className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.09}
            >
              {movement.items.map((item) => (
                <RevealItem as="li" key={item.label}>
                  <p className="font-display text-[clamp(2.75rem,6vw,4.75rem)] leading-none text-ink">
                    {item.value}
                  </p>
                  <p className="mt-4 text-[0.9375rem] text-ink-soft">{item.label}</p>
                  {item.note && <p className="t-label mt-2">{item.note}</p>}
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </section>
      );
  }
}

/** Break a statement across two lines at the nearest word to its midpoint. */
function splitStatement(text: string) {
  const words = text.split(" ");
  if (words.length < 5) return [text];
  const pivot = Math.ceil(words.length / 2);
  return [words.slice(0, pivot).join(" "), words.slice(pivot).join(" ")];
}
