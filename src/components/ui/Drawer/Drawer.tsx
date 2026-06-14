"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Overlay } from "@/components/ui/Overlay/Overlay";

import styles from "./Drawer.module.css";

export interface DrawerLinkItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  isDanger?: boolean;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links?: DrawerLinkItem[];
  footerLinks?: DrawerLinkItem[];
  title?: string;
  titleIcon?: React.ElementType;
  direction?: "left" | "right";
  theme?: "light" | "dark";
  backgroundColor?: string;
  customButtons?: React.ReactNode;
  children?: React.ReactNode;
}

export const Drawer = ({
  isOpen,
  onClose,
  links = [],
  footerLinks = [],
  title,
  titleIcon: TitleIcon,
  direction = "right",
  theme = "light",
  backgroundColor,
  customButtons,
  children,
}: DrawerProps) => {
  const pathname = usePathname();
  const initialX = direction === "right" ? "100%" : "-100%";

  const renderLink = (link: DrawerLinkItem) => {
    const isActive = pathname === link.href;
    const Icon = link.icon;

    let linkClass = styles.drawerLink;
    if (isActive) linkClass += ` ${styles.drawerLinkActive}`;
    if (link.isDanger) linkClass += ` ${styles.drawerLinkDanger}`;

    return (
      <Link key={link.href} href={link.href} className={linkClass} onClick={onClose}>
        {Icon && <Icon size={18} />}
        {link.label}
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay onClick={onClose} />

          <motion.div
            className={`${styles.drawer} ${styles[theme]} ${styles[direction]}`}
            style={{ backgroundColor: backgroundColor || undefined }}
            initial={{ x: initialX }}
            animate={{ x: 0 }}
            exit={{ x: initialX }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitle}>
                {TitleIcon && <TitleIcon size={20} />}
                {title && <span>{title}</span>}
              </div>
              <button className={styles.drawerClose} onClick={onClose} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>

            <nav className={styles.drawerContent}>
              {links.map(renderLink)}
              {customButtons}
              {children}
            </nav>

            {footerLinks && footerLinks.length > 0 && (
              <div className={styles.drawerFooter}>{footerLinks.map(renderLink)}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
