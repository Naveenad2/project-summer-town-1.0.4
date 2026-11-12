"use client";

import { useEffect, useRef, useState } from "react";
import { Emblem, Subline, Wordmark } from "@/components/brand/Logo";

const MIN_DURATION = 1200;
const MAX_FONT_WAIT = 1800;

/**
 * First-visit intro. The grow animation is pure CSS so it starts before
 * hydration; this component only decides when to lift the curtain and flags
 * `html[data-loaded]`, which starts the hero entrance.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute("data-visited")) {
      root.dataset.loaded = "1";
      setDone(true);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));
    const fonts = document.fonts?.ready.then(() => undefined).catch(() => undefined) ?? Promise.resolve();

    Promise.all([wait(Math.max(0, MIN_DURATION - performance.now())), Promise.race([fonts, wait(MAX_FONT_WAIT)])]).then(
      () => {
        if (cancelled) return;
        ref.current?.classList.add("is-leaving");
        timers.push(window.setTimeout(() => (root.dataset.loaded = "1"), 120));
        timers.push(
          window.setTimeout(() => {
            try {
              sessionStorage.setItem("st-visited", "1");
            } catch {}
            setDone(true);
          }, 950),
        );
      },
    );
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  if (done) return null;

  return (
    <div ref={ref} className="preloader" aria-hidden>
      <div className="preloader-inner flex flex-col items-center gap-7 transition-transform">
        <Emblem className="preloader-emblem h-[22svh] max-h-56 min-h-32 w-auto" leafClassName="text-ember" />
        <div className="preloader-word flex flex-col items-center gap-2.5">
          <Wordmark className="h-4 w-auto sm:h-5" />
          <Subline className="h-3 w-auto opacity-70 sm:h-3.5" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[var(--gutter)] pb-6 sm:pb-8">
        <span className="eyebrow text-sage">Panampilly Nagar · Kochi</span>
        <span className="preloader-count headline text-5xl text-cream sm:text-7xl" />
      </div>
    </div>
  );
}
