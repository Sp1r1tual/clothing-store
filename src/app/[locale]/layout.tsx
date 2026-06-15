import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@/providers/AuthProvider";

import { Modal } from "@/components/ui/Modal/Modal";

import { getCurrentUser } from "@/common/auth/server";
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

  const [messages, initialUser] = await Promise.all([getMessages(), getCurrentUser()]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextTopLoader
          color="#f59e0b"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #f59e0b,0 0 5px #f59e0b"
        />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider initialUser={initialUser}>
            {children}
            <Modal />
          </AuthProvider>
          <ToastContainer position="top-center" autoClose={3000} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
