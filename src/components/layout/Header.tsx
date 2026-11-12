"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Emblem, Lockup } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Instagram, Phone, Pin } from "@/components/ui/Icons";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { fullAddress, nav, site } from "@/data/site";
import { lockScroll } from "@/lib/scroll";
import { cn, pad } from "@/lib/utils";

const mobileLinks = [{ label: "Home", href: "/" }, ...nav];

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 260);
        last = y;
      }
      const probe = 30;
      const sections = document.querySelectorAll<HTMLElement>("[data-nav]");
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.top <= probe && r.bottom > probe) {
          setTheme(el.dataset.nav === "light" ? "light" : "dark");
          break;
        }
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.setProperty("--header-offset", hidden && !open ? "0px" : "var(--header-h)");
  }, [hidden, open]);

  useLayoutEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = theme === "dark" || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[translate,color] duration-700 ease-[var(--ease-out-expo)]",
        hidden && !open && "-translate-y-full",
        dark ? "text-cream" : "text-ink",
      )}
    >
      <div className="hero-in relative z-10" style={{ "--d": "0.9s" } as CSSProperties}>
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 border-b backdrop-blur-xl transition-[opacity,background-color,border-color] duration-500",
            scrolled && !open ? "opacity-100" : "opacity-0",
            dark ? "border-cream/10 bg-forest/75" : "border-ink/10 bg-paper/80",
          )}
        />
        <div className="shell relative z-10 flex h-[var(--header-h)] items-center justify-between gap-6">
          <TransitionLink href="/" aria-label="Summer Town Resto Café — home" className="shrink-0">
            <Lockup />
          </TransitionLink>

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
            {nav.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={cn("eyebrow link-u py-2", pathname === item.href && "bg-[length:100%_1px]")}
              >
                {item.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              href="/#visit"
              size="sm"
              variant={dark ? "ghost-light" : "ghost-dark"}
              className="hidden sm:inline-flex"
            >
              Book a table
            </Button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid size-11 place-items-center rounded-full border border-current/25 lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-4.5 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  open ? "rotate-45" : "-translate-y-[3px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-4.5 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  open ? "-rotate-45" : "translate-y-[3px]",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu open={open} onNavigate={() => setOpen(false)} pathname={pathname} />
    </header>
  );
}

function MobileMenu({ open, onNavigate, pathname }: { open: boolean; onNavigate: () => void; pathname: string }) {
  return (
    <div
      id="mobile-menu"
      inert={!open}
      data-lenis-prevent
      className={cn(
        "fixed inset-0 z-0 flex flex-col overflow-y-auto bg-forest text-cream transition-[clip-path] duration-[900ms] ease-[var(--ease-in-out-quart)] lg:hidden",
        open
          ? "[clip-path:circle(150%_at_calc(100%-2.6rem)_2.25rem)]"
          : "[clip-path:circle(0%_at_calc(100%-2.6rem)_2.25rem)]",
      )}
    >
      <Emblem
        className="pointer-events-none absolute -right-24 bottom-10 h-[70svh] w-auto text-cream/[0.04]"
        leafClassName="text-cream/[0.04]"
      />
      <nav aria-label="Mobile" className="shell relative mt-[calc(var(--header-h)+2rem)] flex flex-col">
        {mobileLinks.map((item, i) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            onNavigate={onNavigate}
            className="group flex items-baseline gap-4 border-b border-cream/10 py-4"
          >
            <span className="eyebrow w-6 text-ember">{pad(i + 1)}</span>
            <span className="block overflow-hidden pb-1">
              <span
                className={cn(
                  "headline block text-[clamp(2.6rem,12vw,4rem)] transition-transform duration-1000 ease-[var(--ease-out-expo)]",
                  open ? "translate-y-0" : "translate-y-[110%]",
                  pathname === item.href && "italic text-ember",
                )}
                style={{ transitionDelay: open ? `${180 + i * 60}ms` : "0ms" }}
              >
                {item.label}
              </span>
            </span>
          </TransitionLink>
        ))}
      </nav>

      <div
        className={cn(
          "shell relative mt-auto grid gap-5 pb-10 pt-12 text-sm text-cream/75 transition-opacity duration-700",
          open ? "opacity-100 delay-500" : "opacity-0",
        )}
      >
        <OpenStatus className="justify-self-start" />
        <a href={site.phoneHref} className="flex items-center gap-3">
          <Phone className="size-4 text-ember" /> {site.phone}
        </a>
        <p className="flex items-start gap-3">
          <Pin className="mt-0.5 size-4 shrink-0 text-ember" /> {fullAddress}
        </p>
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
          <Instagram className="size-4 text-ember" /> {site.social.instagramHandle}
        </a>
      </div>
    </div>
  );
}
