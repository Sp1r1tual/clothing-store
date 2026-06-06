import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { AlertCircle } from "lucide-react";

import styles from "./page.module.css";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AuthCodeErrorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AuthCodeError" });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <AlertCircle size={36} />
        </div>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.description}>{t("description")}</p>

        <Link href="/" className={styles.button}>
          {t("button")}
        </Link>
      </div>
    </div>
  );
}
