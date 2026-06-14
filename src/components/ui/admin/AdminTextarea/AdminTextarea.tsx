import { Ref, TextareaHTMLAttributes } from "react";

import styles from "./AdminTextarea.module.css";

export interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

export const AdminTextarea = ({
  error,
  label,
  id,
  className = "",
  ref,
  ...props
}: AdminTextareaProps) => {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`${styles.textarea} ${error ? styles.textareaError : ""} ${className}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
