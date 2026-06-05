"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Heart, ShoppingBag, User } from "lucide-react";

import { Logo } from "@/components/ui/Logo/Logo";
import { SearchInput } from "@/components/ui/SearchInput/SearchInput";

import { MobileDrawer } from "./MobileDrawer";

import { CATALOG_LINKS } from "@/constants/navigation";

import styles from "./Navbar.module.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsMenuOpen(false);

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Logo />

        <ul className={styles.navLinks}>
          {CATALOG_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${isActive(href) ? styles.linkActive : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/sale"
              className={`${styles.link} ${styles.linkSale} ${isActive("/sale") ? styles.linkActive : ""}`}
            >
              Розпродаж
            </Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          <div className={styles.searchHide}>
            <SearchInput />
          </div>
          <button className={styles.actionButton} aria-label="Favorites">
            <Heart size={20} />
          </button>
          <Link href="/cart" className={styles.actionLink} aria-label="Cart">
            <ShoppingBag size={20} />
          </Link>
          <Link href="/profile" className={styles.actionLink} aria-label="Profile">
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
