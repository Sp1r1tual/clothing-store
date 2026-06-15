import { getOrdersAction } from "@/actions/order.actions";

import { ProfilePage } from "@/components/pages/Profile/ProfilePage";

import { requireAuth } from "@/common/auth/server";

interface ProfileRouteProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfileRoute({ params }: ProfileRouteProps) {
  const { locale } = await params;
  await requireAuth(locale);

  const orders = await getOrdersAction().catch(() => []);

  return <ProfilePage orders={orders} />;
}
