import { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "google" | "danger" | "success";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconCircle?: boolean;
  isSquare?: boolean;
  absolute?: boolean;
  children?: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconCircle = false,
  isSquare = false,
  absolute = false,
  children,
  className,
  ...rest
}: ButtonProps) => {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    isSquare ? styles.square : "",
    absolute ? styles.absolute : "",
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
