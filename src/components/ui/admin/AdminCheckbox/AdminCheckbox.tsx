import { InputHTMLAttributes, Ref } from "react";

import styles from "./AdminCheckbox.module.css";

export interface AdminCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: Ref<HTMLInputElement>;
}

export const AdminCheckbox = ({ label, id, className = "", ref, ...props }: AdminCheckboxProps) => {
  return (
    <label className={`${styles.checkboxLabel} ${className}`} htmlFor={id}>
      <input ref={ref} id={id} type="checkbox" className={styles.checkbox} {...props} />
      <span>{label}</span>
    </label>
  );
};
