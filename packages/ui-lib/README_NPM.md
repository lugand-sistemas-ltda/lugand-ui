# 🎨 Vue UI Library

> Sistema robusto de componentes genéricos e reutilizáveis Vue 3 + TypeScript

[![npm version](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/@lugand/vue-ui-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **13+ Componentes Primitivos** - Botões, Inputs, Navegação, Layout
- 🎨 **Sistema de Temas HSL** - 4 temas incluídos (light, dark, ocean, forest)
- 📱 **100% Responsivo** - Mobile-first design
- ♿ **Acessível** - ARIA compliant
- 🔷 **TypeScript First** - Autocomplete completo
- 🌳 **Tree-Shakeable** - Importe apenas o que precisa
- 0️⃣ **Zero Dependencies** - Exceto Vue 3
- ⚡ **Vite Powered** - Build otimizado e rápido

---

## 📦 Instalação

```bash
npm install @lugand/vue-ui-lib
```

---

## 🚀 Quick Start

### 1. Importar Estilos Globais

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";

// Importar estilos da biblioteca
import "@lugand/vue-ui-lib/dist/style.css";

const app = createApp(App);
app.mount("#app");
```

### 2. Usar Componentes

```vue
<script setup lang="ts">
import { Btn, Input, useTheme } from "@lugand/vue-ui-lib";
import { ref } from "vue";

const name = ref("");
const { setTheme } = useTheme();
</script>

<template>
  <div>
    <h1>Meu App</h1>

    <Input
      v-model="name"
      label="Nome"
      placeholder="Digite seu nome"
      hint="Seu nome completo"
    />

    <Btn variant="primary" size="lg" @click="setTheme('dark')">
      Trocar para Dark
    </Btn>
  </div>
</template>
```

---

## 📚 Componentes Disponíveis

### **Primitives (Componentes Base)**

#### `<Btn />`

Botão genérico com variantes e tamanhos

```vue
<Btn variant="primary">Primary</Btn>
<Btn variant="secondary" size="lg">Large Secondary</Btn>
<Btn variant="danger" disabled>Disabled</Btn>
```

**Props:**

- `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled`: `boolean` (default: `false`)
- `type`: `'button' | 'submit' | 'reset'` (default: `'button'`)

---

#### `<BtnToggle />`

Toggle switch on/off

```vue
<script setup>
const darkMode = ref(false);
</script>

<template>
  <BtnToggle v-model="darkMode"> Modo Escuro </BtnToggle>
</template>
```

**Props:**

- `modelValue`: `boolean` (required)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled`: `boolean` (default: `false`)

---

#### `<Input />`

Campo de entrada de texto com validação

```vue
<Input
  v-model="email"
  type="email"
  label="E-mail"
  placeholder="seu@email.com"
  hint="Digite um e-mail válido"
  :error="emailError"
  error-message="E-mail inválido"
/>
```

**Props:**

- `modelValue`: `string | number` (required)
- `type`: `'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'` (default: `'text'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `label`: `string`
- `placeholder`: `string`
- `hint`: `string`
- `error`: `boolean` (default: `false`)
- `errorMessage`: `string`
- `disabled`: `boolean` (default: `false`)
- `readonly`: `boolean` (default: `false`)

---

#### `<Textarea />`

Área de texto multi-linha com contador

```vue
<Textarea
  v-model="description"
  label="Descrição"
  :max-length="200"
  :rows="5"
  resize="vertical"
/>
```

**Props:**

- `modelValue`: `string` (required)
- `rows`: `number` (default: `4`)
- `resize`: `'none' | 'vertical' | 'horizontal' | 'both'` (default: `'vertical'`)
- `maxLength`: `number`
- `label`: `string`
- `placeholder`: `string`
- `hint`: `string`
- `error`: `boolean` (default: `false`)
- `errorMessage`: `string`
- `disabled`: `boolean` (default: `false`)
- `readonly`: `boolean` (default: `false`)

---

### **Navigation (Navegação)**

#### `<NavLink />`

Link com detecção automática de rota ativa

```vue
<NavLink to="/home">Home</NavLink>
<NavLink to="/about">Sobre</NavLink>
```

---

#### `<Navbar />`

Menu lateral responsivo

```vue
<Navbar
  position="left"
  :width="280"
  :collapsible="true"
  :default-visible="true"
>
  <template #top>
    <!-- Conteúdo do topo -->
  </template>
  
  <template #bottom>
    <!-- Conteúdo do rodapé -->
  </template>
</Navbar>
```

---

### **Layout**

#### `<ThemeSwitcher />`

Seletor de temas

```vue
<ThemeSwitcher />
```

---

## 🎨 Sistema de Temas

### Temas Incluídos

- ☀️ **Light** - Tema claro (padrão)
- 🌙 **Dark** - Tema escuro
- 🌊 **Ocean** - Tons de azul
- 🌲 **Forest** - Tons de verde

### Usar Composable `useTheme()`

```typescript
import { useTheme } from "@lugand/vue-ui-lib";

const {
  currentTheme, // ref<ThemeName> - tema atual
  setTheme, // (theme: ThemeName) => void
  toggleDarkMode, // () => void
} = useTheme();

// Trocar tema
setTheme("ocean");

// Toggle dark/light
toggleDarkMode();
```

### Criar Tema Customizado

```css
/* styles/custom-theme.css */
[data-theme="custom"] {
  /* Primary color (HSL) */
  --hsl-primary: 280 70% 50%;
  --color-primary: hsl(var(--hsl-primary));
  --color-primary-hover: hsl(280 70% 45%);
  --color-primary-active: hsl(280 70% 40%);

  /* Secondary color */
  --hsl-secondary: 200 60% 50%;
  --color-secondary: hsl(var(--hsl-secondary));

  /* Background colors */
  --color-bg-primary: hsl(0 0% 100%);
  --color-bg-secondary: hsl(0 0% 98%);

  /* Text colors */
  --color-text-primary: hsl(0 0% 10%);
  --color-text-secondary: hsl(0 0% 40%);
}
```

---

## 🔧 Customização

### Sobrescrever CSS Variables

```css
/* main.css */
:root {
  /* Sobrescrever variáveis globais */
  --font-size-base: 18px;
  --radius-md: 8px;
  --spacing-md: 1rem;
}
```

### Tree-Shaking (Importar Seletivamente)

```typescript
// Apenas os componentes importados serão incluídos no bundle final
import { Btn, Input } from "@lugand/vue-ui-lib";
// Navbar, AppHeader, etc NÃO serão empacotados
```

---

## 📖 Documentação Completa

Para exemplos interativos e documentação visual, rode o showcase localmente:

```bash
git clone https://github.com/lugand/vue-ui-lib
cd vue-ui-lib
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🛠️ Development

```bash
# Instalar dependências
npm install

# Dev mode (showcase)
npm run dev

# Build da biblioteca
npm run build:lib

# Preview do build
npm run preview
```

---

## 📊 Bundle Size

- **JS Bundle**: ~15 KB (gzipped: ~4 KB)
- **CSS**: ~34 KB (gzipped: ~5 KB)
- **Total**: ~49 KB (gzipped: ~9 KB)

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/novo-componente`
3. Commit suas mudanças: `git commit -m 'Add: novo componente'`
4. Push para a branch: `git push origin feature/novo-componente`
5. Abra um Pull Request

---

## 📄 License

MIT © Lugand Sistemas

---

## 🚀 Roadmap

- [ ] Checkbox
- [ ] Radio
- [ ] Select
- [ ] Modal
- [ ] Alert
- [ ] Card
- [ ] Table
- [ ] Tabs
- [ ] Tooltip

---

## 📞 Suporte

- 📧 Email: suporte@lugand.com
- 🐛 Issues: [GitHub Issues](https://github.com/lugand/vue-ui-lib/issues)
- 📖 Docs: [Documentação](https://github.com/lugand/vue-ui-lib)

---

**Feito com ❤️ pela equipe Lugand Sistemas**
