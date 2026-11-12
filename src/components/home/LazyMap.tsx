"use client";

import { useEffect, useRef, useState } from "react";
import { Pin } from "@/components/ui/Icons";
import { site } from "@/data/site";

/**
 * Google Maps pulls in ~500 KB of scripts, so the iframe is only mounted once the
 * stamp is close to the viewport. Until then a lightweight street-grid sketch shows.
 */
export function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {show ? (
        <iframe
          title="Map showing Summer Town Resto Café in Panampilly Nagar, Kochi"
          src={site.maps.embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 grayscale-[0.85] contrast-[1.05] invert-[0.88] hue-rotate-[160deg]"
        />
      ) : (
        <a
          href={site.maps.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 grid place-items-center bg-pine bg-[linear-gradient(rgb(243_235_221/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(243_235_221/0.07)_1px,transparent_1px)] bg-[size:28px_28px] text-cream"
        >
          <span className="flex flex-col items-center gap-3">
            <Pin className="size-8 text-ember" />
            <span className="eyebrow">Open in Google Maps</span>
          </span>
        </a>
      )}
    </div>
  );
}
