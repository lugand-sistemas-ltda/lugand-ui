# 🎨 Lugand UI Library

> Modern Vue 3 component library with TypeScript, theming system, and accessibility built-in.

---

## 🚀 Quick Start

### Installation

```bash
npm install @lugand/vue-ui-lib
```

### Usage

```vue
<script setup lang="ts">
import { Btn, Input, Card } from "@lugand/vue-ui-lib";
import "@lugand/vue-ui-lib/style.css";
</script>

<template>
  <Card title="Welcome">
    <Input v-model="name" label="Name" />
    <Btn @click="submit">Submit</Btn>
  </Card>
</template>
```

---

## 📚 Documentation

- **[Architecture](./ARCHITECTURE.md)** - Project structure and patterns
- **[Components](./COMPONENTS.md)** - Component API reference
- **[Themes](./THEMES.md)** - Theming system and customization
- **[Changelog](./CHANGELOG.md)** - Version history

---

## ✨ Features

- ⚡ **Vue 3 + TypeScript** - Modern and type-safe
- 🎨 **Dynamic Theming** - 10 built-in themes + custom themes
- ♿ **Accessible** - WCAG 2.1 compliant
- 📦 **Tree-shakeable** - Import only what you need
- 🔒 **Secure Inputs** - Built-in validation and sanitization
- 📱 **Mobile-first** - Responsive and touch-friendly

---

## 🎯 Component Categories

### **Primitives** (Base components)

- `Btn`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Radio`

### **Form Components**

- `DateInput`, `DateSegmentedInput`, `DateSelectInput`
- `CurrencyInput`, `MaskInput`, `NumericTextInput`

### **Display Components**

- `Card`, `Badge`, `Avatar`, `MediaCard`

### **Layout Components**

- `GridContainer`, `ScrollContainer`, `CodeBlock`

### **Feedback Components**

- `Toast`, `Modal`, `Spinner`

### **Navigation Components**

- `Tabs`, `Breadcrumbs`

---

## 🎨 Theming

10 pre-built themes available:

- `default` (light), `dark`
- `ocean`, `forest`, `cyberpunk`, `dracula`
- `bombeiros`, `pcpr`, `pretona`, `viatura`

```vue
<script setup>
import { useTheme } from "@lugand/vue-ui-lib";

const { setTheme } = useTheme();
setTheme("dark");
</script>
```

[Learn more about theming →](./THEMES.md)

---

## 🛡️ Security Features

### Date Inputs

- ✅ No letters accepted (type="text" with numeric validation)
- ✅ Range validation (HH: 00-23, mm: 00-59)
- ✅ Semantic validation (31/02 → error)
- ✅ SQL injection prevention

### Currency Inputs

- ✅ Numeric-only with automatic formatting
- ✅ Returns number type (no string manipulation)

---

## 📦 Development

```bash
# Install dependencies
npm install

# Run showcase (development)
npm run dev

# Build library
npm run build:lib

# Preview production build
npm run preview
```

---

## 📝 License

MIT © Lugand Sistemas
