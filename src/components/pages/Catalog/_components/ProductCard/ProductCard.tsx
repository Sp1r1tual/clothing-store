import Image from "next/image";

import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/Badge/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay/PriceDisplay";

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
    variants: { size: string; stock: number }[];
    category: { slug: string };
  };
  locale: string;
}

export const ProductCard = ({ product, locale }: ProductCardProps) => {
  const name = locale === "en" ? product.nameEn : product.nameUk;
  const primaryImage = product.images[0]?.url || "/placeholder.jpg";
  const secondaryImage = product.images[1]?.url || primaryImage;

  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const isOutOfStock = totalStock === 0;

  let discountPercentage = 0;
  if (product.discountPrice && product.discountPrice < product.price) {
    discountPercentage = Math.round(
      ((product.price - product.discountPrice) / product.price) * 100,
    );
  }

  const availableSizes = product.variants.filter((v) => v.stock > 0).map((v) => v.size);

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
            className={`${styles.image} ${styles.primaryImage}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {product.images.length > 1 && (
            <Image
              src={secondaryImage}
              alt={product.images[1]?.altText || name}
              fill
              className={`${styles.image} ${styles.secondaryImage}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
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
