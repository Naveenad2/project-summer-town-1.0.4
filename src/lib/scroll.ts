import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

type ScrollOptions = { offset?: number; immediate?: boolean };

export function scrollToTarget(
  target: number | string | HTMLElement,
  { offset = 0, immediate = false }: ScrollOptions = {},
) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;

  if (lenis) {
    lenis.scrollTo(el, { offset, immediate, force: true, duration: 1.4 });
    return;
  }
  const top = typeof el === "number" ? el : el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("scroll-locked", locked);
}
