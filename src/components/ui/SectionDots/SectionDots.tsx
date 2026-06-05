"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import styles from "./SectionDots.module.css";

const SECTIONS = [
  { id: "hero", key: "hero" },
  { id: "about", key: "about" },
  { id: "categories", key: "categories" },
  { id: "delivery", key: "delivery" },
  { id: "catalog-cta", key: "catalog-cta" },
];

export const SectionDots = () => {
  const t = useTranslations("SectionDots");
  const [activeId, setActiveId] = useState<string>("hero");
  const [hideDots, setHideDots] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        { threshold: 0.35 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setHideDots(scrollY + windowHeight >= documentHeight - 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observers.forEach((obs) => obs.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navbarHeight = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      className={`${styles.nav} ${hideDots ? styles.hidden : ""}`}
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, key }) => {
        const label = t(key);
        return (
          <button
            key={id}
            className={`${styles.dot} ${activeId === id ? styles.active : ""}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
          >
            <span className={styles.tooltip}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
