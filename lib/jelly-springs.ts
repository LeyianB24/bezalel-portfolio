/**
 * Jelly Physics Spring Presets
 * 
 * These presets define the physics for all jelly animations across the site.
 * Each preset creates a different "feel" — from soft and heavy to snappy and bouncy.
 */

export const jellyPresets = {
  /**
   * 🍮 SOFT JELLY — for large containers, hero sections, page transitions
   * Slow, heavy, satisfying wobble
   */
  soft: {
    type: "spring" as const,
    stiffness: 120,
    damping: 10,
    mass: 1.2,
  },

  /**
   * 🫧 BUBBLE — for cards, panels, modals
   * Medium bounce with gentle overshoot
   */
  bubble: {
    type: "spring" as const,
    stiffness: 200,
    damping: 14,
    mass: 0.9,
  },

  /**
   * 🏀 BOUNCY — for buttons, icons, badges
   * Snappy with clear overshoot — feels "tappy"
   */
  bouncy: {
    type: "spring" as const,
    stiffness: 350,
    damping: 12,
    mass: 0.7,
  },

  /**
   * ⚡ SNAP — for micro-interactions, toggles, checkboxes
   * Fast snap with tiny overshoot
   */
  snap: {
    type: "spring" as const,
    stiffness: 500,
    damping: 20,
    mass: 0.5,
  },

  /**
   * 🌊 WAVE — for stagger sequences, list items
   * Smooth ripple effect
   */
  wave: {
    type: "spring" as const,
    stiffness: 180,
    damping: 16,
    mass: 1.0,
  },

  /**
   * 🍬 TAFFY — for draggable elements, sliders
   * Stretchy, elastic, sticky feel
   */
  taffy: {
    type: "spring" as const,
    stiffness: 80,
    damping: 8,
    mass: 1.5,
  },
} as const;

export type JellyPreset = keyof typeof jellyPresets;

export interface JellyProps {
  preset?: JellyPreset;
  intensity?: number; // 0–1 multiplier
  disabled?: boolean; // respects prefers-reduced-motion
}

/**
 * Get jelly spring config with optional intensity multiplier
 */
export function getJellySpring(preset: JellyPreset, intensity: number = 1.0) {
  const spring = jellyPresets[preset];
  
  if (intensity === 1.0) return spring;
  
  // Scale stiffness and damping by intensity
  return {
    ...spring,
    stiffness: spring.stiffness * intensity,
    damping: spring.damping * intensity,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate transition based on reduced motion preference
 */
export function getJellyTransition(preset: JellyPreset, intensity: number = 1.0) {
  if (prefersReducedMotion()) {
    return { duration: 0.2, ease: "easeOut" };
  }
  return getJellySpring(preset, intensity);
}
