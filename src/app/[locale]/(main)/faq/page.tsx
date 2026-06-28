import { getTranslations } from "next-intl/server";

import { BackButton } from "@/components/ui/BackButton/BackButton";
import { ScrollToTop } from "@/components/ui/ScrollToTop/ScrollToTop";

import { FaqAccordion } from "./_components/FaqAccordion/FaqAccordion";

import styles from "./faq.module.css";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

interface RouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return {
    title: `${t("title")} | X-Weevo`,
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function FAQPage({ params }: RouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });

  return (
    <>
      <div className={styles.container}>
        <BackButton scrollUp={true} />
        <header className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.description}>{t("metaDescription")}</p>
        </header>
        <div className={styles.content}>
          <FaqAccordion
            items={[
              { title: t("section1Title"), content: t("section1Content") },
              { title: t("section2Title"), content: t("section2Content") },
              { title: t("section3Title"), content: t("section3Content") },
            ]}
          />
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
