# SnapSort Design Explanation
## macOS-Native Light UI

---

## 🎯 Design Philosophy

**Core Principle:** "This could ship with macOS or Windows."

The UI is designed to feel like a native system utility—calm, trustworthy, and professional. Every design decision serves the goal of making users feel like SnapSort is a reliable desktop tool, not a flashy startup product.

---

## 📐 Layout Structure

### 1. **App Window Container**
- **Full-screen desktop app** (not maximized browser window)
- Clean white background (#FFFFFF) with subtle app background (#FAFAFA)
- No artificial window chrome (Tauri handles native OS window)

**Why this works:**
- Users expect desktop apps to feel "grounded" and stable
- White/light gray creates calm, professional atmosphere
- Matches macOS Finder, Files app, Linear, Notion

---

### 2. **Left Sidebar (224px fixed width)**

**Structure:**
```
┌─────────────────────┐
│  Categories Header  │  ← 13px font, semibold
├─────────────────────┤
│  • All Files    47  │  ← 13px font, icon + count
│  • Code         12  │
│  • Errors        3  │
│  • Chat          8  │
│  • UI            5  │
│  • Documents    15  │
│  • Other         4  │
├─────────────────────┤
│  🟢 100% Offline   │  ← Privacy badge
└─────────────────────┘
```

**Design Decisions:**

1. **Background: #F5F5F5** (soft gray)
   - Subtle contrast from main content (#FAFAFA)
   - Same tone as macOS Finder sidebar
   - Creates visual hierarchy without being distracting

2. **Active State: #E3F2FD** (soft blue wash)
   - Very subtle blue background (not bright selection)
   - Text changes to #0071E3 (Apple blue)
   - Feels native, not custom

3. **Icons: Lucide-React, 16px, strokeWidth: 2**
   - Simple line icons (not filled unless active)
   - Color-coded by category but muted
   - Professional, not playful

4. **Hover: #EBEBEB**
   - Barely noticeable gray
   - Smooth 150ms transition
   - No scale/bounce effects

5. **Count Badges**
   - Right-aligned, 11px font
   - Gray when inactive, blue when active
   - No background pill (too busy)

**Why this works:**
- Matches user mental model from Finder, Notion, Linear
- Clear visual hierarchy (category > count)
- Calm interactions (no flashiness)

---

### 3. **Top Bar (56px height)**

**Structure:**
```
┌────────────────────────────────────────────────────────┐
│  🔍 Search screenshots...    [Monitoring] ⚙️ Settings │
└────────────────────────────────────────────────────────┘
```

**Design Decisions:**

1. **Search Bar (max-width: 384px)**
   - Left-aligned (natural reading flow)
   - Background: #F5F5F5 (subtle, not white)
   - Border: #E5E5E5 (barely visible)
   - Focus: Blue ring (#0071E3) - macOS standard
   - Placeholder: #9B9B9B (soft gray, readable)

2. **Status Indicators**
   - Small badges with dot + text
   - Green dot = monitoring on
   - Gray dot = monitoring off
   - Amber background for "Test Mode"

3. **Settings Icon**
   - 32px button, subtle border
   - Hover changes background to #F5F5F5
   - No tooltips (icon is self-explanatory)

**Why this works:**
- Search is primary action (left-aligned, prominent)
- Status is visible but not intrusive (right side)
- Clean, uncluttered (no button explosion)

---

### 4. **Screenshot Cards**

**Structure:**
```
┌─────────────────────────┐
│                         │
│    [File Icon/Thumb]    │  ← Aspect ratio 16:9
│                         │
├─────────────────────────┤
│  filename.png           │  ← 13px, truncated
│  2h ago        [Code]   │  ← 11px, time + badge
└─────────────────────────┘
```

**Design Decisions:**

1. **Card Container**
   - Background: #FFFFFF (pure white)
   - Border: #E8E8E8 (soft gray)
   - Border radius: 8px (rounded-lg)
   - Shadow: `0 1px 3px rgba(0,0,0,0.08)` (barely visible)
   - Hover shadow: `0 2px 8px rgba(0,0,0,0.12)` (subtle lift)

2. **Thumbnail Area**
   - Aspect ratio: 16:9 (standard screenshot ratio)
   - Background: #FAFAFA (matches app bg)
   - Placeholder icon: Large file icon in #D0D0D0
   - Border bottom: #E8E8E8 (separates from content)

3. **Hover State**
   - Overlay: White 95% opacity
   - Shows file path in small text
   - Smooth 150ms fade-in
   - No scale/transform (stable feel)

4. **Category Badges**
   - Soft colored backgrounds (e.g., blue-50, red-50)
   - Colored text (e.g., blue-700, red-700)
   - Subtle border (e.g., blue-200, red-200)
   - 11px font, medium weight
   - Small tag icon

**Why this works:**
- White cards on light gray feel like macOS Finder icons
- Soft shadows create depth without drama
- Hover shows utility (file path) without being distracting
- Color-coded badges help scanning but aren't garish

---

### 5. **Empty State**

**Design Decisions:**

1. **Centered vertically/horizontally** in main content area
2. **Large icon** (80px) in soft gray circle
3. **Clear heading** (20px, semibold)
4. **Helpful instructions** in gray box
5. **Conditional messaging**:
   - If monitoring ON: "How it works" steps
   - If monitoring OFF: Prompt to enable

**Why this works:**
- Matches macOS empty state patterns (Finder, Photos)
- Educational without being condescending
- Calm, not anxious (no "Get started!" CTAs)

---

### 6. **Settings Modal**

**Structure:**
```
┌──────────────────────────────┐
│  Settings              [X]   │
├──────────────────────────────┤
│  [Icon] Monitoring     [ON]  │
│  [Icon] Test Mode      [OFF] │
│  [Icon] Undo Last Action     │
│  ─────────────────────────   │
│  Status:                     │
│  ✓ Backend Connected         │
│  ⚠ Ollama Offline            │
├──────────────────────────────┤
│  SnapSort v1.0.0 · Offline   │
└──────────────────────────────┘
```

**Design Decisions:**

1. **Modal backdrop: black 20% + blur**
   - Professional, not harsh
   - Blur creates depth

2. **Modal container**
   - White background
   - Rounded corners (12px)
   - Subtle shadow
   - Max-width: 448px

3. **Toggle switches**
   - 44px wide (iOS standard)
   - Blue when on, gray when off
   - Smooth 200ms transition
   - No custom styling (standard pattern)

4. **Section separators**
   - Border-top: #E5E5E5
   - 16px padding
   - Clear visual breaks

**Why this works:**
- Matches macOS System Preferences style
- Clear sections with visual hierarchy
- Toggle switches are familiar pattern
- Status transparency builds trust

---

## 🎨 Color Palette Rationale

### Background Layers
- **#FAFAFA** - App background (warm, not stark white)
- **#F5F5F5** - Sidebar (subtle contrast)
- **#FFFFFF** - Cards (clean, pure)

**Why:** Creates depth through subtle shades, not borders or shadows

### Text Hierarchy
- **#1F1F1F** - Primary text (near-black, readable)
- **#6B6B6B** - Secondary text (metadata, labels)
- **#9B9B9B** - Tertiary text (placeholders, hints)

**Why:** Clear hierarchy without needing font size changes

### Accent Blue
- **#0071E3** - Primary actions, links, selected state
- **#0077ED** - Hover state (slightly brighter)
- **#E3F2FD** - Selected background (very soft wash)

**Why:** Apple's blue - familiar, trustworthy, professional

### Category Colors
All use **50/200/700** pattern:
- Background: 50 (very soft)
- Border: 200 (subtle)
- Text: 700 (readable)

**Examples:**
- Code: blue-50 / blue-200 / blue-700
- Error: red-50 / red-200 / red-700
- Chat: green-50 / green-200 / green-700

**Why:** Consistent pattern, muted tones, high contrast text

---

## 📊 Typography System

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif
```

**Why:** Uses system fonts (native feel), falls back to Inter

### Size Scale
- **20px** (text-xl) - Page titles, empty state headings
- **15px** (text-[15px]) - Modal titles
- **14px** (text-sm) - Sidebar header
- **13px** (text-[13px]) - Body text, filenames, buttons
- **11px** (text-[11px]) - Metadata, timestamps, captions

**Why:** Matches macOS text sizing (13px is standard body)

### Weights
- **Semibold (600)** - Headings, labels
- **Medium (500)** - Category names, badges
- **Normal (400)** - Body text, filenames

**Why:** Clear hierarchy without excessive variation

---

## 🔄 Interaction Patterns

### Transitions
- **Duration: 150ms** - All hovers, state changes
- **Easing: ease-in-out** - Smooth, natural
- **Properties: all** - Background, border, shadow

**Why:** Fast enough to feel responsive, slow enough to be smooth

### Hover Effects
- **Sidebar items:** Background changes #EBEBEB
- **Cards:** Shadow increases, border darkens
- **Buttons:** Background changes #F5F5F5

**No:**
- ❌ Scale transforms (feels unstable)
- ❌ Bounce animations (feels playful)
- ❌ Color shifts (feels unpredictable)

**Why:** Calm, predictable, professional

### Focus States
- **Search input:** Blue ring (1px, #0071E3)
- **Buttons:** Blue ring (keyboard navigation)
- **Cards:** Blue border (keyboard selection)

**Why:** Accessibility + macOS patterns

---

## 🏗️ Component Architecture

### File Structure
```
frontend/src/components/redesign/
├── AppLayout.tsx          # Main container
├── Sidebar.tsx            # Left navigation
├── TopBar.tsx             # Search + status
├── ScreenshotGrid.tsx     # Main content area
├── ScreenshotCard.tsx     # Individual card
├── SettingsModal.tsx      # Settings panel
└── (future components)
```

### Component Responsibilities

**AppLayout.tsx**
- State management (useSnapSort hook)
- Category filtering
- Modal control
- Error handling
- Loading states

**Sidebar.tsx**
- Category list rendering
- Active state management
- Privacy badge
- Click handlers

**TopBar.tsx**
- Search input (placeholder for now)
- Status indicators
- Settings button
- Monitoring/dry-run badges

**ScreenshotGrid.tsx**
- Grid layout
- Empty state logic
- Screenshot count header
- Responsive columns

**ScreenshotCard.tsx**
- Individual card rendering
- Hover state management
- Time formatting
- Category badge styling

**SettingsModal.tsx**
- Toggle controls
- Undo action
- Connection status
- Modal backdrop/close

---

## 📱 Responsive Behavior

### Grid Columns
- **< 768px:** 1 column (mobile - future)
- **768px - 1024px:** 2 columns (tablet - future)
- **1024px - 1280px:** 3 columns (small desktop)
- **> 1280px:** 4 columns (large desktop)

**Why:** Tauri app is desktop-only, but maintain flexibility

### Sidebar
- **Always visible** on desktop (no collapse)
- 224px fixed width
- Scrollable if categories overflow

**Why:** Desktop apps have space for permanent sidebars

---

## 🎯 Design Decisions Summary

### ✅ What We Did
1. Light theme only (warm whites, soft grays)
2. macOS-native color palette (Apple blue, muted accents)
3. Subtle shadows and borders (depth without drama)
4. Clean typography (system fonts, 13px body)
5. Calm interactions (150ms transitions, no bounce)
6. Clear hierarchy (spacing, color, weight)
7. Trustworthy status indicators (dots, badges)
8. Educational empty states (helpful, not pushy)

### ❌ What We Avoided
1. Dark mode (not requested, adds complexity)
2. Neon colors (unprofessional)
3. Gradients (dated, distracting)
4. Glassmorphism (trendy, not timeless)
5. Animations (bounce, spring, parallax)
6. Custom UI patterns (reinventing the wheel)
7. Marketing language ("Get started!", "Unlock...")

---

## 🚀 Implementation Notes

### To Use This Design

1. **Import the new layout:**
```tsx
// In main.tsx or index.tsx
import AppRedesign from './AppRedesign';

// Replace App with AppRedesign
<AppRedesign />
```

2. **Ensure Tailwind config includes custom colors:**
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      // Custom grays (if needed)
    }
  }
}
```

3. **Update global CSS for font:**
```css
/* index.css */
body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Build and Test
```bash
cd frontend
npm run build
```

Then run Tauri:
```bash
npm run tauri:dev
```

---

## 📊 Comparison: Old vs New

### Old (Web Dashboard Style)
- ❌ Dark theme (cyber/startup vibe)
- ❌ Neon green (#10b981)
- ❌ Glassmorphism effects
- ❌ Floating cards with heavy shadows
- ❌ Web-first layout

### New (macOS Native Style)
- ✅ Light theme (professional/calm)
- ✅ Apple blue (#0071E3)
- ✅ Subtle borders and shadows
- ✅ Grounded layout
- ✅ Desktop-first design

---

## 🎨 Visual Inspiration

**Direct References:**
- macOS Finder (sidebar, cards, search)
- Linear (clean, professional, light theme)
- Notion (calm interactions, subtle colors)
- Raycast (focused, uncluttered)

**Color Palette Inspiration:**
- Apple Human Interface Guidelines (light mode)
- Tailwind default grays (neutral, balanced)

---

## ✅ Product Hunt Readiness

This design is **ready for public launch** because:

1. **Professional:** Looks like a real product, not a prototype
2. **Trustworthy:** Calm colors and stable interactions
3. **Native:** Could ship with macOS
4. **Accessible:** High contrast, clear hierarchy
5. **Scannable:** Clear visual patterns
6. **Screenshot-worthy:** Clean UI captures well

**Screenshot Ideas:**
1. Full app window (hero shot)
2. Empty state (onboarding)
3. Grid with 8-12 cards (showing organization)
4. Settings modal (showing controls)
5. Sidebar active state (showing categories)
6. Card hover state (showing file path)

---

## 🎯 Final Thoughts

This design prioritizes **trust over flash**. Users need to feel confident giving SnapSort access to their screenshots. A calm, professional UI signals reliability.

The design is intentionally **conservative**—no experimental patterns, no trendy effects. This makes it timeless and reduces the risk of feeling dated in 6 months.

Every element serves a purpose. Nothing is there for decoration.

**This could ship with macOS.** That's the standard.
