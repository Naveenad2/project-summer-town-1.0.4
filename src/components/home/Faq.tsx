import type { CSSProperties } from "react";
import { InView } from "@/components/ui/InView";
import { Split } from "@/components/ui/Split";
import { faqs } from "@/data/faq";

export function Faq() {
  return (
    <section aria-labelledby="faq-title" data-nav="light" className="faq leaf-pattern relative bg-paper py-24 lg:py-36">
      <div className="cv-auto shell grid gap-12 [contain-intrinsic-size:auto_1150px] lg:grid-cols-12 lg:gap-10 lg:[contain-intrinsic-size:auto_900px]">
        <InView className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow fade-up mb-6 text-terra">(08) — Good to know</p>
            <h2 id="faq-title" className="headline t-h2 text-ink">
              <Split text="Questions," />{" "}
              <em className="text-terra">
                <Split text="answered" start={1} />
              </em>
            </h2>
          </div>
        </InView>
        <InView className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-ink/15">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                name="faq"
                className="fade-up group border-b border-ink/15"
                style={{ "--d": `${i * 60}ms` } as CSSProperties}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left sm:py-7">
                  <h3 className="headline text-[clamp(1.4rem,2.2vw,2rem)] leading-tight text-ink">{f.q}</h3>
                  <span className="faq-icon shape-sun grid size-11 shrink-0 place-items-center bg-sand text-xl text-ink transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)] group-open:bg-terra group-open:text-cream">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 leading-relaxed text-stone">{f.a}</p>
              </details>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}
