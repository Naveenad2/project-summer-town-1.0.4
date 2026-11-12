"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

type Props<T extends ElementType> = {
  as?: T;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
} & ComponentPropsWithoutRef<T>;

/**
 * Sets `data-in` on its element when it scrolls into view. All reveal
 * animations are plain CSS keyed off that attribute, so children can stay
 * server components.
 */
export function InView<T extends ElementType = "div">({
  as,
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
  ...rest
}: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.in = "";
          if (once) io.disconnect();
        } else if (!once) {
          delete el.dataset.in;
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  return <Tag ref={ref} {...rest} />;
}
