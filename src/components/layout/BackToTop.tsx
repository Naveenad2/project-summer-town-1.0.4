"use client";

import { scrollToTarget } from "@/lib/scroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      className="eyebrow group inline-flex w-fit items-center gap-3 text-cream/80"
    >
      Back to top
      <span className="grid size-9 place-items-center rounded-full border border-cream/25 transition-transform duration-500 group-hover:-translate-y-1">
        ↑
      </span>
    </button>
  );
}
