"use client";

import { motion } from "framer-motion";

import { BackButton } from "@/components/ui/BackButton/BackButton";
import { ScrollToTop } from "@/components/ui/ScrollToTop/ScrollToTop";

import { FaqAccordion } from "../FaqAccordion/FaqAccordion";

import styles from "../../faq.module.css";

interface FaqItem {
  title: string;
  content: string;
}

interface FaqPageClientProps {
  title: string;
  description: string;
  items: FaqItem[];
}

export const FaqPageClient = ({ title, description, items }: FaqPageClientProps) => {
  return (
    <>
      <div className={styles.container}>
        <BackButton scrollUp={true} />

        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {description}
          </motion.p>
        </motion.header>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FaqAccordion items={items} />
        </motion.div>
      </div>

      <ScrollToTop />
    </>
  );
};
