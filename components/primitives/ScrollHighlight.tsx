"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";

/**
 * A paragraph that resolves as it passes through the viewport: each word moves
 * from dimmed to full as the reader reaches it. Used once, on the philosophy
 * statement — it's a strong device and loses its meaning if repeated.
 */
export function ScrollHighlight({
  lines,
  className,
  as = "p",
}: {
  lines: string[];
  className?: string;
  as?: "p" | "h2";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.42"],
  });

  const words = lines.flatMap((line, lineIndex) =>
    line.split(" ").map((word, wordIndex) => ({ word, lineIndex, wordIndex })),
  );

  const Wrapper = as === "h2" ? motion.h2 : motion.p;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Plain>
    );
  }

  return (
    <Wrapper
      ref={ref as React.Ref<HTMLParagraphElement & HTMLHeadingElement>}
      className={className}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block" aria-hidden>
          {line.split(" ").map((word, wordIndex) => {
            const index = words.findIndex(
              (w) => w.lineIndex === lineIndex && w.wordIndex === wordIndex,
            );
            return (
              <Fragment key={wordIndex}>
                {wordIndex > 0 && " "}
                <Word progress={scrollYProgress} index={index} total={words.length}>
                  {word}
                </Word>
              </Fragment>
            );
          })}
        </span>
      ))}
    </Wrapper>
  );
}

function Word({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: string;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}
