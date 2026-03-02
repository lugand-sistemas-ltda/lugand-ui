# 🚀 Setup do Lugand UI Monorepo

Guia completo para configurar o ambiente de desenvolvimento.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js**: `^20.19.0` ou `>=22.12.0`
- **npm**: `>=10.0.0`
- **Git**: Qualquer versão recente

### Verificar versões instaladas:

```bash
node --version   # Deve mostrar v20.19+ ou v22.12+
npm --version    # Deve mostrar 10.0+
```

### Instalar Node.js (se necessário):

**Usando nvm (recomendado):**
```bash
# Instalar nvm (se não tiver)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instalar Node.js LTS
nvm install --lts
nvm use --lts
```

**Ou baixar direto:** [nodejs.org](https://nodejs.org/)

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/lugand-sistemas-ltda/lugand-ui.git
cd lugand-ui
```

### 2. Instale as dependências

```bash
npm install
```

**O que acontece:**
- Instala dependências da raiz
- Instala dependências dos workspaces (`packages/ui-lib`, `packages/test-ui-lib`)
- Executa `postinstall` que faz build da lib automaticamente

**⏱️ Tempo estimado:** 2-3 minutos

---

## 🏃 Executando o Projeto

### Servidor de Desenvolvimento (UI Lib)

```bash
npm run dev
# ou
npm run dev:lib
```

Acesse: [http://localhost:5173](http://localhost:5173)

Inicia o servidor Vite com **Hot Module Replacement (HMR)**. Ideal para desenvolver componentes da lib.

### Servidor de Desenvolvimento (App de Teste/Demo)

```bash
npm run dev:test
# ou
npm run dev:demo
```

Inicia o app de teste que consome a lib. Útil para testar integração end-to-end.

**Nota:** O comando `dev:test` faz build da lib antes de iniciar o servidor.

### 🔄 Modo Watch (Desenvolvimento Avançado)

Para desenvolver simultaneamente lib e app de teste:

**Terminal 1 - Watch build da lib:**
```bash
cd packages/ui-lib
npm run dev:watch
```

**Terminal 2 - App de teste:**
```bash
npm run dev:demo
```

Toda mudança em `src/` da lib é automaticamente recompilada. O app de teste precisa ser recarregado manualmente no browser.

---

## 🛠️ Comandos Disponíveis

### Build

```bash
# Build completo da lib (produção)
npm run build:lib

# Build do app de teste
npm run build:test

# Build de tudo (lib + test)
npm run build:all
```

### Type Checking

```bash
# Verificar tipos TypeScript em todos os workspaces
npm run type-check
```

### Limpeza

```bash
# Limpar node_modules e dist de tudo
npm run clean

# Limpar e reinstalar tudo do zero
npm run clean:install
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Cannot find module 'vue-router'"

**Causa:** Dependências não instaladas ou corrompidas.

**Solução:**
```bash
npm run clean:install
```

---

### ❌ Erro: "TypeScript version mismatch"

**Causa:** Conflito de versões entre workspaces.

**Solução:**
```bash
rm -rf node_modules package-lock.json packages/*/node_modules packages/*/package-lock.json
npm install
```

---

### ❌ Erro: "ENOENT: vite.config.ts not found"

**Causa:** Executando comando no diretório errado.

**Solução:**
Certifique-se de estar na **raiz do monorepo**, não dentro de `packages/ui-lib`:

```bash
pwd  # Deve mostrar: /caminho/para/lugand-ui
```

---

### ❌ Erro: "Node version incompatible"

**Causa:** Versão do Node.js não suportada.

**Solução:**
```bash
# Instalar versão correta via nvm
nvm install 20.19.0
nvm use 20.19.0

# Ou atualizar globalmente
brew upgrade node  # macOS
```

---

### ❌ Build funciona mas app não carrega

**Causa:** Build da lib não foi executado antes do dev server.

**Solução:**
```bash
npm run build:lib
npm run dev
```

---

### ⚠️ Warnings sobre peer dependencies

**Exemplo:**
```
npm WARN peer vue@"^3.5.0" from @lugand-sistemas-ltda/vue-ui-lib
```

**Causa:** Versão do Vue no app de teste é diferente da lib.

**Solução:** Geralmente é seguro ignorar. Se causar problemas:
```bash
cd packages/test-ui-lib
npm install vue@^3.5.0
```

---

## 📂 Estrutura do Projeto

```
lugand-ui/                       # Raiz do monorepo
├── package.json                 # Config do workspace
├── SETUP.md                     # Este arquivo
├── .gitignore                   # Git ignore (ÚNICO no monorepo)
├── .nvmrc                       # Versão do Node.js
│
├── packages/
│   ├── ui-lib/                  # Biblioteca principal
│   │   ├── package.json         # Config da lib
│   │   ├── .npmignore           # Arquivos ignorados no publish
│   │   ├── vite.config.lib.ts  # Config de build da lib
│   │   ├── src/                 # Código fonte
│   │   └── dist/                # Build output (gerado)
│   │
│   └── test-ui-lib/             # App de teste/desenvolvimento
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│
└── node_modules/                # Dependências (gitignored)
```

---

## 🔄 Workflow de Desenvolvimento

### 1. Criar uma nova branch

```bash
git checkout -b feature/minha-feature
```

### 2. Desenvolver componente na lib

```bash
# Editar arquivos em packages/ui-lib/src/
npm run dev:lib  # Ver mudanças em tempo real
```

### 3. Testar no app de teste

```bash
# Editar packages/test-ui-lib/src/
npm run dev  # App consome a lib localmente
```

### 4. Fazer build e verificar tipos

```bash
npm run build:lib
npm run type-check
```

### 5. Commit e push

```bash
git add .
git commit -m "feat: adiciona componente XYZ"
git push origin feature/minha-feature
```

---

## 📦 Publicar Nova Versão (Maintainers)

### 1. Atualizar versão

```bash
cd packages/ui-lib
npm version patch  # 0.1.7 → 0.1.8
# ou
npm version minor  # 0.1.7 → 0.2.0
# ou
npm version major  # 0.1.7 → 1.0.0
```

### 2. Build de produção

```bash
npm run build:lib
```

### 3. Publicar no NPM

```bash
cd packages/ui-lib
npm publish
```

---

## 🆘 Suporte

### Documentação

- [README principal](README.md)
- [Docs da lib](packages/ui-lib/README.md)
- [Documentação online](https://lugand-ui.dev) *(em breve)*

### Reportar Issues

- GitHub Issues: [lugand-ui/issues](https://github.com/lugand-sistemas-ltda/lugand-ui/issues)
- Email: suporte@lugand.com.br

---

## ✅ Checklist de Setup Completo

Após instalação, verifique:

- [ ] `npm install` executou sem erros
- [ ] `npm run build:lib` gerou `packages/ui-lib/dist/`
- [ ] `npm run dev` abre servidor em [http://localhost:5173](http://localhost:5173)
- [ ] `npm run type-check` não mostra erros
- [ ] Navegação funciona (testar rotas no app de teste)

---

## 🎉 Pronto!

Agora você está pronto para desenvolver com o Lugand UI.

**Happy coding!** 🚀
