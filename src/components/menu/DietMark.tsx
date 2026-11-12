import { dietLabel, type Diet } from "@/data/menu-labels";
import { cn } from "@/lib/utils";

const colors: Record<Diet, string> = { veg: "#2f8a4c", nonveg: "#9a3b1b", egg: "#c98a16" };

/** FSSAI-style food marker: dot for veg/egg, triangle for non-veg. */
export function DietMark({ diet, className }: { diet: Diet; className?: string }) {
  const color = colors[diet];
  return (
    <span
      title={dietLabel[diet]}
      className={cn(
        "inline-grid size-4 shrink-0 place-items-center rounded-[3px] border-[1.5px] bg-white/70",
        className,
      )}
      style={{ borderColor: color }}
    >
      {diet === "nonveg" ? (
        <svg viewBox="0 0 10 10" className="size-2" aria-hidden>
          <path d="M5 1.2 9.2 8.8H.8Z" fill={color} />
        </svg>
      ) : (
        <span className="size-2 rounded-full" style={{ background: color }} aria-hidden />
      )}
      <span className="sr-only">{dietLabel[diet]}</span>
    </span>
  );
}
