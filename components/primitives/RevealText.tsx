"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { inView, wordRise, wordStagger } from "@/lib/motion";

type RevealTextProps = {
  /** One entry per line. Lines break exactly where they're written. */
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "p" | "div";
  delay?: number;
  stagger?: number;
  /** Play on mount (hero) rather than when scrolled into view. */
  onMount?: boolean;
  /** With `onMount`, hold the reveal until this is true. */
  play?: boolean;
  /** Words rendered in the accent colour, matched case-insensitively. */
  accentWords?: string[];
};

/**
 * Word-by-word display reveal.
 *
 * Each word rises out of its own mask. The mask sits on a wrapper with a small
 * negative-margin trick so descenders aren't clipped, and the whole string is
 * exposed to assistive tech as plain text via aria-label.
 */
export function RevealText({
  lines,
  className,
  as = "h2",
  delay = 0,
  stagger = 0.045,
  onMount = false,
  play = true,
  accentWords = [],
}: RevealTextProps) {
  const reduced = useReducedMotion();
  const Heading = as;

  /*
   * A held reveal must never be a permanent one. `play` is the intro's gate,
   * and if that gate fails to open — a stalled texture, a thrown effect — the
   * words would sit at zero opacity forever. This releases them anyway.
   */
  const [released, setReleased] = useState(false);
  useEffect(() => {
    if (!onMount || play) return;
    const id = window.setTimeout(() => setReleased(true), 2600);
    return () => window.clearTimeout(id);
  }, [onMount, play]);
  const revealed = play || released;
  const label = lines.join(" ");
  // Normalise both sides so "simple." in the copy matches "simple" in the list.
  const normalise = (word: string) =>
    word.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
  const accents = new Set(accentWords.map(normalise));
  const isAccent = (word: string) => accents.has(normalise(word));

  if (reduced) {
    return (
      <Heading className={className} aria-label={label}>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block" aria-hidden>
            {line.split(" ").map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                {wordIndex > 0 && " "}
                <span className={isAccent(word) ? "text-accent" : undefined}>
                  {word}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </Heading>
    );
  }

  const MotionHeading = motion[as];
  const trigger = onMount
    ? ({ animate: revealed ? "play" : "rest" } as const)
    : ({ whileInView: "play", viewport: inView } as const);

  return (
    <MotionHeading
      className={className}
      aria-label={label}
      variants={wordStagger(delay, stagger)}
      initial="rest"
      {...trigger}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block" aria-hidden>
          {line.split(" ").map((word, wordIndex) => (
            <Fragment key={wordIndex}>
              {wordIndex > 0 && " "}
              <span className="word-mask">
                <motion.span
                  className={`inline-block ${isAccent(word) ? "text-accent" : ""}`}
                  variants={wordRise}
                >
                  {word}
                </motion.span>
              </span>
            </Fragment>
          ))}
        </span>
      ))}
    </MotionHeading>
  );
}
