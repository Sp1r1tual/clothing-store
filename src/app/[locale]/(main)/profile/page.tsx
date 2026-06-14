import { ProfilePage } from "@/components/pages/Profile/ProfilePage";

import { requireAuth } from "@/common/auth/server";

interface ProfileRouteProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfileRoute({ params }: ProfileRouteProps) {
  const { locale } = await params;
  await requireAuth(locale);

  return <ProfilePage />;
}
