import { getTranslations } from "next-intl/server";

import styles from "@/components/pages/Privacy/privacy.module.css";
import { BackButton } from "@/components/ui/BackButton/BackButton";
import { ScrollToTop } from "@/components/ui/ScrollToTop/ScrollToTop";

interface PrivacyRouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyRouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return {
    title: `${t("title")} | X-Weevo`,
    description: t("section1Content"),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: PrivacyRouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return (
    <>
      <div className={styles.container}>
        <BackButton scrollUp={true} />

        <h1 className={styles.title}>{t("title")}</h1>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("section1Title")}</h2>
            <p className={styles.sectionContent}>{t("section1Content")}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("section2Title")}</h2>
            <p className={styles.sectionContent}>{t("section2Content")}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("section3Title")}</h2>
            <p className={styles.sectionContent}>{t("section3Content")}</p>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </>
  );
}
