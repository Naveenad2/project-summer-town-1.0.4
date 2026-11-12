"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Emblem } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { SmartImage } from "@/components/ui/SmartImage";
import { SplitChars } from "@/components/ui/Split";
import { useLoaded } from "@/components/ui/useLoaded";
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

const SLIDE_MS = 5200;

const slides = [
  {
    src: "/images/hero/ribeye.jpg",
    caption: "From the grill",
    alt: "Chargrilled bone-in steak with rosemary and spiced potato wedges in a cast-iron pan",
  },
  {
    src: "/images/hero/prawn-spaghetti.jpg",
    caption: "Pasta, made to order",
    alt: "Garlic prawn spaghetti with cherry tomatoes and spring onion",
  },
  {
    src: "/images/hero/caramel-cheesecake.jpg",
    caption: "Butterscotch cheesecake",
    alt: "A slice of butterscotch cheesecake with caramel drizzle and praline crumb",
  },
  {
    src: "/images/hero/mango-mule.jpg",
    caption: "Mango mule",
    alt: "Iced mango mule with lime, beside fresh mango slices",
  },
];

// Leaf-shaped cut-outs orbiting the sun, borrowed from the emblem's leaves.
const leaves = [
  {
    src: "/images/menu/smoked-beef-brisket.jpg",
    shape: "shape-leaf",
    cls: "-right-[13%] -top-[8%] w-[31%]",
    d: "1.1s",
    bob: "5.4s",
  },
  {
    src: "/images/menu/mango-mule.jpg",
    shape: "shape-leaf-alt",
    cls: "-right-[17%] bottom-[22%] w-[22%]",
    d: "1.25s",
    bob: "4.4s",
  },
  {
    src: "/images/menu/butterscotch-cheesecake.jpg",
    shape: "shape-leaf-alt",
    cls: "-left-[22%] top-[34%] w-[21%] max-sm:hidden",
    d: "1.4s",
    bob: "6.1s",
  },
];

const drift = [
  { left: "6%", size: 14, t: "17s", delay: "-3s", dx: "10vw", rot: "300deg" },
  { left: "24%", size: 10, t: "21s", delay: "-11s", dx: "-8vw", rot: "-240deg" },
  { left: "47%", size: 18, t: "19s", delay: "-6s", dx: "6vw", rot: "200deg" },
  { left: "68%", size: 12, t: "23s", delay: "-15s", dx: "-12vw", rot: "-320deg" },
  { left: "86%", size: 16, t: "18s", delay: "-9s", dx: "-6vw", rot: "260deg" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const loaded = useLoaded();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [visible, setVisible] = useState(true);
  const playing = loaded && visible;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(false);
      return;
    }
    const el = root.current!;
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => go((index + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [playing, index]);

  function go(next: number) {
    if (next === index) return;
    setPrev(index);
    setIndex(next);
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        tl.to(".hero-word--summer", { xPercent: -24, ease: "none" }, 0)
          .to(".hero-word--town", { xPercent: 24, ease: "none" }, 0)
          .to(".hero-stage-move", { yPercent: 16, ease: "none" }, 0)
          .to(".hero-plate-spin", { rotate: 140, ease: "none" }, 0)
          .to(".hero-scroll-fade", { autoAlpha: 0, y: -60, ease: "none" }, 0);
        gsap.utils.toArray<HTMLElement>(".hero-leaf").forEach((leaf, i) => {
          tl.to(leaf, { yPercent: -(70 + i * 55), ease: "none" }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      data-nav="dark"
      aria-labelledby="hero-title"
      className={cn(
        "hero relative isolate flex min-h-svh flex-col overflow-clip bg-forest text-cream",
        !visible && "is-paused",
      )}
    >
      <div className="hero-glow" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {drift.map((l) => (
          <svg
            key={l.left}
            viewBox="0 0 36 20"
            className="drift-leaf text-ember/40"
            style={
              {
                left: l.left,
                width: l.size * 2,
                "--t": l.t,
                "--delay": l.delay,
                "--dx": l.dx,
                "--rot": l.rot,
              } as CSSProperties
            }
          >
            <path d="M0 10C8-1 28-1 36 10C28 21 8 21 0 10Z" fill="currentColor" />
          </svg>
        ))}
      </div>

      <div className="shell relative flex flex-1 flex-col pb-6 pt-[calc(var(--header-h)+1rem)] lg:pb-10">
        <div className="hero-scroll-fade hidden items-center justify-between lg:flex">
          <p className="hero-in eyebrow text-sage" style={{ "--d": "1.1s" } as CSSProperties}>
            Continental · Italian · Desserts
          </p>
          <div className="hero-in" style={{ "--d": "1.2s" } as CSSProperties}>
            <OpenStatus />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center pb-20 pt-20 sm:pb-24 sm:pt-16 lg:py-6">
          <div className="hero-stage-move">
            <div className="hero-stage">
              <div className="hero-ring" aria-hidden>
                <svg
                  viewBox="0 0 200 200"
                  className="spin-slow size-full text-cream/55"
                  style={{ animationDuration: "46s", animationDirection: "reverse" }}
                >
                  <defs>
                    <path id="hero-ring-path" d="M100 100m-92 0a92 92 0 1 1 184 0a92 92 0 1 1-184 0" />
                  </defs>
                  <text
                    className="fill-current text-[7.2px] font-medium uppercase"
                    textLength="572"
                    lengthAdjust="spacing"
                  >
                    <textPath href="#hero-ring-path">
                      Slow-smoked ✺ Cheese-stuffed ✺ Hand-stretched ✺ Baked daily ✺ Shaken to order ✺
                    </textPath>
                  </text>
                </svg>
              </div>

              <div aria-hidden className="hero-plate absolute -inset-[6%] z-0">
                <div className="hero-plate-spin size-full">
                  <div className="spin-slow shape-seal size-full bg-terra" style={{ animationDuration: "38s" }} />
                </div>
              </div>

              <div className="hero-sun z-[2] bg-pine">
                {slides.map((s, i) => (
                  <div
                    key={s.src}
                    className={cn("slide", i === index && "is-active", i === prev && "is-prev")}
                    aria-hidden={i !== index}
                  >
                    <SmartImage
                      src={s.src}
                      alt={s.alt}
                      fill
                      preload={i === 0}
                      fetchPriority={i === 0 ? "high" : "low"}
                      quality={85}
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 34rem"
                      className="object-cover"
                    />
                  </div>
                ))}
                <div
                  aria-hidden
                  className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_50%_40%,transparent_45%,rgb(15_33_27/0.45))]"
                />
              </div>

              {leaves.map((l) => (
                <div
                  key={l.src}
                  aria-hidden
                  className={cn("hero-leaf", l.cls)}
                  style={{ "--d": l.d, "--bob": l.bob } as CSSProperties}
                >
                  <div>
                    <div className={cn("relative size-full bg-pine", l.shape)}>
                      <SmartImage src={l.src} alt="" fill sizes="12rem" className="object-cover" />
                    </div>
                  </div>
                </div>
              ))}

              <h1 id="hero-title" className="headline pointer-events-none absolute inset-0 z-[5]">
                <span className="hero-word hero-word--summer">
                  <SplitChars text="Summer" />
                </span>
                <span className="hero-word hero-word--town">
                  <SplitChars text="Town" start={6} />
                </span>
                <span className="sr-only">Summer Town — Resto Café in Panampilly Nagar, Kochi</span>
              </h1>

              <Badge />

              <div
                className="hero-in absolute left-1/2 top-[calc(114%+0.75rem)] z-[6] w-max -translate-x-1/2 text-center"
                style={{ "--d": "1.3s" } as CSSProperties}
              >
                <p className="eyebrow text-cream/60" aria-live="polite">
                  Nº {pad(index + 1)} <span className="text-cream/30">/ {pad(slides.length)}</span>
                  <span className="mx-2 text-cream/30">—</span>
                  <span className="text-cream">{slides[index].caption}</span>
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.src}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show ${s.caption}`}
                      aria-current={i === index}
                      className="relative grid size-6 place-items-center"
                    >
                      <span
                        className={cn(
                          "shape-sun block size-3 transition-colors duration-500",
                          i === index ? "bg-ember" : "bg-cream/25",
                        )}
                      />
                      {i === index && (
                        <span
                          key={`run-${index}`}
                          className="dot-progress shape-sun absolute inset-0 m-auto block size-3 bg-cream/80"
                          style={
                            {
                              "--dur": `${SLIDE_MS}ms`,
                              animationPlayState: playing ? "running" : "paused",
                            } as CSSProperties
                          }
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-fade grid items-end gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <div className="hero-in max-w-md" style={{ "--d": "1.1s" } as CSSProperties}>
            <p className="t-lead text-cream/80">
              Continental plates, slow-smoked meats and desserts worth the detour — served beneath chandeliers on 4th
              Cross Road, Panampilly Nagar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/menu" variant="terra">
                Explore the menu
              </Button>
              <Button href="/#visit" variant="ghost-light">
                Book a table
              </Button>
            </div>
          </div>
          <div className="hidden lg:block" />
          <div
            className="hero-in hidden items-center justify-end gap-4 lg:flex"
            style={{ "--d": "1.4s" } as CSSProperties}
          >
            <span className="eyebrow text-sage">Scroll to explore</span>
            <span className="relative h-14 w-px overflow-hidden bg-cream/15">
              <span className="scroll-cue absolute inset-0 bg-ember" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge() {
  return (
    <div className="hero-badge absolute -left-[9%] bottom-[0%] z-[6] size-[clamp(4.75rem,8.5vw,7.5rem)] sm:-left-[13%] sm:bottom-[6%]">
      <div className="shape-seal relative grid size-full place-items-center bg-cream text-forest">
        <svg viewBox="0 0 200 200" className="spin-slow absolute inset-[7%] size-[86%]" aria-hidden>
          <defs>
            <path id="hero-badge-circle" d="M100 100m-72 0a72 72 0 1 1 144 0a72 72 0 1 1-144 0" />
          </defs>
          <text className="fill-current text-[15px] font-medium uppercase" textLength="446" lengthAdjust="spacing">
            <textPath href="#hero-badge-circle">Resto Café · Est. 2023 · Kochi ·</textPath>
          </text>
        </svg>
        <Emblem className="h-[34%] w-auto text-forest" leafClassName="text-terra" />
      </div>
    </div>
  );
}
