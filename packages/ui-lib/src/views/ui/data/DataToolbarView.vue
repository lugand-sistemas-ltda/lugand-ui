<script setup lang="ts">
import { ref } from 'vue'
import { 
    DataToolbar, 
    Button, 
    Badge,
    ComponentShowcase, 
    CodeBlock 
} from '@/shared/components'
import type { SortOption } from '@/shared/components/data/DataToolbar.vue'

// Mock data genérica
const totalUsers = ref(245)
const totalOrders = ref(1523)
const totalFiles = ref(89)

const sortValue = ref('name')
const userSortValue = ref('newest')
const orderSortValue = ref('date-desc')

// Sort options genéricas (reutilizáveis para qualquer entidade)
const basicSortOptions: SortOption[] = [
    { label: 'Nome (A-Z)', value: 'name' },
    { label: 'Data (Mais Recente)', value: 'date-desc' },
    { label: 'Data (Mais Antigo)', value: 'date-asc' }
]

const userSortOptions: SortOption[] = [
    { label: 'Mais Recentes', value: 'newest' },
    { label: 'Nome', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'status' }
]

const orderSortOptions: SortOption[] = [
    { label: 'Data Decrescente', value: 'date-desc' },
    { label: 'Data Crescente', value: 'date-asc' },
    { label: 'Valor Alto → Baixo', value: 'value-desc' },
    { label: 'Valor Baixo → Alto', value: 'value-asc' },
    { label: 'Status', value: 'status' }
]

const codeBasic = `<DataToolbar
  :total-items="245"
  items-label="usuários"
  :sort-value="sortValue"
  :sort-options="sortOptions"
  @update:sort="sortValue = $event"
/>`

const codeWithSlots = `<DataToolbar
  :total-items="totalItems"
  items-label="pedidos"
  :sort-value="sort"
  :sort-options="sortOptions"
  @update:sort="handleSort"
>
  <!-- Slot: actions (botões customizados) -->
  <template #actions>
    <Button variant="secondary" size="sm">
      Filtrar
    </Button>
    <Button variant="primary" size="sm">
      Novo Pedido
    </Button>
  </template>
</DataToolbar>`

const codeCustomCount = `<DataToolbar
  :total-items="89"
  items-label="arquivos"
  :show-sort="false"
>
  <!-- Slot: count-suffix (badge customizado) -->
  <template #count-suffix>
    <Badge variant="warning" size="sm">
      3 pendentes
    </Badge>
  </template>

  <!-- Slot: actions -->
  <template #actions>
    <Button variant="ghost" size="sm">
      Upload
    </Button>
  </template>
</DataToolbar>`

const codeCompact = `<DataToolbar
  :total-items="45"
  items-label="tarefas"
  variant="compact"
  layout="start"
>
  <template #after>
    <Button size="sm">+ Nova</Button>
  </template>
</DataToolbar>`

const codeInline = `<DataToolbar
  :total-items="12"
  items-label="notificações"
  variant="inline"
  :show-sort="false"
>
  <template #actions>
    <Button variant="ghost" size="sm">
      Marcar todas
    </Button>
  </template>
</DataToolbar>`
</script>

<template>
    <div class="data-toolbar-view">
        <h1>DataToolbar</h1>
        <p class="lead">
            Toolbar genérico e modular para exibição de dados com contador, ordenação e slots customizáveis.
            Use para listagens, tabelas, grids, galerias - qualquer coleção de dados.
        </p>

        <!-- 1. Básico -->
        <ComponentShowcase
            title="DataToolbar Básico"
            description="Contador de items + selector de ordenação. Totalmente genérico e reutilizável."
        >
            <template #preview>
                <DataToolbar
                    :total-items="totalUsers"
                    items-label="usuários encontrados"
                    :sort-value="userSortValue"
                    :sort-options="userSortOptions"
                    @update:sort="userSortValue = $event"
                />
            </template>

            <template #code>
                <CodeBlock :code="codeBasic" />
            </template>
        </ComponentShowcase>

        <!-- 2. Com Slots Actions -->
        <ComponentShowcase
            title="Com Slots de Ações"
            description="Use o slot 'actions' para adicionar botões, filtros ou qualquer conteúdo customizado."
        >
            <template #preview>
                <DataToolbar
                    :total-items="totalOrders"
                    items-label="pedidos"
                    :sort-value="orderSortValue"
                    :sort-options="orderSortOptions"
                    @update:sort="orderSortValue = $event"
                >
                    <template #actions>
                        <Button variant="ghost" size="sm">
                            📊 Exportar
                        </Button>
                        <Button variant="secondary" size="sm">
                            🔍 Filtrar
                        </Button>
                        <Button variant="primary" size="sm">
                            + Novo Pedido
                        </Button>
                    </template>
                </DataToolbar>
            </template>

            <template #code>
                <CodeBlock :code="codeWithSlots" />
            </template>
        </ComponentShowcase>

        <!-- 3. Custom Count + Badge -->
        <ComponentShowcase
            title="Contador Customizado"
            description="Use 'count-suffix' para adicionar badges ou informações extras ao contador."
        >
            <template #preview>
                <DataToolbar
                    :total-items="totalFiles"
                    items-label="arquivos"
                    :show-sort="false"
                >
                    <template #count-suffix>
                        <Badge variant="warning" size="sm">
                            3 pendentes
                        </Badge>
                    </template>

                    <template #actions>
                        <Button variant="ghost" size="sm">
                            📤 Upload
                        </Button>
                        <Button variant="secondary" size="sm">
                            📁 Nova Pasta
                        </Button>
                    </template>
                </DataToolbar>
            </template>

            <template #code>
                <CodeBlock :code="codeCustomCount" />
            </template>
        </ComponentShowcase>

        <!-- 4. Variante Compact -->
        <ComponentShowcase
            title="Variante Compact"
            description="Versão compacta com padding reduzido. Ideal para espaços menores."
        >
            <template #preview>
                <DataToolbar
                    :total-items="45"
                    items-label="tarefas"
                    variant="compact"
                    layout="start"
                    :show-sort="false"
                >
                    <template #after>
                        <Badge variant="success" size="sm">28 concluídas</Badge>
                        <Badge variant="error" size="sm">5 atrasadas</Badge>
                        <Button variant="primary" size="sm">+ Nova Tarefa</Button>
                    </template>
                </DataToolbar>
            </template>

            <template #code>
                <CodeBlock :code="codeCompact" />
            </template>
        </ComponentShowcase>

        <!-- 5. Variante Inline -->
        <ComponentShowcase
            title="Variante Inline"
            description="Versão inline sem background/border. Ideal para integrar em outros componentes."
        >
            <template #preview>
                <DataToolbar
                    :total-items="12"
                    items-label="notificações não lidas"
                    variant="inline"
                    :show-sort="false"
                >
                    <template #actions>
                        <Button variant="ghost" size="sm">
                            ✓ Marcar todas como lidas
                        </Button>
                        <Button variant="secondary" size="sm">
                            ⚙️ Configurações
                        </Button>
                    </template>
                </DataToolbar>
            </template>

            <template #code>
                <CodeBlock :code="codeInline" />
            </template>
        </ComponentShowcase>

        <!-- 6. Layouts Diferentes -->
        <ComponentShowcase
            title="Layouts Disponíveis"
            description="Controle a disposição dos elementos com a prop 'layout'."
        >
            <template #preview>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <!-- Space Between (default) -->
                    <div>
                        <p style="margin-bottom: 8px; font-size: 0.875rem; color: var(--color-text-secondary);">
                            <strong>space-between</strong> (default)
                        </p>
                        <DataToolbar
                            :total-items="100"
                            items-label="items"
                            layout="space-between"
                            :sort-value="sortValue"
                            :sort-options="basicSortOptions"
                            @update:sort="sortValue = $event"
                        />
                    </div>

                    <!-- Start -->
                    <div>
                        <p style="margin-bottom: 8px; font-size: 0.875rem; color: var(--color-text-secondary);">
                            <strong>start</strong>
                        </p>
                        <DataToolbar
                            :total-items="100"
                            items-label="items"
                            layout="start"
                            :sort-value="sortValue"
                            :sort-options="basicSortOptions"
                            @update:sort="sortValue = $event"
                        />
                    </div>

                    <!-- End -->
                    <div>
                        <p style="margin-bottom: 8px; font-size: 0.875rem; color: var(--color-text-secondary);">
                            <strong>end</strong>
                        </p>
                        <DataToolbar
                            :total-items="100"
                            items-label="items"
                            layout="end"
                            :sort-value="sortValue"
                            :sort-options="basicSortOptions"
                            @update:sort="sortValue = $event"
                        />
                    </div>

                    <!-- Center -->
                    <div>
                        <p style="margin-bottom: 8px; font-size: 0.875rem; color: var(--color-text-secondary);">
                            <strong>center</strong>
                        </p>
                        <DataToolbar
                            :total-items="100"
                            items-label="items"
                            layout="center"
                            :show-sort="false"
                        >
                            <template #actions>
                                <Button size="sm">Ação</Button>
                            </template>
                        </DataToolbar>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`layout='space-between' | 'start' | 'end' | 'center'`" />
            </template>
        </ComponentShowcase>

        <!-- 7. Exemplo Completo (Genérico) -->
        <ComponentShowcase
            title="Exemplo Completo - Gestão de Dados"
            description="Toolbar completo com todas as features. Totalmente genérico e adaptável."
        >
            <template #preview>
                <DataToolbar
                    :total-items="1523"
                    items-label="registros encontrados"
                    :sort-value="orderSortValue"
                    :sort-options="orderSortOptions"
                    sort-label="Ordenar:"
                    @update:sort="orderSortValue = $event"
                >
                    <template #count-suffix>
                        <Badge variant="info" size="sm">↻ Atualizado agora</Badge>
                    </template>

                    <template #before>
                        <Badge variant="success" size="sm">1200 ativos</Badge>
                        <Badge variant="warning" size="sm">250 pendentes</Badge>
                        <Badge variant="error" size="sm">73 inativos</Badge>
                    </template>

                    <template #actions>
                        <Button variant="ghost" size="sm">
                            📥 Importar
                        </Button>
                        <Button variant="ghost" size="sm">
                            📊 Exportar
                        </Button>
                        <Button variant="secondary" size="sm">
                            🔍 Filtros Avançados
                        </Button>
                        <Button variant="primary" size="sm">
                            + Adicionar Novo
                        </Button>
                    </template>
                </DataToolbar>
            </template>

            <template #code>
                <CodeBlock :code="codeWithSlots" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.data-toolbar-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.lead {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
}
</style>
