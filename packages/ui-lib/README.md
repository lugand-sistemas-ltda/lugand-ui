# 🎨 Lugand UI Library

> Modern Vue 3 component library built with TypeScript, featuring dynamic theming and secure input handling.

---

## ✨ Features

- ⚡ **Vue 3 + Vite** - Fast builds and instant HMR
- 📘 **TypeScript** - Fully typed components
- 🎨 **10 Built-in Themes** - Dynamic theme switching
- 🔒 **Secure Inputs** - Date inputs with validation and sanitization
- ♿ **Accessible** - WCAG 2.1 compliant
- 📦 **Tree-shakeable** - Import only what you need
- 🚀 **Performance** - Optimized for production

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run showcase (development)
npm run dev

# Build library for distribution
npm run build:lib

# Preview production build
npm run preview
```

### Installation (NPM)

```bash
npm install @lugand-sistemas-ltda/vue-ui-lib
```

### Usage

```vue
<script setup lang="ts">
import { Btn, Input, DateInput, Card } from "@lugand-sistemas-ltda/vue-ui-lib";
import "@lugand-sistemas-ltda/vue-ui-lib/style.css";
import { ref } from "vue";

const name = ref("");
const birthDate = ref<Date | null>(null);
</script>

<template>
  <Card title="User Form">
    <Input v-model="name" label="Name" />
    <DateInput v-model="birthDate" type="date" label="Birth Date" />
    <Btn @click="submit">Submit</Btn>
  </Card>
</template>
```

---

## � Documentation

Complete documentation available in the `/docs` folder:

- **[README](./docs/README.md)** - Overview and getting started
- **[ARCHITECTURE](./docs/ARCHITECTURE.md)** - Project structure and patterns
- **[COMPONENTS](./docs/COMPONENTS.md)** - Component API reference
- **[THEMES](./docs/THEMES.md)** - Theming system guide
- **[CHANGELOG](./docs/CHANGELOG.md)** - Version history

---

## 🎯 Component Highlights

### Secure Date Inputs

```vue
<!-- Blocks letters, validates ranges, returns Date objects -->
<DateInput v-model="date" type="date" label="Birth Date" />
<DateSegmentedInput v-model="dateTime" enable-time />
```

### Dynamic Theming

```vue
<script setup>
import { useTheme } from "@lugand-sistemas-ltda/vue-ui-lib";
const { setTheme } = useTheme();
setTheme("dark"); // 10 themes available
</script>
```

### Form Components

```vue
<CurrencyInput v-model="price" label="Price" />
<MaskInput v-model="cpf" mask="CPF" label="CPF" />
<Input v-model="email" type="email" label="Email" />
```

---

## 📦 Project Structure

```
packages/ui-lib/
├── src/               # Source code
├── lib/               # Build output (library)
├── dist/              # Build output (showcase)
└── docs/              # Documentation
    ├── README.md      # Getting started
    ├── ARCHITECTURE.md
    ├── COMPONENTS.md
    ├── THEMES.md
    └── CHANGELOG.md
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

---

## 📝 License

MIT © Lugand Sistemas

---

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@lugand-sistemas-ltda/vue-ui-lib)
- [GitHub Repository](https://github.com/lugand-sistemas-ltda/lugand-ui)
- [Documentation](./docs/README.md)
- [Changelog](./docs/CHANGELOG.md)

Páginas da aplicação com suporte a rotas pai/filho em múltiplas camadas.

## 🚀 Como Iniciar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🛠️ Tecnologias

- **Vue 3** - Framework progressivo
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Vue Router 4** - Gerenciamento de rotas
- **SASS/SCSS** - Pré-processador CSS

## 📝 Convenções

- Use TypeScript para todos os arquivos
- Componentes devem usar `<script setup lang="ts">`
- Estilos devem usar SCSS com `<style scoped lang="scss">`
- Use path alias `@/` para imports do src
- Organize código por feature, não por tipo de arquivo
