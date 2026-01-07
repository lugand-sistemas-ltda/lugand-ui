# 🔄 Workflow de Desenvolvimento - Lugand UI

Guia prático para trabalhar no monorepo dia a dia.

---

## 📁 Navegação Rápida

### Abrir o Projeto

```bash
# Abrir workspace raiz no VS Code
code /home/heremit/Desktop/vue/lugand-ui

# Ou criar aliases no seu .bashrc/.zshrc:
alias lugand='cd /home/heremit/Desktop/vue/lugand-ui && code .'
```

### Navegação entre Workspaces

```bash
# Raiz
cd /home/heremit/Desktop/vue/lugand-ui

# Biblioteca
cd packages/ui-lib

# App de testes
cd packages/test-ui-lib

# Voltar para raiz
cd ../..
```

---

## 🚀 Workflow: Criar Novo Componente

### 1. Criar o Componente

```bash
cd /home/heremit/Desktop/vue/lugand-ui/packages/ui-lib

# Componente primitivo
touch src/shared/components/primitives/NovoComponente.vue

# Componente de navegação
touch src/shared/components/navigation/NovoNav.vue

# Módulo complexo
mkdir src/modules/NovoModulo
touch src/modules/NovoModulo/NovoModulo.vue
touch src/modules/NovoModulo/types.ts
```

### 2. Implementar o Componente

```vue
<!-- src/shared/components/primitives/NovoComponente.vue -->
<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="novo-componente">
    {{ label }}
  </div>
</template>

<style scoped>
.novo-componente {
  /* Usar design tokens */
  color: var(--color-text);
  background: var(--color-background);
}
</style>
```

### 3. Exportar no lib/index.ts

```typescript
// packages/ui-lib/lib/index.ts
export { default as NovoComponente } from "../src/shared/components/primitives/NovoComponente.vue";
```

### 4. Testar no Showcase (ui-lib)

```bash
npm run dev:lib
# Abrir http://localhost:5174
```

Criar view de teste em `src/views/ui/simple/`:

```vue
<!-- src/views/ui/simple/NovoComponenteView.vue -->
<script setup lang="ts">
import NovoComponente from "@/shared/components/primitives/NovoComponente.vue";
</script>

<template>
  <ComponentShowcase title="Novo Componente">
    <NovoComponente label="Teste" />
  </ComponentShowcase>
</template>
```

### 5. Testar no App de Testes (test-ui-lib)

```bash
npm run dev
# Abrir http://localhost:5173
```

Usar o componente:

```vue
<script setup lang="ts">
import { NovoComponente } from "@lugand/vue-ui-lib";
</script>

<template>
  <NovoComponente label="Teste no App" />
</template>
```

### 6. Build e Verificação

```bash
# Build da biblioteca
npm run build:lib

# Verificar se exportou corretamente
cat packages/ui-lib/dist/lib/index.d.ts | grep NovoComponente
```

### 7. Documentar

Adicionar no README.md da biblioteca:

```markdown
### NovoComponente

Descrição breve.

**Props:**

- `label` (string): Descrição

**Exemplo:**
\`\`\`vue
<NovoComponente label="Texto" />
\`\`\`
```

---

## 🎨 Workflow: Criar Novo Tema

### 1. Criar o Arquivo de Tema

```bash
cd packages/ui-lib
touch src/styles/themes/novo-tema.scss
```

### 2. Definir as Variáveis

```scss
// src/styles/themes/novo-tema.scss
[data-theme="novo-tema"] {
  // Cores primárias (HSL)
  --color-primary-h: 200;
  --color-primary-s: 70%;
  --color-primary-l: 50%;

  // Background
  --color-background-h: 0;
  --color-background-s: 0%;
  --color-background-l: 100%;

  // Text
  --color-text-h: 0;
  --color-text-s: 0%;
  --color-text-l: 10%;

  // ... outras variáveis
}
```

### 3. Importar no main.scss

```scss
// src/styles/main.scss
@use "./themes/novo-tema.scss";
```

### 4. Adicionar na Configuração

```typescript
// src/core/config/themes.config.ts
export const themes = {
  // ... outros temas
  "novo-tema": {
    name: "Novo Tema",
    description: "Descrição do tema",
  },
} as const;
```

### 5. Testar

```bash
npm run dev:lib
# Selecionar o novo tema no ThemeSelector
```

### 6. Build e Verificar

```bash
npm run build:lib
# Verificar se o CSS inclui o novo tema
cat packages/ui-lib/dist/style.css | grep novo-tema
```

---

## 🔧 Workflow: Atualizar Dependências

### Adicionar Nova Dependência

```bash
# Na biblioteca (peer dependency)
npm install <package> --workspace=@lugand/vue-ui-lib

# No app de testes
npm install <package> --workspace=test-ui-lib

# Dependência de desenvolvimento (raiz)
npm install -D <package>
```

### Atualizar Dependências

```bash
# Ver quais estão outdated
npm outdated --workspaces

# Atualizar tudo
npm update --workspaces

# Atualizar específica
npm update <package> --workspace=@lugand/vue-ui-lib
```

### Remover Dependência

```bash
npm uninstall <package> --workspace=@lugand/vue-ui-lib
```

---

## 🐛 Workflow: Debug de Problemas

### Problema: Componente não aparece no test-ui-lib

**Diagnóstico:**

```bash
# 1. Verificar se está exportado
cat packages/ui-lib/lib/index.ts | grep NovoComponente

# 2. Verificar se o build incluiu
npm run build:lib
cat packages/ui-lib/dist/lib/index.d.ts | grep NovoComponente

# 3. Verificar symlink
ls -la packages/test-ui-lib/node_modules/@lugand/
```

**Solução:**

```bash
# Reinstalar
npm run clean
npm install
npm run build:lib
```

### Problema: Tipos TypeScript não encontrados

**Diagnóstico:**

```bash
# Verificar tsconfig
cat packages/test-ui-lib/tsconfig.app.json

# Verificar se tipos foram gerados
ls packages/ui-lib/dist/lib/
```

**Solução:**

```bash
# Regenerar tipos
cd packages/ui-lib
npm run build:lib
```

### Problema: Estilos não aplicados

**Diagnóstico:**

```bash
# Verificar se o CSS está sendo importado
cat packages/test-ui-lib/src/main.ts

# Verificar se o CSS foi gerado
ls -lh packages/ui-lib/dist/style.css
```

**Solução:**

```typescript
// main.ts
import "@lugand/vue-ui-lib/dist/style.css";
```

---

## 📦 Workflow: Preparar para Publicação

### 1. Atualizar Versão

```bash
cd packages/ui-lib

# Patch (0.1.0 -> 0.1.1)
npm version patch

# Minor (0.1.0 -> 0.2.0)
npm version minor

# Major (0.1.0 -> 1.0.0)
npm version major
```

### 2. Atualizar Changelog

```bash
# Editar CHANGELOG.md
code CHANGELOG.md
```

### 3. Build Final

```bash
npm run build:lib

# Verificar tamanhos
du -sh packages/ui-lib/dist/
```

### 4. Testar Localmente

```bash
cd packages/ui-lib

# Criar tarball
npm pack

# Testar instalação local
npm install ./lugand-vue-ui-lib-0.1.0.tgz
```

### 5. Publicar

```bash
# Login no npm (primeira vez)
npm login

# Publicar (scoped package público)
npm publish --access public
```

### 6. Git Tag

```bash
cd /home/heremit/Desktop/vue/lugand-ui
git tag v0.1.0
git push origin v0.1.0
```

---

## 🔄 Workflow: Git

### Commits

```bash
# Commit de feature
git add .
git commit -m "feat: adicionar componente NovoComponente"

# Commit de fix
git commit -m "fix: corrigir estilo do Button"

# Commit de docs
git commit -m "docs: atualizar README com novo componente"
```

### Branches

```bash
# Feature branch
git checkout -b feature/novo-componente

# Bugfix branch
git checkout -b fix/corrigir-button

# Merge de volta
git checkout main
git merge feature/novo-componente
```

---

## ⚡ Atalhos e Dicas

### VS Code Tasks

Criar `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Dev: test-ui-lib",
      "type": "shell",
      "command": "npm run dev",
      "problemMatcher": []
    },
    {
      "label": "Build: ui-lib",
      "type": "shell",
      "command": "npm run build:lib",
      "problemMatcher": ["$tsc"]
    }
  ]
}
```

### Shell Aliases

Adicionar ao `~/.bashrc` ou `~/.zshrc`:

```bash
# Lugand UI
alias lugand='cd /home/heremit/Desktop/vue/lugand-ui'
alias lugand-lib='cd /home/heremit/Desktop/vue/lugand-ui/packages/ui-lib'
alias lugand-test='cd /home/heremit/Desktop/vue/lugand-ui/packages/test-ui-lib'
alias lugand-dev='cd /home/heremit/Desktop/vue/lugand-ui && npm run dev'
alias lugand-build='cd /home/heremit/Desktop/vue/lugand-ui && npm run build:lib'
```

### Watch Mode (Desenvolvimento Contínuo)

```bash
# Terminal 1: Dev server do test-ui-lib
npm run dev

# Terminal 2: Watch mode do build (quando implementado)
# npm run build:lib --watch
```

---

## 📊 Monitoramento de Tamanho

```bash
# Tamanho do bundle
du -sh packages/ui-lib/dist/vue-ui-lib.js

# Tamanho do CSS
du -sh packages/ui-lib/dist/style.css

# Análise de bundle (adicionar plugin)
npm install -D rollup-plugin-visualizer
```

---

## 🎯 Checklist Diário

Antes de commitar:

- [ ] `npm run build:lib` - Sem erros
- [ ] `npm run type-check` - Sem erros
- [ ] Testar no showcase (`npm run dev:lib`)
- [ ] Testar no app de testes (`npm run dev`)
- [ ] Atualizar documentação
- [ ] Commit com mensagem descritiva

---

**Última atualização**: 06/01/2026
