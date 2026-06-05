"use client";

import { useLayoutEffect } from "react";

export const useScrollUp = (active: boolean = false) => {
  useLayoutEffect(() => {
    if (active) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [active]);
};
