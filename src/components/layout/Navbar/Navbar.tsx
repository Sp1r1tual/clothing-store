"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { Heart, ShoppingBag, User } from "lucide-react";

import { Logo } from "@/components/ui/Logo/Logo";
import { GoogleAuthModal } from "@/components/ui/Modal/GoogleAuthModal";
import { SearchInput } from "@/components/ui/SearchInput/SearchInput";

import { MobileDrawer } from "./MobileDrawer";

import { useAuthStore } from "@/store/useAuthStore";

import { CATALOG_LINKS } from "@/common/constants/navigation";

import styles from "./Navbar.module.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const user = useAuthStore((s) => s.user);

  const close = () => setIsMenuOpen(false);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Logo />

          <ul className={styles.navLinks}>
            {CATALOG_LINKS.map(({ href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.link} ${isActive(href) ? styles.linkActive : ""}`}
                >
                  {t(href.replace("/", ""))}
                </Link>
              </li>
            ))}
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
            <Link
              href="/favorites"
              className={`${styles.actionLink} ${isActive("/favorites") ? styles.actionLinkActive : ""}`}
              aria-label={t("favorites")}
              onClick={(e) => isActive("/favorites") && e.preventDefault()}
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              className={`${styles.actionLink} ${isActive("/cart") ? styles.actionLinkActive : ""}`}
              aria-label={t("cart")}
              onClick={(e) => isActive("/cart") && e.preventDefault()}
            >
              <ShoppingBag size={20} />
            </Link>
            <Link
              href="/profile"
              className={`${styles.actionLink} ${user && isActive("/profile") ? styles.actionLinkActive : ""}`}
              aria-label={t("profile")}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setIsAuthModalOpen(true);
                } else if (isActive("/profile")) {
                  e.preventDefault();
                }
              }}
            >
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

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectPath="/profile"
      />
    </>
  );
};
