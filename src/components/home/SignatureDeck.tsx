"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { InView } from "@/components/ui/InView";
import { SmartImage } from "@/components/ui/SmartImage";
import { Split } from "@/components/ui/Split";
import { formatPrice, tagLabel, type MenuItem } from "@/data/menu-labels";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

const tilts = [0, -5, 4.5, -2.5];
const plates = ["shape-cookie", "shape-sun", "shape-clover", "shape-blob"];

const depthTransform = (depth: number) =>
  depth > 3
    ? "translate3d(0, 40px, 0) scale(0.84)"
    : `translate3d(${depth * 7}px, ${depth * 15}px, 0) scale(${1 - depth * 0.045}) rotate(${tilts[depth]}deg)`;

/** A deck of bistro order tickets: swipe, drag, tap or use the arrow keys. */
export function SignatureDeck({ items }: { items: MenuItem[] }) {
  const section = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ id: -1, x0: 0, y0: 0, dx: 0, t0: 0, axis: "" });
  const busy = useRef(false);
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const current = items[order[0]];

  // One-off wiggle so people discover the swipe.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = deck.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-hinting");
        window.setTimeout(() => el.classList.remove("is-hinting"), 1600);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function next(dir: 1 | -1 = -1) {
    const el = top.current;
    if (!el || busy.current) return;
    busy.current = true;
    el.classList.remove("is-dragging");
    el.style.transform = `translate3d(${dir * 125}%, -4%, 0) rotate(${dir * 22}deg)`;
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      busy.current = false;
    }, 240);
  }

  function prev() {
    if (busy.current) return;
    setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, t0: performance.now(), axis: "" };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const el = top.current;
    if (d.id !== e.pointerId || !el) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "x") {
        e.currentTarget.setPointerCapture(e.pointerId);
        el.classList.add("is-dragging");
      }
    }
    if (d.axis !== "x") return;
    d.dx = dx;
    el.style.transform = `translate3d(${dx}px, ${dy * 0.12}px, 0) rotate(${dx * 0.05}deg)`;
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const el = top.current;
    if (d.id !== e.pointerId) return;
    drag.current.id = -1;
    if (!el) return;
    if (d.axis === "x") {
      const velocity = d.dx / Math.max(1, performance.now() - d.t0);
      if (Math.abs(d.dx) > 80 || Math.abs(velocity) > 0.55) {
        next(d.dx > 0 ? 1 : -1);
      } else {
        el.classList.remove("is-dragging");
        el.style.transform = depthTransform(0);
      }
    } else if (!d.axis && e.type === "pointerup") {
      next(-1);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next(-1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  }

  return (
    <section
      ref={section}
      id="signatures"
      data-nav="dark"
      aria-labelledby="signatures-title"
      className="edge-wave relative overflow-x-clip bg-forest py-24 text-cream lg:py-36"
    >
      <div className="shell grid items-center gap-x-10 gap-y-14 lg:grid-cols-12">
        <InView className="lg:col-span-5 lg:row-start-1 lg:self-end">
          <p className="eyebrow fade-up mb-6 text-ember">(02) — Signatures</p>
          <h2 id="signatures-title" className="headline t-h2 max-w-[12ch]">
            <Split text="The plates people" />{" "}
            <em className="text-ember">
              <Split text="come back for" start={3} />
            </em>
          </h2>
        </InView>

        <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
          <div
            ref={deck}
            role="group"
            aria-roledescription="carousel"
            aria-label="Signature dishes — swipe, tap or use arrow keys"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="deck mx-auto aspect-[3/4.15] w-[min(76vw,21rem)] outline-offset-8 sm:w-[22rem] lg:w-[min(26rem,30vw)]"
          >
            {items.map((item, i) => {
              const depth = order.indexOf(i);
              const isTop = depth === 0;
              return (
                <div
                  key={item.slug}
                  ref={isTop ? top : undefined}
                  data-depth={depth}
                  aria-hidden={!isTop}
                  className="deck-card drop-shadow-[0_28px_30px_rgb(0_0_0/0.45)]"
                  style={{
                    transform: depthTransform(depth),
                    opacity: depth > 3 ? 0 : 1,
                    zIndex: 20 - depth,
                    cursor: isTop ? "grab" : undefined,
                  }}
                  onPointerDown={isTop ? onPointerDown : undefined}
                  onPointerMove={isTop ? onPointerMove : undefined}
                  onPointerUp={isTop ? onPointerUp : undefined}
                  onPointerCancel={isTop ? onPointerUp : undefined}
                >
                  <Ticket item={item} index={i} />
                </div>
              );
            })}
          </div>
          <p className="eyebrow mt-14 text-center text-cream/45">Swipe · tap · or use ← →</p>
        </div>

        <div className="lg:col-span-5 lg:row-start-2 lg:self-start">
          <div className="flex items-center gap-4">
            <span className="headline text-6xl text-ember tabular-nums">{pad(order[0] + 1)}</span>
            <span className="eyebrow text-cream/45">/ {pad(items.length)}</span>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous dish"
                className="shape-cookie grid size-14 place-items-center bg-cream/10 transition-colors hover:bg-cream hover:text-forest"
              >
                <ArrowRight className="size-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => next(-1)}
                aria-label="Next dish"
                className="shape-cookie grid size-14 place-items-center bg-terra transition-colors hover:bg-cream hover:text-forest"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
          <div aria-live="polite" className="mt-6 border-t border-cream/15 pt-6">
            <h3 className="headline text-[clamp(2.1rem,4vw,3.25rem)] leading-none">{current.name}</h3>
            <p className="mt-4 max-w-md leading-relaxed text-cream/70">{current.description}</p>
          </div>
          <div className="mt-8">
            <Button href={`/menu?dish=${current.slug}`} variant="ghost-light" size="sm">
              See it on the menu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticket({ item, index }: { item: MenuItem; index: number }) {
  const tag = item.tags?.find((t) => t !== "signature") ?? "signature";
  return (
    <article className="ticket relative flex size-full flex-col rounded-[1.75rem] bg-cream px-5 pb-4 pt-5 text-ink">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-terra">Nº {pad(index + 1)}</span>
        <span className="eyebrow text-[0.6rem] text-stone">{tagLabel[tag]}</span>
      </div>
      <div className="relative mx-auto mt-3 aspect-square w-[86%]">
        <div className={cn("relative size-full bg-sand", plates[index % plates.length])}>
          <SmartImage
            src={item.image}
            alt={item.name}
            fill
            draggable={false}
            sizes="(max-width: 640px) 66vw, 22rem"
            className="pointer-events-none object-cover"
          />
        </div>
        <span className="shape-seal absolute -right-4 -top-3 grid size-[4.4rem] rotate-12 place-items-center bg-terra text-cream">
          <span className="headline text-xl">{formatPrice(item.price)}</span>
        </span>
      </div>
      <span aria-hidden className="absolute inset-x-5 top-[74%] border-t-2 border-dashed border-ink/20" />
      <div className="mt-auto pt-6 text-center">
        <p className="headline text-[clamp(1.6rem,6.5vw,2.1rem)] leading-none">{item.name}</p>
        <p className="eyebrow mt-2 text-[0.56rem] text-stone">Summer Town · Panampilly Nagar</p>
      </div>
    </article>
  );
}
