<script setup lang="ts">
/**
 * PageHeader - Cabeçalho genérico para páginas
 * Componente especializado para exibir título, subtítulo, contador e breadcrumbs
 * Suporta slots para ações (botões) e meta (informações adicionais)
 */

export interface Breadcrumb {
    label: string
    to?: string
    icon?: string
}

interface Props {
    /** Título principal da página */
    title: string
    
    /** Subtítulo ou descrição da página */
    subtitle?: string
    
    /** Ícone do título (emoji ou nome do ícone) */
    icon?: string
    
    /** Contador de items (ex: "245 produtos", "15 pedidos") */
    count?: number | string
    
    /** Label do contador (ex: "produtos", "items") */
    countLabel?: string
    
    /** Badge variant para o contador */
    countVariant?: 'primary' | 'success' | 'info' | 'warning' | 'error' | 'secondary'
    
    /** Array de breadcrumbs para navegação */
    breadcrumbs?: Breadcrumb[]
    
    /** Mostra divider inferior */
    divider?: boolean
}

withDefaults(defineProps<Props>(), {
    countVariant: 'primary',
    divider: true
})

const emit = defineEmits<{
    breadcrumbClick: [breadcrumb: Breadcrumb, index: number]
}>()

const handleBreadcrumbClick = (breadcrumb: Breadcrumb, index: number) => {
    emit('breadcrumbClick', breadcrumb, index)
}
</script>

<template>
    <header class="page-header" :class="{ 'page-header--no-divider': !divider }">
        <div class="page-header__container">
            <!-- Breadcrumbs -->
            <nav v-if="breadcrumbs && breadcrumbs.length > 0" class="page-header__breadcrumbs">
                <button
                    v-for="(crumb, index) in breadcrumbs"
                    :key="index"
                    class="breadcrumb-item"
                    :class="{ 'breadcrumb-item--active': index === breadcrumbs.length - 1 }"
                    @click="handleBreadcrumbClick(crumb, index)"
                >
                    <span v-if="crumb.icon" class="breadcrumb-icon">{{ crumb.icon }}</span>
                    <span class="breadcrumb-label">{{ crumb.label }}</span>
                </button>
            </nav>

            <!-- Main content -->
            <div class="page-header__main">
                <!-- Left: Title + Subtitle + Counter -->
                <div class="page-header__content">
                    <div class="page-header__title-row">
                        <span v-if="icon" class="page-header__icon">{{ icon }}</span>
                        <h1 class="page-header__title">{{ title }}</h1>
                        <span
                            v-if="count !== undefined"
                            class="page-header__count"
                            :class="`page-header__count--${countVariant}`"
                        >
                            {{ count }} <span v-if="countLabel" class="count-label">{{ countLabel }}</span>
                        </span>
                    </div>
                    
                    <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
                    
                    <!-- Slot: meta (informações adicionais) -->
                    <div v-if="$slots.meta" class="page-header__meta">
                        <slot name="meta" />
                    </div>
                </div>

                <!-- Right: Actions (buttons) -->
                <div v-if="$slots.actions" class="page-header__actions">
                    <slot name="actions" />
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.page-header {
    background: var(--color-bg-elevated);
    border-bottom: 2px solid var(--color-border-base);
    padding: var(--spacing-xl) 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &--no-divider {
        border-bottom: none;
    }

    &__container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 var(--spacing-xl);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    // Breadcrumbs
    &__breadcrumbs {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        flex-wrap: wrap;
        margin-bottom: var(--spacing-sm);
    }

    .breadcrumb-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: all 0.2s;
        position: relative;

        &:not(:last-child)::after {
            content: '›';
            position: absolute;
            right: calc(-1 * var(--spacing-xs) - 4px);
            color: var(--color-text-tertiary);
            font-size: var(--font-size-lg);
        }

        &:hover:not(&--active) {
            background: var(--color-bg-secondary);
            color: var(--color-text-primary);
        }

        &--active {
            color: var(--color-text-primary);
            font-weight: var(--font-weight-semibold);
            cursor: default;
            pointer-events: none;
        }

        .breadcrumb-icon {
            font-size: var(--font-size-base);
        }

        .breadcrumb-label {
            white-space: nowrap;
        }
    }

    // Main content
    &__main {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--spacing-lg);
    }

    &__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    &__title-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
    }

    &__icon {
        font-size: 2rem;
        line-height: 1;
    }

    &__title {
        font-size: 2rem;
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        margin: 0;
        line-height: 1.2;
    }

    &__count {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-full);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        line-height: 1;

        .count-label {
            font-weight: var(--font-weight-normal);
            opacity: 0.9;
        }

        // Variants
        &--primary {
            background: var(--primary-100);
            color: var(--primary-700);
        }

        &--success {
            background: var(--success-100);
            color: var(--success-700);
        }

        &--info {
            background: var(--info-100);
            color: var(--info-700);
        }

        &--warning {
            background: var(--warning-100);
            color: var(--warning-700);
        }

        &--error {
            background: var(--error-100);
            color: var(--error-700);
        }

        &--secondary {
            background: var(--neutral-100);
            color: var(--neutral-700);
        }
    }

    &__subtitle {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.5;
    }

    &__meta {
        margin-top: var(--spacing-xs);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    &__actions {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
    }

    // Responsive
    @media (max-width: 1024px) {
        &__container {
            padding: 0 var(--spacing-lg);
        }
    }

    @media (max-width: 768px) {
        padding: var(--spacing-lg) 0;

        &__container {
            padding: 0 var(--spacing-md);
        }

        &__main {
            flex-direction: column;
            align-items: stretch;
        }

        &__title {
            font-size: 1.5rem;
        }

        &__icon {
            font-size: 1.5rem;
        }

        &__actions {
            width: 100%;
            justify-content: stretch;

            > * {
                flex: 1;
            }
        }

        .breadcrumb-item {
            font-size: var(--font-size-xs);
            padding: var(--spacing-xs);
        }
    }
}
</style>
