"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

import { addToCartAction } from "@/actions/cart.actions";
import { toggleFavoriteAction } from "@/actions/favorites.actions";
import { Heart, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";

import { SizeSelector } from "../SizeSelector/SizeSelector";

import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useModalStore } from "@/store/useModalStore";

import styles from "./ProductActions.module.css";

interface ProductActionsProps {
  product: {
    id: string;
    slug: string;
    nameUk: string;
    nameEn: string;
    price: number;
    discountPrice: number | null;
    images: { url: string; altText: string | null }[];
    variants: { id: string; size: string }[];
  };
  discountPercentage: number;
}

export const ProductActions = ({ product, discountPercentage }: ProductActionsProps) => {
  const t = useTranslations("ProductDetail");
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants[0]?.size || null,
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const openAuthModal = useModalStore((s) => s.openAuthModal);
  const user = useAuthStore((s) => s.user);
  const { addItem, updateItemId } = useCartStore();
  const { ids: favoriteIds, toggle: toggleFavoriteStore } = useFavoritesStore();
  const isFavorited = favoriteIds.includes(product.id);

  const isOutOfStock = false;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.warning(t("select-size"));
      return;
    }
    if (!user) {
      toast.info(t("login-required"));
      openAuthModal();
      return;
    }

    setIsAddingToCart(true);
    const variant = product.variants.find((v) => v.size === selectedSize);
    const tempCartItemId = `temp-${Date.now()}`;

    addItem({
      id: tempCartItemId,
      productId: product.id,
      variantId: variant?.id || null,
      quantity: 1,
      product: {
        id: product.id,
        nameUk: product.nameUk,
        nameEn: product.nameEn,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
      },
      variant: variant
        ? {
            id: variant.id,
            size: variant.size,
            colorUk: null,
            colorEn: null,
          }
        : null,
    });

    try {
      const dbItem = await addToCartAction(product.id, variant?.id || null, 1);
      updateItemId(tempCartItemId, dbItem.id);
      toast.success(t("added-to-cart"));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setIsTogglingFavorite(true);
    toggleFavoriteStore(product.id);

    try {
      const { isFavorited: nowFavorited } = await toggleFavoriteAction(product.id);
      if (nowFavorited) {
        toast.success(t("added-to-favorites"));
      } else {
        toast.info(t("removed-from-favorites"));
      }
    } catch {
      toggleFavoriteStore(product.id);
      toast.error("Failed to update favorites");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <>
      <div className={styles.badges}>
        {!isOutOfStock && discountPercentage > 0 && (
          <Badge variant="sale" label={`-${discountPercentage}%`} />
        )}
        {isOutOfStock && <Badge variant="outOfStock" label={t("out-of-stock")} />}
      </div>

      <div className={styles.sizeSelector}>
        <SizeSelector
          variants={product.variants}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />
      </div>

      <div className={styles.actions}>
        <Button
          fullWidth
          size="lg"
          disabled={isOutOfStock || isAddingToCart}
          icon={<ShoppingBag size={20} />}
          onClick={handleAddToCart}
        >
          {t("add-to-cart")}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          disabled={isTogglingFavorite}
          icon={
            <Heart
              size={20}
              fill={isFavorited ? "#ef4444" : "none"}
              color={isFavorited ? "#ef4444" : "currentColor"}
            />
          }
          onClick={handleToggleFavorite}
        >
          {isFavorited ? t("in-favorites") : t("add-to-favorites")}
        </Button>
      </div>
    </>
  );
};
