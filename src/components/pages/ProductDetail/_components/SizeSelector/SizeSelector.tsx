"use client";

import styles from "./SizeSelector.module.css";

interface SizeSelectorProps {
  variants: { size: string }[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export const SizeSelector = ({ variants, selectedSize, onSelect }: SizeSelectorProps) => {
  return (
    <div className={styles.container}>
      {variants.map((variant) => {
        const isSelected = selectedSize === variant.size;

        return (
          <button
            key={variant.size}
            className={`
              ${styles.sizeBtn} 
              ${isSelected ? styles.selected : ""}
            `}
            onClick={() => onSelect(variant.size)}
            aria-pressed={isSelected}
          >
            {variant.size}
          </button>
        );
      })}
    </div>
  );
};
