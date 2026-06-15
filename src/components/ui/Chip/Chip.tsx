"use client";

import styles from "./Chip.module.css";

interface ChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  count?: number;
  removable?: boolean;
  onRemove?: () => void;
  variant?: "default" | "outline" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export const Chip = ({
  label,
  isActive = false,
  onClick,
  count,
  removable = false,
  onRemove,
  variant = "default",
  size = "md",
  className = "",
}: ChipProps) => {
  const classes = [
    styles.chip,
    styles[variant],
    styles[size],
    isActive ? styles.active : "",
    onClick ? styles.clickable : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className={styles.label}>{label}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
      {removable && onRemove && (
        <button
          className={styles.removeBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
