# SnapSort Design System
## macOS-Native Light Theme

### Color Palette
```
Background Layers:
- App Background:     #FAFAFA (almost white, warm)
- Sidebar Background: #F5F5F5 (slightly darker than app bg)
- Card Background:    #FFFFFF (pure white)
- Dividers:           #E5E5E5 (soft gray)

Text Colors:
- Primary:   #1F1F1F (near black, readable)
- Secondary: #6B6B6B (medium gray for metadata)
- Tertiary:  #9B9B9B (light gray for hints)

Accent Colors:
- Primary Blue:   #0071E3 (Apple-style blue)
- Hover Blue:     #0077ED (slightly brighter on hover)
- Selected BG:    #E3F2FD (very soft blue wash)

Status Colors:
- Code:      #2563EB (blue)
- Error:     #DC2626 (red, muted)
- Chat:      #059669 (green, muted)
- UI:        #7C3AED (purple, muted)
- Document:  #D97706 (amber, muted)
- Other:     #64748B (slate)

Borders & Shadows:
- Card Border:  #E8E8E8
- Soft Shadow:  0 1px 3px rgba(0,0,0,0.08)
- Hover Shadow: 0 2px 8px rgba(0,0,0,0.12)
```

### Typography
```
Font Family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif

Sizes:
- Title (20px):     text-xl font-semibold
- Subtitle (14px):  text-sm font-medium
- Body (13px):      text-[13px] font-normal
- Caption (11px):   text-[11px] font-normal

Line Heights:
- Tight for headings: leading-tight
- Comfortable for body: leading-relaxed
```

### Spacing Scale
```
- xs:  4px   (tight internal spacing)
- sm:  8px   (component padding)
- md:  12px  (section gaps)
- lg:  16px  (card padding)
- xl:  24px  (major sections)
- 2xl: 32px  (page margins)
```

### Border Radius
```
- Card:    8px  (rounded-lg)
- Button:  6px  (rounded-md)
- Badge:   4px  (rounded)
- Avatar:  50%  (rounded-full)
```

### Transitions
```
- Default: transition-all duration-150 ease-in-out
- Hover scale: hover:scale-[1.02]
- No bounce, no spring physics
```
