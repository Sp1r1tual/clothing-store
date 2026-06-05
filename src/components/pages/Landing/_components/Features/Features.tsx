import { useTranslations } from "next-intl";

import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

import styles from "./Features.module.css";

interface FeaturesProps {
  variant?: "default" | "compact";
}

export const Features = ({ variant = "default" }: FeaturesProps) => {
  const t = useTranslations("Features");
  const isCompact = variant === "compact";

  const items = [
    {
      id: "delivery",
      icon: <Truck size={isCompact ? 24 : 36} strokeWidth={1.5} />,
      title: t("freeDeliveryTitle"),
      desc: t("freeDeliveryDesc"),
    },
    {
      id: "warranty",
      icon: <ShieldCheck size={isCompact ? 24 : 36} strokeWidth={1.5} />,
      title: t("qualityWarrantyTitle"),
      desc: t("qualityWarrantyDesc"),
    },
    {
      id: "returns",
      icon: <RefreshCw size={isCompact ? 22 : 32} strokeWidth={1.5} />,
      title: t("easyReturnTitle"),
      desc: t("easyReturnDesc"),
    },
  ];

  return (
    <section className={`${styles.featuresContainer} ${isCompact ? styles.compact : ""}`}>
      {items.map((item) => (
        <div key={item.id} className={styles.featureItem}>
          <div className={styles.iconWrapper}>{item.icon}</div>
          <div className={styles.textWrapper}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
