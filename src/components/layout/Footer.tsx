import { Emblem, Wordmark } from "@/components/brand/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { InView } from "@/components/ui/InView";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { fullAddress, nav, site } from "@/data/site";
import { BackToTop } from "./BackToTop";

const socials = [
  { label: "Instagram", href: site.social.instagram },
  { label: "Facebook", href: site.social.facebook },
  { label: "Zomato", href: site.social.zomato },
  { label: "Tripadvisor", href: site.social.tripadvisor },
];

export function Footer() {
  return (
    <footer data-nav="dark" className="edge-scallop relative overflow-x-clip bg-forest pt-20 text-cream lg:pt-28">
      <Emblem
        className="pointer-events-none absolute -right-16 top-0 h-[34rem] w-auto text-cream/[0.03] lg:right-10"
        leafClassName="text-cream/[0.03]"
      />
      <div className="cv-auto shell relative [contain-intrinsic-size:auto_1100px] lg:[contain-intrinsic-size:auto_700px]">
        <InView className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div className="fade-up">
            <p className="eyebrow mb-5 text-ember">Visit</p>
            <address className="max-w-xs not-italic leading-relaxed text-cream/80">{fullAddress}</address>
            <a
              href={site.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="link-u mt-5 inline-flex items-center gap-2 text-sm"
            >
              Get directions <ArrowUpRight className="size-4" />
            </a>
          </div>
          <div className="fade-up" style={{ "--d": "80ms" } as React.CSSProperties}>
            <p className="eyebrow mb-5 text-ember">Hours</p>
            <p className="text-cream/80">Every day</p>
            <p className="headline mt-1 text-3xl">{site.hours.label}</p>
            <OpenStatus className="mt-5" />
          </div>
          <div className="fade-up" style={{ "--d": "160ms" } as React.CSSProperties}>
            <p className="eyebrow mb-5 text-ember">Say hello</p>
            <a href={site.phoneHref} className="headline link-u text-3xl">
              {site.phone}
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-u mt-4 block w-fit text-sm text-cream/80"
            >
              Message us on WhatsApp
            </a>
          </div>
          <div className="fade-up" style={{ "--d": "240ms" } as React.CSSProperties}>
            <p className="eyebrow mb-5 text-ember">Follow</p>
            <ul className="grid gap-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u inline-flex items-center gap-2 text-cream/85"
                  >
                    {s.label} <ArrowUpRight className="size-3.5 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </InView>

        <InView as="div" className="mt-20 lg:mt-28" threshold={0.3}>
          <div className="img-reveal">
            <Wordmark className="h-auto w-full text-cream" title="Summer Town" />
          </div>
        </InView>

        <div className="mt-10 flex flex-col gap-6 border-t border-cream/10 py-8 pb-28 text-sm text-cream/60 lg:flex-row lg:items-center lg:justify-between lg:pb-8">
          <p>© {site.name} · Panampilly Nagar, Kochi</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            <TransitionLink href="/" className="link-u">
              Home
            </TransitionLink>
            {nav.map((n) => (
              <TransitionLink key={n.href} href={n.href} className="link-u">
                {n.label}
              </TransitionLink>
            ))}
          </nav>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
