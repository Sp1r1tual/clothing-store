"use client";

import { motion } from "framer-motion";

import styles from "./Overlay.module.css";

interface OverlayProps {
  onClick?: () => void;
  className?: string;
}

export const Overlay = ({ onClick, className }: OverlayProps) => {
  return (
    <motion.div
      className={`${styles.overlay} ${className || ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    />
  );
};
