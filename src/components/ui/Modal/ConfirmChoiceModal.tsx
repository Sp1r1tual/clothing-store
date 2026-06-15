"use client";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";

import styles from "./ConfirmChoiceModal.module.css";

interface ConfirmChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isDanger?: boolean;
}

export const ConfirmChoiceModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isDanger = false,
}: ConfirmChoiceModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} className={styles.cancelBtn}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDanger ? styles.dangerBtn : styles.confirmBtn}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
