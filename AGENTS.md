# Agent Guidelines for fin-literacy-web

This document provides coding standards and guidelines for AI agents working on this codebase.

## Technology Stack

- **Framework**: Next.js 13 (Pages Router)
- **Language**: TypeScript 5 (strict mode enabled)
- **Styling**: CSS Modules + Global CSS with CSS variables
- **Internationalization**: next-translate (10 locales)
- **UI**: React 18, phosphor-react icons, react-hot-toast
- **Analytics**: Mixpanel, Webengage, Plotline

## Build, Lint, and Run Commands

```bash
# Development
yarn dev                          # Start development server

# Build
yarn prebuild                     # Get translations + like count from remote
yarn build                        # Build for production
yarn start                        # Start production server

# Linting
yarn lint                         # Run ESLint (next/core-web-vitals)

# Scripts
yarn get-remote-translations      # Fetch translations from remote
yarn get-rshort-like-count       # Get like counts from Mixpanel
yarn get-shorts-from-source      # Fetch shorts content
```

**Note**: No test suite is configured. Do not attempt to run tests.

## File Structure

```
src/
├── components/        # Reusable UI components (PascalCase/)
├── pages/            # Next.js pages (kebab-case/)
│   └── api/          # API routes
├── hooks/            # Custom React hooks (useCamelCase.ts)
├── lib/              # Business logic & utilities
├── constants/        # App constants (PascalCase.ts)
├── types/            # TypeScript definitions (kebab-case.ts)
└── styles/           # Global CSS
```

## Import Ordering (Strictly Follow)

```typescript
// 1. React/Next imports
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// 2. Third-party libraries
import { X } from "phosphor-react";
import toast from "react-hot-toast";

// 3. Internal components (@ alias)
import PageLayout from "@/components/PageLayout";
import DashboardLoader from "@/components/DashboardLoader";

// 4. Hooks
import useFetcher from "@/hooks/useFetcher";
import useTranslation from "@/hooks/useTranslation";

// 5. Libraries/utilities
import { logAnalyticsEvent } from "@/lib/analytics";
import { fetcher } from "@/lib/fetcher";

// 6. Types/constants
import { AnalyticEvent } from "@/lib/analytics/events";
import { ScreenName } from "@/constants/ScreenName";

// 7. Assets
import rightArrowIconUrl from "@/images/right-arrow.svg";

// 8. Styles (ALWAYS LAST)
import styles from "./styles.module.css";
```

## Naming Conventions

### Files
- Components: `PascalCase/index.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types: `kebab-case.ts`
- Constants: `PascalCase.ts`
- Styles: `styles.module.css`
- Pages: `kebab-case/index.tsx`

### Code
- Components: `PascalCase` (e.g., `PageLayout`, `Modal`)
- Functions: `camelCase` (e.g., `handleClick`, `fetchData`)
- Handlers: `handle` prefix (e.g., `handleBackClick`, `handleSubmit`)
- Booleans: `is`, `has`, `can` prefix (e.g., `isLoading`, `hasNavbar`)
- Private: underscore prefix (e.g., `_url`, `_className`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_LIMIT`)
- Enums: `PascalCase` with `SCREAMING_SNAKE_CASE` values

### CSS Classes
- Module styles: `PascalCase__SubElement` (e.g., `PageLayout__Wrapper`)
- Global utilities: `kebab-case` (e.g., `text-body`, `btn-primary`)
- Modifiers: `PascalCase` (e.g., `Active`, `Floating`)

## TypeScript Guidelines

### Type Definitions
```typescript
// Interfaces for props and objects
interface PageLayoutProps {
  title?: string;
  children: ReactNode;
  hasNavbar?: boolean;
}

// Types for unions and complex compositions
type ShortsResponse = {
  data: Array<{ id: string; content: string }>;
  nextContinuationToken?: string;
};

// Enums for semantic constants
export enum UserStatus {
  SALARY_VIEWABLE = "SALARY_VIEWABLE",
  VERIFICATION_PENDING = "VERIFICATION_PENDING",
}
```

### Type Safety Patterns
- Use type guards: `isStringAndNotEmpty(value): value is string`
- Prefer optional chaining: `user?.name?.data`
- Use nullish coalescing: `value ?? "default"`
- Type generic hooks: `useFetcher<T, E extends Error>`
- AVOID type assertions; prefer type narrowing
- Always type async function returns: `Promise<User | null>`

## Component Structure (Template)

```typescript
import { ReactNode, useState, useEffect } from "react";
import styles from "./styles.module.css";

interface ComponentProps {
  children: ReactNode;
  title?: string;
  onBackClick?: () => void;
}

export default function Component({
  children,
  title = "Default Title",
  onBackClick,
}: ComponentProps) {
  // State declarations
  const [isLoading, setIsLoading] = useState(false);
  
  // Handlers
  function handleClick() {
    // logic
  }
  
  // Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // Render
  return (
    <div className={styles.Component}>
      {children}
    </div>
  );
}
```

## Error Handling

### Try-Catch Pattern (Graceful Degradation)
```typescript
try {
  const resp = await fetcher();
  setData(resp);
} catch (error: any) {
  setError(error);
} finally {
  setIsLoading(false);
}
```

### API Routes Always Return 200
```typescript
try {
  const response = await fetch(url);
  return res.status(200).json({ success: true, data });
} catch (error: any) {
  console.error("Error:", error);
  return res.status(200).json({
    success: true,
    message: "Handled gracefully",
  });
}
```

### Null Safety
- Use optional chaining: `user?.metadata?.id`
- Use nullish coalescing: `value ?? defaultValue`
- Early returns: `if (!data) return null;`
- Fallback values: `JSON.parse(str).catch(() => ({}))`

## Common Patterns

### Path Aliases
- Use `@/*` for all imports from `src/*`
- Example: `import PageLayout from "@/components/PageLayout"`

### Internationalization
```typescript
const { t, tWithoutTypeSafety } = useTranslation("common");
t("key_from_locale_file");           // Type-safe
tWithoutTypeSafety("dynamic_key");   // For server-provided keys
```

### Analytics
```typescript
logAnalyticsEvent(
  ["mixpanel", "webengage"],
  AnalyticEvent.EVENT_NAME,
  { metadata: "value" }
);
```

### Data Fetching
```typescript
const { data, error, isLoading, refetch } = useFetcher(() => 
  fetcher("/api/endpoint")
);
```

### Page Layout Wrapper
```typescript
<PageLayout
  title="Page Title"
  hasNavbar
  hasBackButton
  onBackClick={handleBack}
>
  {/* content */}
</PageLayout>
```

## CSS Guidelines

- Use CSS Modules for component styles (`styles.module.css`)
- Use global utilities for common patterns (`btn-primary`, `text-body`)
- Use CSS variables from globals.css (e.g., `var(--clr-brand-default)`)
- Follow 4px spacing scale (`--spacing-1` to `--spacing-20`)
- Mobile-first responsive design with media queries

## What NOT to Do

- NEVER skip TypeScript types - always define interfaces/types for props
- NEVER use `any` type unless absolutely necessary
- NEVER bypass ESLint rules without good reason
- NEVER commit without running `yarn lint` and `yarn build`
- NEVER use inline styles - always use CSS modules or global classes
- NEVER hardcode text - use translations via `useTranslation`
- NEVER use `var` - always use `const` or `let`
- NEVER mutate props or state directly
- NEVER forget to handle loading and error states
- NEVER use `console.log` in production code - use proper logging

## Code Review Checklist

- [ ] Imports are ordered correctly (see Import Ordering section)
- [ ] All TypeScript types are properly defined
- [ ] Component follows the standard structure template
- [ ] Error handling is implemented with try-catch
- [ ] Loading and error states are handled in UI
- [ ] Internationalization used for all user-facing text
- [ ] Analytics events logged for user interactions
- [ ] CSS modules used with proper naming conventions
- [ ] No hardcoded strings or magic numbers
- [ ] Null safety with optional chaining and nullish coalescing
- [ ] Code passes `yarn lint` without errors
- [ ] Code builds successfully with `yarn build`
