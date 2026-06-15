import styles from "./ProductGrid.module.css";

interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
}

export const ProductGrid = ({ children, className = "" }: ProductGridProps) => {
  return <div className={`${styles.grid} ${className}`}>{children}</div>;
};
