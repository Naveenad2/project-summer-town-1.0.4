import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Clock, Phone, Pin } from "@/components/ui/Icons";
import { InView } from "@/components/ui/InView";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { Split } from "@/components/ui/Split";
import { fullAddress, site } from "@/data/site";
import { LazyMap } from "./LazyMap";
import { ReservationForm } from "./ReservationForm";

export function Visit() {
  return (
    <section
      id="visit"
      data-nav="dark"
      aria-labelledby="visit-title"
      className="edge-scallop relative overflow-x-clip bg-forest py-24 text-cream lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_90%_10%,rgb(214_169_92/0.14),transparent_70%)]"
      />
      <div className="cv-auto shell relative grid gap-16 [contain-intrinsic-size:auto_2300px] lg:grid-cols-12 lg:gap-12 lg:[contain-intrinsic-size:auto_1300px]">
        <div className="lg:col-span-6">
          <InView>
            <p className="eyebrow fade-up mb-6 text-ember">(07) — Visit &amp; book</p>
            <h2 id="visit-title" className="headline t-h1">
              <Split text="Save us" />{" "}
              <em className="text-ember">
                <Split text="a seat." start={2} />
              </em>
            </h2>
            <p className="fade-up t-lead mt-6 max-w-md text-cream/70" style={{ "--d": "200ms" } as CSSProperties}>
              Tell us when you’re coming and we’ll confirm on WhatsApp. For tables of eight or more, give us a call.
            </p>
          </InView>
          <InView className="fade-up mt-12" style={{ "--d": "250ms" } as CSSProperties}>
            <ReservationForm />
          </InView>
        </div>

        <InView className="relative lg:col-span-5 lg:col-start-8">
          <div className="fade-up relative mx-auto w-[86%] max-w-[25rem] -rotate-2 drop-shadow-[0_26px_34px_rgb(0_0_0/0.45)] sm:w-[62%] lg:w-[86%]">
            <div className="stamp bg-cream">
              <div className="p-2.5 sm:p-3">
                <div className="relative aspect-[4/5] overflow-hidden bg-pine">
                  <LazyMap />
                </div>
                <div className="flex items-end justify-between gap-3 px-1 pt-2.5 text-forest">
                  <span className="headline text-3xl leading-none">
                    ₹{site.costForTwo.toLocaleString("en-IN")}
                    <span className="eyebrow ml-1.5 text-[0.5rem] text-stone">for two</span>
                  </span>
                  <span className="eyebrow text-right text-[0.52rem] leading-snug text-stone">
                    Panampilly Nagar
                    <br />
                    Kochi · 682036
                  </span>
                </div>
              </div>
            </div>
            <Postmark className="pointer-events-none absolute -right-8 -top-10 w-[46%] rotate-12 text-ember sm:-right-12" />
          </div>

          <div
            className="fade-up leaf-pattern relative -mt-4 rotate-[1.5deg] bg-cream px-6 pb-7 pt-9 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] sm:px-9"
            style={{ "--d": "150ms" } as CSSProperties}
          >
            <p className="headline text-[2.1rem] italic leading-none text-terra">Wish you were here.</p>
            <dl className="mt-6 grid gap-x-5 gap-y-4 border-b border-dashed border-ink/20 pb-5 text-[0.95rem] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="border-b border-dashed border-ink/20 pb-4 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <dt className="eyebrow flex items-center gap-2 text-stone">
                  <Pin className="size-4 text-terra" /> Address
                </dt>
                <dd className="mt-2 leading-relaxed">
                  <address className="not-italic">{fullAddress}</address>
                </dd>
              </div>
              <div>
                <dt className="eyebrow flex items-center gap-2 text-stone">
                  <Clock className="size-4 text-terra" /> Hours
                </dt>
                <dd className="mt-2">
                  Every day, {site.hours.label}
                  <OpenStatus tone="dark" className="mt-3" />
                </dd>
              </div>
              <div>
                <dt className="eyebrow flex items-center gap-2 text-stone">
                  <Phone className="size-4 text-terra" /> Call
                </dt>
                <dd className="mt-2">
                  <a href={site.phoneHref} className="headline link-u text-2xl">
                    {site.phone}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={site.maps.directions} variant="terra" size="sm">
                Get directions
              </Button>
              <Button href={site.social.zomatoOrder} variant="ink" size="sm">
                Order on Zomato
              </Button>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}

/** Circular cancellation mark with wavy lines, like a franked postcard. */
function Postmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 170" className={className} fill="none" stroke="currentColor" aria-hidden>
      <defs>
        <path id="postmark-ring" d="M80 85m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0" />
      </defs>
      <circle cx="80" cy="85" r="72" strokeWidth="3" />
      <circle cx="80" cy="85" r="44" strokeWidth="1.5" />
      <text
        fill="currentColor"
        stroke="none"
        className="text-[11.5px] font-medium uppercase"
        textLength="352"
        lengthAdjust="spacing"
      >
        <textPath href="#postmark-ring">Panampilly Nagar · Kochi · Kerala ·</textPath>
      </text>
      <text x="80" y="80" textAnchor="middle" fill="currentColor" stroke="none" className="headline text-[22px]">
        Summer
      </text>
      <text
        x="80"
        y="102"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        className="headline text-[22px] italic"
      >
        Town
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M160 ${49 + i * 18}c12-9 24-9 36 0s24 9 36 0 18-6 24-4`}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
