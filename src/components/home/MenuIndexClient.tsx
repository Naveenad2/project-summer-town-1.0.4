"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { InView } from "@/components/ui/InView";
import { SmartImage } from "@/components/ui/SmartImage";
import { Split } from "@/components/ui/Split";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { gsap } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

const catShapes = ["sun", "leaf", "flower", "cookie", "clover", "blob", "seal", "squircle", "leaf-alt"];

/** Category index with a cursor-following, shape-morphing preview on desktop. */
export type CategorySummary = { slug: string; name: string; kicker: string; image: string; count: number };

export function MenuIndexClient({ categories }: { categories: CategorySummary[] }) {
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [hoverable, setHoverable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverable(mq.matches);
    if (!mq.matches || !floatRef.current) return;
    const el = floatRef.current;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <section
      data-nav="dark"
      aria-labelledby="menu-index-title"
      className="edge-scallop relative bg-ink py-24 text-cream lg:py-36"
    >
      <div className="cv-auto shell [contain-intrinsic-size:auto_1200px] lg:[contain-intrinsic-size:auto_1700px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <InView>
            <p className="eyebrow fade-up mb-6 text-ember">(05) — The menu</p>
            <h2 id="menu-index-title" className="headline t-h2 max-w-[14ch]">
              <Split text="Nine chapters," />{" "}
              <em className="text-ember">
                <Split text="one long table" start={2} />
              </em>
            </h2>
          </InView>
          <InView className="fade-up">
            <Button href="/menu" variant="ghost-light">
              Open the full menu
            </Button>
          </InView>
        </div>

        <ul className="mt-16 border-b border-cream/10 lg:mt-24" onPointerLeave={() => setActive(null)}>
          {categories.map((cat, i) => (
            <li key={cat.slug} onPointerEnter={() => hoverable && setActive(i)}>
              <TransitionLink
                href={`/menu#${cat.slug}`}
                className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-t border-cream/10 py-5 sm:grid-cols-[3rem_1fr_auto] sm:py-7 lg:py-8"
              >
                <span className="eyebrow text-cream/40">{pad(i + 1)}</span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "headline block truncate text-[clamp(2rem,6.5vw,6.25rem)] leading-[1] transition-[translate,color] duration-700 ease-[var(--ease-out-expo)]",
                      active === i && "translate-x-4 text-ember italic lg:translate-x-8",
                    )}
                  >
                    {cat.name}
                  </span>
                  <span className="mt-1 block text-sm text-cream/45">{cat.kicker}</span>
                </span>
                <span className="flex items-center gap-4">
                  <span className={cn("relative size-16 sm:hidden", `shape-${catShapes[i % catShapes.length]}`)}>
                    <SmartImage src={cat.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="eyebrow hidden text-cream/50 sm:inline">{pad(cat.count)} dishes</span>
                  <span
                    className={cn(
                      "shape-sun hidden size-14 place-items-center bg-cream/10 transition-all duration-500 sm:grid",
                      active === i && "rotate-45 bg-ember",
                    )}
                  >
                    <ArrowUpRight className="size-5" />
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={floatRef}
        aria-hidden
        className="menu-float morph hidden size-[19rem] [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{
          opacity: active === null ? 0 : 1,
          scale: active === null ? "0.6" : "1",
          clipPath: `var(--shape-${catShapes[(active ?? 0) % catShapes.length]})`,
        }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat.slug}
            className="absolute inset-0 transition-[opacity,scale] duration-700 ease-[var(--ease-out-expo)]"
            style={{ opacity: active === i ? 1 : 0, scale: active === i ? "1" : "1.15" }}
          >
            <SmartImage src={cat.image} alt="" fill sizes="17rem" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
