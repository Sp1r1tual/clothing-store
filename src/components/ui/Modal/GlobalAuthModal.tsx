"use client";

import { AuthModal } from "./AuthModal";

import { useModalStore } from "@/store/useModalStore";

export const GlobalAuthModal = () => {
  const isAuthOpen = useModalStore((s) => s.isAuthOpen);
  const closeAuthModal = useModalStore((s) => s.closeAuthModal);

  return <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} />;
};
