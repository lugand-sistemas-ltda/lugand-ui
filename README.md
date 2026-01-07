# Lugand UI - Monorepo

> Sistema de componentes UI Vue 3 + TypeScript organizado como monorepo usando **npm workspaces**.

## 📁 Estrutura

```
lugand-ui/
├── packages/
│   ├── ui-lib/          # 📦 Biblioteca de componentes (publicável)
│   └── test-ui-lib/     # 🧪 App de testes e validação
└── docs/                # 📚 Documentação
```

---

## 🚀 Início Rápido

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Desenvolvimento

```bash
# App de testes (builda lib automaticamente)
npm run dev
# → http://localhost:5173

# Showcase da biblioteca
npm run dev:lib
# → http://localhost:5174
```

### 3️⃣ Build

```bash
# Build da biblioteca (para publicação)
npm run build:lib

# Build do app de testes
npm run build:test

# Build de tudo
npm run build:all
```

---

## 📦 Pacotes

### @lugand/vue-ui-lib

Biblioteca principal de componentes Vue 3.

- **Path**: `packages/ui-lib/`
- **Entry**: `lib/index.ts`
- **Output**: `dist/vue-ui-lib.js` + `dist/style.css`
- **Bundle**: ~28 KB (gzipped: ~7.5 KB)

**Exports:**

- Componentes (Btn, Input, Navbar, etc)
- Módulos (DynamicForm, DataTable, AppLayout)
- Composables (useTheme)
- Tipos TypeScript
- 10 temas pré-configurados

### test-ui-lib

Aplicação para testar e validar componentes em ambiente real.

- **Path**: `packages/test-ui-lib/`
- **Dependência**: `@lugand/vue-ui-lib: "*"` (symlink local)

---

## 🛠️ Comandos

### Workspace Raiz

```bash
# Desenvolvimento
npm run dev              # App de testes (builda lib antes)
npm run dev:lib          # Showcase da biblioteca

# Build
npm run build:lib        # Build apenas da biblioteca
npm run build:test       # Build apenas do app de testes
npm run build:all        # Build de tudo

# Manutenção
npm run type-check       # Verificar tipos TypeScript
npm run clean            # Limpar builds e caches

# Instalar em workspace específico
npm install <package> --workspace=@lugand/vue-ui-lib
npm install <package> --workspace=test-ui-lib
```

### Workspaces Individuais

```bash
# ui-lib
cd packages/ui-lib
npm run dev          # Showcase (dev)
npm run build:lib    # Build da biblioteca
npm run preview      # Preview do build

# test-ui-lib
cd packages/test-ui-lib
npm run dev          # Dev server
npm run build        # Build de produção
```

---

## 🎨 Temas Disponíveis

A biblioteca inclui 10 temas prontos:

- `default` - Tema padrão clean
- `dark` - Tema escuro moderno
- `cyberpunk` - Neon futurista
- `dracula` - Roxo elegante
- `forest` - Verde natural
- `ocean` - Azul profundo
- `pcpr` - Polícia Civil do Paraná
- `pretona` - Polícia Militar
- `bombeiros` - Corpo de Bombeiros
- `viatura` - Tema operacional

---

## 📚 Documentação

- **[Início Rápido](docs/QUICK_START.md)** - Guia de primeiros passos
- **[Comandos](docs/COMMANDS.md)** - Referência completa de comandos
- **[Workflow](docs/WORKFLOW.md)** - Guias de desenvolvimento
- **[Arquitetura](packages/ui-lib/ARCHITECTURE.md)** - Estrutura da biblioteca
- **[Design Tokens](packages/ui-lib/DESIGN_TOKENS.md)** - Sistema de tokens
- **[Temas](packages/ui-lib/THEMES.md)** - Customização de temas

---

## ✅ Checklist Pré-Commit

- [ ] `npm run build:lib` executa sem erros
- [ ] `npm run dev` funciona (ui-lib e test-ui-lib)
- [ ] `npm run type-check` sem erros TypeScript
- [ ] Navegador sem erros de console
- [ ] Componentes renderizam corretamente
- [ ] Estilos CSS aplicados

---

## 🔄 Workflow de Desenvolvimento

1. **Desenvolver** componentes em `packages/ui-lib/src/`
2. **Testar** no showcase (`npm run dev:lib`)
3. **Validar** no contexto real (`npm run dev` em test-ui-lib)
4. **Build** da biblioteca (`npm run build:lib`)
5. **Commit** quando estável

---

## 📄 Licença

MIT - Lugand Sistemas

# Build da biblioteca

npm run build:lib

# Build do app de testes

npm run build:test

# Build de tudo

npm run build:all

# Verificar tipos TypeScript

npm run type-check

# Limpar tudo

npm run clean

# Instalar dependência em um workspace específico

npm install <package> --workspace=@lugand/vue-ui-lib
npm install <package> --workspace=test-ui-lib

# Rodar comando em todos os workspaces

npm run <script> --workspaces

````

### Em cada workspace:

```bash
cd packages/ui-lib
npm run dev          # Showcase da biblioteca
npm run build        # Build completo (showcase)
npm run build:lib    # Build da biblioteca (publicação)
npm run preview      # Preview do build

cd packages/test-ui-lib
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run type-check   # Verificar tipos TypeScript
````

## 🔗 Dependências entre Workspaces

O `test-ui-lib` usa a biblioteca local:

```json
{
  "dependencies": {
    "@lugand/vue-ui-lib": "*"
  }
}
```

O npm workspaces cria um symlink automático entre os pacotes.

## 📝 Arquivos Importantes

### Configuração do Monorepo

- `package.json` - Configuração do workspace raiz
- `packages/*/package.json` - Configuração de cada workspace

### TypeScript

- `packages/ui-lib/tsconfig.json` - Config base da biblioteca
- `packages/ui-lib/tsconfig.app.json` - Config da aplicação
- `packages/ui-lib/tsconfig.node.json` - Config do Node (Vite)

### Vite

- `packages/ui-lib/vite.config.ts` - Dev server (showcase)
- `packages/ui-lib/vite.config.lib.ts` - Build da biblioteca
- `packages/test-ui-lib/vite.config.ts` - App de testes

## 🎨 Temas

A biblioteca suporta múltiplos temas:

- default
- dark
- cyberpunk
- dracula
- forest
- ocean
- pcpr
- pretona
- bombeiros
- viatura

## 📚 Documentação Adicional

- [ui-lib/README.md](packages/ui-lib/README.md) - Documentação da biblioteca
- [ui-lib/ARCHITECTURE.md](packages/ui-lib/ARCHITECTURE.md) - Arquitetura detalhada
- [ui-lib/DESIGN_TOKENS.md](packages/ui-lib/DESIGN_TOKENS.md) - Sistema de tokens
- [ui-lib/THEMES.md](packages/ui-lib/THEMES.md) - Sistema de temas

## � Documentação

- **[Documentação Completa](docs/INDEX.md)** - Índice de toda documentação
- **[Guia de Comandos](docs/COMMANDS.md)** - Referência de comandos
- **[Workflows](docs/WORKFLOW.md)** - Guias de desenvolvimento
- **[Arquitetura](packages/ui-lib/ARCHITECTURE.md)** - Arquitetura da biblioteca
- **[Design Tokens](packages/ui-lib/DESIGN_TOKENS.md)** - Sistema de tokens
- **[Temas](packages/ui-lib/THEMES.md)** - Sistema de temas

## �🔄 Workflow de Desenvolvimento

1. **Desenvolver componentes** em `packages/ui-lib/`
2. **Testar em tempo real** no showcase (`npm run dev` em ui-lib)
3. **Validar em contexto real** no `test-ui-lib`
4. **Build da biblioteca** com `npm run build:lib`
5. **Publicar** quando estiver pronto

## 📋 Checklist antes do Commit

- [ ] `npm run build:lib` executa sem erros
- [ ] `npm run dev` funciona em ambos os workspaces
- [ ] TypeScript compila sem erros (`npm run type-check`)
- [ ] Estilos CSS são gerados corretamente
- [ ] Componentes são exportados em `lib/index.ts`
- [ ] Documentação atualizada

## 🚧 Próximos Passos

- [ ] Adicionar testes unitários (Vitest)
- [ ] Configurar CI/CD
- [ ] Adicionar Storybook (opcional)
- [ ] Configurar linting e formatting (ESLint + Prettier)
- [ ] Adicionar pre-commit hooks (Husky)

## 📄 Licença

MIT - Lugand Sistemas
