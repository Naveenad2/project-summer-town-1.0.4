import { Fragment, type CSSProperties } from "react";

/** Wraps each word in a mask so `.sw` reveals can slide it up. */
export function Split({ text, start = 0, className }: { text: string; start?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="sw">
            <span className={className} style={{ "--i": start + i } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Per-letter masks for the hero headline. */
export function SplitChars({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <span aria-hidden>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="sc">
          <span style={{ "--i": start + i } as CSSProperties}>{ch}</span>
        </span>
      ))}
    </span>
  );
}
