import type { CSSProperties } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { SplitChars } from "@/components/ui/Split";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { menu } from "@/data/menu";
import { site } from "@/data/site";

const total = menu.reduce((n, c) => n + c.items.length, 0);

const cutouts = [
  {
    src: "/images/menu/smoked-bbq-pork-ribs.jpg",
    alt: "Smoked BBQ pork ribs",
    cls: "shape-leaf-alt -left-[4%] bottom-[2%] w-[40%] -rotate-6",
  },
  { src: "/images/menu/creme-brulee.jpg", alt: "Crème brûlée", cls: "shape-flower -right-[2%] top-0 w-[36%]" },
];

export function MenuHero() {
  return (
    <section
      data-nav="dark"
      aria-labelledby="menu-title"
      className="relative overflow-clip bg-forest pb-16 pt-[calc(var(--header-h)+2.5rem)] text-cream lg:pb-24 lg:pt-[calc(var(--header-h)+4rem)]"
    >
      <div className="hero-glow" aria-hidden />
      <div className="shell relative grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <nav aria-label="Breadcrumb" className="hero-in eyebrow text-sage" style={{ "--d": "0.5s" } as CSSProperties}>
            <ol className="flex items-center gap-3">
              <li>
                <TransitionLink href="/" className="link-u">
                  Home
                </TransitionLink>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-cream">
                Menu
              </li>
            </ol>
          </nav>
          <h1 id="menu-title" className="headline mt-8 text-[clamp(4.75rem,17vw,14rem)] leading-[0.82]">
            <SplitChars text="The" />{" "}
            <em className="text-ember">
              <SplitChars text="Menu" start={3} />
            </em>
            <span className="sr-only">
              Summer Town menu — continental, Italian and desserts in Panampilly Nagar, Kochi
            </span>
          </h1>
          <p className="hero-in t-lead mt-8 max-w-lg text-cream/75" style={{ "--d": "0.7s" } as CSSProperties}>
            Continental classics, Italian comfort and the desserts we’re quietly famous for — every plate cooked to
            order in our Panampilly Nagar kitchen.
          </p>
          <dl className="hero-in mt-10 flex flex-wrap gap-x-12 gap-y-6" style={{ "--d": "0.85s" } as CSSProperties}>
            {[
              [String(total), "Dishes"],
              [String(menu.length), "Chapters"],
              [`₹${site.costForTwo.toLocaleString("en-IN")}`, "For two"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col-reverse">
                <dt className="eyebrow mt-2 text-sage">{l}</dt>
                <dd className="headline text-5xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="hero-in flex justify-center lg:col-span-5 lg:justify-end"
          style={{ "--d": "0.6s" } as CSSProperties}
        >
          <div className="relative aspect-square w-[min(86vw,24rem)] lg:w-[min(36vw,30rem)]">
            <div aria-hidden className="absolute inset-[6%]">
              <div className="spin-slow shape-seal size-full bg-terra" style={{ animationDuration: "40s" }} />
            </div>
            <div className="shape-sun absolute inset-[13%] bg-pine">
              <SmartImage
                src="/images/menu/cheese-stuffed-chicken.jpg"
                alt="Cheese stuffed chicken, a Summer Town signature"
                fill
                preload
                sizes="(max-width: 1024px) 64vw, 23rem"
                className="object-cover"
              />
            </div>
            {cutouts.map((c) => (
              <div key={c.src} className={`absolute aspect-square bg-pine ${c.cls}`}>
                <SmartImage src={c.src} alt={c.alt} fill sizes="12rem" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
