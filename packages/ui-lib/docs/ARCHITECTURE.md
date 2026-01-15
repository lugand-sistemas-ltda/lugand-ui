# 🏗️ Architecture

> Project structure, patterns, and conventions for the Lugand UI Library.

---

## 📁 Folder Structure

```
packages/ui-lib/
├── src/
│   ├── core/                      # Core configuration
│   │   ├── config/               # App config (themes, routes)
│   │   ├── constants/            # Global constants
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Utility functions (formatters, validators)
│   │
│   ├── shared/                    # Shared resources
│   │   ├── components/           # Reusable components
│   │   │   ├── form/            # Form components
│   │   │   │   ├── primitives/  # Base inputs (Input, NumericTextInput)
│   │   │   │   ├── inputs/      # Specialized inputs (DateInput, CurrencyInput)
│   │   │   │   ├── selection/   # Checkbox, Radio, Switch
│   │   │   │   └── selects/     # Select, Multiselect
│   │   │   ├── display/         # Cards, Badges, Avatars
│   │   │   ├── feedback/        # Toasts, Modals, Spinners
│   │   │   ├── layout/          # Containers, Grids
│   │   │   └── navigation/      # Tabs, Breadcrumbs
│   │   ├── composables/         # Reusable composition functions
│   │   └── directives/          # Custom Vue directives
│   │
│   ├── modules/                   # Feature modules
│   │   ├── AppShell/            # App layout system
│   │   ├── DataTable/           # Data table component
│   │   └── DynamicForm/         # Dynamic form builder
│   │
│   ├── layouts/                   # Page layouts
│   ├── router/                    # Vue Router config
│   ├── views/                     # Page views (showcase)
│   └── styles/                    # Global styles
│       ├── base/                # Reset, elements
│       ├── themes/              # Theme definitions
│       ├── tokens/              # Design tokens (colors)
│       └── utils/               # Variables, mixins
│
├── lib/                           # Library build output
└── docs/                          # Documentation
```

---

## 🎨 Design System

### Design Tokens (CSS Variables)

All tokens are defined in `src/styles/utils/variables.scss`:

#### Spacing

```scss
--spacing-2xs: 0.25rem; // 4px
--spacing-xs: 0.5rem; // 8px
--spacing-sm: 0.75rem; // 12px
--spacing-md: 1rem; // 16px
--spacing-lg: 1.5rem; // 24px
--spacing-xl: 2rem; // 32px
--spacing-2xl: 3rem; // 48px
--spacing-3xl: 4rem; // 64px
```

#### Typography

```scss
--font-size-xs: 0.75rem; // 12px
--font-size-sm: 0.875rem; // 14px
--font-size-md: 1rem; // 16px
--font-size-lg: 1.125rem; // 18px
--font-size-xl: 1.25rem; // 20px
--font-size-2xl: 1.5rem; // 24px
--font-size-3xl: 2rem; // 32px

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Border Radius

```scss
--radius-sm: 0.25rem; // 4px
--radius-md: 0.5rem; // 8px
--radius-lg: 1rem; // 16px
--radius-full: 9999px;
```

#### Transitions

```scss
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

### Semantic Colors

Colors are theme-dependent (see [THEMES.md](./THEMES.md)):

```scss
// Backgrounds
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary

// Text
--color-text-primary
--color-text-secondary
--color-text-tertiary

// Borders
--color-border-light
--color-border-base
--color-border-dark

// Brand
--color-primary
--color-secondary

// Status
--color-success
--color-warning
--color-error
--color-info
```

---

## 🧩 Component Architecture

### Hierarchy Pattern

```
PRIMITIVES (Base Layer)
├─ Input.vue           - Generic text input
├─ NumericTextInput    - Numeric-only input
├─ Btn.vue             - Button primitive
└─ Select.vue          - Dropdown primitive

SPECIALIZED COMPONENTS (Business Layer)
├─ DateInput           - Uses MaskInput → NumericTextInput
├─ CurrencyInput       - Numeric with currency formatting
└─ MaskInput           - Pattern-based input (CPF, Phone)

COMPOSITE COMPONENTS (Feature Layer)
├─ DateSegmentedInput  - DD | MM | YYYY fields
├─ DynamicForm         - Schema-based forms
└─ DataTable           - Sortable, filterable table
```

### Composition Pattern

Components use Vue 3 Composition API:

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  modelValue: string;
  label?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// Local state
const internalValue = ref(props.modelValue);

// Computed
const hasValue = computed(() => internalValue.value.length > 0);

// Methods
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);
};
</script>
```

---

## 📦 Export Strategy

### Library Entry Point (`lib/index.ts`)

```typescript
// Primitives
export { default as Btn } from "./shared/components/form/primitives/Btn.vue";
export { default as Input } from "./shared/components/form/primitives/Input.vue";

// Specialized
export { default as DateInput } from "./shared/components/form/inputs/DateInput.vue";

// Composables
export { useTheme } from "./shared/composables/useTheme";

// Types
export type { Theme } from "./core/types/theme.types";
```

### Tree-shaking

Only imported components are bundled:

```typescript
// ✅ Imports only Btn (tree-shaking works)
import { Btn } from "@lugand/vue-ui-lib";

// ❌ Imports everything (no tree-shaking)
import * as UI from "@lugand/vue-ui-lib";
```

---

## 🔒 Security Patterns

### Input Sanitization

**NumericTextInput** enforces type="text" with numeric validation:

```typescript
const sanitize = (value: string): string => {
  const regex = new RegExp(`[^${props.allowedChars}]`, "g");
  return value.replace(regex, "");
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const sanitized = sanitize(target.value);

  // Visual feedback (immediate removal)
  if (sanitized !== target.value) {
    target.value = sanitized;
  }

  emit("update:modelValue", sanitized);
};
```

### Date Input Architecture

```
USER INPUT (UI Layer)
  ↓ type="text" (NumericTextInput)
  ↓ Sanitization (remove non-numeric)
  ↓ Mask Application (DD/MM/YYYY)
  ↓ Semantic Validation (isValidDate)
  ↓
BUSINESS LOGIC (Date Objects)
  ↓ new Date(year, month, day)
  ↓
API LAYER (ISO Strings)
  ↓ date.toISOString()
  ↓ "2024-12-25T00:00:00.000Z"
  ↓
DATABASE (TIMESTAMP/DATE)
```

---

## 🎯 Naming Conventions

### Components

- **PascalCase**: `DateInput.vue`, `CurrencyInput.vue`
- **Descriptive**: Name reflects functionality
- **Suffix pattern**: `Input`, `Select`, `Card`, `Container`

### Composables

- **camelCase**: `useTheme`, `useDateInput`
- **Prefix**: Always start with `use`

### Types

- **PascalCase**: `Theme`, `FormField`, `TableColumn`
- **Suffix**: `Props`, `Emits`, `Options` for component types

### CSS Classes

- **BEM-like**: `component__element--modifier`
- **Example**: `date-segmented__wrapper--error`

---

## 🧪 Testing Strategy (Future)

```
src/
├── __tests__/
│   ├── unit/              # Vitest unit tests
│   ├── integration/       # Component integration
│   └── e2e/              # Playwright E2E
```

---

## 📝 Documentation Guidelines

### Component Documentation

Each component should have:

1. **Purpose** - What problem it solves
2. **Props** - All available props with types
3. **Emits** - All emitted events
4. **Slots** - Available slots
5. **Examples** - Usage examples

### Code Comments

```vue
<script setup lang="ts">
/**
 * DateInput
 *
 * Text input with automatic date parsing and validation.
 * Returns Date object (not string).
 *
 * @example
 * <DateInput v-model="birthDate" type="date" label="Birth Date" />
 */
</script>
```

---

## 🚀 Build & Deploy

### Development Build

```bash
npm run dev          # Showcase app (Vite dev server)
```

### Library Build

```bash
npm run build:lib    # Outputs to ./lib/
```

### Production Build (Showcase)

```bash
npm run build        # Outputs to ./dist/
npm run preview      # Preview production build
```

---

## 📋 Best Practices

### Do's ✅

- Use Composition API (`<script setup>`)
- Type all props and emits
- Use semantic CSS variables
- Emit `update:modelValue` for v-model
- Keep components single-responsibility
- Document complex logic

### Don'ts ❌

- Don't use Options API
- Don't hardcode colors/spacing
- Don't use `any` type
- Don't create monolithic components
- Don't skip prop validation
- Don't use inline styles (use CSS variables)

---

## 🔄 Migration Guide

### From Old Architecture

If migrating from older patterns:

1. **Input.vue** → Use `NumericTextInput` for numeric inputs
2. **Inline styles** → Use CSS variables
3. **Options API** → Convert to Composition API
4. **Type `any`** → Add proper TypeScript types
5. **Hardcoded values** → Use design tokens

---

## 📚 Further Reading

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
- [Design Tokens](https://spectrum.adobe.com/page/design-tokens/)
- [BEM Methodology](http://getbem.com/)
