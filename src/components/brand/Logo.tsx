import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  EMBLEM_FRAME,
  EMBLEM_LEAVES,
  EMBLEM_VIEWBOX,
  SUBLINE,
  SUBLINE_VIEWBOX,
  WORDMARK,
  WORDMARK_VIEWBOX,
} from "./paths";

type SvgProps = { className?: string; title?: string };

export function Emblem({ className, title, leafClassName }: SvgProps & { leafClassName?: string }) {
  return (
    <svg
      viewBox={EMBLEM_VIEWBOX}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path d={EMBLEM_FRAME} fillRule="evenodd" />
      <g className={leafClassName}>
        {EMBLEM_LEAVES.map((d, i) => (
          <path key={i} d={d} className="emblem-leaf" style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

export function Wordmark({ className, title }: SvgProps) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path d={WORDMARK} fillRule="evenodd" />
    </svg>
  );
}

export function Subline({ className }: SvgProps) {
  return (
    <svg viewBox={SUBLINE_VIEWBOX} className={className} fill="currentColor" aria-hidden focusable="false">
      <path d={SUBLINE} fillRule="evenodd" />
    </svg>
  );
}

/** Horizontal lockup used in the header and footer. */
export function Lockup({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Emblem className="h-9 w-auto shrink-0 lg:h-10" leafClassName="text-ember" />
      <span className={cn("flex-col items-center gap-[0.4rem]", compact ? "hidden sm:flex" : "flex")}>
        <Wordmark className="h-[0.8rem] w-auto lg:h-[0.9rem]" />
        <Subline className="h-[0.64rem] w-auto opacity-75 lg:h-[0.72rem]" />
      </span>
      <span className="sr-only">Summer Town Resto Café</span>
    </span>
  );
}
