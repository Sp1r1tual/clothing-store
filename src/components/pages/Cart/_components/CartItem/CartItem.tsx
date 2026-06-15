"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { removeCartItemAction, updateCartItemAction } from "@/actions/cart.actions";
import { Link } from "@/i18n/navigation";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

import { PriceDisplay } from "@/components/ui/PriceDisplay/PriceDisplay";

import { useCartStore } from "@/store/useCartStore";
import type { CartItem as CartItemType } from "@/store/useCartStore";

import styles from "./CartItem.module.css";

interface CartItemProps {
  item: CartItemType;
  locale: string;
}

export const CartItem = ({ item, locale }: CartItemProps) => {
  const t = useTranslations("Cart");
  const { removeItem, updateQuantity } = useCartStore();
  const [isPendingRemove, startRemoveTransition] = useTransition();
  const [isPendingQty, startQtyTransition] = useTransition();
  const [localQty, setLocalQty] = useState(item.quantity);

  const name = locale === "en" ? item.product.nameEn : item.product.nameUk;
  const image = item.product.images[0]?.url || "/placeholder.jpg";
  const altText = item.product.images[0]?.altText || name;
  const unitPrice = item.product.discountPrice ?? item.product.price;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > 99) return;
    setLocalQty(newQty);

    updateQuantity(item.id, newQty);
    startQtyTransition(async () => {
      try {
        await updateCartItemAction(item.id, newQty);
      } catch {
        setLocalQty(item.quantity);
        updateQuantity(item.id, item.quantity);
        toast.error("Failed to update quantity");
      }
    });
  };

  const handleRemove = () => {
    removeItem(item.id);
    startRemoveTransition(async () => {
      try {
        await removeCartItemAction(item.id);
        toast.success(t("removeSuccess"));
      } catch {
        toast.error("Failed to remove item");
      }
    });
  };

  return (
    <div className={styles.item}>
      <Link href={`/product/${item.product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt={altText}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 80px, 100px"
          />
        </div>
      </Link>

      <div className={styles.details}>
        <div className={styles.header}>
          <Link href={`/product/${item.product.slug}`} className={styles.name}>
            {name}
          </Link>
          <button
            className={styles.removeBtn}
            onClick={handleRemove}
            disabled={isPendingRemove}
            aria-label={t("remove")}
          >
            {isPendingRemove ? (
              <Loader2 size={16} className={styles.spinner} />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>

        {(item.variant?.size || item.variant?.color) && (
          <div className={styles.meta}>
            {item.variant.size && (
              <span className={styles.metaChip}>
                {t("size")}: <strong>{item.variant.size}</strong>
              </span>
            )}
            {item.variant.color && (
              <span className={styles.metaChip}>
                {t("color")}: <strong>{item.variant.color}</strong>
              </span>
            )}
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.quantityStepper}>
            <button
              className={styles.stepperBtn}
              onClick={() => handleQuantityChange(localQty - 1)}
              disabled={localQty <= 1 || isPendingQty}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className={styles.qty}>{localQty}</span>
            <button
              className={styles.stepperBtn}
              onClick={() => handleQuantityChange(localQty + 1)}
              disabled={localQty >= 99 || isPendingQty}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className={styles.priceBlock}>
            <PriceDisplay
              price={item.product.price * localQty}
              discountPrice={item.product.discountPrice ? unitPrice * localQty : null}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
