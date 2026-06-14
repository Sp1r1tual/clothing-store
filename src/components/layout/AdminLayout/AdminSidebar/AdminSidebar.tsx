"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { LayoutDashboard, LogOut, Package, Tag } from "lucide-react";

import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
  { href: "/admin/products", translationKey: "nav.products" as const, icon: Package },
  { href: "/admin/categories", translationKey: "nav.categories" as const, icon: Tag },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const t = useTranslations("Admin.layout");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <LayoutDashboard size={20} />
        <span>{t("title")}</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, translationKey, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`}
          >
            <Icon size={18} />
            {t(translationKey)}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <Link href="/" className={styles.backLink}>
          <LogOut size={16} />
          {t("backToSite")}
        </Link>
      </div>
    </aside>
  );
};
