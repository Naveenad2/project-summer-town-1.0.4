import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./Icons";
import { TransitionLink } from "./TransitionLink";

type Variant = "terra" | "ink" | "ghost-light" | "ghost-dark";

type Props = {
  href: string;
  children: string;
  variant?: Variant;
  size?: "md" | "sm";
  icon?: ReactNode | false;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

/** Pill button with a rolling label and a fill that rises on hover. */
export function Button({
  href,
  children,
  variant = "terra",
  size = "md",
  icon,
  external,
  className,
  ariaLabel,
}: Props) {
  const classes = cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);
  const inner = (
    <>
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      {icon !== false && <span className="btn-icon">{icon ?? <ArrowUpRight className="size-4" />}</span>}
    </>
  );

  const isExternal = external ?? /^(https?:|tel:|mailto:)/.test(href);
  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={classes} aria-label={ariaLabel}>
      {inner}
    </TransitionLink>
  );
}
