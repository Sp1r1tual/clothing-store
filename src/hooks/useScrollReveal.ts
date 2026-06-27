"use client";

import { useEffect, useRef, useState } from "react";

import { isMobileDevice } from "@/common/utils/device";

export const useScrollReveal = (customThreshold?: number) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  let threshold = customThreshold ?? 0.25;
  if (!customThreshold && typeof window !== "undefined" && isMobileDevice()) {
    threshold = 0.1;
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
