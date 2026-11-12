"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const COPY = "Slow-smoked ribs ✺ Cheese-stuffed chicken ✺ Crème brûlée ✺ Butterscotch cheesecake ✺ Mango mule ✺ ";
const WAVE = "M-200 150C0 40 200 40 400 150S800 260 1000 150 1400 40 1600 150 2000 260 2200 150";

/** Striped café awning, then a wavy ribbon whose words flow with scroll velocity. */
export function Awning() {
  const root = useRef<HTMLElement>(null);
  const path = useRef<SVGTextPathElement>(null);
  const measure = useRef<SVGTextElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const copyLen = measure.current?.getComputedTextLength() ?? 0;
        if (!copyLen || !path.current) return;
        const tween = gsap.fromTo(
          path.current,
          { attr: { startOffset: 0 } },
          { attr: { startOffset: -copyLen }, duration: 26, ease: "none", repeat: -1, paused: true },
        );
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => tween.paused(!self.isActive),
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 220, 6);
            gsap.to(tween, { timeScale: self.direction * (1 + boost), duration: 0.25, overwrite: true });
            gsap.to(tween, { timeScale: self.direction, duration: 1.2, delay: 0.25 });
          },
        });
        tween.paused(!st.isActive);
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav="light" aria-label="House favourites" className="relative overflow-x-clip bg-paper">
      <div aria-hidden className="awning relative">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-brass/70" />
      </div>
      <div aria-hidden className="relative -mt-3 pb-2 sm:-mt-6">
        <svg
          viewBox="0 0 2000 300"
          className="relative left-1/2 block w-[300vw] max-w-none -translate-x-1/2 sm:w-[190vw] lg:w-[130vw]"
        >
          <path d={WAVE} fill="none" stroke="var(--color-terra)" strokeWidth="104" strokeLinecap="round" />
          <path
            d={WAVE}
            fill="none"
            stroke="var(--color-cream)"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeDasharray="2 14"
            transform="translate(0 -40)"
          />
          <path
            d={WAVE}
            fill="none"
            stroke="var(--color-cream)"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeDasharray="2 14"
            transform="translate(0 40)"
          />
          <path id="awning-wave" d={WAVE} fill="none" />
          <text ref={measure} className="headline text-[66px]" visibility="hidden" x="0" y="-100">
            {COPY}
          </text>
          <text className="headline fill-cream text-[66px]" dy="22">
            <textPath ref={path} href="#awning-wave" startOffset="0">
              {COPY.repeat(4)}
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
