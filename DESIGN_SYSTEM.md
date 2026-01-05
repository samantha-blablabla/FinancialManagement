# Design System - Financial Management

## 🎨 Color Palette

### Primary Palette: Stone (ONLY)
**IMPORTANT:** This project uses ONLY the Stone color palette. Do not introduce other Tailwind colors (emerald, rose, amber, blue, etc.) unless explicitly requested.

```
Stone 50   - #fafaf9  (Lightest - rarely used)
Stone 100  - #f5f5f4  (Very light text)
Stone 200  - #e7e5e4  (Light text, income amounts)
Stone 300  - #d6d3d1  (Medium-light text, negative balances)
Stone 400  - #a8a29e  (Medium text, expense amounts)
Stone 500  - #78716c  (Labels, secondary text)
Stone 600  - #57534e  (Hidden amounts)
Stone 700  - #44403c  (Borders, dividers)
Stone 800  - #292524  (Card backgrounds)
Stone 900  - #1c1917  (Dark backgrounds)
Stone 950  - #0c0a09  (Darkest - rarely used)
```

### Usage Guidelines

#### Text Colors
- **Primary Text:** `text-stone-100` (main headings, positive balances)
- **Secondary Text:** `text-stone-200` (income amounts)
- **Muted Text:** `text-stone-300` (currency labels, negative balances)
- **Subtle Text:** `text-stone-400` (expense amounts)
- **Labels:** `text-stone-500` (field labels, captions)
- **Hidden/Disabled:** `text-stone-600` (hidden amounts ••••••)

#### Background Colors
- **Cards:** `bg-stone-900/40` with `backdrop-blur-xl`
- **Borders:** `border-stone-700/50`
- **Hover States:** `hover:bg-stone-700/50`
- **Icons/Badges:** `bg-stone-800/50` or `from-stone-700/50 to-stone-800/50`

#### Glassmorphism Effect
All cards use glassmorphism with:
```css
backdrop-blur-xl
bg-stone-900/40
border-stone-700/50
shadow-xl
```

---

## 📏 Typography Scale

Using **Major Third (1.250)** ratio:

```
text-xs     - 12px  (Labels, captions)
text-sm     - 14px  (Secondary text)
text-base   - 16px  (Body text, amounts)
text-lg     - 18px  (Section headers, balances)
text-xl     - 20px  (Icons)
text-2xl    - 24px  (Currency icons)
text-3xl    - 30px  (Page titles on mobile)
text-4xl    - 36px  (Page titles on desktop)
```

---

## 📐 Spacing System

Based on **4px rule**:

```
gap-1    - 4px
gap-2    - 8px
gap-3    - 12px
gap-4    - 16px
gap-5    - 20px
gap-6    - 24px
gap-8    - 32px

p-3      - 12px padding
p-4      - 16px padding
p-5      - 20px padding
```

---

## 🎯 Component Patterns

### Currency Summary Cards

**Layout:** Responsive grid
- Mobile: 1 card per row (`grid-cols-1`)
- Tablet: 2 cards per row (`md:grid-cols-2`)
- Desktop: 3 cards per row (`lg:grid-cols-3`)

**Structure:**
```tsx
<Card>
  <CardContent className="p-5">
    {/* Currency Icon + Name */}
    <div className="w-10 h-10 bg-gradient-to-br from-stone-700/50 to-stone-800/50">
      {icon}
    </div>

    {/* Stats - Vertical Layout */}
    <div className="space-y-3">
      {/* Income: text-stone-200 */}
      {/* Expense: text-stone-400 */}
      {/* Balance: text-stone-100 (positive) or text-stone-300 (negative) */}
    </div>
  </CardContent>
</Card>
```

### Amount Visibility

Default state: **Hidden** (`showAmounts = false`)

Hidden: `<span className="text-stone-600">••••••</span>`
Visible: Actual amount with appropriate stone color

---

## 🚫 What NOT to Use

❌ **Do NOT use these colors:**
- `emerald-*` (no green for income)
- `rose-*` / `red-*` (no red for expenses)
- `amber-*` / `yellow-*` (no yellow for warnings)
- `blue-*` / `sky-*` / `cyan-*`
- Any other Tailwind color

✅ **ONLY use:**
- `stone-*` palette (50-950)

---

## 📱 Responsive Breakpoints

```
sm:   640px   (Small tablets)
md:   768px   (Tablets)
lg:   1024px  (Small desktops)
xl:   1280px  (Large desktops)
2xl:  1536px  (Extra large)
```

**Common Patterns:**
- Hidden on mobile, show on desktop: `hidden sm:inline`
- Text size responsive: `text-sm md:text-base`
- Grid responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 🎭 Animation & Effects

### Particles Background
```tsx
<div className="particles">
  <div className="particle"></div>
  <div className="particle"></div>
  <div className="particle"></div>
</div>
```

### Gradient Background
```css
animate-gradient
```

### Transitions
- Hover: `transition-colors`
- Duration: Default (150ms)

---

## 📝 Code Comments

Always document design system compliance:
```tsx
{/* Design System: Using Stone palette (50-950) only */}
```

---

**Last Updated:** 05/01/2026
**Maintainer:** Financial Management Team
**Compliance:** Strict - No exceptions without approval
