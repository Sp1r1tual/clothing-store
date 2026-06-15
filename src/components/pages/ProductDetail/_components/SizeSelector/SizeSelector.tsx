"use client";

import styles from "./SizeSelector.module.css";

interface SizeSelectorProps {
  variants: { size: string; stock: number }[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export const SizeSelector = ({ variants, selectedSize, onSelect }: SizeSelectorProps) => {
  return (
    <div className={styles.container}>
      {variants.map((variant) => {
        const isOutOfStock = variant.stock === 0;
        const isSelected = selectedSize === variant.size;

        return (
          <button
            key={variant.size}
            className={`
              ${styles.sizeBtn} 
              ${isSelected ? styles.selected : ""} 
              ${isOutOfStock ? styles.outOfStock : ""}
            `}
            onClick={() => !isOutOfStock && onSelect(variant.size)}
            disabled={isOutOfStock}
            aria-pressed={isSelected}
            aria-disabled={isOutOfStock}
          >
            {variant.size}
            {isOutOfStock && (
              <svg className={styles.strike} viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};
