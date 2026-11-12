"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Two-part cursor (dot + lagging ring) for fine pointers only. Elements can
 * opt into a labelled state with `data-cursor="View"`.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const d = dot.current;
    const r = ring.current;
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, summary, label, input, select, textarea, [role='button']");
      const text = labelled?.dataset.cursor ?? "";
      setLabel(text);
      gsap.to(r, {
        scale: text ? 2.6 : interactive ? 1.6 : 1,
        backgroundColor: text ? "rgba(176,74,33,0.95)" : "rgba(176,74,33,0)",
        borderColor: text ? "rgba(176,74,33,0)" : "rgba(243,235,221,0.9)",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(d, { scale: text || interactive ? 0 : 1, duration: 0.3 });
    };

    const leave = () => {
      gsap.to([d, r], { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] -ml-5 -mt-5 grid size-10 place-items-center rounded-full border border-cream/90 opacity-0 mix-blend-difference [&:has(span:not(:empty))]:mix-blend-normal"
      >
        <span className="eyebrow scale-[0.38] whitespace-nowrap text-cream">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[96] -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-cream opacity-0 mix-blend-difference"
      />
    </>
  );
}
