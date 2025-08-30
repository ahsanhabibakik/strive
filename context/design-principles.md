# Strive SaaS Design Principles

## Core Design Philosophy & Strategy

- [ ] **Users First:** Prioritize user needs, workflows, and ease of use in every design decision
- [ ] **Meticulous Craft:** Aim for precision, polish, and high quality in every UI element and interaction
- [ ] **Speed & Performance:** Design for fast load times and snappy, responsive interactions
- [ ] **Simplicity & Clarity:** Strive for a clean, uncluttered interface. Ensure labels, instructions, and information are unambiguous
- [ ] **Focus & Efficiency:** Help users achieve their goals quickly and with minimal friction. Minimize unnecessary steps or distractions
- [ ] **Consistency:** Maintain a uniform design language (colors, typography, components, patterns) across the entire application
- [ ] **Accessibility (WCAG AA+):** Design for inclusivity. Ensure sufficient color contrast, keyboard navigability, and screen reader compatibility
- [ ] **Opinionated Design (Thoughtful Defaults):** Establish clear, efficient default workflows and settings, reducing decision fatigue for users

## Design System Foundation

### Color Palette

- **Primary Brand Color:** Blue-600 (#2563eb) - used strategically for CTAs and key elements
- **Neutrals:** Gray scale (gray-50 to gray-900) for text, backgrounds, borders
- **Semantic Colors:**
  - Success: Green-600 (#059669)
  - Error/Destructive: Red-600 (#dc2626)
  - Warning: Amber-600 (#d97706)
  - Informational: Blue-600 (#2563eb)

### Typography

- **Primary Font:** Inter (system fallbacks: -apple-system, BlinkMacSystemFont, "Segoe UI")
- **Scale:**
  - H1: 2xl/3xl (text-2xl/text-3xl)
  - H2: xl/2xl (text-xl/text-2xl)
  - H3: lg/xl (text-lg/text-xl)
  - Body: base/sm (text-base/text-sm)
  - Caption: xs/sm (text-xs/text-sm)
- **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Line Height:** 1.5-1.7 for body text, tighter for headings

### Spacing System

- **Base Unit:** 4px (Tailwind's spacing scale)
- **Scale:** 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Border Radii

- **Small:** rounded-sm (2px) - for small elements
- **Default:** rounded (4px) - for buttons, inputs
- **Medium:** rounded-lg (8px) - for cards
- **Large:** rounded-xl (12px) - for modals, major containers

## Layout & Visual Hierarchy

### Responsive Design

- **Mobile First:** Design starting from 320px width
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid:** 12-column responsive grid system

### Navigation Structure

- **Main Dashboard Layout:**
  - Persistent sidebar navigation for primary sections
  - Top header with user account, notifications, search
  - Main content area with breadcrumbs and page headers
  - Responsive: Collapsible sidebar on mobile

### Component Guidelines

#### Buttons

- **Primary:** Blue background, white text, for main actions
- **Secondary:** White background, gray border, for secondary actions
- **Destructive:** Red background, white text, for dangerous actions
- **Ghost:** Transparent background, colored text, for tertiary actions
- **States:** Clear hover, active, focus, and disabled states

#### Forms

- **Labels:** Always visible, positioned above inputs
- **Validation:** Inline error messages, clear success states
- **Helper Text:** Gray text below inputs for guidance
- **Required Fields:** Marked with asterisk or "required" label

#### Cards & Containers

- **Elevation:** Subtle shadows (shadow-sm to shadow-lg)
- **Borders:** Light gray borders when needed
- **Padding:** Consistent internal spacing (p-4 to p-6 typically)

## Interaction Design

### Micro-interactions

- **Hover States:** Subtle color changes, scale transforms
- **Loading States:** Skeleton screens for content, spinners for actions
- **Transitions:** 150-300ms duration with ease-in-out timing
- **Feedback:** Toast notifications for actions, inline validation for forms

### Accessibility Requirements

- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Focus States:** Clear visual indication of focused elements
- **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Touch Targets:** Minimum 44px for mobile interactions

## Module-Specific Guidelines

### Dashboard & Analytics

- **Data Visualization:** Clear, legible charts with appropriate color coding
- **Metrics Cards:** Consistent layout with value, label, and trend indicators
- **Tables:** Sortable headers, pagination, clear row separations

### Forms & Settings

- **Progressive Disclosure:** Show advanced options only when needed
- **Grouping:** Related fields grouped with clear section headers
- **Save Patterns:** Auto-save where possible, clear save confirmation

### Authentication & User Management

- **Security First:** Clear password requirements, 2FA options
- **Error Messages:** Helpful, non-technical language
- **Success States:** Clear confirmation of account actions

## Performance Standards

- **Load Time:** First Contentful Paint < 2.5s
- **Interaction:** Response to user input < 100ms
- **Animation:** 60fps smooth animations
- **Bundle Size:** Optimized assets, lazy loading for non-critical content

## Quality Assurance

- **Cross-browser:** Chrome, Firefox, Safari, Edge compatibility
- **Device Testing:** Desktop, tablet, and mobile viewports
- **Accessibility Testing:** Screen reader compatibility, keyboard navigation
- **Performance Testing:** Core Web Vitals compliance
