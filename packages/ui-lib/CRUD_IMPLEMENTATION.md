# 🎉 CRUD System Implementation - Complete

Este documento detalha a implementação completa do sistema CRUD com mocks, composables e componentes reutilizáveis.

---

## 📁 Estrutura de Mocks

### Localização: `/src/mocks/`

```
mocks/
├── types.ts              # Interfaces TypeScript (User, Product, Order, Address)
├── helpers.ts            # Funções auxiliares (randomItem, generateId, etc)
├── index.ts              # Export centralizado
├── factories/            # Geradores de dados dinâmicos
│   ├── user.factory.ts
│   ├── product.factory.ts
│   ├── order.factory.ts
│   ├── address.factory.ts
│   └── index.ts
└── data/                 # Datasets estáticos
    ├── users.data.ts     # USERS_SMALL, USERS_MEDIUM, USERS_LARGE
    ├── products.data.ts
    ├── orders.data.ts
    └── index.ts
```

### Features:

- ✅ **Zero dependências externas** (sem Faker)
- ✅ **Factories dinâmicos** para gerar dados sob demanda
- ✅ **Datasets estáticos** em 3 tamanhos (small/medium/large)
- ✅ **Tipos TypeScript** completos
- ✅ **Helpers customizados** (UUID, email, CPF, CEP, phone generators)

### Uso:

```typescript
import { createUser, createUsers, USERS_DEFAULT, type User } from "@/mocks";

// Criar um usuário
const user = createUser({ name: "João Silva" });

// Criar múltiplos
const users = createUsers(10);

// Usar dataset pronto
const dataset = USERS_DEFAULT; // 20 usuários
```

---

## 🧩 Composables Implementados

### Localização: `/src/shared/composables/`

### 1. **useCrudStore** - Gerenciamento CRUD com localStorage

```typescript
import { useCrudStore } from "@/shared/composables";
import { USERS_DEFAULT, type User } from "@/mocks";

const userStore = useCrudStore<User>("users", USERS_DEFAULT);

// CRUD Operations
userStore.create({ name: "João", email: "joao@email.com" });
userStore.update("id-123", { name: "João Silva" });
userStore.remove("id-123");
userStore.removeMany(["id-1", "id-2"]);

// Queries
const all = userStore.findAll();
const one = userStore.findById("id-123");
const filtered = userStore.findWhere((u) => u.role === "admin");

// State
userStore.items; // Ref<T[]>
userStore.loading; // Ref<boolean>
userStore.error; // Ref<string | null>
userStore.count; // ComputedRef<number>
userStore.isEmpty; // ComputedRef<boolean>
```

**Features:**

- ✅ Persistência automática em localStorage
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Queries avançadas (findWhere, findById)
- ✅ Estado reativo (loading, error, count)
- ✅ Bulk operations (removeMany)

---

### 2. **useValidation** - Sistema de validação customizado

```typescript
import {
  useValidation,
  required,
  email,
  minLength,
} from "@/shared/composables";

const { validate, errors, isValid } = useValidation();

const rules = {
  name: [required(), minLength(3)],
  email: [required(), email()],
  age: [min(18), max(100)],
};

await validate(formData, rules);

if (isValid.value) {
  // Submit form
} else {
  console.log(errors.value); // { name: 'Deve ter no mínimo 3 caracteres' }
}
```

**Built-in validators:**

- `required()` - Campo obrigatório
- `email()` - Email válido
- `url()` - URL válida
- `minLength(n)` / `maxLength(n)` - Comprimento
- `min(n)` / `max(n)` - Valor numérico
- `pattern(regex)` - Padrão regex
- `matches(field)` - Deve ser igual a outro campo
- `oneOf(options)` - Deve estar em lista

---

### 3. **useSearch** - Busca client-side genérica

```typescript
import { useSearch } from "@/shared/composables";

const { searchTerm, results } = useSearch(users, {
  fields: ["name", "email", "role"],
  caseSensitive: false,
  debounceMs: 300,
});

searchTerm.value = "joão";
console.log(results.value); // Usuários com 'joão' em name, email ou role
```

---

### 4. **useSorting** - Ordenação client-side

```typescript
import { useSorting } from "@/shared/composables";

const { sortedItems, toggleSort, sortBy, sortDirection } = useSorting(users);

toggleSort("name"); // asc
toggleSort("name"); // desc
toggleSort("name"); // null (remove sort)
toggleSort("email"); // asc (novo campo)
```

**Ciclo de ordenação:** `null → asc → desc → null`

---

### 5. **usePagination** - Paginação client-side

```typescript
import { usePagination } from "@/shared/composables";

const {
  paginatedItems,
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  previousPage,
} = usePagination(users, {
  itemsPerPage: 10,
  initialPage: 1,
});

nextPage(); // Página 2
goToPage(5); // Página 5
setItemsPerPage(25); // 25 itens por página
```

---

### 6. **useTableState** - Composable de alto nível

Combina **search + sort + pagination** em um único composable.

```typescript
import { useTableState } from '@/shared/composables'

const {
  displayedItems,      // Itens finais (após search + sort + pagination)
  searchTerm,
  sortBy,
  currentPage,
  totalPages,
  toggleSort,
  goToPage,
  reset
} = useTableState(users, {
  searchFields: ['name', 'email'],
  itemsPerPage: 20,
  initialSortBy: 'createdAt',
  initialDirection: 'desc'
})

// Use displayedItems para renderizar a tabela
<DataTable :data="displayedItems" />
```

---

## 🧱 Componente Pagination

### Localização: `/src/shared/components/navigation/Pagination.vue`

Componente standalone extraído do DataTable, reutilizável em qualquer contexto.

```vue
<Pagination
  :current-page="currentPage"
  :total-items="100"
  :items-per-page="10"
  :show-first-last="true"
  @update:current-page="currentPage = $event"
  @update:items-per-page="itemsPerPage = $event"
/>
```

**Props:**

- `currentPage` (required)
- `totalItems` (required)
- `itemsPerPage` (default: 10)
- `itemsPerPageOptions` (default: [5, 10, 25, 50, 100])
- `showItemsPerPage` (default: true)
- `showInfo` (default: true)
- `showFirstLast` (default: false)
- `disabled` (default: false)

**Slots:**

- `info` - Customiza "Showing X to Y of Z entries"
- `first-icon`, `prev-icon`, `next-icon`, `last-icon` - Customiza ícones
- `prev-text`, `next-text` - Customiza textos dos botões
- `current` - Customiza indicador de página

---

## 📊 Exemplo: CrudView

### Localização: `/src/views/ui/complex/CrudView.vue`

Exemplo completo de CRUD com:

- ✅ **useCrudStore** - Persistência localStorage
- ✅ **useTableState** - Search + Sort + Pagination
- ✅ **useValidation** - Validação de formulários
- ✅ **Modal** - Create/Edit/Delete modals
- ✅ **Toast** - Feedback visual
- ✅ **DataTable** - Exibição de dados
- ✅ **DynamicForm** - Formulários dinâmicos
- ✅ **Bulk Delete** - Deleção em massa

### Acesso:

- URL: `/ui/complex/crud`
- Menu: `UI > Complex > CRUD`

---

## 🎯 Exports Atualizados

### `lib/index.ts` - Biblioteca NPM

```typescript
// Composables
export {
  useCrudStore,
  useValidation,
  useSearch,
  useSorting,
  usePagination,
  useTableState,
  // Validators
  required,
  minLength,
  maxLength,
  min,
  max,
  email,
  url,
  pattern,
  matches,
  oneOf,
} from "../src/shared/composables";

// Components
export { Pagination } from "../src/shared/components";
```

---

## 📝 Próximos Passos (Opcional)

1. **Refatorar DataTable → Table**
   - Renomear para `Table.vue`
   - Substituir `<select>` nativo por componente `Select`
   - Usar componente `Pagination` standalone
   - Adicionar prop `:searchable` para controlar visibilidade da busca

2. **StepPagination (Wizards)**
   - Criar variante visual para form wizards
   - Props: steps, currentStep, stepLabels
   - Visual diferenciado (bullets, progress bar)

3. **Mover chartMocks**
   - Mover `/src/modules/charts/mocks/` para `/src/mocks/data/charts.data.ts`
   - Manter consistência na estrutura de mocks

4. **Exemplos Adicionais**
   - Table read-only (visualização)
   - Table editable (inline editing)
   - Form wizard com StepPagination
   - Gallery com Pagination
   - Card grid com Pagination

---

## ✅ Checklist de Implementação

- [x] Estrutura de mocks (`/src/mocks/`)
- [x] Helpers customizados (randomItem, generateId, etc)
- [x] Factories (User, Product, Order, Address)
- [x] Datasets estáticos (small/medium/large)
- [x] useCrudStore (localStorage + CRUD)
- [x] useValidation (custom validators)
- [x] useSearch (client-side search)
- [x] useSorting (client-side sort)
- [x] usePagination (client-side pagination)
- [x] useTableState (high-level composable)
- [x] Pagination component (standalone)
- [x] CrudView example (complete CRUD showcase)
- [x] Router update (`/ui/complex/crud`)
- [x] Navigation menu update (sidebar link)
- [x] lib/index.ts exports (composables + Pagination)

---

## 🎉 Resumo

A implementação está **100% completa** e funcional:

1. ✅ **Mocks organizados** (types, helpers, factories, data)
2. ✅ **6 composables poderosos** (CRUD, validation, search, sort, pagination, table state)
3. ✅ **Pagination standalone** (reutilizável em qualquer contexto)
4. ✅ **CrudView completo** (exemplo real de uso)
5. ✅ **Zero dependências externas** (exceto Vue/Vite/TS)
6. ✅ **100% TypeScript** (tipos completos)
7. ✅ **Persistência localStorage** (dados preservados entre sessões)
8. ✅ **Validação customizada** (sem Zod)
9. ✅ **Exports atualizados** (lib/index.ts)

**Rota de acesso:** `/ui/complex/crud`

**Menu:** `UI > Complex > CRUD`

---

## 🚀 Como Usar

```bash
# Development mode
cd packages/ui-lib
npm run dev

# Acesse: http://localhost:5173/ui/complex/crud
```

---

**Desenvolvido seguindo os princípios:**

- Maximum reusability
- Zero external dependencies (only Vue/Vite/TS)
- Professional library patterns
- Complete TypeScript typing
- localStorage persistence
- Custom validation system
