"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./ImageGallery.module.css";

interface ImageGalleryProps {
  images: { url: string; altText: string | null }[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.mainImageWrapper}>
          <div className={styles.placeholder}>No image</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainImageWrapper}>
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].altText || "Product image"}
          fill
          priority
          className={styles.mainImage}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={index}
              className={`${styles.thumbnailWrapper} ${index === activeIndex ? styles.active : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.altText || `Thumbnail ${index + 1}`}
                fill
                className={styles.thumbnail}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
