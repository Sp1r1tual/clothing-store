"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";

import { useModalStore } from "@/store/useModalStore";

import { CARRIER_LOGOS } from "@/common/constants/images/carrier-logos";

import styles from "./DeliveryPartners.module.css";

export const DeliveryPartners = () => {
  const t = useTranslations("DeliveryPartners");
  const openModal = useModalStore((state) => state.openModal);

  const partners = [
    {
      id: "novaposhta",
      name: t("novaPoshta"),
      color: "#e31e24",
      logo: CARRIER_LOGOS.NOVA_POSHTA,
      info: t("novaPoshtaInfo"),
    },
    {
      id: "ukrposhta",
      name: t("ukrposhta"),
      color: "#ffc107",
      logo: CARRIER_LOGOS.UKRPOSHTA,
      info: t("ukrposhtaInfo"),
    },
    {
      id: "meest",
      name: t("meest"),
      color: "#005b9f",
      logo: CARRIER_LOGOS.MEEST,
      info: t("meestInfo"),
    },
  ];

  return (
    <ScrollReveal id="delivery" className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.description}>{t("description")}</p>
      </div>

      <div className={styles.grid}>
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={styles.card}
            style={{ "--partner-accent": partner.color } as React.CSSProperties}
            onClick={() =>
              openModal(
                <div className={styles.modalInfoContainer}>
                  <div className={styles.modalLogoWrapper}>
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      sizes="80px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3 className={styles.modalTitle}>{partner.name}</h3>
                  <p className={styles.modalDesc}>{partner.info}</p>
                </div>,
              )
            }
          >
            <div className={styles.logoWrapper}>
              <div className={styles.imageContainer}>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="64px"
                  style={{ objectFit: "contain" }}
                  className={styles.logoImage}
                />
              </div>
            </div>
            <span className={styles.partnerName}>{partner.name}</span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
};
