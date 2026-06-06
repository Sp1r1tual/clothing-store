"use client";

import { useRouter } from "@/i18n/navigation";

import { BackButton } from "@/components/ui/BackButton/BackButton";

import { OrdersList } from "./_components/OrdersList/OrdersList";
import { ProfileHeader } from "./_components/ProfileHeader/ProfileHeader";

import { useAuthStore } from "@/store/useAuthStore";

import styles from "./profile.module.css";

const mockOrders = [
  { id: "ORD-9842", date: "02.06.2026", total: "2,499 ₴", status: "delivered" },
  { id: "ORD-9711", date: "15.05.2026", total: "1,850 ₴", status: "delivered" },
];

export const ProfilePage = () => {
  const router = useRouter();
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <BackButton scrollUp={true} />
        <ProfileHeader onLoggedOut={() => router.push("/")} />
        <OrdersList orders={mockOrders} />
      </div>
    </>
  );
};
