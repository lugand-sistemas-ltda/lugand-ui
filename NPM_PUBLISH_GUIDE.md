# 🚀 INSTRUÇÕES FINAIS - Publicação no NPM

## ✅ O QUE JÁ FOI FEITO

1. ✅ `package.json` atualizado com:
   - `"private": false`
   - `"version": "0.1.2"` (sincronizado com última tag)
   - `publishConfig` para pacote público
   - `prepublishOnly` script
   - Informações do repositório

2. ✅ Workflow GitHub Actions criado (`.github/workflows/publish.yml`)
   - Trigger em tags `v*.*.*`
   - Build automático
   - Publicação no npm

3. ✅ Build testado e funcionando
   - Tarball gerado: `lugand-vue-ui-lib-0.1.2.tgz`

4. ✅ Commit e push para `main` feitos

---

## 🔑 PRÓXIMOS PASSOS (VOCÊ FAZ AGORA)

### **PASSO 1: Configurar NPM Token no GitHub** ⚠️ CRÍTICO

1. **Gerar token no npm:**
   - Acesse: https://www.npmjs.com/settings/YOUR-USERNAME/tokens
   - Clique "Generate New Token" → "Classic Token"
   - Tipo: **Automation** (recomendado para CI/CD)
   - Clique "Generate Token"
   - **COPIE O TOKEN** (será mostrado apenas uma vez!)

2. **Adicionar secret no GitHub:**
   - Acesse: https://github.com/lugand-sistemas-ltda/lugand-ui/settings/secrets/actions
   - Clique "New repository secret"
   - **Name:** `NPM_TOKEN`
   - **Secret:** Cole o token do npm
   - Clique "Add secret"

---

### **PASSO 2: Criar e Publicar a Tag**

```bash
# Na pasta do projeto
cd /home/heremit/Desktop/vue/lugand-ui

# Criar tag v0.1.3 (próxima versão)
git tag -a v0.1.3 -m "Release v0.1.3 - Dropdown component + npm publish setup"

# Push da tag para o GitHub
git push origin v0.1.3
```

**O que acontece após o push:**

1. GitHub Actions detecta a tag `v0.1.3`
2. Workflow inicia automaticamente
3. Faz checkout, instala deps, build
4. Publica no npm com o token
5. Pacote fica disponível em: https://www.npmjs.com/package/@lugand-sistemas-ltda/vue-ui-lib

---

### **PASSO 3: Verificar Publicação**

1. **Acompanhar workflow:**
   - https://github.com/lugand-sistemas-ltda/lugand-ui/actions
   - Aguardar conclusão (2-3 minutos)

2. **Confirmar no npm:**
   ```bash
   npm view @lugand-sistemas-ltda/vue-ui-lib
   ```

---

### **PASSO 4: Testar Instalação em Outro Projeto**

```bash
# Em outro projeto Vue 3
npm install @lugand-sistemas-ltda/vue-ui-lib
```

**No projeto, configurar:**

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import "@lugand-sistemas-ltda/vue-ui-lib/dist/style.css"; // ← IMPORTANTE!

createApp(App).mount("#app");
```

**Usar componente:**

```vue
<script setup lang="ts">
import { Tabs, TabPanel } from "@lugand-sistemas-ltda/vue-ui-lib";
</script>

<template>
  <Tabs>
    <TabPanel id="tab1" title="Tab 1"> Conteúdo 1 </TabPanel>
    <TabPanel id="tab2" title="Tab 2"> Conteúdo 2 </TabPanel>
  </Tabs>
</template>
```

---

## 🔄 FLUXO PARA PRÓXIMAS VERSÕES

### **Atualizar versão e publicar:**

```bash
# 1. Fazer alterações no código
# 2. Commitar mudanças
git add .
git commit -m "feat: novo componente X"
git push origin main

# 3. Atualizar versão no package.json
cd packages/ui-lib
npm version patch  # 0.1.3 → 0.1.4 (bug fixes)
# ou
npm version minor  # 0.1.3 → 0.2.0 (new features)
# ou
npm version major  # 0.1.3 → 1.0.0 (breaking changes)

# 4. Push da tag
git push origin main --follow-tags

# 5. GitHub Actions publica automaticamente!
```

---

## 📋 CHECKLIST FINAL

Antes de criar a tag v0.1.3, confirme:

- [ ] Token npm criado
- [ ] Secret `NPM_TOKEN` adicionado no GitHub
- [ ] Workflow arquivo existe em `.github/workflows/publish.yml`
- [ ] Branch `main` está atualizada (`git pull origin main`)
- [ ] Build local funciona (`npm run build:lib`)

**Quando tudo estiver ✅, execute:**

```bash
git tag -a v0.1.3 -m "Release v0.1.3"
git push origin v0.1.3
```

**E aguarde a mágica acontecer! 🎉**

---

## 🆘 TROUBLESHOOTING

**Erro: "npm ERR! code E401" no workflow**

- Token inválido ou expirado
- Verificar secret `NPM_TOKEN` no GitHub

**Erro: "npm ERR! 402 Payment Required"**

- Pacote com nome não-scoped requer conta paga
- Use `@lugand-sistemas-ltda/vue-ui-lib` (scoped = grátis)

**Erro: "npm ERR! 403 Forbidden"**

- Nome já existe no npm
- Verificar: `npm view @lugand-sistemas-ltda/vue-ui-lib`

**Workflow não inicia:**

- Verificar se a tag foi feita na branch `main`
- Verificar formato da tag: `v*.*.*` (ex: v0.1.3)

---

## 📞 SUPORTE

Se algo der errado, me envie:

1. URL do workflow no GitHub Actions
2. Logs de erro completos
3. Comando que executou

**Boa sorte com a publicação! 🚀**
