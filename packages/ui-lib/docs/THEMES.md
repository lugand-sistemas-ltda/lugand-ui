# 🎨 Theming System

> Dynamic theming with CSS variables and 10 pre-built themes.

---

## 🚀 Quick Start

### Basic Usage

```vue
<script setup>
import { useTheme } from "@lugand/vue-ui-lib";

const { currentTheme, setTheme, availableThemes } = useTheme();

// Change theme
setTheme("dark");
</script>

<template>
  <select v-model="currentTheme" @change="setTheme(currentTheme)">
    <option v-for="theme in availableThemes" :key="theme" :value="theme">
      {{ theme }}
    </option>
  </select>
</template>
```

---

## 🎨 Available Themes

### Default Themes

| Theme         | Description          | Primary Color        | Background  |
| ------------- | -------------------- | -------------------- | ----------- |
| **default**   | Clean light theme    | Blue (#3b82f6)       | White       |
| **dark**      | Dark mode            | Light Blue (#60a5fa) | Dark Gray   |
| **ocean**     | Blue water tones     | Cyan (#0ea5e9)       | Light Blue  |
| **forest**    | Green nature tones   | Green (#22c55e)      | Light Green |
| **cyberpunk** | Neon pink/purple     | Pink (#ec4899)       | Dark Purple |
| **dracula**   | Purple vampire theme | Purple (#bd93f9)     | Very Dark   |

### Custom Themes (Business)

| Theme         | Description      | Use Case                |
| ------------- | ---------------- | ----------------------- |
| **bombeiros** | Red emergency    | Fire department systems |
| **pcpr**      | Blue official    | Police systems (PCPR)   |
| **pretona**   | Black tactical   | Tactical operations     |
| **viatura**   | Police car theme | Vehicle systems         |

---

## 🎯 Theme Structure

Each theme defines semantic color variables:

### Background Colors

```scss
--color-bg-primary      // Main background
--color-bg-secondary    // Secondary areas
--color-bg-tertiary     // Tertiary areas
```

### Text Colors

```scss
--color-text-primary    // Main text
--color-text-secondary  // Secondary text
--color-text-tertiary   // Tertiary text (muted)
```

### Border Colors

```scss
--color-border-light    // Light borders
--color-border-base     // Default borders
--color-border-dark     // Dark borders
```

### Brand Colors

```scss
--color-primary         // Primary brand color
--color-primary-light   // Light variant
--color-primary-dark    // Dark variant

--color-secondary       // Secondary brand color
```

### Status Colors

```scss
--color-success         // Success states
--color-warning         // Warning states
--color-error           // Error states
--color-info            // Info states
```

### 🆕 Semantic State Colors (v0.1.4+)

Each theme now includes full semantic color support for Alert components and other feedback elements:

```scss
// INFO STATE (blue tones)
--color-info-bg         // Alert info background
--color-info-text       // Alert info text color
--color-info-border     // Alert info border color

// SUCCESS STATE (green tones)
--color-success-bg      // Alert success background
--color-success-text    // Alert success text color
--color-success-border  // Alert success border color

// WARNING STATE (yellow/orange tones)
--color-warning-bg      // Alert warning background
--color-warning-text    // Alert warning text color
--color-warning-border  // Alert warning border color

// ERROR STATE (red tones)
--color-error-bg        // Alert error background
--color-error-text      // Alert error text color
--color-error-border    // Alert error border color
```

**📌 Important:** These colors automatically adapt to theme brightness:

- **Light themes**: Backgrounds at 95% lightness, text at 30% (dark text on light bg)
- **Dark themes**: Backgrounds at 15% lightness, text at 75-80% (light text on dark bg)

**Example in different themes:**

| Theme     | Info Background          | Info Text                | Adaptation           |
| --------- | ------------------------ | ------------------------ | -------------------- |
| Light     | `hsl(200, 100%, 95%)` ☀️ | `hsl(200, 80%, 30%)` 🌑  | Light bg + Dark text |
| Dark      | `hsl(200, 80%, 15%)` 🌑  | `hsl(200, 100%, 80%)` ☀️ | Dark bg + Light text |
| Dracula   | `hsl(191, 50%, 15%)` 🌑  | `hsl(191, 97%, 85%)` 💎  | Cyan Dracula colors  |
| Cyberpunk | `hsl(180, 70%, 12%)` 🌑  | `hsl(180, 100%, 70%)` 💠 | Neon cyan colors     |

See [ALERT_COLOR_FIX.md](./ALERT_COLOR_FIX.md) for detailed migration guide.

### Input-Specific

```scss
--input-bg              // Input background
--input-border          // Input border
--input-text            // Input text
--input-placeholder     // Placeholder text
```

---

## 🛠️ Creating Custom Themes

### 1. Define Theme Configuration

Create `src/core/config/themes.config.ts`:

```typescript
import type { Theme } from "@/core/types/theme.types";

export const MY_CUSTOM_THEME: Theme = {
  name: "my-theme",
  colors: {
    // Backgrounds
    "--color-bg-primary": "#ffffff",
    "--color-bg-secondary": "#f8fafc",
    "--color-bg-tertiary": "#f1f5f9",

    // Text
    "--color-text-primary": "#0f172a",
    "--color-text-secondary": "#475569",
    "--color-text-tertiary": "#94a3b8",

    // Borders
    "--color-border-light": "#f1f5f9",
    "--color-border-base": "#e2e8f0",
    "--color-border-dark": "#cbd5e1",

    // Brand
    "--color-primary": "#3b82f6",
    "--color-primary-light": "#93c5fd",
    "--color-primary-dark": "#1e40af",
    "--color-secondary": "#8b5cf6",

    // Status
    "--color-success": "#10b981",
    "--color-warning": "#f59e0b",
    "--color-error": "#ef4444",
    "--color-info": "#3b82f6",

    // Inputs
    "--input-bg": "#ffffff",
    "--input-border": "#e2e8f0",
    "--input-text": "#0f172a",
    "--input-placeholder": "#94a3b8",
  },
};

// Add to themes array
export const THEMES: Theme[] = [
  DEFAULT_THEME,
  DARK_THEME,
  MY_CUSTOM_THEME, // ← Add here
];
```

### 2. Create SCSS File

Create `src/styles/themes/my-theme.scss`:

```scss
[data-theme="my-theme"] {
  // Backgrounds
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;

  // Text
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;

  // Brand
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;

  // Status
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  // Borders
  --color-border-light: #f1f5f9;
  --color-border-base: #e2e8f0;
  --color-border-dark: #cbd5e1;

  // Inputs
  --input-bg: #ffffff;
  --input-border: #e2e8f0;
  --input-text: #0f172a;
  --input-placeholder: #94a3b8;
}
```

### 3. Import SCSS

Add to `src/styles/main.scss`:

```scss
@import "./themes/my-theme.scss";
```

### 4. Use Theme

```vue
<script setup>
import { useTheme } from "@lugand/vue-ui-lib";

const { setTheme } = useTheme();
setTheme("my-theme");
</script>
```

---

## 📊 Theme Examples

### Dark Theme

```scss
[data-theme="dark"] {
  --color-bg-primary: #0f0f0f;
  --color-bg-secondary: #1a1a1a;
  --color-bg-tertiary: #262626;

  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #737373;

  --color-primary: #60a5fa;
  --color-border-base: #404040;
}
```

### Ocean Theme

```scss
[data-theme="ocean"] {
  --color-bg-primary: #f0f9ff;
  --color-bg-secondary: #e0f2fe;
  --color-bg-tertiary: #bae6fd;

  --color-text-primary: #082f49;
  --color-text-secondary: #0c4a6e;

  --color-primary: #0ea5e9;
  --color-border-base: #7dd3fc;
}
```

### Cyberpunk Theme

```scss
[data-theme="cyberpunk"] {
  --color-bg-primary: #1a0b2e;
  --color-bg-secondary: #240b3b;
  --color-bg-tertiary: #2e0f4a;

  --color-text-primary: #f5d5e8;
  --color-text-secondary: #d4a5c7;

  --color-primary: #ec4899;
  --color-border-base: #701a75;
}
```

---

## 🎨 Design Tokens

### Color Palette

All themes should define these semantic colors:

```scss
// Foundation
--color-bg-primary, --color-bg-secondary, --color-bg-tertiary
--color-text-primary, --color-text-secondary, --color-text-tertiary
--color-border-light, --color-border-base, --color-border-dark

// Brand
--color-primary, --color-primary-light, --color-primary-dark
--color-secondary

// Status
--color-success, --color-warning, --color-error, --color-info

// Input-specific
--input-bg, --input-border, --input-text, --input-placeholder
```

### Non-Theme Tokens

These tokens are **theme-independent** (defined in `variables.scss`):

```scss
// Spacing (never changes across themes)
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg...

// Typography (consistent across themes)
--font-size-xs, --font-size-sm, --font-size-md...
--font-weight-regular, --font-weight-medium...

// Border Radius (consistent)
--radius-sm, --radius-md, --radius-lg, --radius-full

// Transitions (consistent)
--transition-fast, --transition-base, --transition-slow
```

---

## 🔄 Dynamic Theme Switching

### Composable API

```typescript
const {
  currentTheme, // Current active theme name
  setTheme, // Set theme by name
  availableThemes, // Array of all theme names
} = useTheme();
```

### Reactive Theme

```vue
<script setup>
import { useTheme } from "@lugand/vue-ui-lib";

const { currentTheme, setTheme } = useTheme();

// Watch for changes
watch(currentTheme, (newTheme) => {
  console.log("Theme changed to:", newTheme);
});
</script>
```

### Persist Theme

```vue
<script setup>
import { useTheme } from "@lugand/vue-ui-lib";

const { currentTheme, setTheme } = useTheme();

// Load from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) setTheme(savedTheme);
});

// Save to localStorage
watch(currentTheme, (theme) => {
  localStorage.setItem("theme", theme);
});
</script>
```

---

## 🎯 Best Practices

### Do's ✅

- Use semantic color variables (`--color-text-primary`)
- Test theme in light AND dark modes
- Ensure sufficient contrast (WCAG AA)
- Keep brand colors consistent
- Document custom theme purpose

### Don'ts ❌

- Don't hardcode colors (`color: #3b82f6`)
- Don't use RGB/HSL directly (use CSS vars)
- Don't create themes for every page
- Don't skip accessibility testing
- Don't override spacing/typography tokens

---

## 🧪 Testing Themes

### Manual Testing

1. Switch to theme in UI
2. Test all components (buttons, inputs, cards)
3. Check contrast ratios
4. Test in different screen sizes
5. Verify dark mode compatibility

### Automated Testing (Future)

```typescript
// Theme contrast test
test("theme has sufficient contrast", () => {
  const theme = getTheme("my-theme");
  expect(getContrast(theme.bg, theme.text)).toBeGreaterThan(4.5);
});
```

---

## 📚 Resources

- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Design Tokens](https://spectrum.adobe.com/page/design-tokens/)
- [Theme UI](https://theme-ui.com/home)
