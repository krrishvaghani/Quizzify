# Quizzify UI Design System

## Overview
This document outlines the complete design system used across the Quizzify application for consistent, modern, and professional UI/UX.

## Design Philosophy
- **Modern & Professional**: Clean, contemporary design that conveys trust and quality
- **Bold Typography**: Strong font weights (font-black, font-bold) for emphasis
- **Gradient Accents**: Strategic use of gradients for visual interest
- **Smooth Interactions**: Transitions and hover effects for better UX
- **Dark Theme Foundation**: Black/gray base with bright accent colors

## Color Palette

### Primary Colors
- **Black**: `from-black via-gray-900 to-black` (primary background gradients)
- **White**: `#FFFFFF` (text, cards, icons)
- **Gray Scale**:
  - `gray-50` - Light backgrounds
  - `gray-100` - Subtle backgrounds
  - `gray-200` - Borders, dividers
  - `gray-300` - Inactive elements
  - `gray-400` - Secondary text
  - `gray-600` - Body text
  - `gray-700` - Dark borders
  - `gray-800` - Dark backgrounds
  - `gray-900` - Darkest backgrounds

### Accent Colors
- **Blue**: `from-blue-500 to-blue-600` (primary actions, links)
- **Purple**: `from-purple-500 to-purple-600` (secondary accents)
- **Pink**: `to-pink-500` (gradient endings)
- **Red**: `from-red-600 to-red-700` (logout, destructive actions)
- **Green**: Success states
- **Yellow**: Warnings

### Gradient Combinations
```css
/* Primary Gradient */
bg-gradient-to-br from-black via-gray-900 to-black

/* Card Headers */
bg-gradient-to-br from-black via-gray-900 to-black

/* Buttons */
bg-gradient-to-r from-black to-gray-800

/* Accent Gradients */
bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
bg-gradient-to-br from-blue-500 to-purple-600

/* Background */
bg-gradient-to-br from-gray-50 via-white to-gray-100
```

## Typography

### Font Weights
- **font-black** (900): Primary headings, main titles
- **font-bold** (700): Buttons, secondary headings, labels
- **font-semibold** (600): Navigation items, subheadings
- **font-medium** (500): Body text, descriptions

### Heading Hierarchy
```jsx
// Page Title
<h1 className="text-4xl font-black text-white">

// Section Title
<h2 className="text-3xl font-black text-black">

// Card Title
<h3 className="text-xl font-black text-black">

// Subsection
<h4 className="text-lg font-bold text-gray-900">
```

## Components

### 1. Sidebar (Navigation)
```jsx
<aside className="w-64 bg-gradient-to-b from-black via-gray-900 to-black border-r border-gray-800 flex flex-col fixed h-screen overflow-hidden shadow-2xl">
  {/* Logo */}
  <div className="p-6 border-b border-gray-800 flex-shrink-0">
    <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
      <Sparkles className="h-6 w-6 text-black" />
    </div>
  </div>
  
  {/* Nav Items */}
  {/* Active */}
  <Link className="bg-gradient-to-r from-white to-gray-100 text-black rounded-xl font-bold shadow-lg">
  
  {/* Inactive */}
  <Link className="text-gray-400 hover:bg-white/10 hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1">
</aside>
```

### 2. Cards
```jsx
{/* Quiz Card */}
<div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-black transition-all duration-300 overflow-hidden group hover:shadow-2xl transform hover:-translate-y-1">
  {/* Header */}
  <div className="bg-gradient-to-br from-black via-gray-900 to-black p-6">
    <div className="bg-gradient-to-br from-white to-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
      <Icon className="h-8 w-8 text-black" />
    </div>
  </div>
  
  {/* Content */}
  <div className="p-6">
    <h3 className="text-xl font-black text-black">Title</h3>
    <p className="text-gray-600 font-medium">Description</p>
  </div>
</div>
```

### 3. Buttons

```jsx
{/* Primary Button */}
<button className="px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-bold hover:from-gray-900 hover:to-black shadow-lg hover:shadow-xl transition-all">
  Button Text
</button>

{/* Secondary Button */}
<button className="px-6 py-3 bg-white text-black border-2 border-gray-800 rounded-xl font-bold hover:bg-gray-50 shadow-lg transition-all">
  Button Text
</button>

{/* Danger Button */}
<button className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg">
  Logout
</button>

{/* Icon Button */}
<button className="p-3 bg-white hover:bg-gray-50 rounded-xl transition-all shadow-lg">
  <Icon className="h-5 w-5" />
</button>
```

### 4. Input Fields
```jsx
<input 
  type="text"
  className="w-full px-6 py-5 bg-white border-2 border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-lg font-medium shadow-lg"
  placeholder="Search..."
/>
```

### 5. Badges
```jsx
{/* Status Badge */}
<span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
  My Quiz
</span>

{/* Count Badge */}
<span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-bold rounded-full">
  5
</span>
```

### 6. Modal/Dialog
```jsx
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-2xl w-full mx-4 shadow-2xl border-2 border-gray-800">
    {/* Header */}
    <div className="p-6 border-b border-gray-800">
      <h2 className="text-2xl font-black text-white">Title</h2>
    </div>
    
    {/* Content */}
    <div className="p-6">
      {/* Content here */}
    </div>
    
    {/* Footer */}
    <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
      <button className="...">Cancel</button>
      <button className="...">Confirm</button>
    </div>
  </div>
</div>
```

## Layout Patterns

### Dashboard Layout
```jsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
  {/* Fixed Sidebar */}
  <aside className="w-64 fixed h-screen">...</aside>
  
  {/* Main Content with left margin */}
  <main className="flex-1 ml-64">
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Content */}
    </div>
  </main>
</div>
```

### Page with Header
```jsx
<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
  {/* Header */}
  <header className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 shadow-2xl">
    {/* Header content */}
  </header>
  
  {/* Main */}
  <div className="max-w-7xl mx-auto px-6 py-8">
    {/* Content */}
  </div>
</div>
```

## Spacing Scale
- `gap-2`: 8px
- `gap-3`: 12px
- `gap-4`: 16px
- `gap-6`: 24px
- `gap-8`: 32px

- `p-4`: 16px
- `p-6`: 24px
- `p-8`: 32px

- `mb-2`: 8px
- `mb-4`: 16px
- `mb-6`: 24px
- `mb-8`: 32px

## Border Radius
- `rounded-lg`: 8px (small elements)
- `rounded-xl`: 12px (buttons, inputs)
- `rounded-2xl`: 16px (cards)
- `rounded-3xl`: 24px (large cards, modals)
- `rounded-full`: Full circle (avatars, badges)

## Shadows
```css
/* Light Shadow */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)

/* Medium Shadow */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)

/* Heavy Shadow */
shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

## Animations & Transitions

### Hover Effects
```jsx
{/* Scale on hover */}
<div className="transform hover:scale-110 transition-transform">

{/* Translate on hover */}
<div className="transform hover:-translate-y-1 transition-all">

{/* Color change */}
<div className="transition-colors hover:bg-gray-50">

{/* Multiple properties */}
<div className="transition-all duration-300">
```

### Loading States
```jsx
{/* Spinner */}
<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

{/* Pulse */}
<div className="animate-pulse bg-gray-200 rounded" />
```

## Icon Usage
- **Size**: h-5 w-5 (20px) for buttons, h-6 w-6 (24px) for headers
- **Stroke Width**: Default (lucide-react)
- **Color**: Inherit from parent or explicit classes

## Responsive Design
- Mobile-first approach
- Key breakpoints:
  - `sm:` 640px
  - `md:` 768px
  - `lg:` 1024px
  - `xl:` 1280px
  - `2xl:` 1536px

## Accessibility
- Sufficient color contrast (WCAG AA minimum)
- Focus states on interactive elements
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support

## Best Practices
1. ✅ Use gradient backgrounds for headers and primary sections
2. ✅ Bold typography for emphasis and hierarchy
3. ✅ Consistent border-radius across similar components
4. ✅ Shadow-lg or shadow-xl for elevated elements
5. ✅ Smooth transitions (transition-all duration-300)
6. ✅ Hover effects for interactive elements
7. ✅ Responsive design with mobile-first approach
8. ✅ Consistent spacing using Tailwind's scale
9. ✅ Use lucide-react icons consistently
10. ✅ Test in both light and dark contexts

## Component Examples

### Welcome Banner
```jsx
<div className="bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-3xl p-8 shadow-2xl border border-gray-800">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-2xl flex items-center justify-center shadow-lg">
      <Sparkles className="w-8 h-8 text-black" />
    </div>
    <div>
      <h2 className="text-4xl font-black mb-2">Welcome back!</h2>
      <p className="text-gray-300 text-lg">Ready to continue your learning journey?</p>
    </div>
  </div>
</div>
```

### Empty State
```jsx
<div className="text-center py-20 px-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-200 shadow-xl">
  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
    <Icon className="h-10 w-10 text-gray-600" />
  </div>
  <h3 className="text-2xl font-black text-black mb-3">No items yet</h3>
  <p className="text-gray-600 text-lg mb-8">Get started by creating your first item</p>
  <button className="...">Create Now</button>
</div>
```

## Notes
- Always test components in different states (hover, focus, active, disabled)
- Maintain consistency across similar components
- Use semantic HTML for better accessibility
- Keep animations subtle and performant
- Test on multiple screen sizes

---

**Last Updated**: November 2025
**Version**: 1.0
