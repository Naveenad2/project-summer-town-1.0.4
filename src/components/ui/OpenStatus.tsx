"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Live open/closed indicator computed in Kochi time (IST). */
function getStatus() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const now = (h % 24) * 60 + m;
  const open = toMinutes(site.hours.opens);
  const close = toMinutes(site.hours.closes);
  const isOpen = now >= open && now < close;
  const closingSoon = isOpen && close - now <= 45;
  return { isOpen, closingSoon };
}

export function OpenStatus({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<ReturnType<typeof getStatus> | null>(null);

  useEffect(() => {
    const update = () => setStatus(getStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const text = !status
    ? `Open daily · ${site.hours.label}`
    : status.closingSoon
      ? `Closing soon · until ${site.hours.label.split("– ")[1]}`
      : status.isOpen
        ? `Open now · until ${site.hours.label.split("– ")[1]}`
        : `Closed now · opens at ${site.hours.label.split(" –")[0]}`;

  const dotColor = !status || status.isOpen ? (status?.closingSoon ? "bg-brass" : "bg-[#5fbf7f]") : "bg-terra";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-[0.7rem] tracking-[0.16em] uppercase",
        tone === "light" ? "border-cream/20 text-cream/85" : "border-ink/15 text-ink/75",
        className,
      )}
    >
      <span className={cn("pulse-dot size-1.5 rounded-full", dotColor)} />
      <span suppressHydrationWarning>{text}</span>
    </span>
  );
}
