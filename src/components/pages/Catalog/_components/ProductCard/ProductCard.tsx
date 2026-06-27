import Image from "next/image";

import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/Badge/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay/PriceDisplay";

import { calculateDiscountPercentage } from "@/common/utils/product";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    nameUk: string;
    nameEn: string;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    images: { url: string; altText: string | null }[];
    variants: { size: string }[];
    category: { slug: string };
  };
  locale: string;
  priority?: boolean;
}

export const ProductCard = ({ product, locale, priority = false }: ProductCardProps) => {
  const name = locale === "en" ? product.nameEn : product.nameUk;
  const primaryImage = product.images[0]?.url || "/placeholder.jpg";
  const isOutOfStock = false;

  const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);

  const availableSizes = product.variants.map((v) => v.size);

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.badges}>
          {isOutOfStock && (
            <Badge
              variant="outOfStock"
              label={locale === "en" ? "Out of Stock" : "Немає в наявності"}
            />
          )}
          {!isOutOfStock && discountPercentage > 0 && (
            <Badge variant="sale" label={`-${discountPercentage}%`} />
          )}
          {!isOutOfStock && product.isFeatured && discountPercentage === 0 && (
            <Badge variant="featured" label={locale === "en" ? "Featured" : "Топ"} />
          )}
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={primaryImage}
            alt={product.images[0]?.altText || name}
            fill
            priority={priority}
            className={styles.image}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {!isOutOfStock && availableSizes.length > 0 && (
          <div className={styles.sizesOverlay}>
            {availableSizes.slice(0, 5).map((size) => (
              <span key={size} className={styles.sizeIndicator}>
                {size}
              </span>
            ))}
            {availableSizes.length > 5 && <span className={styles.sizeIndicator}>+</span>}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name} title={name}>
          {name}
        </h3>
        <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" />
      </div>
    </Link>
  );
};
