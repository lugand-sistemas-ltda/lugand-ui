# UI Component Library 🎨

> Biblioteca base de componentes UI construída com **Vue 3**, **TypeScript** e **Vite**  
> Projetada para ser a fundação de múltiplos aplicativos

---

## ✨ Características

- ⚡ **Vite** - Build rápido e HMR instantâneo
- 🎯 **Vue 3 Composition API** - Moderna e reativa
- 📘 **TypeScript** - Type-safe
- 🎨 **Sistema de Design Atômico** - Variáveis CSS customizáveis
- 🌓 **Temas Dinâmicos** - Light/Dark mode ready
- 📦 **Feature-based** - Arquitetura modular
- ♿ **Acessível** - Padrões de acessibilidade
- 🚀 **Performance** - Lazy loading e otimizações

---

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 📖 Documentação

Consulte **[ARCHITECTURE.md](./ARCHITECTURE.md)** para:

- Estrutura detalhada de pastas
- Sistema de design (variáveis CSS, mixins)
- Padrões de desenvolvimento
- Roadmap e próximos passos

---

## 🎨 Sistema de Estilos

### Variáveis CSS Disponíveis

```css
/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg...

/* Typography */
--font-size-xs, --font-size-sm, --font-size-md...
--font-weight-regular, --font-weight-medium...

/* Colors */
--color-bg-primary, --color-text-primary...
--color-primary, --color-secondary...

/* Outros */
--radius-sm, --radius-md, --radius-lg...
--transition-fast, --transition-base...
```

### Mixins SCSS

```scss
@import "@/styles/utils/mixins.scss";

.component {
  @include flex-center;
  @include mobile {
    // Mobile styles
  }
}
```

---

Contém a lógica fundamental e configurações que sustentam toda a aplicação.

### Shared

Recursos verdadeiramente genéricos que podem ser usados em qualquer lugar.

### Features

Cada feature representa um tipo de componente UI (botões, cards, etc.) e é auto-contida com seus próprios components, composables e types.

### Layouts

Sistema de layouts hierárquicos e reutilizáveis.

### Views

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
