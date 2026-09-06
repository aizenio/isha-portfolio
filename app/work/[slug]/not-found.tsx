import { TransitionLink } from "@/components/chrome/Transition";

export default function CaseStudyNotFound() {
  return (
    <section
      data-surface="paper"
      className="shell flex min-h-[80svh] flex-col justify-center py-24"
    >
      <p className="t-label">404</p>
      <h1 className="font-display t-statement mt-6 max-w-[16ch] text-ink">
        That case study isn&rsquo;t here.
      </h1>
      <p className="t-body mt-6 max-w-[42ch]">
        It may have been renamed, or it may never have existed. The selected work is
        one link away.
      </p>
      <TransitionLink
        href="/#deck"
        label="Work"
        className="link-underline mt-10 self-start text-lg text-ink"
      >
        Back to selected work →
      </TransitionLink>
    </section>
  );
}
