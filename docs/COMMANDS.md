# 🎯 Guia de Comandos - Lugand UI Monorepo

Referência rápida de comandos para trabalhar com o monorepo.

---

## 📦 Instalação

### Primeira Instalação

```bash
# Instala todas as dependências de todos os workspaces
npm install
```

### Reinstalar do Zero

```bash
# Limpar tudo e reinstalar
npm run clean
npm install
```

---

## 🚀 Desenvolvimento

### Rodar Aplicações

```bash
# Rodar app de testes (test-ui-lib) - RECOMENDADO PARA DESENVOLVIMENTO
npm run dev

# Rodar showcase da biblioteca (ui-lib)
npm run dev:lib

# Ou navegar para o workspace específico:
cd packages/test-ui-lib && npm run dev
cd packages/ui-lib && npm run dev
```

**Portas Padrão:**

- `test-ui-lib`: http://localhost:5173
- `ui-lib`: http://localhost:5174 (geralmente)

---

## 🏗️ Build

### Build da Biblioteca (Para Publicação)

```bash
# Build otimizado da biblioteca
npm run build:lib

# Resultado em: packages/ui-lib/dist/
# - vue-ui-lib.js (Bundle ESM)
# - style.css (Estilos compilados)
# - lib/ (Declarações TypeScript)
```

### Build do App de Testes

```bash
# Build do test-ui-lib
npm run build:test

# Resultado em: packages/test-ui-lib/dist/
```

### Build de Tudo

```bash
# Build de todos os workspaces
npm run build:all
```

---

## 🔍 Verificação de Tipos

```bash
# Verificar tipos TypeScript em todos os workspaces
npm run type-check

# Verificar tipos em um workspace específico
cd packages/ui-lib && npm run type-check
cd packages/test-ui-lib && npm run type-check
```

---

## 📝 Gerenciamento de Workspaces

### Adicionar Dependências

```bash
# Adicionar ao workspace ui-lib
npm install <package> --workspace=@lugand/vue-ui-lib

# Adicionar ao workspace test-ui-lib
npm install <package> --workspace=test-ui-lib

# Adicionar como dev dependency
npm install -D <package> --workspace=@lugand/vue-ui-lib

# Adicionar à raiz (dependências de build/tooling)
npm install -D <package>
```

### Remover Dependências

```bash
# Remover de um workspace
npm uninstall <package> --workspace=@lugand/vue-ui-lib

# Remover da raiz
npm uninstall <package>
```

### Atualizar Dependências

```bash
# Atualizar todas as dependências de todos os workspaces
npm update --workspaces

# Atualizar dependências de um workspace específico
npm update --workspace=@lugand/vue-ui-lib
```

### Listar Dependências

```bash
# Listar dependências da raiz
npm list

# Listar dependências de um workspace
npm list --workspace=@lugand/vue-ui-lib

# Ver dependências outdated
npm outdated --workspaces
```

---

## 🧹 Limpeza

```bash
# Limpar node_modules e dist de todos os workspaces
npm run clean

# Limpar e reinstalar
npm run clean && npm install
```

---

## 🔧 Comandos Úteis

### Preview de Builds

```bash
# Preview do build da biblioteca
cd packages/ui-lib && npm run preview

# Preview do build do test-ui-lib
cd packages/test-ui-lib && npm run preview
```

### Rodar Scripts em Todos os Workspaces

```bash
# Rodar um script em todos os workspaces que o tiverem
npm run <script-name> --workspaces --if-present

# Exemplo: build
npm run build --workspaces --if-present
```

### Informações do Workspace

```bash
# Ver estrutura de workspaces
npm query .workspace

# Ver informações de um workspace
npm info @lugand/vue-ui-lib

# Ver versões instaladas
npm list --workspace=@lugand/vue-ui-lib
```

---

## 📚 Navegação

### Estrutura de Diretórios

```bash
lugand-ui/
├── packages/
│   ├── ui-lib/          # cd packages/ui-lib
│   └── test-ui-lib/     # cd packages/test-ui-lib
├── package.json         # Workspace raiz
└── README.md
```

### Atalhos

```bash
# Criar aliases no seu shell (~/.bashrc ou ~/.zshrc)
alias lugand-ui='cd /home/heremit/Desktop/vue/lugand-ui'
alias lugand-lib='cd /home/heremit/Desktop/vue/lugand-ui/packages/ui-lib'
alias lugand-test='cd /home/heremit/Desktop/vue/lugand-ui/packages/test-ui-lib'
```

---

## 🚢 Publicação (Futuro)

### Preparar para Publicação

```bash
# 1. Atualizar versão
cd packages/ui-lib
npm version patch|minor|major

# 2. Build
npm run build:lib

# 3. Testar localmente
npm pack

# 4. Publicar
npm publish --access public

# 5. Criar tag git
git tag v0.1.0
git push --tags
```

---

## 🐛 Troubleshooting

### "Module not found" no test-ui-lib

```bash
# Reinstalar dependências
cd /home/heremit/Desktop/vue/lugand-ui
npm install

# Se persistir, limpar e reinstalar
npm run clean && npm install
```

### Build falha

```bash
# Verificar erros TypeScript
npm run type-check

# Limpar dist/ e rebuildar
cd packages/ui-lib
rm -rf dist
npm run build:lib
```

### Symlinks não funcionam

```bash
# Forçar recriação de symlinks
npm install --force
```

### Node modules muito grande

```bash
# Limpar caches npm
npm cache clean --force

# Reinstalar
npm run clean && npm install
```

---

## 📊 Informações Rápidas

### Versões

```bash
# Versões instaladas
node --version  # Deve ser >= 20.19.0 ou >= 22.12.0
npm --version   # Deve ser >= 10.0.0

# Versão da biblioteca
cat packages/ui-lib/package.json | grep version
```

### Tamanhos

```bash
# Tamanho do bundle da biblioteca
du -sh packages/ui-lib/dist/

# Tamanho total do node_modules
du -sh node_modules/ packages/*/node_modules/
```

---

## 🔗 Links Úteis

- **Documentação da Biblioteca**: `packages/ui-lib/README.md`
- **Arquitetura**: `packages/ui-lib/ARCHITECTURE.md`
- **Design Tokens**: `packages/ui-lib/DESIGN_TOKENS.md`
- **Temas**: `packages/ui-lib/THEMES.md`
- **Relatório de Validação**: `VALIDATION_REPORT.md`

---

## 💡 Dicas

1. **Sempre trabalhe da raiz** para comandos que afetam múltiplos workspaces
2. **Use `npm run dev`** (raiz) para desenvolvimento rápido
3. **Teste no `test-ui-lib`** antes de fazer build da biblioteca
4. **Rode `npm run build:lib`** antes de commits importantes
5. **Use `--workspace=` para comandos específicos** de um workspace

---

**Última atualização**: 06/01/2026  
**Versão do Guia**: 1.0.0
