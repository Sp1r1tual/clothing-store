"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { Heart, ShoppingBag, User } from "lucide-react";

import { Logo } from "@/components/ui/Logo/Logo";
import { SearchInput } from "@/components/ui/SearchInput/SearchInput";

import { CATALOG_LINKS } from "@/common/constants/navigation";

import { MobileDrawer } from "./MobileDrawer";

import styles from "./Navbar.module.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const close = () => setIsMenuOpen(false);

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Logo />

        <ul className={styles.navLinks}>
          {CATALOG_LINKS.map(({ href }) => {
            const key = href.replace("/", "");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.link} ${isActive(href) ? styles.linkActive : ""}`}
                >
                  {t(key)}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/sale"
              className={`${styles.link} ${styles.linkSale} ${isActive("/sale") ? styles.linkActive : ""}`}
            >
              {t("sale")}
            </Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          <div className={styles.searchHide}>
            <SearchInput />
          </div>
          <button className={styles.actionButton} aria-label={t("favorites")}>
            <Heart size={20} />
          </button>
          <Link href="/cart" className={styles.actionLink} aria-label={t("cart")}>
            <ShoppingBag size={20} />
          </Link>
          <Link href="/profile" className={styles.actionLink} aria-label={t("profile")}>
            <User size={20} />
          </Link>

          <button
            className={styles.hamburger}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </div>

      <MobileDrawer isOpen={isMenuOpen} onClose={close} links={CATALOG_LINKS} />
    </nav>
  );
};
