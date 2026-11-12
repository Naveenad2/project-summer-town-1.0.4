"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, use, useCallback, useEffect, useRef, type ReactNode } from "react";
import { Emblem } from "@/components/brand/Logo";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => use(TransitionContext);

const offsetFor = (el: HTMLElement | null) => (el ? -(parseFloat(getComputedStyle(el).scrollMarginTop) || 24) : 0);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const phase = useRef<"idle" | "covering" | "covered">("idle");
  const pendingHash = useRef<string | null>(null);
  const failsafe = useRef<number>(0);

  const reveal = useCallback(() => {
    const el = curtain.current;
    window.clearTimeout(failsafe.current);
    lockScroll(false);
    if (!el) return;
    gsap.to(el, {
      yPercent: -100,
      y: 0,
      duration: 0.95,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(el, { yPercent: 100, y: 0 });
        el.classList.remove("is-active");
        phase.current = "idle";
      },
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        const target = url.hash ? document.querySelector<HTMLElement>(url.hash) : null;
        if (target) {
          scrollToTarget(target, { offset: offsetFor(target) });
          window.history.replaceState(null, "", url.hash);
        } else {
          scrollToTarget(0);
        }
        return;
      }
      if (prefersReducedMotion() || phase.current !== "idle") {
        router.push(href);
        return;
      }
      const el = curtain.current!;
      phase.current = "covering";
      pendingHash.current = url.hash || null;
      el.classList.add("is-active");
      lockScroll(true);
      gsap.fromTo(
        el,
        { yPercent: 100, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 0.75,
          ease: "expo.inOut",
          onComplete: () => {
            phase.current = "covered";
            router.push(href, { scroll: false });
            failsafe.current = window.setTimeout(reveal, 4000);
          },
        },
      );
    },
    [router, reveal],
  );

  useEffect(() => {
    if (phase.current !== "covered") return;
    const raf = requestAnimationFrame(() => {
      const hash = pendingHash.current;
      pendingHash.current = null;
      lockScroll(false);
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      scrollToTarget(target ?? 0, { immediate: true, offset: offsetFor(target) });
      ScrollTrigger.refresh();
      reveal();
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, reveal]);

  return (
    <TransitionContext value={{ navigate }}>
      {children}
      <div ref={curtain} className="curtain" aria-hidden>
        <Emblem className="h-16 w-auto text-cream" leafClassName="text-ember" />
      </div>
    </TransitionContext>
  );
}
