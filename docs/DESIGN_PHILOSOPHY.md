# VYBE Design Philosophy

**Version:** 1.0
**Last Updated:** 2025-12-11
**Owner:** Design & Product Team

---

## 🎯 Core Aesthetic: Apple-Inspired Minimalism

VYBE follows an **Apple ecosystem design philosophy** — content-first, elegant simplicity, and exceptional user experience through restraint and clarity.

### Design Principles

1. **Content is King** — Outfits, clothing items, and user creations are the heroes. UI exists to get out of the way.
2. **Negative Space** — Breathing room around every element. Whitespace is a design tool.
3. **Monochromatic + Focused** — Black, white, gray only. No competing colors. User's wardrobe is the only color.
4. **Typography-Driven** — Typography hierarchy and spacing do the heavy lifting. Minimal icons.
5. **Smooth, Intentional Motion** — Every animation serves a purpose. No decorative transitions.
6. **Showpiece Mentality** — Each outfit/item is presented like a display piece (clipboard aesthetic).

---

## 🎨 Visual Language

### Typography

- **Font Family:** San Francisco (Apple's system font)
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)
- **Hierarchy:**
  - Hero: 48-56px (large, breathing room)
  - Headlines: 24-32px
  - Subheadings: 16-18px
  - Body: 14-16px
  - Caption: 12-14px

### Color Palette

- **Primary Background:** Pure white `#FFFFFF`
- **Secondary Background:** Off-white/light gray `#F9F9F9` or `#FAFAFA`
- **Text Primary:** Deep black `#000000` or `#1A1A1A`
- **Text Secondary:** Medium gray `#666666`
- **Text Tertiary:** Light gray `#999999`
- **Borders:** `#E5E5E5` or `#EBEBEB`
- **Accent (Primary CTA):** Deep teal `#1B4D3E` (used sparingly for CTAs, hover states, active elements)

### Spacing System

- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px, 48px
- Elements have maximum breathing room

### Shadows & Depth

- **Minimal shadows** — Subtle elevation only when needed
- **Clipboard Effect:** Slight shadow (0 2px 8px rgba(0,0,0,0.08)) for card stacking
- No aggressive shadows; subtlety over drama

---

## 📱 Mobile Layout (Bottom Navigation)

### Navigation Structure

```
┌─────────────────────────────────┐
│                                 │
│     Content Area                │
│  (Outfit/Item Showcase)         │
│                                 │
│  ┌──────────────────────┐       │
│  │   Large Showpiece    │       │
│  │   (200-300px image)  │       │
│  │                      │       │
│  └──────────────────────┘       │
│                                 │
│  Title                          │
│  Metadata (2-3 lines)           │
│                                 │
├─────────────────────────────────┤
│  🗂️    ✨    💬    👤    ⚙️   │
│ Wardrobe Create Chat Profile Settings
└─────────────────────────────────┘
```

### Bottom Nav Items (Primary Navigation)

1. **Wardrobe** — Browse, organize, search all items
2. **Create** — Floating action button for outfit creation
3. **Chat** — Messages with stylists
4. **Profile** — User profile & requests history
5. **Settings** — Account, preferences, payment

### Mobile Interaction Patterns

- **Vertical scrolling:** Browse outfits/items as a vertical card deck
- **Card stacking:** Each card slightly overlaps next (clipboard effect)
- **Tap to expand:** Tap card to see full details, edit, or delete
- **Swipe actions:** Swipe left for quick actions (favorite, delete)
- **No hamburger menu** — Bottom nav is primary, always accessible

---

## 🖥️ Desktop Layout (Collapsible Sidebar)

### Layout Structure

```
┌──────────┬────────────────────────────────────┐
│ [≡]      │ VYBE                               │
├──────────┤────────────────────────────────────┤
│          │                                    │
│ Wardrobe │  ┌──────────────────────┐         │
│ Create   │  │  Large Outfit Card   │         │
│ Chat     │  │  (Showpiece)         │         │
│ Profile  │  │                      │         │
│ Settings │  └──────────────────────┘         │
│          │                                    │
│          │  ┌──────────────────────┐         │
│ [x]      │  │  Next Card (Stacked) │         │
│          │  │                      │         │
│          │  └──────────────────────┘         │
│          │                                    │
└──────────┴────────────────────────────────────┘
```

### Sidebar Behavior

- **Default:** Expanded (250-280px width)
- **Collapsed:** Icons only (60-80px width)
- **Toggle:** Hamburger menu (≡) in top-left
- **Responsive:** Auto-collapses on smaller desktops (< 1024px)
- **Hover states:** Text labels appear on collapsed state hover

### Desktop Interaction Patterns

- **Main content area:** Large, centered cards
- **Clipboard stacking:** Cards appear layered with subtle shadows
- **Hover actions:** Buttons/actions appear on card hover
- **Keyboard navigation:** Full keyboard support

---

## 📐 Component Design

### Card/Showpiece Layout

```
┌─────────────────────────────────┐
│                                 │
│   Image Container               │
│   (Flexible aspect ratio)        │
│   (No borders, full bleed)       │
│                                 │
├─────────────────────────────────┤
│                                 │
│ Title (Medium, 18px)            │
│                                 │
│ Metadata Row 1 (Caption, gray)  │
│ Metadata Row 2 (Optional)       │
│                                 │
│ [Action Buttons - Subtle]       │
│                                 │
└─────────────────────────────────┘
```

### Minimal Button States

- **Default:** Text only, no background
- **Hover:** Subtle background (light gray)
- **Active/Selected:** Darker text, no background change
- **Disabled:** Grayed out text

### Input Fields

- **No borders when idle** — Border appears on focus only
- **Underline style** — Clean, minimal look
- **Labels above fields** — Clear hierarchy
- **Placeholders:** Light gray, disappears on focus

---

## ✨ Animation & Motion

### Guiding Principles

- **Purpose-driven only** — Every animation tells a story
- **Subtle timing** — 200-300ms for most interactions
- **No decorative motion** — No bounces, no excessive easing

### Common Animations

- **Card entrance:** Fade in + slight slide up (200ms)
- **Navigation transitions:** Fade between screens (150ms)
- **Button interactions:** Subtle opacity change (100ms)
- **Sidebar toggle:** Slide in/out (300ms, ease-out)

---

## 🎬 First Screen Experience (Post-Login)

### Option: Outfit Showcase (Recommended)

**User sees:**

1. Large outfit card centered on screen
2. Outfit image (hero), title, metadata below
3. Subtle navigation to next outfit (swipe or button)
4. Bottom nav always visible
5. Feeling: "This is my beautiful wardrobe, let me explore"

### Flow

- Login → Redirect to Outfit Showcase
- Can browse through all saved outfits
- Tap to edit, delete, or share
- Create button always accessible

---

## 🔄 User Journey

### Mobile-First (Primary)

1. **Wardrobe Tab** → Browse all items/outfits
2. **Create Tab** → Build new outfit from items
3. **Chat Tab** → Message stylists
4. **Profile Tab** → View requests, bookings, ratings
5. **Settings Tab** → Account, payment, preferences

### Desktop-First

1. **Sidebar navigation** → Same structure as mobile
2. **Main canvas** → Large showpiece display
3. **Right sidebar (future):** Details, actions, recommendations

---

## 📋 Design Checklist

- [ ] Use San Francisco font exclusively
- [ ] Monochromatic color scheme (black/white/gray)
- [ ] Bottom nav on mobile, collapsible sidebar on desktop
- [ ] Minimal shadows (clipboard stacking effect)
- [ ] Large, centered imagery
- [ ] Typography-driven hierarchy
- [ ] No unnecessary icons
- [ ] Massive negative space
- [ ] Smooth 200-300ms transitions
- [ ] Touch targets 44x44px minimum (mobile)
- [ ] Content-first approach
- [ ] No stat cards or traditional dashboards

---

## 🚀 Implementation Notes

- **Font Loading:** Use system font stack: `-apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', sans-serif`
- **Tailwind Config:** Customize color palette to monochromatic scheme
- **Component Library:** Keep components minimal, composable
- **Responsive:** Mobile-first approach, scale up to desktop
- **Accessibility:** High contrast, large touch targets, keyboard navigation

---

**Next Steps:**

1. Design high-fidelity mockups for each major screen
2. Build component library based on this philosophy
3. Implement responsive layouts
4. Test with users for UX validation
