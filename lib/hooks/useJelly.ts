/**
 * Jelly Animation Hooks
 * 
 * Custom React hooks for managing jelly physics animations
 */

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getJellyTransition, type JellyPreset } from "../jelly-springs";

/**
 * Hook to check if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false // Server-side default
  );
}

/**
 * Hook to get jelly animation config with reduced motion support
 */
export function useJellyAnimation(preset: JellyPreset = "bubble", intensity: number = 1.0) {
  const prefersReduced = useReducedMotion();
  
  if (prefersReduced) {
    return { duration: 0.2, ease: "easeOut" as const };
  }
  
  return getJellyTransition(preset, intensity);
}

/**
 * Hook to detect if device is mobile/touch
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to get jelly intensity based on device
 * Mobile devices get 50% intensity for performance
 */
export function useJellyIntensity(): number {
  const isMobile = useIsMobile();
  return isMobile ? 0.5 : 1.0;
}

/**
 * Hook to add jelly-click class on touch
 */
export function useJellyTouch(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = () => {
      element.classList.add('jelly-click');
      setTimeout(() => {
        element.classList.remove('jelly-click');
      }, 400);
    };

    element.addEventListener('touchstart', handleTouchStart);
    return () => element.removeEventListener('touchstart', handleTouchStart);
  }, [ref]);
}
