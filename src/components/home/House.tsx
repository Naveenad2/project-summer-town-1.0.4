import type { CSSProperties } from "react";
import { InView } from "@/components/ui/InView";
import { Parallax } from "@/components/ui/Parallax";
import { SmartImage } from "@/components/ui/SmartImage";
import { Split } from "@/components/ui/Split";

const features = [
  {
    title: "Chandelier-lit dining room",
    text: "Brass chandeliers and pendant lamps under a warm terracotta timber ceiling.",
  },
  { title: "Arched Victorian windows", text: "Green-framed arches, framed photographs and copper on the walls." },
  { title: "Made for gathering", text: "Long lunches, birthdays, date nights and catch-ups that run late." },
  { title: "Right in Panampilly Nagar", text: "On 4th Cross Road, opposite DDRC — easy from MG Road and Kadavanthra." },
];

export function House() {
  return (
    <section
      id="house"
      data-nav="light"
      aria-labelledby="house-title"
      className="leaf-pattern relative overflow-x-clip bg-paper py-24 lg:py-40"
    >
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6 xl:col-span-5">
          <InView className="max-w-[34rem]">
            <div className="img-reveal cartouche relative aspect-[4/5] w-full bg-sand">
              <div className="absolute inset-0">
                <Parallax className="absolute -inset-y-[10%] inset-x-0" amount={8}>
                  <SmartImage
                    src="/images/venue/interior.jpg"
                    alt="The dining room at Summer Town — chandelier, terracotta ceiling and arched green windows"
                    fill
                    sizes="(max-width: 1024px) 90vw, 34rem"
                    className="object-cover saturate-[1.05]"
                  />
                </Parallax>
              </div>
              <span aria-hidden className="cartouche absolute inset-3 z-10 border border-cream/70 sm:inset-4" />
            </div>
          </InView>

          <InView
            className="fade-up absolute -bottom-12 right-0 w-[48%] max-w-[15rem] rotate-[4deg] bg-white p-2.5 pb-10 shadow-[0_30px_60px_-25px_rgb(19_22_19/0.45)] sm:-bottom-10 lg:-right-10"
            style={{ "--d": "300ms" } as CSSProperties}
          >
            <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-sand/80" aria-hidden />
            <div className="relative aspect-square overflow-hidden">
              <SmartImage
                src="/images/venue/storefront.jpg"
                alt="Summer Town Resto Café storefront on 4th Cross Road, Panampilly Nagar"
                fill
                sizes="15rem"
                className="object-cover"
              />
            </div>
            <p className="headline absolute inset-x-0 bottom-2.5 text-center text-lg italic text-ink/80">
              4th Cross Road
            </p>
          </InView>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <InView>
            <p className="eyebrow fade-up mb-6 text-terra">(04) — The house</p>
            <h2 id="house-title" className="headline t-h2 text-ink">
              <Split text="Chandeliers, arched windows" />{" "}
              <em className="text-terra">
                <Split text="& a terracotta sky" start={3} />
              </em>
            </h2>
            <p className="fade-up t-lead mt-8 max-w-xl text-ink/70" style={{ "--d": "200ms" } as CSSProperties}>
              Step through the green-framed doors and the city slows down. Summer Town is dressed in quiet Victorian
              detail — the kind of room where a quick coffee turns into dinner.
            </p>
          </InView>

          <InView as="ul" className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {features.map((f, i) => (
              <li
                key={f.title}
                className="fade-up grid grid-cols-[2.25rem_1fr] gap-x-4"
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
              >
                <span
                  aria-hidden
                  className={`mt-1 grid size-9 place-items-center bg-terra text-[0.6rem] font-medium text-cream ${
                    i % 2 ? "shape-leaf-alt" : "shape-leaf"
                  }`}
                >
                  0{i + 1}
                </span>
                <div>
                  <h3 className="headline text-2xl text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{f.text}</p>
                </div>
              </li>
            ))}
          </InView>
        </div>
      </div>
    </section>
  );
}
