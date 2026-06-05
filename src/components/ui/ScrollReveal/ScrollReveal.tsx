"use client";

import React from "react";

import { useScrollReveal } from "@/hooks/useScrollReveal";

import styles from "./ScrollReveal.module.css";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  as?: React.ElementType;
  id?: string;
}

export const ScrollReveal = ({
  children,
  className = "",
  threshold = 0.25,
  as: Component = "section",
  id,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal(threshold);

  return (
    <Component
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`${styles.container} ${isVisible ? styles.visible : ""} ${className}`}
    >
      {children}
    </Component>
  );
};
