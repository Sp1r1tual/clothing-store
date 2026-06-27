"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import styles from "./FaqAccordion.module.css";

interface FaqItem {
  title: string;
  content: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={styles.item}>
            <button
              className={styles.header}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <div className={styles.titleWrapper}>
                <h2 className={styles.title}>{item.title}</h2>
              </div>
              <ChevronDown
                className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
                size={24}
              />
            </button>
            <div className={`${styles.contentWrapper} ${isOpen ? styles.contentWrapperOpen : ""}`}>
              <div className={styles.contentInner}>
                <p className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`}>
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
