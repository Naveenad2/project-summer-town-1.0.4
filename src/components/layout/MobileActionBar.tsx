"use client";

import { useEffect, useState } from "react";
import { Phone } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Thumb-reach quick actions on phones, shown once the hero is scrolled past. */
export function MobileActionBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 140;
      setVisible(window.scrollY > window.innerHeight * 0.7 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-[translate,opacity] duration-700 ease-[var(--ease-out-expo)] lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0",
      )}
      inert={!visible}
    >
      <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 rounded-[1.35rem] border border-cream/10 bg-forest/90 p-1.5 text-cream shadow-[0_20px_50px_-15px_rgb(0_0_0/0.5)] backdrop-blur-xl">
        <a
          href={site.phoneHref}
          aria-label={`Call ${site.name}`}
          className="shape-cookie grid size-12 place-items-center bg-terra"
        >
          <Phone className="size-5" />
        </a>
        <TransitionLink
          href="/menu"
          className="eyebrow grid place-items-center rounded-[0.9rem] bg-cream/10 text-[0.66rem]"
        >
          Menu
        </TransitionLink>
        <TransitionLink
          href="/#visit"
          className="eyebrow grid place-items-center rounded-[0.9rem] bg-cream text-[0.66rem] text-forest"
        >
          Book a table
        </TransitionLink>
      </div>
    </div>
  );
}
