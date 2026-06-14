import { Ref, SelectHTMLAttributes } from "react";

import styles from "./AdminSelect.module.css";

export interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  children: React.ReactNode;
  ref?: Ref<HTMLSelectElement>;
}

export const AdminSelect = ({
  error,
  label,
  id,
  className = "",
  children,
  ref,
  ...props
}: AdminSelectProps) => {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`${styles.select} ${error ? styles.selectError : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
