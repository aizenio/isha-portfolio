import Image from "next/image";

/**
 * How a real screenshot is presented.
 *
 * A raw capture dropped edge-to-edge reads as an asset, not as work — it
 * competes with the page's own margins and looks like it was pasted in. So a
 * shot is mounted: a device or a browser window, sitting on its own ground,
 * with a shadow deep enough to lift it off the paper and a bezel that says
 * "this is a product" before the reader has read a word of it.
 *
 * The frame is drawn with the portfolio's tokens; only the pixels inside it
 * belong to the product being shown.
 */

type Common = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};

export function BrowserShot({ src, alt, width, height, url, priority }: Common & { url: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,var(--paper-raised)_0%,var(--paper)_70%)] p-6 sm:p-10 md:p-14">
      <div className="w-full max-w-[1180px] overflow-hidden rounded-lg border border-rule bg-paper-raised shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-12px_rgba(0,0,0,0.28),0_48px_96px_-32px_rgba(0,0,0,0.32)] ring-1 ring-black/[0.04] md:rounded-xl">
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-rule bg-[color-mix(in_srgb,var(--ink)_4%,var(--paper-raised))] px-3 py-2 md:px-4 md:py-2.5">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2 rounded-full bg-ink-muted/45 md:size-2.5" />
            ))}
          </div>
          <div className="mx-auto hidden min-w-0 max-w-[46%] flex-1 rounded-full bg-ink/[0.05] px-3 py-1 text-center sm:block">
            <span className="font-mono text-[10px] tracking-wide text-ink-muted">{url}</span>
          </div>
          <span className="w-10 shrink-0" />
        </div>

        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          // Already WebP at 2160px and under 130KB: the optimizer only ever
          // handed back a smaller, softer variant of a file that was fine.
          unoptimized
          className="block h-auto w-full"
          sizes="(min-width: 1280px) 2360px, 190vw"
        />
      </div>
    </div>
  );
}

export function PhoneShot({
  shots,
  priority,
}: {
  shots: (Common & { caption?: string })[];
  priority?: boolean;
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-5 overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,var(--paper-raised)_0%,var(--paper)_72%)] px-4 py-11 sm:gap-8 md:gap-14 md:py-14">
      {shots.map((shot, index) => (
        <div key={shot.src} className="flex h-full min-h-0 flex-col items-center gap-3">
          {/* the device: bezel, screen, and a shadow deep enough to lift it */}
          <div className="relative aspect-[1206/2622] min-h-0 flex-1 rounded-[1.6rem] bg-[color-mix(in_srgb,var(--ink)_86%,var(--paper))] p-[5px] shadow-[0_2px_6px_rgba(0,0,0,0.18),0_28px_56px_-14px_rgba(0,0,0,0.38),0_56px_112px_-40px_rgba(0,0,0,0.42)] ring-1 ring-black/10 md:rounded-[2rem] md:p-[6px]">
            <div className="relative h-full w-full overflow-hidden rounded-[1.3rem] bg-paper-raised md:rounded-[1.65rem]">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                priority={priority && index === 0}
                unoptimized
                className="block h-full w-full object-contain"
                sizes="(min-width: 768px) 300px, 30vw"
              />
            </div>
          </div>
          {shot.caption && <span className="t-label shrink-0 pb-1 text-center">{shot.caption}</span>}
        </div>
      ))}
    </div>
  );
}

/** A capture that already carries its own framing — a composed cover. */
export function PlainShot({ src, alt, width, height, priority }: Common) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className="h-full w-full object-cover"
      sizes="(min-width: 1280px) 2360px, 190vw"
    />
  );
}
