/**
* ============================================
* CRUD VIEW - Exemplo completo de CRUD com localStorage
* ============================================
*
* Demonstra o uso de:
* - useCrudStore (localStorage persistence)
* - useTableState (search + sort + pagination)
* - useValidation (form validation)
* - Modal (create/edit forms)
* - Toast (feedback)
* - DataTable (data display)
*
* Features:
* - Create, Read, Update, Delete
* - Client-side search
* - Column sorting
* - Pagination
* - Form validation
* - localStorage persistence
* - Bulk delete
*/

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ComponentShowcase, CodeBlock, AlertDialog, InputWithAddon, Icon } from '@/shared/components'
import {
  useCrudStore,
  useTableState,
  useValidation,
  useSelection,
  useBulkActions,
  required,
  email,
  minLength
} from '@/shared/composables'
import type { BulkActionDefinition } from '@/shared/composables'
import { useModal, Modal } from '@/modules/modal'
import { useToast, ToastProvider } from '@/modules/toast'
import { DataTable, DynamicForm } from '@/modules'
import { Btn, Card } from '@/shared/components'
import type { TableColumn } from '@/modules/DataTable/types'
import type { FormField } from '@/modules/DynamicForm/DynamicForm.vue'
import { USERS_DEFAULT, type User } from '@/mocks'// ============================================
// COMPOSABLES
// ============================================
const userStore = useCrudStore<User>('demo-users', USERS_DEFAULT)
const toast = useToast()
const createModal = useModal()
const editModal = useModal()
const viewModal = useModal()

// Delete dialog state
const showDeleteDialog = ref(false)

// ============================================
// TABLE STATE
// ============================================
const tableState = useTableState(userStore.items, {
  searchFields: ['name', 'email', 'role', 'status'],
  itemsPerPage: 10,
  initialSortBy: 'createdAt',
  initialDirection: 'desc'
})

// Instância separada para demonstração do useTableState showcase
const demoTableState = useTableState(userStore.items, {
  searchFields: ['name', 'email', 'role', 'status'],
  itemsPerPage: 5, // Menos itens para demonstração
  initialSortBy: 'name',
  initialDirection: 'asc'
})

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'rowActions', label: 'Actions', align: 'right' }
]

// ============================================
// FORM STATE
// ============================================
const formData = ref<Partial<User>>({})
const isEditing = ref(false)
const selectedUser = ref<User | null>(null)

const validation = useValidation<User>()

const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter full name',
    cols: 2 // Full width (2 colunas no grid de 2)
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'user@example.com',
    cols: 2 // Full width
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' }
    ],
    cols: 1 // Half width
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' }
    ],
    cols: 1 // Half width
  }
]

const validationRules = {
  name: [required(), minLength(3)],
  email: [required(), email()],
  role: [required()],
  status: [required()]
}

// ============================================
// SELECTION STATE (novo composable)
// ============================================
const selection = useSelection<User>({
  getKey: (user) => user.id,
  onChange: (selected) => {
    console.log(`Selection changed: ${selected.length} items selected`)
  }
})

// Bulk Actions state (mantido para compatibilidade futura)
const bulkActions = useBulkActions<User>({
  selection: selection.selected
})

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Abre o modal de criação
 */
function openCreateModal(): void {
  isEditing.value = false
  formData.value = {
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  }
  validation.clearErrors()
  createModal.open()
}

/**
 * Abre o modal de edição
 */
function openEditModal(user: User): void {
  isEditing.value = true
  selectedUser.value = user
  formData.value = { ...user }
  validation.clearErrors()
  editModal.open()
}

/**
 * Abre o modal de visualização
 */
function openViewModal(user: User): void {
  selectedUser.value = user
  viewModal.open()
}

/**
 * Abre o modal de confirmação de exclusão
 */
function openDeleteModal(user: User): void {
  selectedUser.value = user
  showDeleteDialog.value = true
}

/**
 * Cria um novo usuário
 */
async function handleCreate(): Promise<void> {
  const isValid = await validation.validate(formData.value as User, validationRules)

  if (!isValid) {
    // Validação falhou - erros já estão no validation.errors
    return
  }

  try {
    userStore.create(formData.value as Omit<User, 'id' | 'createdAt' | 'updatedAt'>)
    toast.success('User created successfully')
    createModal.close()
    validation.clearErrors()
  } catch (err) {
    toast.error('Failed to create user')
    console.error(err)
  }
}

/**
 * Atualiza um usuário existente
 */
async function handleUpdate(): Promise<void> {
  if (!selectedUser.value) return

  const isValid = await validation.validate(formData.value as User, validationRules)

  if (!isValid) {
    // Validação falhou - erros já estão no validation.errors
    return
  }

  try {
    userStore.update(selectedUser.value.id, formData.value)
    toast.success('User updated successfully')
    editModal.close()
    validation.clearErrors()
  } catch (err) {
    toast.error('Failed to update user')
    console.error(err)
  }
}

/**
 * Deleta um usuário
 */
function handleDelete(): void {
  if (!selectedUser.value) return

  try {
    userStore.remove(selectedUser.value.id)
    toast.success(`User "${selectedUser.value.name}" deleted successfully`)
    showDeleteDialog.value = false
    selectedUser.value = null
  } catch (err) {
    toast.error('Failed to delete user')
    console.error(err)
  }
}

/**
 * Deleta múltiplos usuários com confirmação
 */
const showBulkDeleteDialog = ref(false)

function handleBulkDelete(): void {
  if (!selection.hasSelection) return
  showBulkDeleteDialog.value = true
}

async function confirmBulkDelete(): Promise<void> {
  try {
    const ids = selection.selected.value.map(u => u.id)
    const count = userStore.removeMany(ids)

    toast.success(`${count} users deleted successfully`)
    showBulkDeleteDialog.value = false
    selection.clear()
  } catch (err) {
    toast.error('Failed to delete users')
    console.error(err)
  }
}

/**
 * Reset CRUD - Recarrega dados iniciais
 */
function handleResetCrud(): void {
  // Limpar localStorage
  localStorage.removeItem('demo-users')

  // Recarregar dados default
  userStore.items.value = [...USERS_DEFAULT]

  // Limpar seleções (usar novo composable)
  selection.clear()

  // Resetar busca
  tableState.searchTerm.value = ''

  // Feedback
  toast.success('CRUD reset to default data')
}

/**
 * Formata data para exibição
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

/**
 * Badge color por role
 */
function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    admin: 'var(--color-error)',
    editor: 'var(--color-warning)',
    viewer: 'var(--color-info)'
  }
  return colors[role] || 'var(--color-text-secondary)'
}

/**
 * Badge color por status
 */
function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'var(--color-success)',
    inactive: 'var(--color-text-secondary)',
    pending: 'var(--color-warning)'
  }
  return colors[status] || 'var(--color-text-secondary)'
}

// ============================================
// CODE EXAMPLES
// ============================================
const crudStoreExample = `
<script setup>
import { useCrudStore } from '@lugand/vue-ui-lib'
import { USERS_DEFAULT } from '@/mocks'

// Initialize store with localStorage persistence
const userStore = useCrudStore('users', USERS_DEFAULT)

// Create
const newUser = userStore.create({
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'editor',
  status: 'active'
})

// Read
const all = userStore.findAll()
const one = userStore.findById('id-123')
const admins = userStore.findWhere(u => u.role === 'admin')

// Update
userStore.update('id-123', { name: 'João Santos' })

// Delete
userStore.remove('id-123')
userStore.removeMany(['id-1', 'id-2', 'id-3'])

// State
console.log(userStore.count)    // Total items
console.log(userStore.isEmpty)  // Is empty?
console.log(userStore.loading)  // Loading state
<\/script>
`

const tableStateExample = `
<script setup>
import { useTableState } from '@lugand/vue-ui-lib'
import { DataTable } from '@lugand/vue-ui-lib'

const {
  displayedItems,     // Final items (search + sort + pagination)
  searchTerm,
  sortBy,
  currentPage,
  totalPages,
  toggleSort,
  goToPage
} = useTableState(users, {
  searchFields: ['name', 'email'],
  itemsPerPage: 10,
  initialSortBy: 'createdAt',
  initialDirection: 'desc'
})
<\/script>

<template>
  <DataTable 
    :data="displayedItems" 
    :columns="columns"
    selectable
    pagination
  />
</template>
`

const validationExample = `
<script setup>
import { 
  useValidation, 
  required, 
  email, 
  minLength 
} from '@lugand/vue-ui-lib'

const { validate, errors, isValid } = useValidation()

const rules = {
  name: [required(), minLength(3)],
  email: [required(), email()],
  role: [required()]
}

async function handleSubmit() {
  await validate(formData, rules)
  
  if (isValid.value) {
    // Submit form
  } else {
    console.log(errors.value)
    // { name: 'Deve ter no mínimo 3 caracteres' }
  }
}
<\/script>
`

const fullExample = `
<script setup>
import { useCrudStore, useTableState, useValidation } from '@lugand/vue-ui-lib'
import { useModal, useToast } from '@lugand/vue-ui-lib'
import { DataTable, DynamicForm, Modal, ToastProvider } from '@lugand/vue-ui-lib'
import { USERS_DEFAULT } from '@/mocks'

// CRUD Store with localStorage
const userStore = useCrudStore('users', USERS_DEFAULT)

// Table State (search + sort + pagination)
const tableState = useTableState(userStore.items, {
  searchFields: ['name', 'email', 'role'],
  itemsPerPage: 10
})

// Validation
const validation = useValidation()
const rules = {
  name: [required(), minLength(3)],
  email: [required(), email()]
}

// Modals
const createModal = useModal()
const toast = useToast()

// Create user
async function handleCreate() {
  const isValid = await validation.validate(formData.value, rules)
  if (!isValid) {
    toast.error('Please fix form errors')
    return
  }
  
  userStore.create(formData.value)
  toast.success('User created successfully')
  createModal.close()
}
<\/script>

<template>
  <div>
    <ToastProvider />
    
    <!-- Stats -->
    <div class="stats">
      <p>Total: {{ userStore.count }}</p>
      <p>Filtered: {{ tableState.filteredTotal }}</p>
    </div>
    
    <!-- Table -->
    <DataTable
      :data="tableState.displayedItems"
      :columns="columns"
      selectable
      pagination
    />
    
    <!-- Create Modal -->
    <Modal :is-open="createModal.isOpen.value" @close="createModal.close()">
      <DynamicForm v-model="formData" :schema="fields" />
      <button @click="handleCreate">Create</button>
    </Modal>
  </div>
</template>
`
</script>

<template>
  <div class="crud-view">
    <ToastProvider />

    <!-- Page Header -->
    <div class="crud-view__header">
      <h1>CRUD System</h1>
      <p class="subtitle">
        Complete CRUD implementation with localStorage persistence, validation, search, sorting, and pagination.
      </p>
    </div>

    <!-- 1. Full CRUD Example (Main Showcase) -->
    <ComponentShowcase title="Full CRUD Example"
      description="Complete CRUD interface with DataTable, search, sorting, pagination, bulk actions, and inline actions. Data persists in localStorage.">
      <template #preview>
        <Card padding="none">
          <!-- Header: Título + Stats -->
          <div class="table-header">
            <h2 class="table-title">Users Management</h2>
            <div class="table-header__stats">
              <div class="stat-item">
                <span class="stat-label">Total:</span>
                <span class="stat-value">{{ userStore.count }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Filtered:</span>
                <span class="stat-value">{{ tableState.filteredTotal }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Selected:</span>
                <span class="stat-value">{{ selection.count }}</span>
              </div>
            </div>
          </div>

          <DataTable :data="tableState.displayedItems.value" :columns="columns" :loading="userStore.loading.value"
            selectable disable-search disable-pagination @update:selection="selection.setSelection($event)">
            <!-- Toolbar Actions Slot -->
            <template #actions>
              <!-- Left Side: Search Input -->
              <div class="table-toolbar__left">
                <InputWithAddon v-model="tableState.searchTerm.value" placeholder="Search users..." type="search"
                  class="search-input">
                  <template #prefix>
                    <Icon name="search" type="ui" size="sm" />
                  </template>
                </InputWithAddon>
              </div>

              <!-- Right Side: Action Buttons -->
              <div class="table-toolbar__right">
                <Btn variant="outline" size="sm" @click="handleResetCrud">
                  <Icon name="arrows_horizontal" type="ui" size="sm" />
                  Reset
                </Btn>
                <Btn variant="danger" size="sm" @click="handleBulkDelete"
                  :disabled="!selection.hasSelection || bulkActions.state.value.isExecuting">
                  <Icon name="delete" type="ui" size="sm" />
                  Delete
                </Btn>
                <Btn variant="primary" size="sm" @click="openCreateModal">
                  <Icon name="plus" type="ui" size="sm" />
                  Create
                </Btn>
              </div>
            </template>

            <!-- Custom cell: Role -->
            <template #role="{ value }">
              <span class="badge" :style="{ backgroundColor: getRoleBadgeColor(value) }">
                {{ value }}
              </span>
            </template>

            <!-- Custom cell: Status -->
            <template #status="{ value }">
              <span class="badge" :style="{ backgroundColor: getStatusBadgeColor(value) }">
                {{ value }}
              </span>
            </template>

            <!-- Custom cell: Created At -->
            <template #createdAt="{ value }">
              {{ formatDate(value) }}
            </template>

            <!-- Custom cell: Row Actions -->
            <template #rowActions="slotProps: any">
              <div class="actions-cell">
                <Btn size="sm" variant="ghost" @click="openViewModal(slotProps.row)">
                  View
                </Btn>
                <Btn size="sm" variant="ghost" @click="openEditModal(slotProps.row)">
                  Edit
                </Btn>
                <Btn size="sm" variant="danger" @click="openDeleteModal(slotProps.row)">
                  Delete
                </Btn>
              </div>
            </template>
          </DataTable>

          <!-- Custom Pagination Controls -->
          <div class="custom-pagination">
            <div class="pagination-info">
              Showing {{ tableState.pageInfo.value.from }} to {{ tableState.pageInfo.value.to }} of {{
                tableState.pageInfo.value.total }} entries
            </div>

            <div class="pagination-controls">
              <div class="rows-per-page">
                <span>Rows per page:</span>
                <select v-model="tableState.itemsPerPage.value" class="rows-select" @change="tableState.goToPage(1)">
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                </select>
              </div>

              <div class="page-nav">
                <Btn size="sm" variant="ghost" :disabled="tableState.isFirstPage.value"
                  @click="tableState.previousPage()">
                  Prev
                </Btn>
                <span class="page-current">{{ tableState.currentPage.value }} / {{ tableState.totalPages.value }}</span>
                <Btn size="sm" variant="ghost" :disabled="tableState.isLastPage.value" @click="tableState.nextPage()">
                  Next
                </Btn>
              </div>
            </div>
          </div>
        </Card>
      </template>

      <template #code>
        <CodeBlock :code="fullExample" language="typescript" />
      </template>
    </ComponentShowcase>

    <!-- 2. useCrudStore Showcase -->
    <ComponentShowcase title="useCrudStore - CRUD with localStorage"
      description="Composable for managing CRUD operations with automatic localStorage persistence. Provides reactive state and complete CRUD methods.">
      <template #preview>
        <div class="showcase-content">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <Card class="stat-card">
              <div class="stat-card__content">
                <span class="stat-card__label">Total Users</span>
                <span class="stat-card__value">{{ userStore.count }}</span>
              </div>
            </Card>

            <Card class="stat-card">
              <div class="stat-card__content">
                <span class="stat-card__label">Filtered Results</span>
                <span class="stat-card__value">{{ tableState.filteredTotal }}</span>
              </div>
            </Card>

            <Card class="stat-card">
              <div class="stat-card__content">
                <span class="stat-card__label">Selected</span>
                <span class="stat-card__value">{{ selection.count }}</span>
              </div>
            </Card>
          </div>
        </div>
      </template>

      <template #code>
        <CodeBlock :code="crudStoreExample" language="typescript" />
      </template>
    </ComponentShowcase>

    <!-- 3. useTableState Showcase -->
    <ComponentShowcase title="useTableState - High-level Table Composable"
      description="Combines search, sorting, and pagination into a single composable. Perfect for complex tables.">
      <template #preview>
        <Card>
          <div class="table-state-demo">
            <div class="demo-controls">
              <InputWithAddon v-model="demoTableState.searchTerm.value" placeholder="Search users..." type="search">
                <template #prefix>
                  <Icon name="search" type="ui" size="sm" />
                </template>
              </InputWithAddon>
              <div class="demo-stats">
                <span>Page: {{ demoTableState.currentPage.value }} / {{ demoTableState.totalPages.value }}</span>
                <span>|</span>
                <span>Showing: {{ demoTableState.displayedItems.value.length }} items</span>
                <span>|</span>
                <span>Filtered: {{ demoTableState.filteredTotal.value }} total</span>
              </div>
            </div>
            <p class="demo-note">
              ℹ️ Try searching above to see real-time filtering. This demo is independent from the main CRUD table.
            </p>
          </div>
        </Card>
      </template>

      <template #code>
        <CodeBlock :code="tableStateExample" language="typescript" />
      </template>
    </ComponentShowcase>

    <!-- 4. useValidation Showcase -->
    <ComponentShowcase title="useValidation - Custom Validation System"
      description="Composable for form validation without external dependencies. Includes 9 built-in validators.">
      <template #preview>
        <Card>
          <div class="validation-demo">
            <div class="demo-errors" v-if="Object.keys(validation.errors.value).length > 0">
              <h4>Current Validation Errors:</h4>
              <ul>
                <li v-for="(error, field) in validation.errors.value" :key="field">
                  <strong>{{ field }}:</strong> {{ error }}
                </li>
              </ul>
            </div>
            <div v-else class="demo-success">
              ✅ No validation errors! Form is valid.
            </div>
            <p class="demo-note">
              💡 Validation runs automatically when you submit the create/edit forms above.
              Open DevTools Console to see validation in action.
            </p>
          </div>
        </Card>
      </template>

      <template #code>
        <CodeBlock :code="validationExample" language="typescript" />
      </template>
    </ComponentShowcase>

    <!-- Create Modal -->
    <Modal :model-value="createModal.isOpen.value" title="Create User"
      @update:model-value="createModal.isOpen.value = $event" @close="createModal.close(); validation.clearErrors()">
      <DynamicForm v-model="formData" :schema="formFields" hide-submit />

      <!-- Validation Errors Display -->
      <div v-if="Object.keys(validation.errors.value).length > 0" class="validation-errors">
        <div class="validation-error-header">
          <Icon name="warning" type="ui" size="sm" />
          <span>Please fix the following errors:</span>
        </div>
        <ul class="validation-error-list">
          <li v-for="(error, field) in validation.errors.value" :key="field">
            <strong>{{ field }}:</strong> {{ error }}
          </li>
        </ul>
      </div>

      <template #footer>
        <Btn variant="ghost" @click="createModal.close(); validation.clearErrors()">
          Cancel
        </Btn>
        <Btn variant="primary" @click="handleCreate">
          Create
        </Btn>
      </template>
    </Modal>

    <!-- Edit Modal -->
    <Modal :model-value="editModal.isOpen.value" title="Edit User" @update:model-value="editModal.isOpen.value = $event"
      @close="editModal.close(); validation.clearErrors()">
      <DynamicForm v-model="formData" :schema="formFields" hide-submit />

      <!-- Validation Errors Display -->
      <div v-if="Object.keys(validation.errors.value).length > 0" class="validation-errors">
        <div class="validation-error-header">
          <Icon name="warning" type="ui" size="sm" />
          <span>Please fix the following errors:</span>
        </div>
        <ul class="validation-error-list">
          <li v-for="(error, field) in validation.errors.value" :key="field">
            <strong>{{ field }}:</strong> {{ error }}
          </li>
        </ul>
      </div>

      <template #footer>
        <Btn variant="ghost" @click="editModal.close(); validation.clearErrors()">
          Cancel
        </Btn>
        <Btn variant="primary" @click="handleUpdate">
          Update
        </Btn>
      </template>
    </Modal>

    <!-- View Modal (Read-only) -->
    <Modal :model-value="viewModal.isOpen.value" title="User Details"
      @update:model-value="viewModal.isOpen.value = $event" @close="viewModal.close()">
      <div v-if="selectedUser" class="user-details">
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value">{{ selectedUser.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">{{ selectedUser.email }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Role:</span>
          <span class="badge" :style="{ backgroundColor: getRoleBadgeColor(selectedUser.role) }">
            {{ selectedUser.role }}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="badge" :style="{ backgroundColor: getStatusBadgeColor(selectedUser.status) }">
            {{ selectedUser.status }}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Created:</span>
          <span class="detail-value">{{ formatDate(selectedUser.createdAt) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Updated:</span>
          <span class="detail-value">{{ formatDate(selectedUser.updatedAt) }}</span>
        </div>
      </div>

      <template #footer>
        <Btn variant="ghost" @click="viewModal.close()">
          Close
        </Btn>
        <Btn variant="primary" @click="viewModal.close(); openEditModal(selectedUser!)">
          Edit User
        </Btn>
      </template>
    </Modal>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :is-open="showDeleteDialog" variant="danger" title="Delete User?"
      :message="`Are you sure you want to delete user '${selectedUser?.name}'? This action cannot be undone.`"
      confirm-text="Delete" cancel-text="Cancel" @confirm="handleDelete" @cancel="showDeleteDialog = false"
      @close="showDeleteDialog = false" />

    <!-- Bulk Delete Confirmation Dialog -->
    <AlertDialog :is-open="showBulkDeleteDialog" variant="danger" title="Delete Multiple Users?"
      :message="`Are you sure you want to delete ${selection.count.value} user(s)? This action cannot be undone.`"
      confirm-text="Delete All" cancel-text="Cancel" @confirm="confirmBulkDelete" @cancel="showBulkDeleteDialog = false"
      @close="showBulkDeleteDialog = false" />
  </div>
</template>

<style lang="scss" scoped>
.crud-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);

  &__header {
    h1 {
      margin: 0 0 var(--spacing-xs);
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .subtitle {
      margin: 0;
      font-size: var(--font-size-md);
      color: var(--color-text-secondary);
      max-width: 800px;
    }
  }

  // Força o Card da tabela CRUD a ocupar toda a largura do showcase
  :deep(.component-showcase__preview) {
    .card {
      width: 100%;
      max-width: 100%;
    }
  }
}

// Showcase-specific styles
.showcase-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.showcase-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  padding: var(--spacing-sm) 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-md);
  }

  &__label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-text-primary);
  }
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: white;
  text-transform: capitalize;
}

.actions-cell {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;

  .detail-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border);

    &:last-child {
      border-bottom: none;
    }
  }

  .detail-label {
    min-width: 100px;
    font-weight: 600;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .detail-value {
    flex: 1;
    color: var(--color-text-primary);
  }
}

.warning-text {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

// Demo showcases styles
.table-state-demo,
.validation-demo {
  padding: var(--spacing-md);
}

.demo-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.demo-stats {
  display: flex;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  align-items: center;
}

.demo-note {
  margin: var(--spacing-md) 0 0;
  padding: var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-left: 3px solid var(--color-info);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

// ============================================
// TABLE HEADER & TOOLBAR
// ============================================

// Header: Título + Stats (primeira linha)
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-lg);
  flex-wrap: wrap;

  &__stats {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
  }
}

.table-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

// Toolbar Groups (dentro do DataTable actions slot)
.table-toolbar__left {
  flex: 1;
  display: flex;
  min-width: 250px;
  max-width: 400px;

  .search-input {
    width: 100%;
  }
}

.table-toolbar__right {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  margin-left: auto;
}

// Custom Pagination Controls
.custom-pagination {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);

  .pagination-info {
    flex: 1;
    min-width: 200px;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .rows-per-page {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    .rows-select {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--color-border-hover);
      }

      &:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 0;
      }
    }
  }

  .page-nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    .page-current {
      padding: 0 var(--spacing-sm);
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }
}

// Stats items
.stat-item {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);

  .stat-label {
    color: var(--color-text-secondary);
    font-weight: 500;
    font-size: var(--font-size-sm);
  }

  .stat-value {
    color: var(--color-primary);
    font-weight: 700;
    font-size: var(--font-size-lg);
    line-height: 1;
  }
}

// Legacy table-controls (manter para compatibilidade)
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-md);
  flex-wrap: wrap;

  &__stats {
    display: flex;
    gap: var(--spacing-lg);
    align-items: center;
  }

  &__search {
    flex: 1;
    min-width: 200px;
    max-width: 400px;

    .search-input {
      width: 100%;
    }
  }

  &__actions {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
  }
}

.demo-errors {
  padding: var(--spacing-md);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);

  h4 {
    margin: 0 0 var(--spacing-sm);
    color: var(--color-error);
    font-size: var(--font-size-sm);
  }

  ul {
    margin: 0;
    padding-left: var(--spacing-lg);
    list-style-type: disc;
  }

  li {
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
  }
}

.demo-success {
  padding: var(--spacing-md);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-success);
  font-weight: 600;
}

// Validation Errors in Modals
.validation-errors {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);

  .validation-error-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
    color: var(--color-error);
    font-weight: 600;
    font-size: var(--font-size-sm);
  }

  .validation-error-list {
    margin: 0;
    padding-left: var(--spacing-lg);
    list-style-type: disc;

    li {
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);

      strong {
        color: var(--color-error);
        text-transform: capitalize;
      }
    }
  }
}
</style>
