import { ShoppingCart } from "lucide-react";

import styles from "./AnimatedCartLoader.module.css";

interface AnimatedCartLoaderProps {
  text?: string;
  size?: number;
}

export const AnimatedCartLoader = ({ text, size = 64 }: AnimatedCartLoaderProps) => {
  return (
    <div className={styles.loaderOverlay}>
      <ShoppingCart size={size} className={styles.animatedCart} />
      {text && <h2>{text}</h2>}
    </div>
  );
};
