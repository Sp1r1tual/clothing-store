"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Overlay } from "@/components/ui/Overlay/Overlay";

import styles from "./MobileDrawer.module.css";

interface LinkItem {
  href: string;
  label: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
}

export const MobileDrawer = ({ isOpen, onClose, links }: MobileDrawerProps) => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay onClick={onClose} />

          <motion.div
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <button className={styles.drawerClose} onClick={onClose} aria-label="Close menu">
              <X size={22} />
            </button>

            <ul className={styles.drawerLinks}>
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${styles.link} ${isActive(href) ? styles.linkActive : ""}`}
                    onClick={onClose}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sale"
                  className={`${styles.link} ${styles.linkSale} ${isActive("/sale") ? styles.linkActive : ""}`}
                  onClick={onClose}
                >
                  Розпродаж
                </Link>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
