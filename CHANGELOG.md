# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Planejado

- Adicionar testes unitários com Vitest
- Configurar CI/CD
- Adicionar ESLint e Prettier
- Adicionar pre-commit hooks com Husky

## [0.1.0] - 2026-01-06

### Adicionado

- Estrutura inicial do monorepo com npm workspaces
- Biblioteca de componentes `@lugand/vue-ui-lib`
- Aplicação de testes `test-ui-lib`
- Sistema de temas (10 temas disponíveis)
- Componentes primitivos: Button, Input, Textarea, Checkbox, Select, Scrollable
- Componentes de navegação: NavLink, NavItem, Navbar
- Módulos complexos: DynamicForm, DataTable, AppLayout
- Sistema de design tokens baseado em HSL
- Composable `useTheme` para gerenciamento de temas
- Documentação completa da arquitetura
- Build configurado com Vite + TypeScript

### Configurado

- npm workspaces para gerenciamento de monorepo
- TypeScript com strict mode
- Vite para build da biblioteca e dev server
- Sistema de exports modernos (ESM + types)
- Geração automática de declarações TypeScript

---

## Tipos de Mudanças

- `Added` - Para novas funcionalidades
- `Changed` - Para mudanças em funcionalidades existentes
- `Deprecated` - Para funcionalidades que serão removidas
- `Removed` - Para funcionalidades removidas
- `Fixed` - Para correção de bugs
- `Security` - Para correções de segurança

## Versionamento Semântico

- **MAJOR** (1.0.0): Mudanças incompatíveis com versões anteriores
- **MINOR** (0.1.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.1): Correções de bugs compatíveis
