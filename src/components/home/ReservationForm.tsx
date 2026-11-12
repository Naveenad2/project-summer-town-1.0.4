"use client";

import { useEffect, useState, type FormEvent } from "react";
import { WhatsApp } from "@/components/ui/Icons";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const times = Array.from({ length: 22 }, (_, i) => {
  const mins = 12 * 60 + i * 30;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const label = `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  return label;
});

const field =
  "peer w-full rounded-none border-0 border-b border-cream/25 bg-transparent px-0 pb-3 pt-6 text-base text-cream placeholder-transparent transition-colors focus:border-ember focus:outline-none focus:ring-0 [color-scheme:dark]";
const labelCls =
  "eyebrow pointer-events-none absolute left-0 top-0 text-[0.62rem] text-cream/55 transition-colors peer-focus:text-ember";

/** Builds a WhatsApp message from the booking details — no backend needed. */
export function ReservationForm() {
  const [minDate, setMinDate] = useState<string>();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    setMinDate(local.toISOString().slice(0, 10));
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const date = get("date")
      ? new Date(`${get("date")}T00:00:00`).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "";
    const lines = [
      `Hi ${site.shortName}! I'd like to book a table.`,
      `Name: ${get("name")}`,
      `Guests: ${get("guests")}`,
      `Date: ${date}`,
      `Time: ${get("time")}`,
      get("occasion") && `Occasion: ${get("occasion")}`,
      get("notes") && `Notes: ${get("notes")}`,
      `Phone: ${get("phone")}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2" aria-describedby="booking-note">
      <div className="relative">
        <input id="b-name" name="name" required autoComplete="name" placeholder="Name" className={field} />
        <label htmlFor="b-name" className={labelCls}>
          Your name
        </label>
      </div>
      <div className="relative">
        <input
          id="b-phone"
          name="phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          pattern="[0-9+ ]{10,15}"
          placeholder="Phone"
          className={field}
        />
        <label htmlFor="b-phone" className={labelCls}>
          Phone
        </label>
      </div>
      <div className="relative">
        <input id="b-date" name="date" type="date" required min={minDate} className={field} />
        <label htmlFor="b-date" className={labelCls}>
          Date
        </label>
      </div>
      <div className="relative">
        <select id="b-time" name="time" required defaultValue="8:00 PM" className={cn(field, "appearance-none")}>
          {times.map((t) => (
            <option key={t} value={t} className="bg-forest">
              {t}
            </option>
          ))}
        </select>
        <label htmlFor="b-time" className={labelCls}>
          Time
        </label>
        <span aria-hidden className="pointer-events-none absolute bottom-3.5 right-0 text-cream/50">
          ↓
        </span>
      </div>
      <div className="relative">
        <select id="b-guests" name="guests" defaultValue="2" className={cn(field, "appearance-none")}>
          {["1", "2", "3", "4", "5", "6", "7", "8+"].map((g) => (
            <option key={g} value={g} className="bg-forest">
              {g} {g === "1" ? "guest" : "guests"}
            </option>
          ))}
        </select>
        <label htmlFor="b-guests" className={labelCls}>
          Guests
        </label>
        <span aria-hidden className="pointer-events-none absolute bottom-3.5 right-0 text-cream/50">
          ↓
        </span>
      </div>
      <div className="relative">
        <select id="b-occasion" name="occasion" defaultValue="" className={cn(field, "appearance-none")}>
          {["", "Birthday", "Anniversary", "Date night", "Family get-together", "Business meal"].map((o) => (
            <option key={o} value={o} className="bg-forest">
              {o || "Just because"}
            </option>
          ))}
        </select>
        <label htmlFor="b-occasion" className={labelCls}>
          Occasion
        </label>
        <span aria-hidden className="pointer-events-none absolute bottom-3.5 right-0 text-cream/50">
          ↓
        </span>
      </div>
      <div className="relative sm:col-span-2">
        <textarea id="b-notes" name="notes" rows={2} placeholder="Notes" className={cn(field, "resize-none")} />
        <label htmlFor="b-notes" className={labelCls}>
          Anything we should know? (optional)
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-terra w-full sm:w-auto">
          <span className="btn-label">
            <span>Request on WhatsApp</span>
            <span aria-hidden>Request on WhatsApp</span>
          </span>
          <WhatsApp className="btn-icon size-5" />
        </button>
        <p id="booking-note" className="text-sm text-cream/55" aria-live="polite">
          {sent ? (
            <span className="text-cream/85">
              WhatsApp should be open — or call us on{" "}
              <a href={site.phoneHref} className="underline">
                {site.phone}
              </a>
              .
            </span>
          ) : (
            "We’ll confirm availability by reply."
          )}
        </p>
      </div>
    </form>
  );
}
