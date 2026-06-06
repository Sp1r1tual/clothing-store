"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import whiteWallTexture from "@/assets/textures/white-wall.avif";

import { SLIDE_IMAGES } from "@/common/constants/hero";

import styles from "./Carousel.module.css";

export const HeroCarousel = () => {
  const [activeId, setActiveId] = useState(SLIDE_IMAGES[0].id);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveId((prevId) => {
          const idx = SLIDE_IMAGES.findIndex((s) => s.id === prevId);
          return SLIDE_IMAGES[(idx + 1) % SLIDE_IMAGES.length].id;
        });
      } else {
        setActiveId((prevId) => {
          const idx = SLIDE_IMAGES.findIndex((s) => s.id === prevId);
          return SLIDE_IMAGES[(idx - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length].id;
        });
      }
    }
    touchStartX.current = null;
  };

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
        {SLIDE_IMAGES.map((slide) => (
          <div
            key={slide.id}
            id={`hero-slide-${slide.id}`}
            className={`${styles.slide} ${slide.id === activeId ? styles.slideActive : ""}`}
          >
            <Image
              id={`hero-img-${slide.id}`}
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.modelImage}
              style={{ objectFit: "contain", objectPosition: "bottom center" }}
              priority={slide.id === SLIDE_IMAGES[0].id}
            />
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {SLIDE_IMAGES.map((slide, index) => (
          <button
            key={slide.id}
            id={`hero-dot-${slide.id}`}
            className={`${styles.dot} ${slide.id === activeId ? styles.dotActive : ""}`}
            onClick={() => setActiveId(slide.id)}
            aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
          />
        ))}
      </div>
    </div>
  );
};
