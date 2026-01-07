# 🎨 Sistema de Temas e Estilos Globais

## ✨ Arquitetura Implementada

### 🎯 Filosofia

- **Estilos globais** para elementos HTML nativos (h1-h6, p, a, button, header, footer, etc)
- **Componentes primitivos** genéricos (Btn, BtnToggle) como base reutilizável
- **Sem estilos escopados** em elementos globais
- **Foco em características essenciais**, não dimensões fixas
- **Múltiplos temas** configurados e funcionais

---

## 🎨 Temas Disponíveis

### 1. **Light** (padrão)

- Background claro (#ffffff)
- Texto escuro (#1a1a1a)
- Brand azul (#3b82f6)

### 2. **Dark**

- Background escuro (#0f0f0f)
- Texto claro (#f5f5f5)
- Brand azul claro (#60a5fa)

### 3. **Ocean**

- Tons de azul e verde-água
- Background (#f0f9ff)
- Brand (#0ea5e9)

### 4. **Forest**

- Tons de verde natureza
- Background (#f0fdf4)
- Brand (#22c55e)

---

## 🧩 Estrutura de Arquivos

```
src/
├── core/
│   ├── config/
│   │   └── themes.config.ts       # Configurações dos 4 temas
│   └── types/
│       └── theme.types.ts         # Tipos TypeScript dos temas
│
├── styles/
│   ├── base/
│   │   ├── reset.scss             # Reset CSS moderno
│   │   └── elements.scss          # Estilos globais de elementos HTML
│   ├── utils/
│   │   ├── variables.scss         # Variáveis CSS (spacing, typography, etc)
│   │   └── mixins.scss            # Mixins SCSS reutilizáveis
│   ├── themes/
│   │   ├── default.scss           # Tema Light
│   │   ├── dark.scss              # Tema Dark
│   │   ├── ocean.scss             # Tema Ocean
│   │   └── forest.scss            # Tema Forest
│   └── main.scss                  # Entry point (importa tudo)
│
└── shared/
    ├── components/
    │   ├── Btn.vue                # Componente botão primitivo
    │   ├── BtnToggle.vue          # Componente toggle primitivo
    │   └── index.ts               # Exports
    └── composables/
        ├── useTheme.ts            # Composable de gerenciamento de temas
        └── index.ts               # Exports
```

---

## 🎨 Elementos HTML Globais Estilizados

### Typography

- `h1` - `h6`: Hierarquia tipográfica configurada
- `p`: Texto secundário com line-height relaxado
- `strong`, `b`, `em`, `i`: Estilos enfatizados
- `small`: Texto menor

### Interactive

- `a`: Links com hover/active states
- `button`: Base neutra (override com classes ou componentes)

### Sections

- `header`: Borda inferior, background elevado
- `footer`: Borda superior, background secundário, texto menor
- `main`: Background primário
- `aside`: Background secundário

### Code

- `code`: Inline code com background
- `pre`: Code blocks com padding e scroll

### Outros

- `hr`: Separator horizontal
- `blockquote`: Citações com borda lateral

---

## 🧩 Componentes Primitivos

### **Btn** (Botão)

Props:

- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'

Exemplo:

```vue
<Btn variant="primary" size="md">Click me</Btn>
<Btn variant="ghost" size="sm">Cancel</Btn>
<Btn variant="danger" disabled>Delete</Btn>
```

### **BtnToggle** (Toggle Switch)

Props:

- `modelValue`: boolean (v-model)
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean

Exemplo:

```vue
<BtnToggle v-model="isDark" size="md">
  Dark Mode
</BtnToggle>
```

---

## 🎛️ Uso do Sistema de Temas

### No código:

```typescript
import { useTheme } from "@/shared/composables";

const { currentTheme, setTheme, toggleDarkMode } = useTheme();

// Mudar tema
setTheme("dark");
setTheme("ocean");
setTheme("forest");

// Toggle dark/light
toggleDarkMode();
```

### Variáveis CSS disponíveis em qualquer componente:

#### Colors

```css
var(--color-bg-primary)
var(--color-bg-secondary)
var(--color-bg-tertiary)
var(--color-bg-elevated)

var(--color-text-primary)
var(--color-text-secondary)
var(--color-text-tertiary)
var(--color-text-inverse)
var(--color-text-muted)

var(--color-border-light)
var(--color-border-base)
var(--color-border-dark)
var(--color-border-focus)

var(--color-primary)
var(--color-primary-hover)
var(--color-primary-active)

var(--color-success)
var(--color-warning)
var(--color-error)
var(--color-info)
```

#### Spacing

```css
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */
var(--spacing-2xl)  /* 48px */
var(--spacing-3xl)  /* 64px */
```

#### Typography

```css
var(--font-size-xs)   /* 12px */
var(--font-size-sm)   /* 14px */
var(--font-size-md)   /* 16px */
var(--font-size-lg)   /* 18px */
var(--font-size-xl)   /* 20px */
var(--font-size-2xl)  /* 24px */
var(--font-size-3xl)  /* 32px */

var(--font-weight-regular)   /* 400 */
var(--font-weight-medium)    /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--font-weight-bold)      /* 700 */

var(--line-height-tight)     /* 1.25 */
var(--line-height-normal)    /* 1.5 */
var(--line-height-relaxed)   /* 1.75 */
```

#### Outros

```css
var(--radius-sm)
var(--radius-md)
var(--radius-lg)
var(--radius-xl)
var(--radius-full)

var(--transition-fast)   /* 150ms */
var(--transition-base)   /* 250ms */
var(--transition-slow)   /* 350ms */

var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)

var(--z-dropdown)
var(--z-modal)
var(--z-tooltip)
/* etc... */
```

---

## 📐 Mixins SCSS Disponíveis

```scss
@use "@/styles/utils/mixins.scss" as mixins;

.component {
  @include mixins.flex-center;
  @include mixins.flex-column;
  @include mixins.flex-between;

  @include mixins.truncate;
  @include mixins.custom-scrollbar;
  @include mixins.focus-ring;

  @include mixins.mobile {
    // Mobile styles
  }

  @include mixins.tablet {
    // Tablet styles
  }

  @include mixins.desktop {
    // Desktop styles
  }
}
```

---

## ✅ Padrões Seguidos

### ✨ Características Globais (elements.scss)

- Foco em **comportamento e estilo**, não dimensões
- Transições suaves entre temas
- Acessibilidade (focus-visible, aria, etc)

### 🧩 Componentes Primitivos

- Props tipadas com TypeScript
- Variantes configuráveis
- Não escopados (reutilizáveis globalmente)
- Base para componentes complexos futuros

### 🎨 Temas

- Paletas completas e coerentes
- Type-safe (TypeScript)
- Persistência automática (localStorage)
- Transições suaves

---

## 🚀 Próximos Passos

Com esta base sólida, você pode:

1. **Criar mais componentes primitivos**

   - Input, Checkbox, Radio, Select
   - Card, Modal, Dropdown
   - Badge, Tag, Tooltip

2. **Criar componentes complexos**

   - Formulários (baseados em Input + Btn)
   - Sidebars (baseados em nav + Btn)
   - Data tables, grids, etc

3. **Adicionar mais temas**

   - Criar novos temas em `themes.config.ts`
   - Adicionar arquivo SCSS correspondente
   - Tudo funcionará automaticamente!

4. **Features específicas**
   - Organizar por pasta de feature
   - Usar primitivos como base
   - Manter consistência visual

---

**Última atualização:** Dezembro 2025
