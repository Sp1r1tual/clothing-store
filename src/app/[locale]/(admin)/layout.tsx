import { ReactNode } from "react";

import { AdminLayout } from "@/components/layout/AdminLayout/AdminLayout";

import { requireAdmin } from "@/common/auth/server";

interface AdminRouteLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminRouteLayout({ children, params }: AdminRouteLayoutProps) {
  const { locale } = await params;

  await requireAdmin(locale);

  return <AdminLayout>{children}</AdminLayout>;
}
