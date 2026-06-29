"use client";

import { useEffect, useRef, useState } from "react";

export const useScrollDirection = () => {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 80) {
        setHidden(false);
      } else if (diff > 4) {
        setHidden(true);
      } else if (diff < -4) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hidden;
};
