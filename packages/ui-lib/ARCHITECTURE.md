# 🏗️ Arquitetura e Estrutura do Projeto

## 📋 Visão Geral

Este é um **UI Component Library** construído com Vue 3 + Vite + TypeScript, projetado para ser uma base reutilizável para múltiplos aplicativos.

### Características Principais

- ⚡ **Minimalista**: Código limpo e sem poluição
- 🎯 **Atômica**: Sistema de design baseado em variáveis CSS customizáveis
- 🔧 **Escalável**: Arquitetura preparada para crescimento
- 🎨 **Temática**: Sistema de temas dinâmicos (light/dark)
- 📦 **Feature-based**: Organização modular

---

## 🗂️ Estrutura de Pastas

```
src/
├── core/                    # Configurações e utilitários base
│   ├── config/             # Configurações globais
│   ├── constants/          # Constantes da aplicação
│   ├── types/              # Tipos TypeScript globais
│   └── utils/              # Funções utilitárias
│
├── features/               # Features modulares (futuro)
│   └── [feature-name]/
│       ├── components/     # Componentes da feature
│       ├── composables/    # Composables específicos
│       ├── types/          # Tipos da feature
│       └── index.ts        # Exports da feature
│
├── layouts/                # Layouts de página
│   └── DefaultLayout.vue   # Layout padrão
│
├── router/                 # Configuração de rotas
│   └── index.ts
│
├── shared/                 # Recursos compartilhados
│   ├── components/         # Componentes reutilizáveis
│   ├── composables/        # Composables globais
│   └── directives/         # Diretivas Vue customizadas
│
├── styles/                 # Estilos globais
│   ├── base/              # Reset e estilos base
│   ├── themes/            # Temas (light/dark/custom)
│   ├── utils/             # Variáveis, mixins, funções
│   └── main.scss          # Entry point de estilos
│
└── views/                  # Views de página
    └── HomeView.vue
```

---

## 🎨 Sistema de Design

### Variáveis CSS (Design Tokens)

Todas as variáveis estão em `src/styles/utils/variables.scss`:

- **Spacing**: `--spacing-xs` até `--spacing-3xl`
- **Typography**: `--font-size-*`, `--font-weight-*`, `--line-height-*`
- **Border Radius**: `--radius-*`
- **Transitions**: `--transition-*`
- **Z-index**: `--z-*`

### Cores Semânticas

Definidas em `src/styles/themes/default.scss`:

- **Background**: `--color-bg-primary/secondary/tertiary`
- **Text**: `--color-text-primary/secondary/tertiary`
- **Border**: `--color-border-light/base/dark`
- **Brand**: `--color-primary/secondary`
- **Status**: `--color-success/warning/error/info`

### Mixins SCSS

Disponíveis em `src/styles/utils/mixins.scss`:

- `@mixin flex-center` - Centralização flex
- `@mixin flex-column` - Flex em coluna
- `@mixin flex-between` - Space between
- `@mixin mobile/tablet/desktop` - Breakpoints responsivos
- `@mixin truncate` - Texto truncado
- `@mixin custom-scrollbar` - Scrollbar customizada
- `@mixin focus-ring` - Acessibilidade

---

## 🚀 Próximos Passos

### Componentes Atômicos (Futuro)

```
shared/components/
├── atoms/           # Botões, inputs, labels
├── molecules/       # Cards, forms, dropdowns
├── organisms/       # Navbars, sidebars, modals
└── templates/       # Layout templates
```

### Sistema de Temas

- [ ] Theme manager (composable)
- [ ] Persistência de tema (localStorage)
- [ ] Múltiplos temas customizados
- [ ] Transição suave entre temas

### Composables Globais

- [ ] useTheme - Gerenciamento de temas
- [ ] useBreakpoint - Responsive utilities
- [ ] useLocalStorage - Persistência
- [ ] useDebounce/useThrottle - Performance

### Diretivas

- [ ] v-click-outside - Click fora do elemento
- [ ] v-tooltip - Tooltips
- [ ] v-lazy - Lazy loading
- [ ] v-intersection - Intersection observer

---

## 🎯 Padrões de Desenvolvimento

### Componentes

```vue
<script setup lang="ts">
/**
 * ComponentName - Descrição breve
 * @example
 * <ComponentName prop="value" />
 */
import { computed } from "vue";

interface Props {
  // Props tipadas
}

const props = defineProps<Props>();
</script>

<template>
  <!-- Template limpo -->
</template>

<style scoped lang="scss">
// Usar variáveis CSS sempre que possível
// Evitar valores hardcoded
</style>
```

### Composables

```typescript
/**
 * useFeatureName - Descrição
 * @example
 * const { state, action } = useFeatureName()
 */
export function useFeatureName() {
  // Lógica reutilizável
  return {
    // Exports
  };
}
```

---

## 📦 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

---

## 🎓 Filosofia do Projeto

1. **Minimalismo**: Código apenas quando necessário
2. **Atomicidade**: Pequenos blocos reutilizáveis
3. **Escalabilidade**: Preparado para crescer
4. **Manutenibilidade**: Fácil de entender e modificar
5. **Performance**: Otimizado desde o início

---

**Última atualização**: Dezembro 2025
