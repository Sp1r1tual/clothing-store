import { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconCircle?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconCircle = false,
  children,
  className,
  ...rest
}: ButtonProps) => {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {icon && (iconCircle ? <span className={styles.iconWrapper}>{icon}</span> : icon)}
      {children}
    </button>
  );
};
