# 🚀 Guia de Publicação NPM - Lugand UI

Guia completo e atualizado para publicar novas versões da biblioteca no npm via GitHub Actions.

---

## 📋 PRÉ-REQUISITOS (CONFIGURAÇÃO ÚNICA)

### ✅ O QUE JÁ ESTÁ CONFIGURADO

1. ✅ `package.json` configurado corretamente:
   - `"private": false`
   - `"name": "@lugand-sistemas-ltda/vue-ui-lib"` (scoped package)
   - `publishConfig` para pacote público com provenance
   - `prepublishOnly` script para build automático

2. ✅ Workflow GitHub Actions (`.github/workflows/publish.yml`):
   - Trigger automático em tags `v*.*.*`
   - Node.js 20 (requerido pelo Vite)
   - Build da biblioteca (`npm run build:lib`)
   - Publicação automática no npm com provenance

3. ✅ Build configurado:
   - Comando: `npm run build:lib` (usa `vite.config.lib.ts`)
   - Output: `dist/vue-ui-lib.js` + `dist/style.css`
   - TypeScript strict mode com vue-tsc

---

### 🔑 PASSO ÚNICO: Configurar NPM Token no GitHub (se ainda não fez)

1. **Gerar token no npm:**
   - Acesse: https://www.npmjs.com/settings/YOUR-USERNAME/tokens
   - Clique "Generate New Token" → "Classic Token"
   - Tipo: **Automation** (para CI/CD)
   - **COPIE O TOKEN** (mostrado apenas uma vez!)

2. **Adicionar secret no GitHub:**
   - Acesse: https://github.com/lugand-sistemas-ltda/lugand-ui/settings/secrets/actions
   - Clique "New repository secret"
   - **Name:** `NPM_TOKEN`
   - **Secret:** Cole o token do npm
   - Clique "Add secret"

---

## 🚀 PUBLICAR NOVA VERSÃO (FLUXO PADRÃO)

### 1️⃣ Fazer Alterações e Commitar

```bash
cd /home/heremit/Desktop/vue/lugand-ui

# Fazer alterações no código
# Testar localmente: npm run build:lib

# Commitar mudanças
git add .
git commit -m "feat: adiciona novos componentes X, Y, Z"
git push origin main
```

---

### 2️⃣ Atualizar Versão no package.json

```bash
cd packages/ui-lib

# Editar manualmente o package.json
# Ou usar npm version (cria commit + tag automaticamente):
npm version patch   # 0.1.5 → 0.1.6 (bug fixes)
npm version minor   # 0.1.5 → 0.2.0 (new features)
npm version major   # 0.1.5 → 1.0.0 (breaking changes)
```

**⚠️ IMPORTANTE:** Se usar `npm version`, ele já cria a tag! Pule para o passo 4.

**Se editou manualmente**, commitar a mudança:

```bash
git add packages/ui-lib/package.json
git commit -m "chore: bump version to 0.1.6"
git push origin main
```

---

### 3️⃣ Criar Tag de Release

```bash
# Criar tag anotada com mensagem descritiva
git tag -a v0.1.6 -m "Release v0.1.6

- Adiciona componentes PageHeader, FilterSidebar, DataToolbar
- Corrige bugs de paginação
- Melhora documentação"

# ⚠️ Se a tag já existir localmente, delete primeiro:
git tag -d v0.1.6

# ⚠️ Se a tag já existir no GitHub, delete remotamente:
git push origin :refs/tags/v0.1.6
```

---

### 4️⃣ Enviar Tag para GitHub (INICIA PUBLICAÇÃO)

```bash
# Push da tag - ISSO INICIA O WORKFLOW!
git push origin v0.1.6

# Ou push com --follow-tags se usou npm version:
git push origin main --follow-tags
```

**✨ O QUE ACONTECE AUTOMATICAMENTE:**

1. ✅ GitHub detecta tag `v*.*.*`
2. ✅ Workflow inicia (`.github/workflows/publish.yml`)
3. ✅ Checkout do código na tag
4. ✅ Setup Node.js 20
5. ✅ `npm ci` (instala deps)
6. ✅ `npm run build:lib` (build otimizado)
7. ✅ `npm publish --provenance` (publica no npm)
8. ✅ Pacote disponível em ~5-10 minutos!

---

### 5️⃣ Verificar Publicação

**Acompanhar workflow:**
- URL: https://github.com/lugand-sistemas-ltda/lugand-ui/actions
- Aguardar conclusão (5-10 minutos)

**Confirmar no npm:**
```bash
npm view @lugand-sistemas-ltda/vue-ui-lib version
# Deve mostrar a nova versão (ex: 0.1.6)

```bash
npm view @lugand-sistemas-ltda/vue-ui-lib version
# Deve mostrar a nova versão (ex: 0.1.6)

# Ver todas as informações do pacote:
npm view @lugand-sistemas-ltda/vue-ui-lib
```

**Verificar no npm registry:**
- URL: https://www.npmjs.com/package/@lugand-sistemas-ltda/vue-ui-lib

---

## 🔄 ATUALIZAR TAG EXISTENTE (CASO NECESSÁRIO)

Se precisar mover uma tag para outro commit (ex: corrigir algo após criar a tag):

```bash
# 1. Deletar tag localmente
git tag -d v0.1.6

# 2. Deletar tag no GitHub
git push origin :refs/tags/v0.1.6

# 3. Criar nova tag no commit atual (HEAD)
git tag -a v0.1.6 -m "Release v0.1.6 - (atualizado com correções)"

# 4. Enviar tag (re-inicia workflow)
git push origin v0.1.6
```

**⚠️ ATENÇÃO:** Mover uma tag já publicada pode causar inconsistências. Use apenas se a publicação ainda não foi concluída!

---

## 📦 TESTAR PACOTE PUBLICADO

```bash
# Em outro projeto Vue 3
npm install @lugand-sistemas-ltda/vue-ui-lib

# Ou forçar reinstalar a versão mais recente:
npm install @lugand-sistemas-ltda/vue-ui-lib@latest
```

**Configurar no projeto:**

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// IMPORTANTE: Importar estilos da lib!
import '@lugand-sistemas-ltda/vue-ui-lib/dist/style.css'

createApp(App).mount('#app')
```

**Usar componente:**

```vue
<script setup lang="ts">
import { Button, Card, DataTable } from '@lugand-sistemas-ltda/vue-ui-lib'
</script>

<template>
  <Card>
    <h2>Teste da Biblioteca</h2>
    <Button variant="primary">Clique aqui</Button>
  </Card>
</template>
```

---

## 🛠️ COMANDOS RÁPIDOS

```bash
# Verificar versão local
cat packages/ui-lib/package.json | grep '"version"'

# Build local antes de publicar
npm run build:lib

# Verificar tamanho do bundle
du -sh packages/ui-lib/dist/

# Listar todas as tags locais
git tag -l

# Listar todas as tags remotas
git ls-remote --tags origin

# Ver últimas versões publicadas no npm
npm view @lugand-sistemas-ltda/vue-ui-lib versions --json

# Ver última versão publicada
npm view @lugand-sistemas-ltda/vue-ui-lib version
```

---

## ⚠️ TROUBLESHOOTING

### ❌ Erro: "npm ERR! code E401" no workflow
**Causa:** Token npm inválido ou expirado

**Solução:**
1. Gerar novo token no npm: https://www.npmjs.com/settings/YOUR-USERNAME/tokens
2. Atualizar secret `NPM_TOKEN` no GitHub
3. Reenviar tag: `git push origin :refs/tags/vX.X.X && git push origin vX.X.X`

---

### ❌ Erro: "npm ERR! 403 Forbidden"
**Causa:** Nome do pacote já existe ou sem permissão

**Solução:**
- Verificar se o pacote existe: `npm view @lugand-sistemas-ltda/vue-ui-lib`
- Confirmar que você tem permissão de publicar no scope `@lugand-sistemas-ltda`

---

### ❌ Erro: "Vite requires Node.js version 20.19+ or 22.12+"
**Causa:** Workflow usando Node.js 18

**Solução:** ✅ JÁ CORRIGIDO - Workflow usa Node.js 20

---

### ❌ Workflow não inicia
**Causa:** Tag no formato errado ou não na branch `main`

**Checklist:**
- [ ] Tag segue formato `v*.*.*` (ex: v0.1.6, não 0.1.6)
- [ ] Tag foi criada a partir da branch `main`
- [ ] Tag foi enviada com `git push origin vX.X.X`

---

### ❌ Build falha localmente
```bash
# Limpar e rebuildar
cd packages/ui-lib
rm -rf dist node_modules
cd ../..
npm install
npm run build:lib
```

---

## 📊 CHECKLIST PRÉ-PUBLICAÇÃO

Antes de criar a tag, confirme:

- [ ] ✅ Token npm criado e secret `NPM_TOKEN` configurado no GitHub
- [ ] ✅ Código testado e funcionando
- [ ] ✅ Build local executado com sucesso: `npm run build:lib`
- [ ] ✅ TypeScript sem erros: `cd packages/ui-lib && npm run type-check`
- [ ] ✅ Versão atualizada no `packages/ui-lib/package.json`
- [ ] ✅ Mudanças commitadas e enviadas para `main`
- [ ] ✅ Workflow `.github/workflows/publish.yml` existe e está correto
- [ ] ✅ Branch `main` atualizada: `git pull origin main`

**Quando tudo estiver ✅:**

```bash
git tag -a v0.1.6 -m "Release v0.1.6 - descrição das mudanças"
git push origin v0.1.6
```

**Aguarde ~5-10 minutos e verifique:**
- https://github.com/lugand-sistemas-ltda/lugand-ui/actions
- https://www.npmjs.com/package/@lugand-sistemas-ltda/vue-ui-lib

---

## 🎯 RESUMO DO FLUXO

```
1. Fazer alterações → Commitar → Push
                ↓
2. Atualizar version no package.json → Commitar → Push
                ↓
3. Criar tag: git tag -a vX.X.X -m "Release vX.X.X"
                ↓
4. Enviar tag: git push origin vX.X.X
                ↓
5. GitHub Actions → Build → Publish npm
                ↓
6. ✅ Pacote disponível no npm!
```

---

## 📚 VERSIONAMENTO SEMÂNTICO

- **PATCH** (0.1.5 → 0.1.6): Bug fixes, pequenas correções
- **MINOR** (0.1.6 → 0.2.0): Novos recursos, não quebra compatibilidade
- **MAJOR** (0.2.0 → 1.0.0): Breaking changes, quebra compatibilidade

---

**Última atualização:** 15/02/2026 (v0.1.5)  
**Versão do Guia:** 2.0.0

**🚀 Boa publicação!**
