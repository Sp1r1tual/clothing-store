"use client";

import { useEffect, useState } from "react";

import { ArrowDown } from "lucide-react";

import styles from "./ScrollTo.module.css";

export const ScrollTo = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
      <ArrowDown className={styles.icon} size={28} strokeWidth={2} />
    </div>
  );
};
