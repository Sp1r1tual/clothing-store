import { useTranslations } from "next-intl";

export const Landing = () => {
  const t = useTranslations("HomePage");
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
};
