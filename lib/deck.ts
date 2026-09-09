import { projects, type VisualKey } from "./content";

/**
 * The deck — the three projects that carry a case study.
 *
 * The landing experience is a single conveyor of these: they arrive from the
 * lower left, pass flat through the centre where they can be read, and recede
 * to the upper right. Deliberately short. Everything else Isha has made is
 * indexed on the about page, where it can be scanned rather than scrubbed.
 */
export type DeckCard = {
  id: string;
  /** 01, 02, … as displayed. */
  label: string;
  name: string;
  category: string;
  year: string;
  blurb: string;
  meta: string;
  visual: VisualKey;
  href: string | null;
};

export const deck: DeckCard[] = projects.map((project) => ({
  id: project.slug,
  label: project.index,
  name: project.name,
  category: project.discipline,
  year: project.year,
  blurb: project.tagline,
  meta: project.role,
  visual: project.cover ?? project.visual,
  href: `/work/${project.slug}`,
}));

export const DECK_COUNT = deck.length;
