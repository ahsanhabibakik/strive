# Internationalization (i18n) Guide

This project uses a custom i18n solution built specifically for Next.js 15 with App Router. It provides type-safe translations organized by feature domains.

## Quick Start

### Using translations in components:

```tsx
import { useTranslation } from '@/lib/i18n/context'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.loading')}</h1>
      <p>{t('auth.signIn')}</p>
      <p>{t('goals.goalCreated')}</p>
    </div>
  )
}
```

### Using translations with parameters:

```tsx
const message = t('auth.minLength', { count: 8 })
// Result: "Minimum 8 characters required"

const notification = t('notifications.unreadNotifications', { count: 5 })
// Result: "You have 5 unread notifications"
```

### Server-side translations:

```tsx
import { getServerTranslation } from '@/lib/i18n/server'

export default async function ServerComponent() {
  const title = await getServerTranslation('landing.hero.title')
  
  return <h1>{title}</h1>
}
```

## File Structure

```
src/locales/
├── en/                    # English (default)
│   ├── common.json       # Common UI elements
│   ├── auth.json         # Authentication
│   ├── dashboard.json    # Dashboard features
│   ├── landing.json      # Landing page
│   ├── errors.json       # Error messages
│   ├── goals.json        # Goals feature
│   ├── habits.json       # Habits feature
│   ├── navigation.json   # Navigation items
│   ├── notifications.json # Notifications
│   └── index.ts          # Export all translations
├── es/                   # Spanish (example future language)
│   └── ...              # Same structure as English
├── index.ts             # Main exports and utilities
└── README.md           # This file
```

## Adding New Languages

1. **Create language folder:**
   ```bash
   mkdir src/locales/es  # for Spanish
   ```

2. **Copy English files as template:**
   ```bash
   cp -r src/locales/en/* src/locales/es/
   ```

3. **Translate the content:**
   Edit each JSON file in the new language folder.

4. **Update configuration:**
   ```typescript
   // src/locales/index.ts
   import { es } from './es'
   
   export const locales = {
     en,
     es, // Add new language
   }
   ```

5. **Update language metadata:**
   ```typescript
   // src/lib/i18n/config.ts
   export const languageMetadata = {
     en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
     es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
   }
   ```

## Translation Files Organization

### common.json
Basic UI elements used across the app:
- Buttons (save, cancel, delete, etc.)
- States (loading, error, success)
- Actions (edit, create, update, etc.)

### Feature-specific files
Each major feature has its own translation file:
- `auth.json` - Authentication flows
- `goals.json` - Goal management
- `habits.json` - Habit tracking
- `dashboard.json` - Dashboard components
- `navigation.json` - Menu items and links

### Special files
- `errors.json` - All error messages and validation
- `landing.json` - Marketing/landing page content
- `notifications.json` - Notification content

## Best Practices

### 1. Naming Conventions
- Use camelCase for keys: `goalCreated`, `userProfile`
- Use nested objects for organization: `hero.title`, `pricing.free.name`
- Keep keys descriptive but concise

### 2. Parameter Usage
Use `{{parameter}}` syntax for dynamic content:
```json
{
  "welcome": "Welcome back, {{name}}!",
  "itemCount": "You have {{count}} items"
}
```

### 3. Pluralization
Handle plurals with separate keys or conditional logic:
```json
{
  "goalCount": {
    "zero": "No goals yet",
    "one": "{{count}} goal",
    "other": "{{count}} goals"
  }
}
```

### 4. Context-Specific Translations
Group related translations together:
```json
{
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "forgotPassword": "Forgot Password?"
  }
}
```

## RTL Language Support

For right-to-left languages (Arabic, Hebrew, etc.):

1. **Add to RTL language list:**
   ```typescript
   // src/lib/i18n/utils.ts
   const rtlLanguages: Locale[] = ['ar', 'he'] // Add your RTL languages
   ```

2. **The system will automatically:**
   - Set `dir="rtl"` on the document
   - Provide RTL detection utilities
   - Handle text direction in components

## Components

### LanguageSwitcher
Dropdown component for language selection:
```tsx
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

// Default variant
<LanguageSwitcher />

// Compact variant
<LanguageSwitcher variant="compact" align="start" />
```

### I18nProvider
Wrap your app with the i18n provider:
```tsx
import { I18nProvider } from '@/components/providers/I18nProvider'

function Layout({ children }) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  )
}
```

## Utilities

### Number/Date Formatting
```tsx
import { formatNumber, formatCurrency, formatDate } from '@/lib/i18n/utils'

const number = formatNumber(1234.56, 'en') // "1,234.56"
const price = formatCurrency(99.99, 'USD', 'en') // "$99.99"
const date = formatDate(new Date(), 'en', { dateStyle: 'medium' })
```

### Pluralization
```tsx
import { pluralize } from '@/lib/i18n/utils'

const message = pluralize(5, 'item', 'items', 'en') // "5 items"
```

## Type Safety

The i18n system provides full TypeScript support:

```tsx
// Translation keys are type-checked
const { t } = useTranslation()
t('common.save') // ✅ Valid key
t('invalid.key') // ❌ TypeScript error
```

## Performance

- Translations are loaded per-component as needed
- Server-side rendering supported
- Lazy loading for additional languages
- Minimal bundle size impact

## Testing

Test translations in your components:

```tsx
import { render } from '@testing-library/react'
import { I18nProvider } from '@/components/providers/I18nProvider'
import MyComponent from './MyComponent'

test('renders with translations', () => {
  render(
    <I18nProvider locale="en">
      <MyComponent />
    </I18nProvider>
  )
  // Your test assertions...
})
```