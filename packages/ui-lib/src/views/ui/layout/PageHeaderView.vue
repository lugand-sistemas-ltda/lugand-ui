<script setup lang="ts">
import { PageHeader, Button, ComponentShowcase, CodeBlock } from '@/shared/components'
import { ref } from 'vue'
import type { Breadcrumb } from '@/shared/components/layout/PageHeader.vue'

const breadcrumbs = ref<Breadcrumb[]>([
    { label: 'Home', icon: '🏠' },
    { label: 'E-commerce', icon: '🛒' },
    { label: 'Produtos' }
])

const handleBreadcrumbClick = (breadcrumb: Breadcrumb, index: number) => {
    console.log('Breadcrumb clicked:', breadcrumb.label, 'at index:', index)
}

const codeBasic = `<PageHeader
  title="Minha Página"
  subtitle="Descrição da página"
/>`

const codeWithIcon = `<PageHeader
  icon="📦"
  title="Produtos"
  subtitle="Gerencie seu catálogo"
  :count="245"
  count-label="produtos"
  count-variant="primary"
/>`

const codeBreadcrumbs = `<script setup>
const breadcrumbs = [
  { label: 'Home', icon: '🏠' },
  { label: 'E-commerce', icon: '🛒' },
  { label: 'Produtos' }
]
</script>

<PageHeader
  icon="📦"
  title="Catálogo de Produtos"
  :breadcrumbs="breadcrumbs"
  @breadcrumb-click="handleClick"
/>`

const codeWithSlots = `<PageHeader
  icon="📦"
  title="Produtos"
  subtitle="Gerencie seu catálogo"
  :count="245"
  count-label="produtos"
>
  <template #meta>
    <span>📅 Última atualização: Hoje</span>
  </template>

  <template #actions>
    <Button variant="secondary">Filtrar</Button>
    <Button variant="primary">+ Novo Produto</Button>
  </template>
</PageHeader>`

const codeVariants = `<!-- Primary Count -->
<PageHeader
  title="Vendas"
  :count="1234"
  count-variant="primary"
/>

<!-- Success Count -->
<PageHeader
  title="Pedidos Aprovados"
  :count="89"
  count-variant="success"
/>

<!-- Warning Count -->
<PageHeader
  title="Pendentes"
  :count="15"
  count-variant="warning"
/>

<!-- Error Count -->
<PageHeader
  title="Cancelados"
  :count="3"
  count-variant="error"
/>`
</script>

<template>
    <div class="page-header-view">
        <h1>PageHeader</h1>
        <p class="lead">
            Componente especializado para cabeçalhos de páginas com título, subtítulo, contador, 
            breadcrumbs e slots para ações.
        </p>

        <!-- 1. Básico -->
        <ComponentShowcase
            title="PageHeader Básico"
            description="Uso mais simples com apenas título e subtítulo."
        >
            <template #preview>
                <PageHeader
                    title="Minha Página"
                    subtitle="Uma descrição simples da página"
                />
            </template>

            <template #code>
                <CodeBlock :code="codeBasic" />
            </template>
        </ComponentShowcase>

        <!-- 2. Com Ícone e Contador -->
        <ComponentShowcase
            title="Com Ícone e Contador"
            description="Header com ícone, contador de items e label personalizado."
        >
            <template #preview>
                <PageHeader
                    icon="📦"
                    title="Produtos"
                    subtitle="Gerencie todo seu catálogo de produtos"
                    :count="245"
                    count-label="produtos"
                    count-variant="primary"
                />
            </template>

            <template #code>
                <CodeBlock :code="codeWithIcon" />
            </template>
        </ComponentShowcase>

        <!-- 3. Com Breadcrumbs -->
        <ComponentShowcase
            title="Com Breadcrumbs"
            description="Navegação por breadcrumbs com ícones e interação."
        >
            <template #preview>
                <PageHeader
                    icon="📦"
                    title="Catálogo de Produtos"
                    subtitle="Explore nossa coleção completa"
                    :breadcrumbs="breadcrumbs"
                    @breadcrumb-click="handleBreadcrumbClick"
                />
            </template>

            <template #code>
                <CodeBlock :code="codeBreadcrumbs" />
            </template>
        </ComponentShowcase>

        <!-- 4. Com Slots (Meta + Actions) -->
        <ComponentShowcase
            title="Com Slots Personalizados"
            description="Use slots 'meta' para informações adicionais e 'actions' para botões."
        >
            <template #preview>
                <PageHeader
                    icon="📦"
                    title="Produtos"
                    subtitle="Gerencie seu catálogo completo"
                    :count="245"
                    count-label="produtos"
                    count-variant="primary"
                >
                    <template #meta>
                        <span style="display: flex; gap: 12px; font-size: 0.875rem; color: var(--color-text-secondary);">
                            <span>📅 Última atualização: Hoje</span>
                            <span>|</span>
                            <span>👤 Atualizado por: Admin</span>
                        </span>
                    </template>

                    <template #actions>
                        <Button variant="secondary" size="sm">
                            🔍 Filtrar
                        </Button>
                        <Button variant="primary" size="sm">
                            + Novo Produto
                        </Button>
                    </template>
                </PageHeader>
            </template>

            <template #code>
                <CodeBlock :code="codeWithSlots" />
            </template>
        </ComponentShowcase>

        <!-- 5. Variantes de Contador -->
        <ComponentShowcase
            title="Variantes de Contador"
            description="Diferentes cores para o badge do contador (primary, success, warning, error, info, secondary)."
        >
            <template #preview>
                <div class="variants-grid">
                    <PageHeader
                        title="Vendas Totais"
                        :count="1234"
                        count-label="vendas"
                        count-variant="primary"
                    />

                    <PageHeader
                        title="Pedidos Aprovados"
                        :count="89"
                        count-label="pedidos"
                        count-variant="success"
                    />

                    <PageHeader
                        title="Pendentes"
                        :count="15"
                        count-label="items"
                        count-variant="warning"
                    />

                    <PageHeader
                        title="Cancelados"
                        :count="3"
                        count-label="pedidos"
                        count-variant="error"
                    />

                    <PageHeader
                        title="Em Análise"
                        :count="7"
                        count-label="items"
                        count-variant="info"
                    />

                    <PageHeader
                        title="Arquivados"
                        :count="42"
                        count-label="items"
                        count-variant="secondary"
                    />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeVariants" />
            </template>
        </ComponentShowcase>

        <!-- 6. Exemplo Completo (E-commerce) -->
        <ComponentShowcase
            title="Exemplo Completo - E-commerce"
            description="Header completo com breadcrumbs, contador, meta e ações (como usado em ProductsView)."
        >
            <template #preview>
                <PageHeader
                    icon="🛒"
                    title="Catálogo de Produtos"
                    subtitle="Explore nossa coleção completa com produtos selecionados"
                    :count="245"
                    count-label="produtos"
                    count-variant="primary"
                    :breadcrumbs="[
                        { label: 'Home', icon: '🏠' },
                        { label: 'E-commerce', icon: '🛒' },
                        { label: 'Catálogo' }
                    ]"
                    @breadcrumb-click="handleBreadcrumbClick"
                >
                    <template #meta>
                        <div style="display: flex; gap: 16px; font-size: 0.875rem; color: var(--color-text-secondary);">
                            <span>📅 Atualizado: 15/02/2026</span>
                            <span>|</span>
                            <span>🏷️ 12 categorias</span>
                            <span>|</span>
                            <span>✅ 89% em estoque</span>
                        </div>
                    </template>

                    <template #actions>
                        <Button variant="ghost" size="sm">
                            📊 Exportar
                        </Button>
                        <Button variant="secondary" size="sm">
                            🔍 Filtros Avançados
                        </Button>
                        <Button variant="primary" size="sm">
                            + Adicionar Produto
                        </Button>
                    </template>
                </PageHeader>
            </template>

            <template #code>
                <CodeBlock :code="codeWithSlots" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.page-header-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.lead {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
}

.variants-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}
</style>
