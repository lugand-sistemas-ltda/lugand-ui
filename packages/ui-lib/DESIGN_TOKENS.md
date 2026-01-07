# 🎨 Sistema de Design Tokens e Temas

## 📐 Arquitetura de Cores

### 1. **Design Tokens Globais** (não mudam por tema)

Localizados em: `src/styles/tokens/colors.scss`

#### Status Colors (Semânticas - UX crítico)

Cores que **NÃO mudam** entre temas para manter consistência de UX:

```scss
// Success (verde) - sempre verde em qualquer tema
--color-success         // Base
--color-success-light   // Variação clara
--color-success-dark    // Variação escura

// Warning (amarelo/laranja) - sempre amarelo
--color-warning
--color-warning-light
--color-warning-dark

// Error (vermelho) - sempre vermelho
--color-error
--color-error-light
--color-error-dark

// Info (azul) - sempre azul
--color-info
--color-info-light
--color-info-dark
```

**Por quê globais?**

- ✅ Usuário **reconhece imediatamente** a função (vermelho = perigo)
- ✅ Consistência entre apps/features
- ✅ Acessibilidade e padrões de UX
- ✅ Não faz sentido "error" ser verde no tema forest

---

### 2. **Cores Temáticas** (mudam por tema)

Localizados em: `src/styles/themes/*.scss`

Cada tema define suas próprias cores **estéticas** usando **HSL** para flexibilidade:

#### Por que HSL?

```scss
// Definindo HUE e SATURATION base
--primary-h: 217; // Azul
--primary-s: 91%; // Saturação

// Criando escala completa (50-950 como Tailwind)
--primary-50: hsl(var(--primary-h), calc(var(--primary-s) * 0.9), 97%);
--primary-100: hsl(var(--primary-h), var(--primary-s), 94%);
--primary-200: hsl(var(--primary-h), var(--primary-s), 87%);
// ... até
--primary-950: hsl(var(--primary-h), calc(var(--primary-s) * 0.7), 18%);
```

**Vantagens:**

- 🎨 **Criar ranges completos** (50-950) de uma cor
- 🔧 **Ajustar facilmente** mudando apenas H ou S
- 🌈 **Variações automáticas** (light, dark, hover, active)
- 📊 **Consistência matemática** entre tonalidades

---

## 🎯 Estrutura de Paletas por Tema

### Neutral Palette (escala de cinzas)

```scss
--neutral-50   // Mais claro
--neutral-100
// ...
--neutral-900
--neutral-950  // Mais escuro
```

Usadas para:

- Backgrounds (`--color-bg-primary`, `--color-bg-secondary`)
- Text (`--color-text-primary`, `--color-text-secondary`)
- Borders (`--color-border-light`, `--color-border-base`)

### Primary Palette (cor principal do tema)

```scss
--primary-50   // Mais claro
--primary-500  // Base (cor principal)
--primary-950  // Mais escuro
```

Usadas para:

- Botões primários
- Links
- Elementos de destaque

### Secondary Palette (cor secundária do tema)

```scss
--secondary-50   // Mais claro
--secondary-500  // Base
--secondary-950  // Mais escuro
```

---

## 📦 Como Usar

### Em componentes simples:

```scss
.my-component {
  // Cores semânticas (padrão)
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-base);

  // Status (globais)
  &.success {
    color: var(--color-success);
  }

  &.error {
    color: var(--color-error);
  }
}
```

### Em componentes complexos (usando ranges):

```scss
.card {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);

  &__header {
    background: var(--primary-100);
    color: var(--primary-900);
  }

  &:hover {
    background: var(--primary-100);
    border-color: var(--primary-300);
  }

  &--highlighted {
    background: var(--primary-500);
    color: white;

    &:hover {
      background: var(--primary-600);
    }
  }
}
```

### Gradientes:

```scss
.gradient-card {
  background: linear-gradient(135deg, var(--primary-400), var(--secondary-500));
}
```

---

## 🛠️ Como Criar Novo Tema

1. **Copie um tema existente**

   ```bash
   cp src/styles/themes/default.scss src/styles/themes/sunset.scss
   ```

2. **Defina HUE e Saturation**

   ```scss
   [data-theme="sunset"] {
     // Primary: Laranja
     --primary-h: 25; // Laranja no círculo de cores
     --primary-s: 95%;

     // Secondary: Rosa
     --secondary-h: 340; // Rosa
     --secondary-s: 80%;
   }
   ```

3. **Importe no main.scss**

   ```scss
   @use "./themes/sunset.scss";
   ```

4. **Adicione no TypeScript** (apenas metadados!)

   ```typescript
   // src/core/types/theme.types.ts
   export type ThemeName = "light" | "dark" | "ocean" | "forest" | "sunset";

   // src/core/config/themes.config.ts
   export const sunsetTheme: Theme = {
     name: "sunset",
     displayName: "Sunset",
   };

   export const themes: Record<ThemeName, Theme> = {
     // ... outros temas
     sunset: sunsetTheme,
   };
   ```

   **⚠️ IMPORTANTE:** Não coloque cores aqui! As cores estão no SCSS.
   TypeScript é apenas para type-safety e metadata (nome, displayName).

---

## 🎨 Referência de HUE (círculo de cores)

```
0°   - Vermelho
30°  - Laranja
60°  - Amarelo
120° - Verde
180° - Cyan/Azul-esverdeado
240° - Azul
300° - Magenta/Roxo
360° - Vermelho (volta ao início)
```

**Exemplos práticos:**

- **Ocean**: Primary H=199 (cyan), Secondary H=180 (teal)
- **Forest**: Primary H=142 (verde), Secondary H=158 (esmeralda)
- **Dark**: Primary H=213 (azul), Secondary H=250 (roxo)

---

## ✅ Melhores Práticas

### ✓ Faça:

- Use `--color-success/warning/error` para status
- Use paletas completas (50-950) para componentes complexos
- Teste contraste de texto (WCAG AA no mínimo)
- Use HSL para facilitar ajustes

### ✗ Evite:

- Mudar cores de status por tema (confunde usuário)
- Hardcode de cores (#3b82f6)
- Criar variáveis CSS únicas sem propósito
- Ignorar paletas neutras

---

## 📊 Diagrama de Hierarquia

```
┌─────────────────────────────────────┐
│   Design Tokens Globais             │
│   (cores funcionais/status)         │
│   • Success, Warning, Error, Info   │
└─────────────────────────────────────┘
              ↓ Não muda
┌─────────────────────────────────────┐
│   Temas (cores estéticas)           │
│   • Light, Dark, Ocean, Forest...   │
│   • Primary, Secondary, Neutral     │
│   • Paletas 50-950 com HSL          │
└─────────────────────────────────────┘
              ↓ Aplica
┌─────────────────────────────────────┐
│   Componentes                       │
│   • Usam variáveis CSS              │
│   • Respondem a mudanças de tema    │
│   • Consistentes e reutilizáveis    │
└─────────────────────────────────────┘
```

---

**Última atualização**: Dezembro 2025
