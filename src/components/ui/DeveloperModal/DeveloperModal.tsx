"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

import { ExternalLink } from "lucide-react";

import { Modal } from "@/components/ui/Modal/Modal";

import { CONTACTS } from "@/common/constants/contacts";

import styles from "./DeveloperModal.module.css";

export const DeveloperModal = ({ triggerText }: { triggerText: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Footer.developerModal");

  return (
    <>
      <button className={styles.triggerButton} onClick={() => setIsOpen(true)}>
        {triggerText}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.avatarWrapper}>
              <span className={styles.avatarLetter}>A</span>
            </div>
            <div>
              <h2 className={styles.name}>Andrii Zub</h2>
              <p className={styles.role}>{t("role")}</p>
            </div>
          </div>

          <p className={styles.description}>{t("description")}</p>

          <div className={styles.contacts}>
            <a
              href={CONTACTS.DEVELOPER.TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.contactIcon} data-brand="telegram">
                <Image
                  src="/icons/telegram_icon.webp"
                  alt="Telegram"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>{t("telegram")}</span>
                <span className={styles.contactValue}>{CONTACTS.DEVELOPER.TELEGRAM_HANDLE}</span>
              </div>
              <ExternalLink size={16} className={styles.externalIcon} />
            </a>

            <a href={`mailto:${CONTACTS.DEVELOPER.EMAIL}`} className={styles.contactCard}>
              <div className={styles.contactIcon} data-brand="email">
                <Image
                  src="/icons/gmail_icon.webp"
                  alt="Email"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>{t("email")}</span>
                <span className={styles.contactValue}>{CONTACTS.DEVELOPER.EMAIL}</span>
              </div>
              <ExternalLink size={16} className={styles.externalIcon} />
            </a>

            <a
              href={CONTACTS.DEVELOPER.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.contactIcon} data-brand="linkedin">
                <Image
                  src="/icons/linkedIn_icon.webp"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>{t("linkedin")}</span>
                <span className={styles.contactValue}>{CONTACTS.DEVELOPER.LINKEDIN_HANDLE}</span>
              </div>
              <ExternalLink size={16} className={styles.externalIcon} />
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};
