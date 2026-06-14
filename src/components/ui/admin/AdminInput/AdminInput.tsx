import { InputHTMLAttributes, Ref } from "react";

import styles from "./AdminInput.module.css";

export interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  ref?: Ref<HTMLInputElement>;
}

export const AdminInput = ({
  error,
  label,
  id,
  className = "",
  ref,
  ...props
}: AdminInputProps) => {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
