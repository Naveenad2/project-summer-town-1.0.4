"use client";

import { Fragment, useRef } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Segment = string | { src: string; alt: string; shape: string };

const segments: Segment[] = [
  "Summer Town is a sunlit Victorian room",
  { src: "/images/venue/interior.jpg", alt: "Chandelier-lit dining room at Summer Town", shape: "shape-sun" },
  "on Panampilly Nagar’s 4th Cross Road — where continental classics",
  { src: "/images/menu/chicken-fettuccine.jpg", alt: "Creamy chicken fettuccine", shape: "shape-leaf" },
  "are cooked from honest ingredients, ribs and brisket",
  { src: "/images/menu/smoked-bbq-pork-ribs.jpg", alt: "Smoked BBQ pork ribs", shape: "shape-flower" },
  "take their time over the smoke, and desserts",
  { src: "/images/menu/butterscotch-cheesecake.jpg", alt: "Butterscotch cheesecake", shape: "shape-cookie" },
  "are always worth the detour.",
];

/** Manifesto paragraph: words brighten as you scroll, inline photos pop in. */
export function StoryText() {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, (ctx) => {
        const el = root.current!;
        const arm = () => {
          const items = gsap.utils.toArray<HTMLElement>(".story-w, .story-img", el);
          gsap.set(el.querySelectorAll(".story-w"), { opacity: 0.13 });
          gsap.set(el.querySelectorAll(".story-img"), { scale: 0, rotate: -8 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.5 },
          });
          items.forEach((item, i) => {
            if (item.classList.contains("story-img")) {
              tl.to(item, { scale: 1, rotate: 0, duration: 2, ease: "back.out(1.6)" }, i * 0.5);
            } else {
              tl.to(item, { opacity: 1, duration: 1, ease: "none" }, i * 0.5);
            }
          });
        };
        // Words stay fully readable until the paragraph is about to scroll in,
        // so the text is never dimmed for someone who lands on it directly.
        if (el.getBoundingClientRect().top < window.innerHeight + 250) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom+=250",
          once: true,
          onEnter: () => ctx.add(arm),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <p
      ref={root}
      className="headline mt-14 max-w-[1280px] text-[clamp(2.1rem,5.4vw,5.6rem)] leading-[1.02] text-ink sm:mt-20"
    >
      {segments.map((seg, i) =>
        typeof seg === "string" ? (
          <Fragment key={i}>
            {seg.split(" ").map((w, j) => (
              <Fragment key={j}>
                <span className="story-w">{w}</span>{" "}
              </Fragment>
            ))}
          </Fragment>
        ) : (
          <Fragment key={i}>
            <span
              className={`story-img relative mx-[0.08em] inline-block size-[1.08em] -translate-y-[0.08em] align-middle ${seg.shape}`}
            >
              <SmartImage src={seg.src} alt={seg.alt} fill sizes="200px" className="object-cover" />
            </span>{" "}
          </Fragment>
        ),
      )}
    </p>
  );
}
