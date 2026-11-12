import type { CSSProperties } from "react";
import { Emblem } from "@/components/brand/Logo";
import { InView } from "@/components/ui/InView";
import { site } from "@/data/site";
import { StoryText } from "./StoryText";

const stats = [
  { value: "2023", label: "Doors opened on 4th Cross Road, Panampilly Nagar" },
  { value: "60+", label: "Plates on the menu — small bites to grill platters" },
  { value: `₹${site.costForTwo.toLocaleString("en-IN")}`, label: "Average for two, before taxes" },
  { value: "7 days", label: `Open every day, ${site.hours.label}` },
];

export function Story() {
  return (
    <section
      id="story"
      data-nav="light"
      className="relative overflow-clip bg-paper pb-24 pt-16 sm:pt-24 lg:pb-40 lg:pt-28"
    >
      <Emblem
        className="pointer-events-none absolute -left-40 top-1/3 h-[44rem] w-auto text-ink/[0.025]"
        leafClassName="text-terra/[0.05]"
      />
      <div className="shell relative">
        <InView className="flex items-center justify-between gap-6 pb-6">
          <span className="eyebrow fade-up text-terra">(01) — Our story</span>
          <span className="eyebrow fade-up hidden text-stone sm:block">Est. 2023 · Panampilly Nagar</span>
        </InView>
        <InView className="h-px bg-ink/10">
          <div className="line-grow h-px bg-ink/40" />
        </InView>

        <h2 className="sr-only">About Summer Town Resto Café</h2>
        <StoryText />

        <div className="mt-20 grid gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          <InView className="lg:col-span-5">
            <p className="fade-up t-lead max-w-md text-ink/75">
              Founded by actor {site.founder}, Summer Town grew from a simple love of good food, beautiful rooms and
              long, unhurried conversations — a cosy corner of Kochi where nobody is in a rush.
            </p>
            <p className="fade-up headline mt-8 text-3xl italic text-terra" style={{ "--d": "120ms" } as CSSProperties}>
              Come hungry, stay a while.
            </p>
          </InView>
          <InView as="dl" className="grid grid-cols-2 gap-x-6 gap-y-12 lg:col-span-6 lg:col-start-7">
            {stats.map((s, i) => (
              <div
                key={s.value}
                className="fade-up flex flex-col-reverse border-t border-ink/15 pt-5"
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
              >
                <dt className="mt-3 max-w-[24ch] text-sm leading-relaxed text-stone">{s.label}</dt>
                <dd className="headline text-[clamp(2.6rem,5vw,4.5rem)] leading-none text-ink">{s.value}</dd>
              </div>
            ))}
          </InView>
        </div>
      </div>
    </section>
  );
}
