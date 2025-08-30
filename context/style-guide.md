# Strive Visual Style Guide

## Brand Identity

### Logo & Branding

- **Primary Logo:** "Strive" wordmark in Inter SemiBold
- **Color:** Primary blue (#2563eb) or white on dark backgrounds
- **Usage:** Consistent placement in top navigation, marketing materials

### Voice & Tone

- **Professional yet Approachable:** Clear, confident, helpful
- **Action-Oriented:** Use active voice, direct language
- **Encouraging:** Positive reinforcement for user achievements
- **Concise:** Respect user's time with brief, clear communication

## Color System

### Primary Palette

```css
--primary: #2563eb; /* Blue-600 */
--primary-hover: #1d4ed8; /* Blue-700 */
--primary-light: #dbeafe; /* Blue-100 */
```

### Semantic Colors

```css
--success: #059669; /* Emerald-600 */
--error: #dc2626; /* Red-600 */
--warning: #d97706; /* Amber-600 */
--info: #0ea5e9; /* Sky-500 */
```

### Neutral Palette

```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Usage Guidelines

- **Primary Blue:** CTAs, links, active states, progress indicators
- **Success Green:** Completed tasks, success messages, positive metrics
- **Error Red:** Error states, destructive actions, validation failures
- **Warning Amber:** Caution states, pending items, important notices
- **Gray Scale:** Text hierarchy, backgrounds, borders, disabled states

## Typography

### Font Stack

```css
font-family:
  Inter,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  sans-serif;
```

### Type Scale

- **Display:** 36px / 44px (text-4xl) - Hero sections
- **H1:** 30px / 36px (text-3xl) - Page titles
- **H2:** 24px / 32px (text-2xl) - Section headers
- **H3:** 20px / 28px (text-xl) - Subsection headers
- **H4:** 18px / 28px (text-lg) - Component titles
- **Body Large:** 16px / 24px (text-base) - Primary body text
- **Body:** 14px / 20px (text-sm) - Secondary body text
- **Caption:** 12px / 16px (text-xs) - Labels, meta information

### Weight Usage

- **Bold (700):** Important headings, emphasis
- **SemiBold (600):** Buttons, section headers, navigation
- **Medium (500):** Labels, secondary headings
- **Regular (400):** Body text, descriptions

## Iconography

### Icon System

- **Library:** Lucide React (consistent, modern, customizable)
- **Sizes:** 16px, 20px, 24px standard sizes
- **Style:** 1.5px stroke width, rounded line caps
- **Usage:** Paired with text, navigation, actions, status indicators

### Common Icons

- **Navigation:** Home, Users, Settings, ChevronRight
- **Actions:** Plus, Edit, Trash2, Search, Filter
- **Status:** Check, X, AlertCircle, Info
- **UI:** Menu, X, Eye, EyeOff, ExternalLink

## Component Styling

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 8px 16px; /* py-2 px-4 */
  border-radius: 4px;
  font-weight: 500;
  transition: all 150ms ease-in-out;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}
```

### Cards

```css
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Forms

```css
.input {
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  transition: border-color 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

## Layout Patterns

### Page Structure

```html
<div class="min-h-screen bg-gray-50">
  <nav><!-- Sidebar navigation --></nav>
  <main class="ml-64">
    <header class="bg-white border-b px-6 py-4">
      <h1 class="text-2xl font-semibold text-gray-900">Page Title</h1>
    </header>
    <div class="p-6">
      <!-- Page content -->
    </div>
  </main>
</div>
```

### Card Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>
```

### Form Layout

```html
<div class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Form fields -->
  </div>
</div>
```

## Spacing & Rhythm

### Vertical Rhythm

- **Large sections:** 48px (space-y-12)
- **Section separation:** 32px (space-y-8)
- **Component spacing:** 24px (space-y-6)
- **Form fields:** 16px (space-y-4)
- **List items:** 12px (space-y-3)
- **Inline elements:** 8px (space-x-2)

### Container Padding

- **Page containers:** 24px (p-6)
- **Card internal:** 16px-24px (p-4 to p-6)
- **Button internal:** 8px 16px (py-2 px-4)
- **Input internal:** 8px 12px (py-2 px-3)

## Responsive Design

### Breakpoint Strategy

- **Mobile:** 320px - 639px (single column, stacked navigation)
- **Tablet:** 640px - 1023px (two-column grids, collapsible sidebar)
- **Desktop:** 1024px+ (full layout, expanded sidebar)

### Mobile Adaptations

- **Navigation:** Hamburger menu, slide-out drawer
- **Tables:** Horizontal scroll or stacked cards
- **Forms:** Single column layout
- **Buttons:** Full-width on mobile when appropriate

## Animation & Transitions

### Timing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Duration Standards

- **Micro-interactions:** 150ms (hover, focus states)
- **Component transitions:** 300ms (modal, drawer opening)
- **Page transitions:** 500ms (route changes)

### Common Animations

```css
.fade-in {
  animation: fadeIn 300ms ease-out;
}

.slide-up {
  animation: slideUp 300ms ease-out;
}

.scale-in {
  animation: scaleIn 200ms ease-out;
}
```

## Accessibility Guidelines

### Color Contrast

- **Normal text:** 4.5:1 minimum contrast ratio
- **Large text (18px+):** 3:1 minimum contrast ratio
- **UI components:** 3:1 minimum contrast ratio

### Focus States

```css
.focus-ring {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Screen Reader Support

- Semantic HTML structure
- ARIA labels for complex interactions
- Alt text for all images
- Proper heading hierarchy
- Form label associations

This style guide ensures consistent visual design across the Strive application while maintaining accessibility and usability standards.
