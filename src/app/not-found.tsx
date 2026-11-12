import type { Metadata } from "next";
import { Emblem } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      data-nav="dark"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-clip bg-forest px-[var(--gutter)] py-32 text-center text-cream"
    >
      <div className="hero-glow" aria-hidden />
      <Emblem className="h-24 w-auto text-cream/80" leafClassName="text-ember" />
      <p className="eyebrow mt-10 text-ember">Error 404</p>
      <h1 className="headline mt-5 text-[clamp(3rem,9vw,7rem)]">
        This table <em className="text-ember">doesn’t exist</em>
      </h1>
      <p className="t-lead mt-6 max-w-md text-cream/70">
        The page you’re looking for has moved or never made it onto the menu.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="terra">
          Back home
        </Button>
        <Button href="/menu" variant="ghost-light">
          See the menu
        </Button>
      </div>
    </section>
  );
}
