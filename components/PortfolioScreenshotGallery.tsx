"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { 
  ChevronLeft, ChevronRight, Maximize2, X, 
  Layers 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PortfolioScreenshotGalleryProps {
  images: string[];
  title: string;
  category?: string;
  className?: string;
}

export default function PortfolioScreenshotGallery({
  images = [],
  title,
  category,
  className = "",
}: PortfolioScreenshotGalleryProps) {
  // Ensure at least one image is available
  const validImages = images.filter(Boolean);
  const galleryImages = validImages.length > 0 ? validImages : ["/images/web_system.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = galleryImages.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, goToNext, goToPrev]);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* ─── 1. ACTIVE SHOWCASE SCREEN ────────────────────────────── */}
      <div className="relative group overflow-hidden rounded-xl border border-border bg-slate-950 aspect-[16/10] sm:aspect-[16/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={galleryImages[currentIndex]}
              alt={`${title} - Screenshot ${currentIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={currentIndex === 0}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Category Tag & Counter Badge (Google Play Style) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          {category ? (
            <span className="rounded-md bg-background/90 px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light backdrop-blur-md border border-border">
              {category}
            </span>
          ) : <span />}

          <div className="flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] sm:text-xs font-mono font-semibold text-white/90 border border-white/10">
            <Layers className="w-3 h-3 text-[#C9A24B]" />
            <span>{currentIndex + 1} / {total}</span>
          </div>
        </div>

        {/* Lightbox / Zoom CTA */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-3 right-3 z-10 p-2 rounded-lg bg-black/65 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-md border border-white/15 transition-all shadow-md flex items-center gap-1.5 text-xs font-medium"
          title="Open Google Play Fullscreen Gallery"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span className="hidden sm:inline text-[11px]">View All</span>
        </button>

        {/* Left & Right Chevrons (Only if multiple pictures) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous picture"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next picture"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* ─── 2. GOOGLE PLAY HORIZONTAL SCREENSHOT REEL / FILMSTRIP ── */}
      {total > 1 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Screenshots & Views ({total})
            </span>
            <span className="text-[10px]">Tap to preview</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-hide snap-x">
            {galleryImages.map((img, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 rounded-lg overflow-hidden snap-start transition-all duration-200 aspect-[16/10] w-20 sm:w-24 ${
                    isSelected
                      ? "ring-2 ring-[#C9A24B] shadow-md scale-100 opacity-100"
                      : "opacity-60 hover:opacity-90 hover:scale-[0.98] border border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${title} thumbnail ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#C9A24B]/10 pointer-events-none" />
                  )}
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/75 text-[9px] font-mono text-white font-bold">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 3. FULL-SCREEN LIGHTBOX MODAL (GOOGLE PLAY STYLE) ───── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md p-4 sm:p-6 select-none"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-white">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#C9A24B]/20 text-[#C9A24B] flex items-center justify-center font-bold text-xs">
                  {currentIndex + 1}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {title}
                  </h3>
                  <p className="text-xs text-white/60">
                    Screenshot {currentIndex + 1} of {total} • Use arrow keys to navigate
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central High-Res Showcase */}
            <div className="relative flex-1 w-full my-4 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full max-w-5xl max-h-[75vh]">
                <Image
                  src={galleryImages[currentIndex]}
                  alt={`${title} full screenshot ${currentIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Chevrons in modal */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrev}
                    className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Screenshot Strip */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 border-t border-white/10 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative shrink-0 rounded-lg overflow-hidden aspect-[16/10] w-16 sm:w-20 transition-all ${
                      idx === currentIndex
                        ? "ring-2 ring-[#C9A24B] scale-105 opacity-100"
                        : "opacity-50 hover:opacity-80 border border-white/10"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
