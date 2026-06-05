import Link from "next/link";

import { Logo } from "@/components/ui/Logo/Logo";

import { CATALOG_LINKS, CUSTOMER_LINKS } from "@/constants/navigation";

import styles from "./Footer.module.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.brandSection}>
          <Logo className={styles.logoSpacing} />
          <p className={styles.description}>
            Стильний та преміальний одяг для вашого неповторного образу. Тільки найкращі бренди та
            актуальні новинки.
          </p>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Каталог</h4>
            <ul className={styles.linksList}>
              {CATALOG_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sale" className={`${styles.link} ${styles.linkSale}`}>
                  Розпродаж
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Клієнтам</h4>
            <ul className={styles.linksList}>
              {CUSTOMER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Контакти</h4>
            <ul className={styles.linksList}>
              <li className={styles.contactItem}>
                Email:{" "}
                <a href="mailto:x.weevo@gmail.com" className={styles.contactLink}>
                  x.weevo@gmail.com
                </a>
              </li>
              <li className={styles.contactItem}>
                Тел:{" "}
                <a href="tel:+380931878784" className={styles.contactLink}>
                  +38 (093) 187-87-84
                </a>
              </li>
              <li className={styles.contactItem}>Пн-Нд: 09:00 - 20:00</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarContainer}>
          <p className={styles.copyright}>&copy; {currentYear} X-WEEVO. Всі права захищено.</p>
          <a
            href="https://t.me/Sp1r1tual5"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.developerLink}
          >
            Замовити розробку сайту
          </a>
        </div>
      </div>
    </footer>
  );
};
