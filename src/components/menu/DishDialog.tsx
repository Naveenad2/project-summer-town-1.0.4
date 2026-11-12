"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Close } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";
import { dietLabel, formatPrice, menu, tagLabel, type MenuItem } from "@/data/menu";
import { site } from "@/data/site";
import { lockScroll } from "@/lib/scroll";
import { DietMark } from "./DietMark";

type Props = { item: MenuItem | null; onClose: () => void; onStep: (dir: 1 | -1) => void };

/** Native <dialog>: focus trap, Esc and top-layer for free. Bottom sheet on phones. */
export function DishDialog({ item, onClose, onStep }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const category = item ? menu.find((c) => c.items.some((i) => i.slug === item.slug)) : undefined;

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (item && !dlg.open) {
      dlg.showModal();
      lockScroll(true);
    } else if (!item && dlg.open) {
      dlg.close();
    }
  }, [item]);

  useEffect(() => {
    const dlg = ref.current;
    return () => {
      if (dlg?.open) dlg.close();
      lockScroll(false);
    };
  }, []);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onStep]);

  return (
    <dialog
      ref={ref}
      className="dish-dialog"
      aria-labelledby="dish-title"
      onClose={() => {
        lockScroll(false);
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      {item && (
        <div
          className="dish-panel absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto overscroll-contain rounded-t-[2rem] bg-paper text-ink md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:grid md:max-h-[86svh] md:w-[min(92vw,62rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-2 md:overflow-hidden md:rounded-[2rem]"
          data-lenis-prevent
        >
          <div className="relative aspect-[4/3] w-full bg-sand md:aspect-auto md:h-full md:min-h-[32rem]">
            <SmartImage
              key={item.slug}
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 31rem"
              className="object-cover"
            />
            <span
              className="absolute left-1/2 top-3 h-1 w-12 -translate-x-1/2 rounded-full bg-paper/70 md:hidden"
              aria-hidden
            />
          </div>

          <div className="flex flex-col p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8 md:overflow-y-auto md:p-10">
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow text-terra">{category?.name}</p>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                aria-label="Close"
                autoFocus
                className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-cream"
              >
                <Close className="size-5" />
              </button>
            </div>

            <h2 id="dish-title" className="headline mt-4 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.95]">
              {item.name}
            </h2>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="headline text-3xl text-terra">{formatPrice(item.price)}</span>
              <span className="h-5 w-px bg-ink/15" />
              <span className="flex items-center gap-2 text-sm text-stone">
                <DietMark diet={item.diet} /> {dietLabel[item.diet]}
              </span>
            </div>
            <p className="mt-6 leading-relaxed text-ink/75">{item.description}</p>
            {item.tags && item.tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <li key={t} className="eyebrow rounded-full border border-ink/15 px-3 py-2 text-[0.6rem]">
                    {tagLabel[t]}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex flex-wrap gap-3 pt-10" onClickCapture={() => ref.current?.close()}>
              <Button href={site.social.zomatoOrder} variant="ink" size="sm">
                Order on Zomato
              </Button>
              <Button href="/#visit" variant="ghost-dark" size="sm">
                Book a table
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-5">
              <button
                type="button"
                onClick={() => onStep(-1)}
                className="eyebrow flex items-center gap-2 text-ink/70 hover:text-ink"
              >
                <ArrowRight className="size-4 rotate-180" /> Previous
              </button>
              <button
                type="button"
                onClick={() => onStep(1)}
                className="eyebrow flex items-center gap-2 text-ink/70 hover:text-ink"
              >
                Next <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
