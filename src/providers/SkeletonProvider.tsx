"use client";

import { SkeletonTheme } from "react-loading-skeleton";

interface SkeletonProviderProps {
  children: React.ReactNode;
}

export const SkeletonProvider = ({ children }: SkeletonProviderProps) => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5" duration={1.4} enableAnimation>
      {children}
    </SkeletonTheme>
  );
};
