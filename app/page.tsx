import { Deck } from "@/components/sections/Deck";
import { Philosophy } from "@/components/sections/Philosophy";
import { Process } from "@/components/sections/Process";
import { Craft } from "@/components/sections/Craft";
import { Contact } from "@/components/sections/Contact";

/**
 * The hero and the work, then the story.
 *
 * The deck IS the landing: a wheel of the three projects turning beside the
 * hero copy, which unrolls into a scroll-scrubbed conveyor of full case-study
 * introductions as the reader scrolls. Once the reader reaches the last card
 * the page keeps going into the chapters — how I think, how I work, the
 * craft, who I am, and how to get in touch.
 */
export default function Home() {
  return (
    <div id="top">
      <Deck />

      <Philosophy />
      <Process />
      <Craft />
      <Contact />
    </div>
  );
}
