"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { designer, navSections } from "@/lib/content";
import { useSurface } from "@/lib/use-surface";
import { easeEditorial } from "@/lib/motion";
import { TransitionLink } from "@/components/chrome/Transition";

/**
 * Minimal sticky navigation.
 *
 * Two things make it feel considered rather than bolted on:
 *  - it adopts the surface of whatever section is passing beneath it, so the
 *    bar never sits in the wrong colour during a section change;
 *  - it compacts once the reader has left the opening scene.
 */
export function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isHome = pathname === "/";

  const surface = useSurface({ px: 56 });
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  // The overlay's open state is tied to the route it was opened on, so a
  // navigation closes it during render rather than via a sync-back effect.
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;
  const setMenuOpen = (open: boolean) => setMenu({ open, path: pathname });
  const frame = useRef(0);

  /* Read the surface and active section from one rAF-throttled scroll pass. */
  useEffect(() => {
    const measure = () => {
      frame.current = 0;
      setCompact(window.scrollY > window.innerHeight * 0.6);

      let currentId: string | null = null;
      for (const { id } of navSections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) {
          currentId = id;
        }
      }
      setActive(currentId);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* Lock the page behind the overlay while it's open. */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu({ open: false, path: pathname });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, pathname]);

  const target = useCallback(
    (id: string) => {
      // About has its own page; the rest are chapters of the home scroll.
      if (id === "about") return "/about";
      return isHome ? `#${id}` : `/#${id}`;
    },
    [isHome],
  );

  return (
    <>
      <motion.header
        data-surface={menuOpen ? "ink" : surface}
        className="fixed inset-x-0 top-0 z-50 text-ink"
        initial={false}
        animate={{
          backgroundColor: compact && !menuOpen ? "var(--paper)" : "rgba(0,0,0,0)",
          borderBottomColor: compact && !menuOpen ? "var(--rule-soft)" : "rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.5, ease: easeEditorial }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <nav
          aria-label="Primary"
          className="shell flex items-center justify-between transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ paddingBlock: compact ? "0.85rem" : "1.6rem" }}
        >
          <TransitionLink
            href="/"
            className="group flex items-baseline gap-3"
            aria-label={`${designer.name} — home`}
          >
            <span className="font-display text-[1.35rem] leading-none tracking-[-0.01em]">
              {designer.name}
            </span>
            <motion.span
              className="t-label hidden sm:inline"
              initial={false}
              animate={{ opacity: compact ? 0 : 1, x: compact ? -6 : 0 }}
              transition={{ duration: 0.4, ease: easeEditorial }}
            >
              {designer.role}
            </motion.span>
          </TransitionLink>

          <div className="hidden items-center gap-9 md:flex">
            {navSections.map((section) => (
              <TransitionLink
                key={section.id}
                href={target(section.id)}
                label={section.label}
                className="group relative py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em]"
              >
                <span
                  className={
                    (section.id === "about" && pathname === "/about") ||
                    (active === section.id && isHome)
                      ? "text-ink"
                      : "text-ink-muted"
                  }
                >
                  {section.label}
                </span>
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  style={{
                    transform:
                      (section.id === "about" && pathname === "/about") ||
                      (active === section.id && isHome)
                        ? "scaleX(1)"
                        : undefined,
                  }}
                />
              </TransitionLink>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="menu-overlay"
            className="relative z-10 -mr-1 flex items-center gap-3 p-1 md:hidden"
          >
            <span className="t-label text-ink">{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden className="flex h-3 w-5 flex-col justify-between">
              <motion.span
                className="block h-px w-full bg-current"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5.5 : 0 }}
                transition={{ duration: 0.4, ease: easeEditorial }}
              />
              <motion.span
                className="block h-px w-full bg-current"
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px w-full bg-current"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5.5 : 0 }}
                transition={{ duration: 0.4, ease: easeEditorial }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-overlay"
            data-surface="ink"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-paper px-6 pb-10 pt-28 text-ink md:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.62, ease: easeEditorial }}
          >
            <ul className="flex flex-col gap-2">
              {navSections.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.22 + index * 0.07,
                    duration: 0.6,
                    ease: easeEditorial,
                  }}
                >
                  <TransitionLink
                    href={target(section.id)}
                    label={section.label}
                    onClick={() => setMenuOpen(false)}
                    className="font-display block py-2 text-[3rem] leading-[1.05]"
                  >
                    {section.label}
                  </TransitionLink>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="flex flex-col gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.5 }}
            >
              <span className="t-label">Get in touch</span>
              <a href={`mailto:${designer.email}`} className="text-lg text-ink-soft">
                {designer.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
