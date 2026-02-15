<script setup lang="ts">
import { ref } from 'vue'

/**
 * FilterSection - Seção de filtro colapsável
 * Componente base para agrupar filtros com título e conteúdo
 */

interface Props {
    /** Título da seção */
    title: string
    
    /** Ícone opcional (emoji ou nome) */
    icon?: string
    
    /** Se a seção é colapsável */
    collapsible?: boolean
    
    /** Estado inicial (expandido/colapsado) */
    defaultExpanded?: boolean
    
    /** Mostra divider inferior */
    divider?: boolean
    
    /** Variant visual */
    variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
    collapsible: false,
    defaultExpanded: true,
    divider: true,
    variant: 'default'
})

const isExpanded = ref(props.defaultExpanded)

const toggleExpanded = () => {
    if (props.collapsible) {
        isExpanded.value = !isExpanded.value
    }
}
</script>

<template>
    <div 
        class="filter-section" 
        :class="[
            `filter-section--${variant}`,
            { 
                'filter-section--no-divider': !divider,
                'filter-section--collapsible': collapsible,
                'filter-section--collapsed': collapsible && !isExpanded
            }
        ]"
    >
        <div 
            class="filter-section__header"
            :class="{ 'filter-section__header--clickable': collapsible }"
            @click="toggleExpanded"
        >
            <div class="filter-section__title-row">
                <span v-if="icon" class="filter-section__icon">{{ icon }}</span>
                <h3 class="filter-section__title">{{ title }}</h3>
            </div>
            
            <button 
                v-if="collapsible" 
                class="filter-section__toggle"
                type="button"
                :aria-label="isExpanded ? 'Recolher' : 'Expandir'"
                :aria-expanded="isExpanded"
            >
                <span class="toggle-icon">{{ isExpanded ? '▼' : '▶' }}</span>
            </button>
        </div>

        <Transition name="filter-content">
            <div v-if="isExpanded" class="filter-section__content">
                <slot />
            </div>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
.filter-section {
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-light);

    &--no-divider {
        border-bottom: none;
    }

    &--compact {
        margin-bottom: var(--spacing-md);
        padding-bottom: var(--spacing-md);
    }

    &:last-child {
        border-bottom: none;
    }

    // Header
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
        gap: var(--spacing-sm);

        &--clickable {
            cursor: pointer;
            user-select: none;
            padding: var(--spacing-xs);
            margin: calc(-1 * var(--spacing-xs));
            border-radius: var(--radius-sm);
            transition: background-color 0.2s;

            &:hover {
                background-color: var(--color-bg-secondary);
            }
        }
    }

    &__title-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex: 1;
    }

    &__icon {
        font-size: 1.125rem;
        line-height: 1;
    }

    &__title {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        text-transform: uppercase;
        color: var(--color-text-tertiary);
        margin: 0;
        letter-spacing: 0.5px;
        line-height: 1.2;
    }

    &__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        color: var(--color-text-tertiary);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background-color: var(--color-bg-tertiary);
            color: var(--color-text-secondary);
        }

        .toggle-icon {
            font-size: 0.625rem;
            transition: transform 0.2s;
        }
    }

    &--collapsed &__toggle .toggle-icon {
        transform: rotate(0deg);
    }

    // Content
    &__content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    // Compact variant
    &--compact &__header {
        margin-bottom: var(--spacing-sm);
    }

    &--compact &__title {
        font-size: var(--font-size-xs);
    }

    &--compact &__content {
        gap: var(--spacing-xs);
    }
}

// Transition
.filter-content-enter-active,
.filter-content-leave-active {
    transition: all 0.2s ease;
    overflow: hidden;
}

.filter-content-enter-from,
.filter-content-leave-to {
    opacity: 0;
    max-height: 0;
    margin-bottom: 0;
}

.filter-content-enter-to,
.filter-content-leave-from {
    opacity: 1;
    max-height: 1000px;
}
</style>
