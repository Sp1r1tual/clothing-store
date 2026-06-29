"use client";

import Image, { ImageProps } from "next/image";
import { useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./SkeletonImage.module.css";

interface SkeletonImageProps extends Omit<ImageProps, "ref" | "priority"> {
  wrapperClassName?: string;
  skeletonHeight?: string | number;
  isLoading?: boolean;
  preload?: boolean;
}

export const SkeletonImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  skeletonHeight = "100%",
  isLoading = false,
  preload,
  ...rest
}: SkeletonImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setIsLoaded(false);
    setHasError(false);
    setIsCached(false);
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;

    if (img.naturalWidth > 0 && img.complete) {
      setIsCached(true);
    }
    setIsLoaded(true);
    rest.onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoaded(true);
    rest.onError?.(e);
  };

  const imageClass = [
    styles.image,
    className ?? "",
    isLoaded && !isLoading
      ? isCached
        ? styles.imageVisibleCached
        : styles.imageVisible
      : styles.imageHidden,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${styles.wrapper} ${wrapperClassName ?? ""}`}>
      {(isLoading || !isLoaded) && !hasError && (
        <div className={styles.skeletonWrapper}>
          <Skeleton height={skeletonHeight} className={styles.skeleton} />
        </div>
      )}

      {hasError ? (
        <div className={styles.errorPlaceholder}>
          <span>No image</span>
        </div>
      ) : (
        <Image
          {...rest}
          ref={imgRef}
          src={src}
          alt={alt}
          preload={preload}
          className={imageClass}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};
