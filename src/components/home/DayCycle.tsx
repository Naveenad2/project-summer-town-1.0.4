"use client";

import { useRef, type CSSProperties } from "react";
import { InView } from "@/components/ui/InView";
import { SmartImage } from "@/components/ui/SmartImage";
import { Split } from "@/components/ui/Split";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const stages = [
  {
    time: "12:00",
    period: "Noon",
    title: "Long lunches",
    text: "Sunlight through the arched windows, a cheese-stuffed chicken and a cold mango mule. The best afternoons start here.",
    image: "/images/moment/lunch.jpg",
    alt: "A table spread with lunch plates, salads and coffee",
    bg: "#f3ebdd",
    fg: "#131613",
    nav: "light",
    shape: "sun",
  },
  {
    time: "16:30",
    period: "Afternoon",
    title: "Coffee & something sweet",
    text: "A cappuccino, a slice of butterscotch cheesecake and absolutely nowhere to be.",
    image: "/images/moment/afternoon.jpg",
    alt: "Cappuccinos with latte art on a café table",
    bg: "#e9c88a",
    fg: "#131613",
    nav: "light",
    shape: "cookie",
  },
  {
    time: "19:30",
    period: "Evening",
    title: "Dinner, properly",
    text: "The chandeliers glow, the grill is busy — ribs, brisket and steaks, rested just right.",
    image: "/images/moment/dinner.jpg",
    alt: "Grilled meats served in a black pan",
    bg: "#b9522a",
    fg: "#f3ebdd",
    nav: "dark",
    shape: "flower",
  },
  {
    time: "23:00",
    period: "Late",
    title: "One more dessert",
    text: "Last orders are around eleven — the kitchen keeps something sweet for the road until 11:30 PM.",
    image: "/images/moment/late.jpg",
    alt: "A dark chocolate layer cake on a black plate",
    bg: "#0f211b",
    fg: "#f3ebdd",
    nav: "dark",
    shape: "seal",
  },
] as const;

// Semi-ellipse the sun travels along (viewBox 0 0 1000 340).
const CX = 500;
const CY = 320;
const RX = 440;
const RY = 300;
const orbAt = (t: number) => ({
  x: CX - RX * Math.cos(Math.PI * t),
  y: CY - RY * Math.sin(Math.PI * t),
});

export function DayCycle() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-height: 600px)", () => {
        const s = section.current!;
        s.classList.add("is-enhanced");
        const sticky = s.querySelector<HTMLElement>(".day-sticky")!;
        const panels = gsap.utils.toArray<HTMLElement>(".day-panel");
        const ticks = gsap.utils.toArray<HTMLElement>(".day-tick");
        const sun = s.querySelector<SVGGElement>(".day-sun")!;
        const moon = s.querySelector<SVGGElement>(".day-moon")!;
        const fill = s.querySelector<HTMLElement>(".day-fill")!;
        const plate = s.querySelector<HTMLElement>(".day-morph-clip")!;
        const plates = gsap.utils.toArray<HTMLElement>(".day-morph-img");
        const rootStyle = getComputedStyle(document.documentElement);
        const shapeOf = (name: string) => rootStyle.getPropertyValue(`--shape-${name}`).trim();

        gsap.set(sticky, { backgroundColor: stages[0].bg, color: stages[0].fg });
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });
        gsap.set(plate, { clipPath: shapeOf(stages[0].shape), rotate: 0 });
        gsap.set(plates.slice(1), { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: "none" } });
        stages.slice(1).forEach((stage, i) => {
          tl.to(sticky, { backgroundColor: stage.bg, color: stage.fg, duration: 1 }, i)
            .to(panels[i], { autoAlpha: 0, y: -40, duration: 0.35, ease: "power2.in" }, i + 0.3)
            .fromTo(
              panels[i + 1],
              { autoAlpha: 0, y: 40 },
              { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
              i + 0.6,
            )
            .to(plate, { clipPath: shapeOf(stage.shape), rotate: (i + 1) * 30, duration: 1, ease: "power1.inOut" }, i)
            .to(plates[i + 1], { opacity: 1, duration: 0.4 }, i + 0.35)
            .set(plates[i], { opacity: 0 }, i + 0.8);
        });

        let active = -1;
        const render = (p: number) => {
          const sunT = gsap.utils.clamp(0, 1.08, gsap.utils.mapRange(0, 0.78, 0.46, 1.08, p));
          const moonT = gsap.utils.mapRange(0.72, 1, -0.08, 0.3, p);
          const sp = orbAt(sunT);
          const mp = orbAt(gsap.utils.clamp(-0.08, 0.3, moonT));
          sun.setAttribute("transform", `translate(${sp.x} ${sp.y})`);
          moon.setAttribute("transform", `translate(${mp.x} ${mp.y})`);
          fill.style.transform = `scaleX(${p})`;
          const idx = Math.min(stages.length - 1, Math.floor(p * (stages.length - 1) + 0.5));
          if (idx !== active) {
            active = idx;
            s.dataset.nav = stages[idx].nav;
            ticks.forEach((t, i) => t.classList.toggle("is-active", i === idx));
          }
        };
        render(0);

        gsap
          .timeline({
            scrollTrigger: {
              trigger: s,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              onUpdate: (self) => render(self.progress),
            },
          })
          .add(tl);

        return () => {
          s.classList.remove("is-enhanced");
          s.dataset.nav = "light";
          gsap.set(sticky, { clearProps: "backgroundColor,color" });
          gsap.set(panels, { clearProps: "opacity,visibility,transform" });
        };
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="a-day"
      data-nav="light"
      aria-labelledby="day-title"
      className="day-section relative bg-cream"
    >
      <div className="day-sticky">
        <div className="shell relative z-20 flex items-start justify-between gap-6 pt-20 sm:pt-24 lg:pt-[calc(var(--header-h)+1.25rem)]">
          <InView>
            <p className="eyebrow fade-up mb-4 opacity-70">(03) — A day at Summer Town</p>
            <h2 id="day-title" className="headline t-h3 max-w-[16ch]">
              <Split text="From noon sun to" />{" "}
              <em>
                <Split text="chandelier light" start={4} />
              </em>
            </h2>
          </InView>
          <p className="day-enhanced-only eyebrow hidden pt-2 opacity-60 sm:block">Open daily · 12 PM – 11:30 PM</p>
        </div>

        <div className="day-enhanced-only day-arc pointer-events-none absolute inset-x-0 z-0" aria-hidden>
          <svg
            viewBox="0 0 1000 340"
            className="mx-auto w-screen -translate-y-[94.12%] overflow-visible lg:w-[min(72vw,780px)]"
          >
            <defs>
              <clipPath id="day-horizon">
                <rect x="-100" y="-100" width="1200" height={CY + 100} />
              </clipPath>
            </defs>
            <path
              d={`M${CX - RX} ${CY} A${RX} ${RY} 0 0 1 ${CX + RX} ${CY}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeDasharray="2 10"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <g clipPath="url(#day-horizon)">
              <g className="day-sun">
                <circle r="50" fill="#f2b65a" opacity="0.22" />
                <circle r="30" fill="#f2b65a" />
              </g>
              <g className="day-moon">
                <circle r="26" fill="#f3ebdd" />
                <circle r="22" cx="12" cy="-8" fill="#0f211b" />
              </g>
            </g>
          </svg>
        </div>

        <div className="day-enhanced-only day-morph" aria-hidden>
          <div className="day-morph-clip relative size-full">
            {stages.map((st) => (
              <div key={st.time} className="day-morph-img absolute inset-0">
                <SmartImage
                  src={st.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="day-panels">
          {stages.map((st, i) => (
            <article
              key={st.time}
              className="day-panel"
              style={{ backgroundColor: st.bg, color: st.fg } as CSSProperties}
            >
              <div className="day-panel-inner shell flex flex-col items-center gap-7 text-center lg:grid lg:text-left lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-14">
                <div className={`day-plate relative aspect-square shrink-0 lg:order-2 shape-${st.shape}`}>
                  <SmartImage
                    src={st.image}
                    alt={st.alt}
                    fill
                    sizes="(max-width: 1024px) 60vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:order-1 lg:text-right">
                  <p className="eyebrow mb-3 opacity-60">{st.period}</p>
                  <p className="headline text-[clamp(3.6rem,11vw,10rem)] leading-[0.85] tabular-nums">{st.time}</p>
                </div>
                <div className="lg:order-3">
                  <h3 className="headline text-[clamp(2rem,3.6vw,3.4rem)] leading-none">{st.title}</h3>
                  <p className="mx-auto mt-4 max-w-sm leading-relaxed opacity-75 lg:mx-0">{st.text}</p>
                  <p className="day-static-only eyebrow mt-6 opacity-50">
                    {i + 1} / {stages.length}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="day-enhanced-only shell absolute inset-x-0 bottom-0 z-20 pb-7 sm:pb-10">
          <div className="relative h-px bg-current/20">
            <div className="day-fill absolute inset-0 origin-left scale-x-0 bg-current" />
          </div>
          <ol className="mt-4 flex justify-between">
            {stages.map((st) => (
              <li
                key={st.time}
                className="day-tick eyebrow opacity-60 transition-opacity duration-500 [&.is-active]:opacity-100"
              >
                {st.time}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
