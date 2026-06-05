import { ReactNode } from "react";

import { MainLayout } from "@/components/layout/MainLayout/MainLayout";

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
