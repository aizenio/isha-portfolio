"use client";

import { useEffect, useState } from "react";

/**
 * True only for devices with a precise pointer that also has hover. Anything
 * hover-dependent — the custom cursor, hover-reveal previews — is gated on this
 * rather than on viewport width, which lies about hybrid laptops and tablets.
 */
export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return fine;
}
