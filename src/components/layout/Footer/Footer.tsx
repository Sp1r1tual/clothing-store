import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { Logo } from "@/components/ui/Logo/Logo";

import { CATALOG_LINKS, CUSTOMER_LINKS } from "@/common/constants/navigation";

import styles from "./Footer.module.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const tFooter = useTranslations("Footer");
  const tNavbar = useTranslations("Navbar");

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.brandSection}>
          <Logo className={styles.logoSpacing} />
          <p className={styles.description}>{tFooter("description")}</p>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>{tFooter("catalog")}</h4>
            <ul className={styles.linksList}>
              {CATALOG_LINKS.map(({ href }) => {
                const key = href.replace("/", "");
                return (
                  <li key={href}>
                    <Link href={href} className={styles.link}>
                      {tNavbar(key)}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href="/sale" className={`${styles.link} ${styles.linkSale}`}>
                  {tNavbar("sale")}
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>{tFooter("customers")}</h4>
            <ul className={styles.linksList}>
              {CUSTOMER_LINKS.map(({ href }) => {
                const key = href.replace("/", "");
                return (
                  <li key={href}>
                    <Link href={href} className={styles.link}>
                      {tNavbar(key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>{tFooter("contacts")}</h4>
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
              <li className={styles.contactItem}>{tFooter("workTime")}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarContainer}>
          <p className={styles.copyright}>
            &copy; {currentYear} X-WEEVO. {tFooter("copyright")}
          </p>
          <a
            href="https://t.me/Sp1r1tual5"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.developerLink}
          >
            {tFooter("devLink")}
          </a>
        </div>
      </div>
    </footer>
  );
};
