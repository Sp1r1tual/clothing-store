"use client";

import { GoogleAuthModal } from "./GoogleAuthModal";

import { useModalStore } from "@/store/useModalStore";

export const GlobalAuthModal = () => {
  const isAuthOpen = useModalStore((s) => s.isAuthOpen);
  const closeAuthModal = useModalStore((s) => s.closeAuthModal);

  return <GoogleAuthModal isOpen={isAuthOpen} onClose={closeAuthModal} />;
};
