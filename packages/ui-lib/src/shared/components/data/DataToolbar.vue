<script setup lang="ts">
/**
 * DataToolbar - Toolbar genérico para exibição de dados
 * Componente modular com slots para máxima customização
 * Casos de uso: listagens, tabelas, grids, galerias
 */

export interface SortOption {
    label: string
    value: string
}

interface Props {
    /** Total de items na coleção */
    totalItems?: number
    
    /** Label do contador (ex: "produtos", "usuários", "items") */
    itemsLabel?: string
    
    /** Valor atual do sort */
    sortValue?: string
    
    /** Opções de ordenação */
    sortOptions?: SortOption[]
    
    /** Label do sort select */
    sortLabel?: string
    
    /** Mostra contador de resultados */
    showCount?: boolean
    
    /** Mostra sort selector */
    showSort?: boolean
    
    /** Variant visual */
    variant?: 'default' | 'compact' | 'inline'
    
    /** Posição do layout */
    layout?: 'space-between' | 'start' | 'end' | 'center'
}

withDefaults(defineProps<Props>(), {
    totalItems: 0,
    itemsLabel: 'items',
    sortLabel: 'Ordenar por:',
    showCount: true,
    showSort: true,
    variant: 'default',
    layout: 'space-between'
})

const emit = defineEmits<{
    'update:sort': [value: string]
}>()

const handleSortChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value
    emit('update:sort', value)
}
</script>

<template>
    <div 
        class="data-toolbar" 
        :class="[
            `data-toolbar--${variant}`,
            `data-toolbar--${layout}`
        ]"
    >
        <!-- Left: Count + Custom slot -->
        <div class="data-toolbar__left">
            <!-- Count -->
            <div v-if="showCount" class="data-toolbar__count">
                <strong>{{ totalItems }}</strong>
                <span>{{ itemsLabel }}</span>
                <slot name="count-suffix" />
            </div>
            
            <!-- Slot: Before (adicionar conteúdo customizado à esquerda) -->
            <slot name="before" />
        </div>

        <!-- Center: Custom slot -->
        <div v-if="$slots.center" class="data-toolbar__center">
            <slot name="center" />
        </div>

        <!-- Right: Sort + Custom slot -->
        <div class="data-toolbar__right">
            <!-- Slot: Actions (botões, filtros, etc) -->
            <slot name="actions" />
            
            <!-- Sort -->
            <div v-if="showSort && sortOptions && sortOptions.length > 0" class="data-toolbar__sort">
                <label v-if="sortLabel" :for="`sort-${$.uid}`" class="sort-label">
                    {{ sortLabel }}
                </label>
                <select 
                    :id="`sort-${$.uid}`"
                    class="sort-select"
                    :value="sortValue"
                    @change="handleSortChange"
                >
                    <option 
                        v-for="option in sortOptions" 
                        :key="option.value" 
                        :value="option.value"
                    >
                        {{ option.label }}
                    </option>
                </select>
            </div>
            
            <!-- Slot: After (adicionar conteúdo customizado à direita) -->
            <slot name="after" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.data-toolbar {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    // Layout variants
    &--space-between {
        justify-content: space-between;
    }

    &--start {
        justify-content: flex-start;
    }

    &--end {
        justify-content: flex-end;
    }

    &--center {
        justify-content: center;
    }

    // Visual variants
    &--compact {
        padding: var(--spacing-sm) var(--spacing-md);
        gap: var(--spacing-md);
    }

    &--inline {
        background: transparent;
        border: none;
        box-shadow: none;
        padding: var(--spacing-sm) 0;
    }

    // Sections
    &__left,
    &__center,
    &__right {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    &__left {
        flex: 1;
    }

    &__center {
        flex-shrink: 0;
    }

    &__right {
        flex-shrink: 0;
        justify-content: flex-end;
    }

    // Count
    &__count {
        display: flex;
        align-items: baseline;
        gap: var(--spacing-xs);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);

        strong {
            font-size: var(--font-size-lg);
            font-weight: var(--font-weight-bold);
            color: var(--primary-600);
        }
    }

    // Sort
    &__sort {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .sort-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        white-space: nowrap;
    }

    .sort-select {
        padding: var(--spacing-xs) var(--spacing-sm);
        border: 1px solid var(--color-border-base);
        border-radius: var(--radius-sm);
        background: var(--color-bg-elevated);
        color: var(--color-text-primary);
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: all 0.2s;
        min-width: 150px;

        &:hover {
            border-color: var(--primary-400);
        }

        &:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 3px var(--primary-50);
        }
    }

    // Responsive
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-sm);

        &__left,
        &__center,
        &__right {
            width: 100%;
        }

        &__right {
            justify-content: stretch;
        }

        &__sort {
            flex-direction: column;
            align-items: stretch;

            .sort-label {
                font-size: var(--font-size-xs);
            }

            .sort-select {
                width: 100%;
            }
        }

        &--inline {
            padding: var(--spacing-sm);
        }
    }
}
</style>
