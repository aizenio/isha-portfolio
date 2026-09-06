"use client";

import { motion, useReducedMotion } from "motion/react";
import { contact, designer } from "@/lib/content";
import { easeEditorial, inView } from "@/lib/motion";
import { RevealText } from "@/components/primitives/RevealText";
import { Marker } from "@/components/primitives/Marker";

/**
 * The closing scene.
 *
 * Deliberately the darkest, quietest screen on the site: one sentence, one
 * address, four links. The page should feel finished here, not trailed off into
 * a footer, so the colophon is set as a single hairline row rather than a block.
 */
export function Contact() {
  const reduced = useReducedMotion();

  return (
    <section
      id="contact"
      data-surface="ink"
      className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-between overflow-hidden pb-10 pt-28 text-ink md:pt-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/3 h-[70vw] w-[70vw] max-w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.09] blur-[120px]"
          animate={reduced ? undefined : { scale: [1, 1.09, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="shell relative">
        <Marker index="08" label="Contact" align="between">
          <span className="t-label hidden sm:inline">{contact.note}</span>
        </Marker>
      </div>

      <div className="shell relative py-16">
        <RevealText
          as="h2"
          className="font-display t-chapter max-w-[16ch] text-ink"
          lines={contact.heading}
          stagger={0.05}
          accentWords={["remembering."]}
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.8, delay: 0.3, ease: easeEditorial }}
          className="t-lede mt-10 max-w-[38ch]"
        >
          {contact.lede}
        </motion.p>

        <motion.a
          href={`mailto:${designer.email}`}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.8, delay: 0.42, ease: easeEditorial }}
          className="group mt-12 inline-flex items-baseline gap-4 md:mt-16"
          data-cursor="link"
        >
          <span className="font-display text-[clamp(1.6rem,4.2vw,3.4rem)] leading-none text-ink">
            <span className="link-underline">{designer.email}</span>
          </span>
          <span
            aria-hidden
            className="text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
          >
            →
          </span>
        </motion.a>
      </div>

      <div className="shell relative">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-6 md:grid-cols-4">
          {designer.links.map((link, index) => (
            <motion.li
              key={link.label}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.06, ease: easeEditorial }}
            >
              <a
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="group block"
              >
                <span className="t-label">{link.label}</span>
                <span className="mt-2 flex items-center gap-2 text-[0.9375rem] text-ink-soft transition-colors duration-300 group-hover:text-ink">
                  {link.value}
                  <span
                    aria-hidden
                    className="text-accent opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-5">
          <span className="t-label">
            © {new Date().getFullYear()} {designer.name}
          </span>
          <span className="t-label">
            Instrument Serif · Geist · Built with Next.js
          </span>
          <a href="#top" className="t-label link-underline text-ink">
            Back to the top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
