import { InputHTMLAttributes, Ref } from "react";

import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ error, label, className = "", ref, ...props }: InputProps) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={ref}
        className={`${styles.input} ${error ? styles.hasError : ""} ${className}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
