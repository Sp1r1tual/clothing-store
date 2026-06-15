import styles from "./Badge.module.css";

type BadgeVariant = "sale" | "new" | "featured" | "outOfStock" | "default";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export const Badge = ({ label, variant = "default", size = "sm", className = "" }: BadgeProps) => {
  const classes = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{label}</span>;
};
