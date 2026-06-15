import styles from "./SlideDots.module.css";

interface SlideDotsProps {
  count: number;
  activeIndex: number;
  onDotClick?: (index: number) => void;
  size?: "s" | "m" | "l";
  variant?: "pill" | "overlay";
  className?: string;
}

export const SlideDots = ({
  count,
  activeIndex,
  onDotClick,
  size = "m",
  variant = "pill",
  className,
}: SlideDotsProps) => {
  if (count <= 1) return null;

  const sizeClass = styles[size];

  return (
    <div
      className={[styles.dots, styles[variant], sizeClass, className].filter(Boolean).join(" ")}
      aria-label="Slide indicators"
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
          onClick={() => onDotClick?.(index)}
          aria-label={`Slide ${index + 1}`}
          aria-current={index === activeIndex ? "true" : undefined}
        />
      ))}
    </div>
  );
};
