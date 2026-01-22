# Modules - Arquitetura de Componentes Complexos

Este diretório contém **módulos complexos** - sistemas completos que geralmente incluem múltiplos componentes, composables dedicados, gerenciadores de estado e documentação própria.

## 📋 Critérios para Módulos

Um componente deve estar em `modules/` se atender a um ou mais critérios:

1. **Padrão Pai/Filho**: Possui um componente base e múltiplas implementações específicas
2. **Singleton Manager**: Possui um gerenciador de estado global (ex: modalStack, toastManager)
3. **Composable Dedicado**: Tem um composable complexo específico para o sistema
4. **Subcomponentes Múltiplos**: É composto por vários componentes que trabalham juntos
5. **Arquitetura Documentada**: Requer documentação ARCHITECTURE.md própria

## 🗂️ Estrutura de um Módulo

```
modules/
└── NomeDoModulo/
    ├── README.md                    # Documentação de uso
    ├── ARCHITECTURE.md              # (Opcional) Arquitetura detalhada
    ├── index.ts                     # Exports centralizados
    ├── types.ts                     # Types do módulo
    │
    ├── components/                  # Componentes do módulo
    │   ├── ComponentePrincipal.vue
    │   └── SubComponente.vue
    │
    ├── composables/                 # (Opcional) Composables dedicados
    │   └── useModulo.ts
    │
    └── utils/                       # (Opcional) Utilitários específicos
        └── manager.ts
```

## 📦 Módulos Disponíveis

### **UI Complexos**

#### `modal/`
Sistema completo de modais com gerenciamento de stack (z-index) e composables.
- **Componentes**: Modal.vue
- **Gerenciador**: modalStack.ts
- **Composables**: useModal, useConfirmModal
- **Features**: Stack management, múltiplas variantes, confirmação assíncrona

#### `toast/`
Sistema de notificações toast com provedor global.
- **Componentes**: Toast.vue, ToastProvider.vue
- **Gerenciador**: toastManager.ts
- **Composable**: useToast
- **Features**: Posicionamento, queue, auto-dismiss

#### `charts/`
Família completa de gráficos com padrão pai/filho.
- **Base**: BaseChart.vue (container comum)
- **Charts**: LineChart, BarChart, PieChart, AreaChart, ScatterChart, GraphChart
- **Composable**: useChart (gerenciamento de canvas)
- **Features**: Canvas 2D API, escalas, legendas, toolbar, export
- **Docs**: ARCHITECTURE.md completo

### **Data Management**

#### `DataTable/`
Tabela avançada com sorting, filtros e paginação.
- **Componente**: DataTable.vue
- **Features**: Client-side sorting/filtering, seleção múltipla, slots customizáveis

#### `DynamicForm/`
Gerador de formulários baseado em schema.
- **Componente**: DynamicForm.vue
- **Features**: Validação, campos dinâmicos, layout flexível

### **Layouts**

#### `layouts/`
Layouts completos para estrutura de aplicação.
- **DefaultLayout**: Layout com Navbar lateral + Header + Footer
- **Componentes**: Navbar, NavItem, NavLink
- **Futuro**: MinimalLayout, DashboardLayout, AdminLayout

#### `AppShell/`
Componentes de shell da aplicação.
- **Componentes**: AppHeader, AppFooter, ThemeSelector
- **Usage**: Usado dentro dos layouts

## 🔄 Quando NÃO usar modules/

Componentes **simples** devem ir para `shared/components/{category}/`:
- Componentes atômicos (Btn, Input, Checkbox)
- Componentes de display (Badge, Avatar, Card)
- Feedback simples (Spinner, ProgressBar)
- Utilitários de layout (Container, Grid, Stack)

**Regra geral**: Se pode ser usado sozinho sem configuração complexa, vai em `shared/`.

## 📖 Exportando Módulos

Todos os módulos devem exportar através de `index.ts`:

```typescript
// modules/meu-modulo/index.ts
export { default as MeuComponente } from './components/MeuComponente.vue'
export { useMeuModulo } from './composables/useMeuModulo'
export * from './types'
```

E serem incluídos no `modules/index.ts` central:

```typescript
// modules/index.ts
export * from './meu-modulo'
```

## 🚀 Criando um Novo Módulo

1. Criar pasta em `modules/NomeDoModulo/`
2. Adicionar componentes em `components/`
3. Criar `index.ts` com exports
4. Adicionar types em `types.ts`
5. (Opcional) Criar composables em `composables/`
6. (Opcional) Criar ARCHITECTURE.md se for complexo
7. Adicionar export em `modules/index.ts`
8. Atualizar `lib/index.ts` para exportação pública

## 📚 Referências

- Ver `charts/ARCHITECTURE.md` como exemplo de documentação completa
- Ver `modal/` como exemplo de módulo com manager
- Ver `layouts/` como exemplo de módulo com múltiplos layouts
