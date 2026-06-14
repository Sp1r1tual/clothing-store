import { X } from "lucide-react";

import styles from "./CloseButton.module.css";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export const CloseButton = ({ onClick, className = "" }: CloseButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.closeButton} ${className}`}
      aria-label="Close"
    >
      <X size={20} strokeWidth={1.5} />
    </button>
  );
};
