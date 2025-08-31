# Tailwind CSS v3 to v4 Upgrade Guide

This guide provides comprehensive instructions for upgrading Tailwind CSS projects from v3 to v4, including breaking changes and migration steps.

## Browser Requirements

**⚠️ Important:** Tailwind CSS v4.0 targets modern browsers:

- Safari 16.4+
- Chrome 111+
- Firefox 128+

If you need to support older browsers, stick with v3.4 until your browser support requirements change.

## Quick Upgrade Using Official Tool

The fastest way to upgrade is using the official upgrade tool:

```bash
npx @tailwindcss/upgrade
```

**Requirements:**

- Node.js 20 or higher
- Run in a new branch for safety
- Carefully review the diff after running

## Manual Upgrade Steps

### 1. Update Dependencies

#### For PostCSS Users

```bash
# Remove old dependencies
npm uninstall tailwindcss postcss-import autoprefixer

# Install new v4 PostCSS plugin
npm install -D @tailwindcss/postcss
```

Update `postcss.config.mjs`:

```javascript
// Before (v3)
export default {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

// After (v4)
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

#### For Vite Users

```bash
npm install -D @tailwindcss/vite
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

#### For Tailwind CLI Users

```bash
npm install -D @tailwindcss/cli
```

Update build commands:

```bash
# Before
npx tailwindcss -i input.css -o output.css

# After
npx @tailwindcss/cli -i input.css -o output.css
```

### 2. Update CSS Imports

Replace Tailwind directives with CSS import:

```css
/* Before (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* After (v4) */
@import "tailwindcss";
```

### 3. Update Utility Classes

#### Removed Deprecated Utilities

| v3 Deprecated           | v4 Replacement         |
| ----------------------- | ---------------------- |
| `bg-opacity-*`          | `bg-black/50`          |
| `text-opacity-*`        | `text-black/50`        |
| `border-opacity-*`      | `border-black/50`      |
| `divide-opacity-*`      | `divide-black/50`      |
| `ring-opacity-*`        | `ring-black/50`        |
| `placeholder-opacity-*` | `placeholder-black/50` |
| `flex-shrink-*`         | `shrink-*`             |
| `flex-grow-*`           | `grow-*`               |
| `text-ellipsis`         | `text-ellipsis`        |
| `box-decoration-slice`  | `box-decoration-slice` |
| `box-decoration-clone`  | `box-decoration-clone` |

#### Renamed Utilities

| v3                 | v4                 |
| ------------------ | ------------------ |
| `shadow-2xs`        | `shadow-2xs`       |
| `shadow-xs`        | `shadow-2xs`        |
| `drop-shadow-xs`   | `drop-shadow-xs`   |
| `drop-shadow-xs`   | `drop-shadow-xs`   |
| `blur-xs`          | `blur-xs`          |
| `blur-xs`          | `blur-xs`          |
| `backdrop-blur-xs` | `backdrop-blur-xs` |
| `backdrop-blur-xs` | `backdrop-blur-xs` |
| `rounded-xs`       | `rounded-xs`       |
| `rounded-sm`          | `rounded-xs`       |
| `outline-hidden`   | `outline-hidden`   |
| `ring-3`           | `ring-3`           |

#### Examples of Common Updates

```html
<!-- Shadow utilities -->
<div class="shadow-2xs">...</div>
<!-- v3 -->
<div class="shadow-2xs">...</div>
<!-- v4 -->

<div class="shadow-xs">...</div>
<!-- v3 -->
<div class="shadow-2xs">...</div>
<!-- v4 -->

<!-- Ring utilities -->
<input class="ring-3 ring-blue-500" />
<!-- v3 -->
<input class="ring-3 ring-blue-500" />
<!-- v4 -->

<!-- Outline utilities -->
<input class="focus:outline-hidden" />
<!-- v3 -->
<input class="focus:outline-hidden" />
<!-- v4 -->

<!-- Opacity utilities -->
<div class="bg-black bg-opacity-50">
  <!-- v3 -->
  <div class="bg-black/50"><!-- v4 --></div>
</div>
```

### 4. Configuration Changes

#### Container Utility

```css
/* v4 way to customize container */
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

#### Default Colors

Add explicit colors where needed:

```html
<!-- Make sure to specify border colors -->
<div class="border border-gray-200 px-2 py-3">
  <!-- ... -->
</div>
```

Or preserve v3 behavior with base styles:

```css
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}
```

### 5. Custom Utilities

Replace `@layer utilities` with `@utility`:

```css
/* Before (v3) */
@layer utilities {
  .tab-4 {
    tab-size: 4;
  }
}

/* After (v4) */
@utility tab-4 {
  tab-size: 4;
}
```

### 6. Theme Variables

#### Using CSS Variables

```css
/* Preferred v4 approach */
.my-class {
  background-color: var(--color-red-500);
}

/* Instead of theme() function */
.my-class {
  background-color: theme(colors.red.500); /* v3 way */
}
```

#### Media Queries

```css
/* v3 */
@media (width >= theme(screens.xl)) {
  /* ... */
}

/* v4 */
@media (width >= theme(--breakpoint-xl)) {
  /* ... */
}
```

### 7. JavaScript Configuration

Load JS config explicitly if needed:

```css
@config "../../tailwind.config.js";
```

### 8. Framework-Specific Updates

#### Vue/Svelte/CSS Modules

Use `@reference` to import theme variables:

```vue
<template>
  <h1>Hello world!</h1>
</template>

<style>
@reference "../../app.css";

h1 {
  @apply text-2xl font-bold text-red-500;
}
</style>
```

Or use CSS variables directly:

```vue
<style>
h1 {
  color: var(--color-red-500);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}
</style>
```

## Breaking Changes Summary

### Variant Stacking Order

```html
<!-- v3: right to left -->
<ul class="py-4 first:*:pt-0 last:*:pb-0">
  <!-- v4: left to right -->
  <ul class="py-4 *:first:pt-0 *:last:pb-0"></ul>
</ul>
```

### Variables in Arbitrary Values

```html
<!-- v3 -->
<div class="bg-(--brand-color)"></div>

<!-- v4 -->
<div class="bg-(--brand-color)"></div>
```

### Hover Behavior

Now only applies when primary input device supports hover:

```css
/* v4 behavior */
@media (hover: hover) {
  .hover\:underline:hover {
    text-decoration: underline;
  }
}
```

Override if needed:

```css
@custom-variant hover (&:hover);
```

## Preflight Changes

### Placeholder Color

```css
/* To preserve v3 behavior */
@layer base {
  input::placeholder,
  textarea::placeholder {
    color: var(--color-gray-400);
  }
}
```

### Button Cursor

```css
/* To preserve v3 pointer cursor */
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```

### Dialog Margins

```css
/* To preserve v3 centered dialogs */
@layer base {
  dialog {
    margin: auto;
  }
}
```

## Testing Checklist

After upgrading:

- [ ] Test all shadow utilities (`shadow-2xs` → `shadow-2xs`)
- [ ] Test all ring utilities (`ring-3` → `ring-3`)
- [ ] Test all outline utilities (`outline-hidden` → `outline-hidden`)
- [ ] Test all opacity utilities (`bg-opacity-*` → `bg-*/opacity`)
- [ ] Test custom utilities with `@utility`
- [ ] Test hover states on touch devices
- [ ] Test container utility customizations
- [ ] Test any JavaScript theme access
- [ ] Test build process and performance
- [ ] Test in target browsers (Safari 16.4+, Chrome 111+, Firefox 128+)

## Compatibility Notes

- **No Sass/Less/Stylus support**: Tailwind v4 is designed as a preprocessor replacement
- **CSS Variables**: Use generated CSS variables instead of `theme()` function when possible
- **Modern CSS**: Leverages `@property` and `color-mix()` for core features
- **Performance**: Improved build times and smaller bundle sizes

## Resources

- [Official v4 Documentation](https://tailwindcss.com/docs)
- [Upgrade Tool](https://github.com/tailwindlabs/tailwindcss/tree/main/packages/%40tailwindcss-upgrade)
- [Migration Examples](https://tailwindcss.com/docs/upgrade-guide)

---

**Note**: Always test thoroughly in a separate branch before merging v4 changes to your main codebase.
