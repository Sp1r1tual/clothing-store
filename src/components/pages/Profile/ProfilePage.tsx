"use client";

import type { OrderData } from "@/db/order";

import { BackButton } from "@/components/ui/BackButton/BackButton";
import { ProfilePageSkeleton } from "@/components/ui/ProfilePageSkeleton/ProfilePageSkeleton";

import { OrdersList } from "./_components/OrdersList/OrdersList";
import { ProfileHeader } from "./_components/ProfileHeader/ProfileHeader";

import { useAuthStore } from "@/store/useAuthStore";

import styles from "./profile.module.css";

interface ProfilePageProps {
  orders: OrderData[];
}

export const ProfilePage = ({ orders }: ProfilePageProps) => {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <>
      <div className={styles.container}>
        <BackButton scrollUp={true} />
        <ProfileHeader />
        <OrdersList orders={orders} />
      </div>
    </>
  );
};
