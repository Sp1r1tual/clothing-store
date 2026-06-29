"use client";

import { useEffect, useState } from "react";

import whiteWallTexture from "@/assets/textures/white-wall.webp";
import { Link } from "@/i18n/navigation";

import { useSwipe } from "@/hooks/useSwipe";

import { SkeletonImage } from "@/components/ui/SkeletonImage/SkeletonImage";
import { SlideDots } from "@/components/ui/SlideDots/SlideDots";

import { SLIDE_IMAGES } from "@/common/constants/hero";

import styles from "./Carousel.module.css";

export const HeroCarousel = () => {
  const [activeId, setActiveId] = useState(SLIDE_IMAGES[0].id);

  const activeIndex = SLIDE_IMAGES.findIndex((s) => s.id === activeId);

  const goNext = () => setActiveId(SLIDE_IMAGES[(activeIndex + 1) % SLIDE_IMAGES.length].id);

  const goPrev = () =>
    setActiveId(SLIDE_IMAGES[(activeIndex - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length].id);

  const { handleTouchStart, handleTouchEnd } = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveId((prevId) => {
        const idx = SLIDE_IMAGES.findIndex((s) => s.id === prevId);
        return SLIDE_IMAGES[(idx + 1) % SLIDE_IMAGES.length].id;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [activeId]);

  return (
    <div
      className={styles.imageSection}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <svg
        className={styles.diamondBg}
        viewBox="-20 -20 240 260"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="concrete-wall" width="1" height="1" patternContentUnits="objectBoundingBox">
            <image
              href={whiteWallTexture.src}
              preserveAspectRatio="xMidYMid slice"
              width="1"
              height="1"
            />
          </pattern>
          <filter id="edge-blur" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="atop" />
          </filter>
        </defs>

        <g filter="url(#edge-blur)">
          <polygon
            points="48,8 90,0 130,2 200,105 185,165 158,215 60,215 8,108 12,55"
            fill="url(#concrete-wall)"
          />

          <polygon
            points="48,8 90,0 130,2 200,105 185,165 158,215 60,215 8,108 12,55"
            fill="white"
            opacity="0.35"
          />
        </g>

        <polygon
          points="48,8 90,0 130,2 200,105 185,165 158,215 60,215 8,108 12,55"
          className={styles.outlineShape}
        />
      </svg>

      <div className={styles.carouselWrapper}>
        {SLIDE_IMAGES.map((slide) => {
          const isActive = slide.id === activeId;
          return (
            <Link
              href="/new-arrivals"
              key={slide.id}
              id={`hero-slide-${slide.id}`}
              className={`${styles.slide} ${styles.modelImage}`}
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 5 : 1,
                display: "block",
                cursor: isActive ? "pointer" : "default",
              }}
              aria-label={slide.alt}
              tabIndex={isActive ? 0 : -1}
            >
              <SkeletonImage
                src={slide.src}
                alt={slide.alt}
                fill
                preload={isActive}
                style={{ objectFit: "contain", objectPosition: "bottom center" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Link>
          );
        })}
      </div>

      <div className={styles.dots}>
        <SlideDots
          count={SLIDE_IMAGES.length}
          activeIndex={activeIndex}
          onDotClick={(i) => setActiveId(SLIDE_IMAGES[i].id)}
          variant="pill"
        />
      </div>
    </div>
  );
};
