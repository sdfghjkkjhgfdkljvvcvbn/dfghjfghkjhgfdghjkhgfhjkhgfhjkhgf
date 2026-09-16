# Parbati Interior Admin Panel - Visual Design Guide

## Design Transformation

### Before (Generic SaaS)
- Bright red buttons everywhere
- Heavy typography
- Generic Tailwind colors (gray-900, gray-600, etc.)
- Oversized rounded corners
- Bright status badges (green pill)
- Red pill active states in sidebar
- Cold, corporate feeling

### After (Premium Interior Studio)
- Understated burgundy accents (`#8F2F2F`)
- Light, refined typography
- Warm, curated color palette
- Moderate border radius (10px, 8px)
- Subtle status indicators
- Thin left border for active navigation
- Warm, welcoming, professional feeling

---

## Color System

### Brand Palette

```
Primary Background:     #F7F6F2  [Warm Off-White]
Card Background:        #FFFFFF  [Pure White]
Sidebar:               #15181C  [Deep Charcoal]
Brand Accent:          #8F2F2F  [Burgundy]
Primary Text:          #202124  [Dark Gray]
Secondary Text:        #77736D  [Muted Brown-Gray]
Border:                #E5E1DA  [Subtle Taupe]
Hover Background:      #EFEFEA  [Light Off-White]
```

### Status Colors (Always Restrained)

```
New:        Blue (#3B82F6)    - Fresh, attention
Contacted:  Amber (#D97706)   - In progress
Booked:     Emerald (#059669) - Success
Closed:     Muted Gray        - Inactive
```

---

## Component Styling

### Buttons

**Primary Button**
```
Background:  #8F2F2F
Hover:       #7a2828
Active:      #6b2323
Text:        White
Padding:     px-4 py-2 (medium)
Border:      None
Radius:      8px
Font:        Medium weight
Shadow:      sm → md on hover
```

**Secondary Button**
```
Background:  #F7F6F2
Border:      1px #E5E1DA
Text:        #202124
Hover:       #EFEFEA background
Active:      #E8E5DE background
Padding:     px-4 py-2 (medium)
Radius:      8px
Font:        Medium weight
```

### Inputs

```
Border:      1px #E5E1DA
Focus:       #8F2F2F border + ring-1 ring-#8F2F2F/20
Background:  White
Padding:     px-3 py-2
Radius:      8px
Text:        #202124
Placeholder: #77736D
```

### Cards

```
Background:  White
Border:      1px #E5E1DA
Radius:      10px
Shadow:      sm (default) → md (hover)
Padding:     px-6 py-4 (body)
```

### Sidebar

```
Background:  #15181C
Text:        White (#FFFFFF)
Item Padding: py-2.5 px-4
Item Hover:  bg-white/5 + text-white
Item Active: Left border (2px #8F2F2F) + bg-white/5 + text-white
Icon Size:   w-4 h-4
```

### Typography

**Page Headings**
```
Font:        24px (text-2xl)
Weight:      Light (300)
Color:       #202124
Tracking:    -0.5px (tight-tight)
```

**Card Titles**
```
Font:        16px (text-base)
Weight:      Medium (500)
Color:       #202124
```

**Service Numbers / Labels**
```
Font:        12px (text-xs)
Weight:      Light (300)
Color:       #77736D
Tracking:    2px (uppercase)
```

**Body Text**
```
Font:        14px (text-sm)
Weight:      Regular (400)
Color:       #77736D
Line Height: 1.6
```

---

## Page Layouts

### Services Page

**Header Section**
```
┌─────────────────────────────────────────────────┐
│ Services                                  [+ New] │
│ Manage the services displayed on your website.   │
└─────────────────────────────────────────────────┘
```

**Service Card Grid (2 columns, gap-6)**
```
┌─────────────────┐  ┌─────────────────┐
│   Image (h-40)  │  │   Image (h-40)  │
├─────────────────┤  ├─────────────────┤
│ 01              │  │ 02              │
│ Interior Design │  │ Space Planning  │
│ Thoughtful...   │  │ Smart layouts...│
├─────────────────┤  ├─────────────────┤
│ ● Active  [✎][🗑] │ ● Active  [✎][🗑] │
└─────────────────┘  └─────────────────┘
```

### Dashboard Page

**Metric Cards (4 columns on desktop)**
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ [🔔]             │  │ [👔]             │  │ [🎨]             │  │ [📄]             │
│ TOTAL RECEIVED   │  │ PUBLISHED        │  │ AVAILABLE        │  │ PUBLISHED        │
│ 12               │  │ 5                │  │ 8                │  │ 3                │
│ Enquiries        │  │ Projects         │  │ Services         │  │ Blog Posts       │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Enquiries Page

**Search & Filters**
```
┌────────────────────────────────────────┐
│ 🔍 Search by name, phone, email...     │
├────────────────────────────────────────┤
│ [All (25)] [New (3)] [Contacted (8)]   │
│ [Booked (10)] [Closed (4)]             │
├────────────────────────────────────────┤
│ [Newest First] [Oldest First]          │
└────────────────────────────────────────┘
```

**Enquiry List Item**
```
┌─────────────────────────────────────────┐
│ John Doe                    [New]        │
│ Interior Design Service                 │
│ 📞 98XXXXXXXX | 📧 email@... | 📅 Date │
└─────────────────────────────────────────┘
```

---

## Sidebar Navigation

```
┌─────────────────────┐
│ PARBATI             │
│ INTERIOR            │
├─────────────────────┤
│ ├─ Dashboard        │  ← Default state
│ ├─ Enquiries        │
│ ├─ Hero Slider      │
│ ├─ Gallery          │
│ ├─ Projects         │
│ ├─ Blog             │
│ ├─ Services         │  ← Active state with left border
│ ├─ Happy Clients    │
│ └─ Settings         │
├─────────────────────┤
│ [View Website]      │
├─────────────────────┤
│ [A] Admin User      │
│     Administrator   │
│ [Logout]            │
└─────────────────────┘
```

---

## Header Design

```
┌─────────────────────────────────────────────────────┐
│ Services                                   [🔔] [A] ▼│
│ Manage the services displayed on your website.      │
└─────────────────────────────────────────────────────┘
```

---

## Modal Dialog

```
┌────────────────────────────────────────────┐
│ Add Service                            [✕] │
├────────────────────────────────────────────┤
│                                            │
│ Service Title                              │
│ [______________________________]            │
│                                            │
│ Description                                │
│ [__________________________________]       │
│ [__________________________________]       │
│                                            │
│ Image Upload                               │
│ JPG, PNG, WebP or GIF · max 15 MB          │
│ [Choose File]                              │
│                                            │
├────────────────────────────────────────────┤
│                        [Cancel] [Add]      │
└────────────────────────────────────────────┘
```

---

## Active Navigation States

### Before
```
⚫ Dashboard  ← Bright red pill, looks jarring
```

### After
```
│ ← Thin burgundy left border
Dashboard   ← Subtle background, light text
```

---

## Icon Usage

All icons from lucide-react:
- Icon size: **w-4 h-4** (default) or **w-5 h-5** (large)
- Icon style: Thin stroke (light 1-1.5px)
- Icon color: Inherits from text color
- Icon spacing: gap-2 or gap-3 from text

---

## Spacing System

```
xs: 4px   (1)      - Use for tiny gaps
sm: 8px   (2)      - Use for tight spacing
md: 12px  (3)      - Use for small elements
lg: 16px  (4)      - Standard spacing
xl: 24px  (6)      - Card gap/padding
2xl: 32px (8)      - Page padding
3xl: 48px (12)     - Large section gaps
```

---

## Transitions & Animations

### Buttons
```
transition-all duration-200
- background color changes smoothly
- shadow increases on hover
```

### Sidebar Items
```
transition-all
- background and text color change smoothly
- No jarring effects
```

### Cards
```
hover:shadow-md transition-shadow
- Subtle shadow increase on hover
- Shows interactivity without being loud
```

---

## Practical Examples

### Service Card (Complete)

```tsx
<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  {/* Image Section */}
  <div className="relative h-40 overflow-hidden bg-[#F7F6F2]">
    <img src={image} alt={title} className="w-full h-full object-cover" />
  </div>

  {/* Content Section */}
  <CardBody className="p-6">
    <div className="space-y-4">
      {/* Service Number - Small, muted, uppercase */}
      <div className="text-[#77736D] text-xs font-light tracking-widest">
        01
      </div>

      {/* Title - Light weight, elegant */}
      <h3 className="text-lg font-light text-[#202124] tracking-tight">
        {title}
      </h3>

      {/* Description - Muted secondary text */}
      <p className="text-sm text-[#77736D] line-clamp-2 font-light">
        {description}
      </p>

      {/* Status & Actions - Bottom section */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5E1DA]">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-600' : 'bg-[#D4CDBF]'}`}></div>
          <span className="text-xs font-light text-[#77736D]">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Icon buttons - Subtle, not bold */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-[#77736D] hover:text-[#202124] hover:bg-[#F7F6F2] rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-[#77736D] hover:text-[#8F2F2F] hover:bg-[#F7F6F2] rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </CardBody>
</Card>
```

---

## Verification Checklist

After implementing the redesign, verify:

### Visual
- [ ] No bright red elements (only burgundy #8F2F2F)
- [ ] Sidebar has left border on active items
- [ ] Typography feels elegant and restrained
- [ ] Whitespace is generous
- [ ] Shadows are subtle
- [ ] No AI/SaaS dashboard feeling

### Functional
- [ ] All buttons are clickable
- [ ] Forms submit correctly
- [ ] Services CRUD operations work
- [ ] Data displays correctly from Supabase
- [ ] Navigation works across all pages
- [ ] Responsive design functions

### Performance
- [ ] Page loads quickly
- [ ] No console errors
- [ ] Images load properly
- [ ] Transitions are smooth
- [ ] Mobile responsive works

---

## Design Tokens Summary

| Token | Value | Usage |
|-------|-------|-------|
| Primary Accent | #8F2F2F | Buttons, active states, links |
| Primary Background | #F7F6F2 | Page background |
| Primary Text | #202124 | Headings, body text |
| Secondary Text | #77736D | Descriptions, muted content |
| Border Color | #E5E1DA | Card borders, dividers |
| Sidebar | #15181C | Sidebar background |
| Border Radius | 8px / 10px | Components / Cards |
| Shadow | sm / md | Subtle elevation |
| Font Weight | 300-500 | Light to medium (no heavy bold) |

---

## Accessibility Notes

- All text has sufficient contrast ratio (WCAG AA)
- Icon buttons have aria-labels
- Focus states visible on all interactive elements
- Touch targets minimum 44px
- Color not the only indicator (also uses icons, text)
- Semantic HTML maintained

