import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@/providers/AuthProvider";
import { SkeletonProvider } from "@/providers/SkeletonProvider";

import { GlobalAuthModal } from "@/components/ui/Modal/GlobalAuthModal";
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t("title"),
      template: `%s | X-Weevo`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: "X-Weevo",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        uk: `${baseUrl}/uk`,
        en: `${baseUrl}/en`,
      },
    },
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
          <SkeletonProvider>
            <AuthProvider initialUser={initialUser}>
              {children}
              <Modal />
              <GlobalAuthModal />
            </AuthProvider>
            <ToastContainer position="top-center" autoClose={3000} />
          </SkeletonProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
