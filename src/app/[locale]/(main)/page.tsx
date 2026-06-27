import { getTranslations } from "next-intl/server";

import { Landing } from "@/components/pages/Landing/Landing";

interface LandingRouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LandingRouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Layout" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LandingPage() {
  return <Landing />;
}
