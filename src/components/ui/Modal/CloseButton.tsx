import { X } from "lucide-react";

import styles from "./CloseButton.module.css";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export const CloseButton = ({ onClick, className = "" }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.closeButton} ${className}`}
      aria-label="Close modal"
    >
      <X size={20} strokeWidth={1.5} />
    </button>
  );
};
