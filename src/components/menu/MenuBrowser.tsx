"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Close, Search } from "@/components/ui/Icons";
import { InView } from "@/components/ui/InView";
import { SmartImage } from "@/components/ui/SmartImage";
import { allItems, formatPrice, menu, tagLabel, type Diet, type MenuItem } from "@/data/menu";
import { scrollToTarget } from "@/lib/scroll";
import { cn, pad } from "@/lib/utils";
import { DietMark } from "./DietMark";
import { DishDialog } from "./DishDialog";

type DietFilter = "all" | Diet;

const dietOptions: { value: DietFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "veg", label: "Veg" },
  { value: "nonveg", label: "Non-veg" },
  { value: "egg", label: "Egg" },
];

const normalise = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function MenuBrowser() {
  const [diet, setDiet] = useState<DietFilter>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(menu[0].slug);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => {
    const q = normalise(query.trim());
    return menu
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) =>
            (diet === "all" || i.diet === diet) &&
            (!q || normalise(`${i.name} ${i.description} ${c.name}`).includes(q)),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [diet, query]);

  const visibleItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const count = visibleItems.length;

  // Scroll-spy for the category chips.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.slug)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // Keep the active chip in view.
  useEffect(() => {
    const wrap = chips.current;
    const chip = wrap?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!wrap || !chip) return;
    wrap.scrollTo({ left: chip.offsetLeft - wrap.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  // Deep link: /menu?dish=slug opens that dish.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("dish");
    if (!slug) return;
    const item = allItems.find((i) => i.slug === slug);
    if (item) setSelected(item);
    params.delete("dish");
    const rest = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`,
    );
  }, []);

  const jumpTo = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const goingDown = el.getBoundingClientRect().top > 0;
    const headerH = goingDown
      ? 0
      : parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) * 16 || 0;
    scrollToTarget(el, { offset: -((toolbar.current?.offsetHeight ?? 0) + headerH + 24) });
  }, []);

  const step = (dir: 1 | -1) => {
    if (!selected) return;
    const idx = visibleItems.findIndex((i) => i.slug === selected.slug);
    const next = visibleItems[(idx + dir + visibleItems.length) % visibleItems.length];
    if (next) setSelected(next);
  };

  const filters = (suffix: string) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div
        role="group"
        aria-label="Dietary preference"
        className="flex shrink-0 self-start rounded-full border border-ink/15 p-1 sm:self-auto"
      >
        {dietOptions.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={diet === o.value}
            onClick={() => setDiet(o.value)}
            className={cn(
              "eyebrow flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.62rem] transition-colors duration-300",
              diet === o.value ? "bg-ink text-cream" : "text-ink/70 hover:text-ink",
            )}
          >
            {o.value !== "all" && <DietMark diet={o.value} className="size-3 [&>span:first-child]:size-1.5" />}
            {o.label}
          </button>
        ))}
      </div>
      <label className="relative flex w-full min-w-0 items-center sm:flex-1 lg:w-56 lg:flex-none">
        <span className="sr-only">Search the menu</span>
        <Search className="pointer-events-none absolute left-3.5 size-4 text-ink/50" />
        <input
          id={`menu-search-${suffix}`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes"
          className="h-10 w-full min-w-0 rounded-full border border-ink/15 bg-white/60 pl-10 pr-9 text-base text-ink placeholder:text-ink/45 focus:border-terra focus:outline-none sm:text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 grid size-7 place-items-center rounded-full text-ink/60 hover:bg-ink/5"
          >
            <Close className="size-4" />
          </button>
        )}
      </label>
    </div>
  );

  return (
    <section aria-label="Menu" className="relative bg-paper pb-24 lg:pb-36">
      <div className="shell pt-8 lg:hidden">{filters("m")}</div>

      <div
        ref={toolbar}
        className="sticky top-[var(--header-offset)] z-30 mt-6 border-y border-ink/10 bg-paper/90 backdrop-blur-xl transition-[top] duration-700 ease-[var(--ease-out-expo)] lg:mt-0 lg:border-t-0"
      >
        <div className="shell flex items-center gap-6 py-3 lg:py-4">
          <div
            ref={chips}
            className="no-scrollbar -mx-[var(--gutter)] flex flex-1 gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0"
            data-lenis-prevent
          >
            {menu.map((c) => {
              const enabled = sections.some((s) => s.slug === c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  data-chip={c.slug}
                  disabled={!enabled}
                  onClick={() => jumpTo(c.slug)}
                  aria-current={active === c.slug ? "true" : undefined}
                  className={cn(
                    "eyebrow shrink-0 rounded-full border px-4 py-2.5 text-[0.64rem] transition-colors duration-300 disabled:opacity-30",
                    active === c.slug
                      ? "border-terra bg-terra text-cream"
                      : "border-ink/15 text-ink/75 hover:border-ink/40",
                  )}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          <div className="hidden shrink-0 lg:block">{filters("d")}</div>
        </div>
      </div>

      <div className="shell">
        <p className="eyebrow pt-8 text-stone" aria-live="polite">
          Showing {count} {count === 1 ? "dish" : "dishes"}
          {diet !== "all" && ` · ${dietOptions.find((d) => d.value === diet)?.label}`}
          {query && ` · “${query}”`}
        </p>

        {sections.length === 0 && (
          <div className="flex flex-col items-start gap-6 py-24">
            <p className="headline text-5xl text-ink">Nothing on the table for that.</p>
            <p className="text-stone">Try another word, or clear the filters.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDiet("all");
              }}
              className="btn btn-ink"
            >
              <span className="btn-label">
                <span>Reset filters</span>
                <span aria-hidden>Reset filters</span>
              </span>
            </button>
          </div>
        )}

        {sections.map((cat) => {
          const index = menu.findIndex((c) => c.slug === cat.slug);
          return (
            <section
              key={cat.slug}
              id={cat.slug}
              aria-labelledby={`${cat.slug}-title`}
              className="grid scroll-mt-[calc(var(--header-h)+5rem)] gap-10 border-b border-ink/10 py-16 last:border-b-0 lg:grid-cols-12 lg:gap-10 lg:py-24"
            >
              <InView className="lg:col-span-4">
                <div className="lg:sticky lg:top-[calc(var(--header-offset)+6.5rem)] lg:transition-[top] lg:duration-700">
                  <p className="eyebrow fade-up flex items-center gap-3 text-terra">
                    <span>{pad(index + 1)}</span>
                    <span className="h-px w-8 bg-terra/50" />
                    <span>{cat.kicker}</span>
                  </p>
                  <h2
                    id={`${cat.slug}-title`}
                    className="headline fade-up mt-5 text-[clamp(2.75rem,5vw,4.75rem)] text-ink"
                  >
                    {cat.name}
                  </h2>
                  <p className="fade-up mt-4 max-w-sm leading-relaxed text-stone">{cat.description}</p>
                  <div className="relative mt-10 hidden aspect-square w-full max-w-[19rem] lg:block">
                    <div aria-hidden className="absolute inset-0">
                      <div
                        className="spin-slow shape-seal size-full bg-terra/90"
                        style={{ animationDuration: "48s" }}
                      />
                    </div>
                    <div className="img-reveal absolute inset-[8%]">
                      <div className="shape-sun absolute inset-0 bg-sand">
                        <SmartImage src={cat.image} alt="" fill sizes="17rem" className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </InView>

              <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-14 lg:col-span-8 xl:grid-cols-3">
                {cat.items.map((item, i) => (
                  <li key={item.slug}>
                    <DishCard item={item} index={i} onOpen={() => setSelected(item)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-stone">
          Prices are in Indian Rupees and exclude applicable taxes. Dishes may contain allergens such as nuts, gluten,
          dairy and eggs — please tell our team about any allergies. Menu and prices may change with the season.
        </p>
      </div>

      <DishDialog item={selected} onClose={() => setSelected(null)} onStep={step} />
    </section>
  );
}

const cardShapes = ["cookie", "blob", "squircle", "sun", "clover"];

function DishCard({ item, index, onOpen }: { item: MenuItem; index: number; onOpen: () => void }) {
  const shape = cardShapes[index % cardShapes.length];
  const hoverShape = shape === "sun" ? "cookie" : "sun";
  return (
    <InView
      as="article"
      id={`dish-${item.slug}`}
      className="fade-up group relative grid grid-cols-[6.5rem_1fr] items-start gap-5 sm:block"
      style={{ "--d": `${(index % 3) * 80}ms` } as CSSProperties}
      data-cursor="View"
    >
      <div className="relative aspect-square">
        <div
          className={cn(
            "morph relative size-full bg-sand group-hover:[clip-path:var(--hover-shape)]",
            `shape-${shape}`,
          )}
          style={{ "--hover-shape": `var(--shape-${hoverShape})` } as CSSProperties}
        >
          <SmartImage
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 7rem, (max-width: 1280px) 30vw, 18rem"
            className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
          />
        </div>
        <span className="shape-seal absolute -right-1 -top-1 hidden size-[4.4rem] rotate-12 place-items-center bg-terra text-cream transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[40deg] sm:grid">
          <span className="headline -rotate-12 text-lg">{formatPrice(item.price)}</span>
        </span>
      </div>
      <div className="min-w-0 sm:mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="headline text-[1.6rem] leading-[1.05] text-ink sm:text-[1.75rem]">
            <button
              type="button"
              onClick={onOpen}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:after:rounded-2xl [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-offset-4 [&:focus-visible]:after:outline-terra"
            >
              {item.name}
            </button>
          </h3>
          <span className="headline shrink-0 pt-0.5 text-xl text-terra sm:hidden">{formatPrice(item.price)}</span>
        </div>
        <div className="mt-2 flex items-start gap-2.5">
          <DietMark diet={item.diet} className="mt-[3px]" />
          <p className="line-clamp-3 text-sm leading-relaxed text-stone sm:line-clamp-none">{item.description}</p>
        </div>
        {item.tags && item.tags.length > 0 && (
          <p className="eyebrow mt-3 text-[0.56rem] text-terra">{item.tags.map((t) => tagLabel[t]).join(" · ")}</p>
        )}
      </div>
    </InView>
  );
}
