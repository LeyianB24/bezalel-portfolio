# Device Viewport & Aspect Ratio Reference Matrix

This reference outlines testing dimensions and specific considerations for every tier of consumer and enterprise display.

## 1. Outer & Cover Displays (Flip Phones & Smart Wearables)
- **Samsung Galaxy Z Flip 5 / 6 Cover**: 720 × 748 (~300px - 340px logical CSS width)
- **Motorola Razr 40 Ultra Outer**: 1056 × 1066 (~360px logical CSS width)
- **Minimum Target**: 280px CSS viewport width
- **Requirements**:
  - `overflow-x: clip` on root HTML and body.
  - Zero multi-column layouts; pure single-column flow.
  - Card horizontal padding clamped to `12px` - `16px`.
  - Icon-only or compact monogram logo mark.

## 2. Compact & Older Phones
- **iPhone SE (2nd/3rd Gen)**: 375 × 667
- **iPhone 12 / 13 Mini**: 360 × 780
- **Small Androids (J2, A01, etc.)**: 320 × 533 / 360 × 640
- **Requirements**:
  - Safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
  - Minimum touch target: 44 × 44 pt / px.
  - Fluid clamp typography for headings so 2-line titles don't consume the entire fold.

## 3. Standard Modern Smartphones
- **iPhone 14 / 15 / 16 Pro**: 393 × 852 (Dynamic Island notch)
- **iPhone 14 / 15 / 16 Pro Max / Plus**: 430 × 932
- **Samsung Galaxy S24 Ultra**: 412 × 915
- **Google Pixel 8 / 9 Pro**: 412 × 923
- **Requirements**:
  - 1 or 2-column card layouts where appropriate.
  - Sticky bottom or top actions clear home gesture indicator.

## 4. Foldable Devices (Folded State)
- **Samsung Galaxy Z Fold 4 / 5 / 6 (Cover Screen)**: 2316 × 904 (aspect ratio 23.1:9, ~344px to 384px logical width)
- **Google Pixel Fold (Cover Screen)**: 1080 × 2092 (~411px logical width)
- **Requirements**:
  - Very tall, narrow aspect ratios. Ensure modal sheets and drawers have vertical scrollability (`max-h-[85vh] overflow-y-auto`).

## 5. Foldable Devices (Unfolded State)
- **Samsung Galaxy Z Fold 4 / 5 / 6 (Main Screen)**: 2176 × 1812 (~717px to 884px logical width, aspect ratio near 6:5)
- **Google Pixel Fold (Main Screen)**: 2208 × 1840 (~840px logical width)
- **OnePlus Open (Main Screen)**: 2440 × 2268 (~896px logical width)
- **Requirements**:
  - Square / boxy aspect ratios.
  - Ensure floating pills or menus do not collide with CTAs. Keep drawer navigation active below 1024px (`lg:`).

## 6. Tablets (Portrait & Landscape)
- **iPad Mini**: 768 × 1024
- **iPad Air / Pro 11"**: 820 × 1180 / 834 × 1194
- **iPad Pro 12.9"**: 1024 × 1366
- **Microsoft Surface Pro**: 912 × 1368
- **Requirements**:
  - Dual column layouts; table elements wrap or horizontally scroll cleanly.
  - Header navigation switches to horizontal layout only at `lg:` (1024px+).

## 7. Laptops & Desktop Workstations
- **13" - 16" Laptops (MacBook Air/Pro, ThinkPad)**: 1280 × 800 up to 1728 × 1117 (scaled)
- **Full HD Monitors**: 1920 × 1080
- **QHD Monitors**: 2560 × 1440
- **Requirements**:
  - Full desktop horizontal navigation with smooth hover micro-animations.
  - Multi-column grids (3 to 4 columns).

## 8. Ultrawide & High-Density Displays
- **Ultrawide Monitors (21:9)**: 3440 × 1440
- **Super Ultrawide Monitors (32:9)**: 5120 × 1440
- **4K / 5K Displays**: 3840 × 2160 / 5120 × 2880
- **Requirements**:
  - Hard max-width ceiling on main content container: `3xl:max-w-[1600px]` or `max-w-7xl`.
  - Negative horizontal space kept symmetrically centered with `mx-auto`.
