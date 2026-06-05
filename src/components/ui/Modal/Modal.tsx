"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import { Overlay } from "@/components/ui/Overlay/Overlay";

import { CloseButton } from "./CloseButton";

import { useModalStore } from "@/store/useModalStore";

import styles from "./Modal.module.css";

const emptySubscribe = () => () => {};

export const Modal = () => {
  const { isOpen, content, closeModal } = useModalStore();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalWrapper}>
          <Overlay onClick={closeModal} />

          <motion.div
            className={styles.modalContent}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className={styles.closeWrapper}>
              <CloseButton onClick={closeModal} />
            </div>
            <div className={styles.innerContent}>{content}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
