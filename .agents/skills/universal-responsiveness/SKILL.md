---
name: universal-responsiveness
description: >-
  Build, audit, and refactor web user interfaces to be universally responsive across
  every real-world screen category (280px flip phone cover screens, compact smartphones,
  foldables in folded & unfolded states, tablets, laptops, standard desktops, and
  ultrawide 4K/5K monitors). Use whenever the user asks for multi-screen responsiveness,
  mobile/tablet layout fixes, foldable support, or zero-overflow guarantees.
---

# Universal Responsiveness Skill

A battle-tested engineering standard for implementing universal responsiveness across every real-world screen category without horizontal overflow, broken sticky elements, or cramped touch targets.

## 1. Trigger Conditions

Activate this skill when:
- The user requests multi-screen responsiveness, mobile-first optimization, or ultra-wide/4K adaptations.
- The UI experiences horizontal scrollbar blowout or element clipping on small screens (< 360px).
- Navigation menus, header bars, or metric rows collide or wrap awkwardly on tablet/foldable viewports (768px–1023px).
- Cards or touch controls feel cramped on narrow cover displays (280px–340px) or stretched on ultra-wide screens (2560px+).

---

## 2. Target Device Breakpoint Matrix

| Tier | Viewport Width | Screen Types & Devices | Core Rules & Behaviors |
| :--- | :--- | :--- | :--- |
| **Tier 0: Outer / Cover** | 280px – 340px | Galaxy Z Flip cover, Razr outer screen, smart bands | Single-column stack, compact icon logos, 12px–16px padding, wrapped action buttons, `overflow-x: clip`. |
| **Tier 1: Compact Phone** | 320px – 412px | iPhone SE, iPhone 12/13 Mini, older Androids | Fluid typography clamp, safe-area padding (`--sat`/`--sab`), `min-h-[44px]` touch targets. |
| **Tier 2: Standard Mobile** | 414px – 480px | iPhone 14/15/16 Pro Max, Galaxy S23/S24 Ultra | 1–2 column responsive grids, kinetic chip carousels with `.scrollbar-hide`. |
| **Tier 3: Folded Foldable** | ~717px | Galaxy Z Fold (folded), Pixel Fold (folded) | 2-column grids, calibrated drawer navigation (drawer active below 1024px). |
| **Tier 4: Tablets & Unfolded** | 768px – 1023px | iPad Mini/Air, Surface Pro, unfolded foldables | Clean overlay drawer; desktop horizontal menu withheld until 1024px to prevent collision. |
| **Tier 5: Laptops & Desktops** | 1024px – 1920px | MacBooks, 1080p desktop monitors | Full horizontal navigation pill, multi-column dashboard layouts, rich mockups. |
| **Tier 6: Ultrawide & 4K/5K** | 2560px – 3840px+ | 21:9 / 32:9 monitors, Studio Display, 4K TVs | Content ceiling (`3xl:max-w-[1600px]`), centered containers, balanced negative space. |

---

## 3. Step-by-Step Implementation Procedure

### Step 1: Configure Responsive Breakpoints (`tailwind.config.ts`)
Extend Tailwind with micro-breakpoints and ultra-wide breakpoints:
```typescript
theme: {
  screens: {
    "2xs": "320px",
    xs: "380px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
    "3xl": "1792px",
    "4xl": "2160px",
  },
}
```

### Step 2: Establish Root Guards & Safe-Area Insets (`globals.css`)
1. **Never use `overflow-x: hidden`** on root tags or main containers if descendant elements use `position: sticky`. Always use `overflow-x: clip`:
```css
:root {
  --sat: env(safe-area-inset-top, 0px);
  --sar: env(safe-area-inset-right, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
}

html {
  overflow-x: clip;
}

body {
  min-width: 280px;
  overflow-x: clip;
  padding-top: var(--sat);
  padding-bottom: var(--sab);
}
```

2. **Define Fluid Typography Clamp Utilities**:
```css
@layer utilities {
  .text-fluid-h1 {
    font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3.75rem);
    line-height: 1.08;
  }
  .text-fluid-h2 {
    font-size: clamp(1.35rem, 1rem + 1.6vw, 2.5rem);
    line-height: 1.15;
  }
  .text-fluid-body {
    font-size: clamp(0.875rem, 0.8rem + 0.35vw, 1.125rem);
    line-height: 1.6;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### Step 3: Full-Bleed Corner-to-Corner Header & Navigation Calibration
- **Corner-to-Corner Layout**: Anchor the navbar container across the entire viewport edge-to-edge (`fixed left-0 right-0 top-0 w-full border-b`). Avoid floating pill containers with outer margins or rounded edges on high-density displays.
- **Header Navigation Breakpoint**: A header containing a brand logo, 5–6 navigation links, and a CTA button will collide and wrap awkwardly between 768px and 1023px.
- **Rule**: Set the desktop horizontal link list to `hidden lg:flex`.
- Use the mobile/tablet sheet drawer for all screens `< lg:`.
- Provide a compact logo badge (monogram) for `< sm:` and full wordmark for `sm:+`.
- Ensure mobile drawer modal has `max-h-[calc(100vh-headerHeight)] overflow-y-auto` so short screens can scroll to every link.

### Step 4: Scale Card Padding and Touch Targets
- **Padding Scaler**: Replace rigid `p-6` or `p-8` with:
  ```html
  <div className="p-4 xs:p-6 sm:p-8">
  ```
- **Inputs & Buttons**: Guarantee touch target compliance:
  ```html
  <button className="min-h-[44px] px-4 py-2 text-sm font-semibold">
  ```

### Step 5: Clamp Ultrawide Viewports
Prevent layouts from stretching across 3840px monitors into thin ribbons:
```html
<div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
```

### Step 6: Kinetic Horizontal Filter Carousels
For filter tags, category chips, or tabs:
```html
<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
  {chips.map(chip => (
    <button className="shrink-0 rounded-full px-3 py-1.5 text-xs">...</button>
  ))}
</div>
```

---

## 4. Invariant Constraints

1. **No `overflow-x: hidden` with `position: sticky`**: `overflow: hidden` forces a new stacking/clipping context, breaking sticky headers, filter bars, and sidebars. Always use `overflow-x: clip`.
2. **Never hardcode pixel widths** on containers (e.g. `w-[450px]`). Use max-widths (`max-w-md w-full`) or percentage/fluid units.
3. **Never allow button/input heights below 44px** on interactive elements.
4. **Always preserve brand attribution** (e.g., Bezalel Technologies link in footer) according to project operating rules.
5. **No horizontal scrollbar at any width** between 280px and 3840px.

---

## 5. Failure Modes & Fixes

| Failure Symptom | Underlying Cause | Corrective Fix |
| :--- | :--- | :--- |
| Sticky header/filter bar stops sticking on scroll. | Ancestor container has `overflow: hidden` or `overflow-x: hidden`. | Change ancestor to `overflow-x: clip`. |
| Header nav buttons overlap logo on iPad or foldables. | Breakpoint set to `md:` (768px), which has insufficient room for 6 items. | Raise horizontal nav breakpoint to `lg:` (1024px). |
| Text on 280px flip cover screens overflows screen edge. | Long unspaced words or rigid `text-4xl` class. | Use `break-words` and fluid scale `text-2xl xs:text-3xl sm:text-5xl`. |
| Outer padding consumes 50% of the screen width on mobile. | Heavy fixed card padding like `p-8`. | Scale card padding to `p-4 xs:p-6 sm:p-8`. |
| Mobile drawer bottom buttons cut off on short landscape/cover screens. | Drawer lacks internal scrolling. | Add `overflow-y-auto max-h-[85vh]` to drawer content. |

---

## 6. Verification Checklist

- [ ] Viewport resized to 280px: Zero horizontal scrolling; logo compact; all text readable.
- [ ] Viewport resized to 375px: Primary buttons reachable and touchable (`min-h-[44px]`).
- [ ] Viewport resized to 768px (Tablet portrait / Folded): Navigation displays drawer trigger; no overlap.
- [ ] Viewport resized to 1024px (Tablet landscape): Clean horizontal navigation pill.
- [ ] Viewport resized to 2560px+ (Ultrawide): Content centered with `3xl:max-w-[1600px]` boundary.
- [ ] Sticky test: Sticky filter bar and header float properly while scrolling.
- [ ] Build test: `npm run build` completes with exit code 0.
