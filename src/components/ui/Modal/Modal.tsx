"use client";

import { ReactNode, useCallback, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import { Overlay } from "@/components/ui/Overlay/Overlay";

import { CloseButton } from "./CloseButton";

import { useModalStore } from "@/store/useModalStore";

import styles from "./Modal.module.css";

const emptySubscribe = () => () => {};

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

export const Modal = ({ isOpen: isOpenProp, onClose: onCloseProp, children }: ModalProps = {}) => {
  const { isOpen: isOpenStore, content, closeModal: closeStore } = useModalStore();

  const controlled = isOpenProp !== undefined;
  const isOpen = controlled ? isOpenProp : isOpenStore;
  const closeModal = useCallback(
    () => (controlled ? onCloseProp?.() : closeStore()),
    [controlled, onCloseProp, closeStore],
  );
  const modalContent = controlled ? children : content;

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
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
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

            <div className={styles.innerContent}>{modalContent}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,

    document.body,
  );
};
