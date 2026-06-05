import type { Metadata } from "next";

import { geistMono, geistSans } from "@/common/fonts/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "X-Weevo | Магазин одягу",
  description: "Trendy, premium clothes online store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
