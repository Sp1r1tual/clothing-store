import { getTranslations } from "next-intl/server";

import { getOrdersAction } from "@/actions/order.actions";

import { ProfilePage } from "@/components/pages/Profile/ProfilePage";

import { requireAuth } from "@/common/auth/server";

interface ProfileRouteProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProfileRouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Profile" });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function ProfileRoute({ params }: ProfileRouteProps) {
  const { locale } = await params;
  await requireAuth(locale);

  const orders = await getOrdersAction().catch(() => []);

  return <ProfilePage orders={orders} />;
}
