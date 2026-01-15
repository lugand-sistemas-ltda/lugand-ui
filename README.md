# 🎨 Lugand UI - Monorepo

> Modern Vue 3 component library built with TypeScript, featuring dynamic theming and secure inputs.

---

## � Packages

```
lugand-ui/
├── packages/
│   ├── ui-lib/          # Component library (publishable to NPM)
│   └── test-ui-lib/     # Test application
└── docs/                # Monorepo documentation
```

### **[@lugand/vue-ui-lib](./packages/ui-lib/)**

The main component library with:

- 🎯 40+ Vue 3 components
- 🎨 10 built-in themes
- � Secure date/currency inputs
- ♿ WCAG 2.1 accessible
- 📦 Tree-shakeable

**[View Library Documentation →](./packages/ui-lib/docs/README.md)**

### **[@lugand/test-ui-lib](./packages/test-ui-lib/)**

Test application for integration testing and development.

---

## 🚀 Quick Start

### Installation

```bash
# Install all workspace dependencies
npm install
```

### Development

```bash
# Run library showcase (recommended)
npm run dev:lib
# → http://localhost:5174

# Run test application
npm run dev:test
# → http://localhost:5173
```

### Build

```bash
# Build library for NPM
npm run build:lib

# Build test application
npm run build:test

# Build everything
npm run build:all
```

---

## 📚 Documentation

- **[Library Docs](./packages/ui-lib/docs/README.md)** - Getting started, components, theming
- **[Architecture](./packages/ui-lib/docs/ARCHITECTURE.md)** - Project structure and patterns
- **[Components](./packages/ui-lib/docs/COMPONENTS.md)** - Complete API reference
- **[Themes](./packages/ui-lib/docs/THEMES.md)** - Theming system
- **[Changelog](./packages/ui-lib/docs/CHANGELOG.md)** - Version history

---

## 🎯 Features

### Secure Date Inputs

```vue
<!-- Blocks letters, validates ranges, returns Date objects -->
<DateInput v-model="date" type="date" label="Birth Date" />
<DateSegmentedInput v-model="dateTime" enable-time />
```

### Dynamic Theming

```vue
<script setup>
import { useTheme } from "@lugand/vue-ui-lib";
const { setTheme } = useTheme();
setTheme("dark"); // 10 themes: default, dark, ocean, forest, cyberpunk...
</script>
```

### Form Components

```vue
<CurrencyInput v-model="price" label="Price" />
<MaskInput v-model="cpf" mask="CPF" label="CPF" />
<Input v-model="email" type="email" label="Email" />
```

---

## �️ Development Commands

### Workspace Root

```bash
# Development
npm run dev:lib          # Library showcase (recommended)
npm run dev:test         # Test application

# Build
npm run build:lib        # Build library for NPM
npm run build:test       # Build test application
npm run build:all        # Build everything

# Maintenance
npm run type-check       # TypeScript type checking
npm run lint             # Code linting
npm run format           # Code formatting
```

### Package-specific Commands

```bash
# Navigate to package
cd packages/ui-lib

# Run package commands
npm run dev              # Development server
npm run build:lib        # Build library
npm run preview          # Preview production build
```

---

## 📋 Workspace Configuration

### NPM Workspaces

Defined in root `package.json`:

```json
{
  "workspaces": ["packages/*"]
}
```

**Benefits:**

- ✅ Shared `node_modules` (hoisting)
- ✅ Local package symlinks (no `npm link`)
- ✅ Unified dependency management
- ✅ Parallel builds

### Package Linking

Test app automatically uses latest library code:

```json
// packages/test-ui-lib/package.json
{
  "dependencies": {
    "@lugand/vue-ui-lib": "*" // ← Symlink to local package
  }
}
```

---

## 📊 Package Details

### @lugand/vue-ui-lib

**Purpose:** Component library for NPM distribution

**Location:** `packages/ui-lib/`

**Build Output:**

- `lib/index.js` - ES module
- `lib/style.css` - Compiled styles
- `lib/*.d.ts` - TypeScript declarations

**Bundle Size:** ~28 KB (gzipped: ~7.5 KB)

**Exports:**

- Components (40+)
- Composables (useTheme, useDateInput)
- Types (Theme, FormField, TableColumn)
- Themes (10 pre-built)

### @lugand/test-ui-lib

**Purpose:** Integration testing and development

**Location:** `packages/test-ui-lib/`

**Features:**

- Real-world usage scenarios
- Component integration tests
- Development playground

---

## 🎨 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **SCSS** - CSS preprocessor
- **NPM Workspaces** - Monorepo management

---

## 🤝 Contributing

1. Clone repository
2. Install dependencies: `npm install`
3. Create feature branch: `git checkout -b feature/my-feature`
4. Make changes in `packages/ui-lib/`
5. Test in showcase: `npm run dev:lib`
6. Commit: `git commit -m "feat: add feature"`
7. Push and open PR

---

## 📝 License

MIT © Lugand Sistemas

---

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@lugand/vue-ui-lib)
- [GitHub Repository](https://github.com/lugand-sistemas-ltda/lugand-ui)
- [Documentation](./packages/ui-lib/docs/README.md)
- [Changelog](./packages/ui-lib/docs/CHANGELOG.md)
