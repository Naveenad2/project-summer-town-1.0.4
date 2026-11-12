"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "@/components/providers/PageTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Internal link that plays the curtain transition before navigating. */
export function TransitionLink({ href, onNavigate, ...rest }: Props) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onNavigate={(e) => {
        onNavigate?.(e);
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
