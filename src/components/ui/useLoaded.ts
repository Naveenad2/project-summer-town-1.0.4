"use client";

import { useEffect, useState } from "react";

/** True once the preloader has handed over (`html[data-loaded]`). */
export function useLoaded() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute("data-loaded")) {
      setLoaded(true);
      return;
    }
    const mo = new MutationObserver(() => {
      if (root.hasAttribute("data-loaded")) {
        setLoaded(true);
        mo.disconnect();
      }
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-loaded"] });
    return () => mo.disconnect();
  }, []);

  return loaded;
}
