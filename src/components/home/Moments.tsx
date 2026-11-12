import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/ui/Icons";
import { InView } from "@/components/ui/InView";
import { SmartImage } from "@/components/ui/SmartImage";
import { Split } from "@/components/ui/Split";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Shape = "sun" | "leaf" | "leaf-alt" | "cookie" | "flower" | "clover" | "blob" | "seal" | "squircle" | "stamp";
type Tile = { src: string; alt: string; shape: Shape; big?: boolean; tilt?: string };

const rowA: Tile[] = [
  { src: "/images/venue/storefront.jpg", alt: "Summer Town storefront", shape: "stamp", tilt: "-rotate-3" },
  { src: "/images/menu/cheese-stuffed-chicken.jpg", alt: "Cheese stuffed chicken", shape: "sun", big: true },
  { src: "/images/menu/mango-mule.jpg", alt: "Mango mule", shape: "leaf", tilt: "rotate-6" },
  { src: "/images/menu/smoked-beef-brisket.jpg", alt: "Smoked beef brisket", shape: "cookie", big: true },
  { src: "/images/menu/creme-brulee.jpg", alt: "Crème brûlée", shape: "flower" },
  { src: "/images/menu/double-smash-burger.jpg", alt: "Double smash burger", shape: "clover", big: true },
  { src: "/images/menu/chicken-fettuccine.jpg", alt: "Chicken fettuccine", shape: "blob" },
];

const rowB: Tile[] = [
  {
    src: "/images/menu/butterscotch-cheesecake.jpg",
    alt: "Butterscotch cheesecake",
    shape: "leaf-alt",
    tilt: "-rotate-6",
  },
  { src: "/images/venue/interior.jpg", alt: "Chandelier-lit dining room", shape: "seal", big: true },
  { src: "/images/menu/gochujang-chicken.jpg", alt: "Gochujang chicken", shape: "sun" },
  { src: "/images/menu/cappuccino.jpg", alt: "Cappuccino", shape: "flower", big: true },
  { src: "/images/menu/smoked-bbq-pork-ribs.jpg", alt: "Smoked BBQ pork ribs", shape: "squircle", tilt: "rotate-3" },
  { src: "/images/menu/loaded-chicken-fries.jpg", alt: "Loaded chicken fries", shape: "cookie", big: true },
  { src: "/images/menu/classic-tiramisu.jpg", alt: "Tiramisu", shape: "leaf" },
];

const favourites = [
  "Cheese-stuffed chicken",
  "Butterscotch cheesecake",
  "Beef brisket",
  "Crème brûlée",
  "Braised pork belly",
  "Chicken quesadilla",
  "Mango mule",
];

function Row({ tiles, reverse, dur }: { tiles: Tile[]; reverse?: boolean; dur: string }) {
  return (
    <InView className="marquee overflow-hidden py-4" once={false} threshold={0} rootMargin="0px">
      <div
        className={cn("marquee-track items-center gap-3 sm:gap-6", reverse && "is-reverse")}
        style={{ "--dur": dur } as CSSProperties}
      >
        {[0, 1].map((copy) =>
          tiles.map((t, i) => (
            <a
              key={`${copy}-${t.src}`}
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={copy === 1}
              tabIndex={copy === 1 ? -1 : undefined}
              aria-label={copy === 0 ? `${t.alt} — view on Instagram` : undefined}
              data-cursor="Follow"
              className={cn(
                "group relative block shrink-0",
                t.big ? "size-44 sm:size-60 lg:size-72" : "size-36 sm:size-48 lg:size-56",
                i % 2 ? "translate-y-3" : "-translate-y-3",
                t.tilt,
              )}
            >
              {t.shape === "stamp" ? (
                <span className="stamp block size-full bg-paper drop-shadow-sm">
                  <span className="relative block size-full overflow-hidden bg-sand">
                    <SmartImage src={t.src} alt={copy === 0 ? t.alt : ""} fill sizes="18rem" className="object-cover" />
                  </span>
                </span>
              ) : (
                <span
                  className={cn(
                    "morph relative block size-full bg-sand group-hover:[clip-path:var(--shape-sun)]",
                    `shape-${t.shape}`,
                  )}
                >
                  <SmartImage
                    src={t.src}
                    alt={copy === 0 ? t.alt : ""}
                    fill
                    sizes="(max-width: 640px) 44vw, 18rem"
                    className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-110"
                  />
                </span>
              )}
            </a>
          )),
        )}
      </div>
    </InView>
  );
}

export function Moments() {
  return (
    <section
      aria-labelledby="moments-title"
      data-nav="light"
      className="edge-wave relative overflow-x-clip bg-cream py-24 lg:py-36"
    >
      <div className="shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <InView>
          <p className="eyebrow fade-up mb-6 text-terra">(06) — Moments</p>
          <h2 id="moments-title" className="headline t-h2 max-w-[15ch] text-ink">
            <Split text="Pull up a chair," />{" "}
            <em className="text-terra">
              <Split text="stay for dessert" start={4} />
            </em>
          </h2>
        </InView>
        <InView className="fade-up flex flex-col items-start gap-5 lg:items-end">
          <p className="max-w-xs text-sm leading-relaxed text-stone lg:text-right">
            New plates, quiet corners and plenty of celebrations — follow along on Instagram.
          </p>
          <Button href={site.social.instagram} variant="ink">
            {site.social.instagramHandle}
          </Button>
        </InView>
      </div>

      <div className="cv-auto mt-10 grid gap-2 [contain-intrinsic-size:auto_420px] sm:gap-4 lg:mt-16 lg:[contain-intrinsic-size:auto_640px]">
        <Row tiles={rowA} dur="60s" />
        <Row tiles={rowB} dur="70s" reverse />
      </div>

      <div className="shell mt-16 lg:mt-24">
        <InView className="flex flex-col gap-6 border-t border-ink/10 pt-8 lg:flex-row lg:items-baseline lg:gap-14">
          <p className="eyebrow fade-up shrink-0 text-stone">Most-mentioned in guest reviews</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {favourites.map((f, i) => (
              <li
                key={f}
                className="fade-up headline flex items-center gap-5 text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none text-ink"
                style={{ "--d": `${i * 70}ms` } as CSSProperties}
              >
                <span className={i % 2 ? "italic text-terra" : ""}>{f}</span>
                {i < favourites.length - 1 && <Sparkle className="size-3.5 text-terra/60" />}
              </li>
            ))}
          </ul>
        </InView>
      </div>
    </section>
  );
}
