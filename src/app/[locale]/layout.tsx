import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { Modal } from "@/components/ui/Modal/Modal";

import { geistMono, geistSans } from "@/common/fonts/fonts";

import "@/app/globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Layout" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  const locales = ["uk", "en"];
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Modal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
