<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * FilterSidebar - Container lateral para filtros
 * Componente especializado para sidebar de filtros com suporte a sticky e collapse
 */

interface Props {
    /** Largura da sidebar */
    width?: string | number
    
    /** Se a sidebar é sticky (fixa no scroll) */
    sticky?: boolean
    
    /** Altura máxima quando sticky */
    maxHeight?: string
    
    /** Se a sidebar é colapsável (mobile) */
    collapsible?: boolean
    
    /** Estado inicial (expandido/colapsado) */
    defaultExpanded?: boolean
    
    /** Título da sidebar */
    title?: string
    
    /** Mostra divider à direita */
    divider?: boolean
    
    /** Padding interno */
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    width: '280px',
    sticky: true,
    maxHeight: '100vh',
    collapsible: true,
    defaultExpanded: true,
    divider: true,
    padding: 'lg'
})

const isExpanded = ref(props.defaultExpanded)

const toggleExpanded = () => {
    if (props.collapsible) {
        isExpanded.value = !isExpanded.value
    }
}

const sidebarWidth = computed(() => {
    return typeof props.width === 'number' ? `${props.width}px` : props.width
})

const emit = defineEmits<{
    expand: []
    collapse: []
}>()

const handleToggle = () => {
    toggleExpanded()
    if (isExpanded.value) {
        emit('expand')
    } else {
        emit('collapse')
    }
}
</script>

<template>
    <aside 
        class="filter-sidebar" 
        :class="[
            `filter-sidebar--padding-${padding}`,
            {
                'filter-sidebar--sticky': sticky,
                'filter-sidebar--divider': divider,
                'filter-sidebar--collapsible': collapsible,
                'filter-sidebar--collapsed': collapsible && !isExpanded
            }
        ]"
        :style="{ '--sidebar-width': sidebarWidth, '--sidebar-max-height': maxHeight }"
    >
        <!-- Header (mobile toggle) -->
        <div 
            v-if="collapsible || title" 
            class="filter-sidebar__header"
            :class="{ 'filter-sidebar__header--clickable': collapsible }"
            @click="collapsible ? handleToggle() : null"
        >
            <h2 v-if="title" class="filter-sidebar__title">{{ title }}</h2>
            <button 
                v-if="collapsible"
                class="filter-sidebar__toggle"
                type="button"
                :aria-label="isExpanded ? 'Recolher filtros' : 'Expandir filtros'"
                :aria-expanded="isExpanded"
            >
                <span class="toggle-icon">{{ isExpanded ? '✕' : '☰' }}</span>
            </button>
        </div>

        <!-- Content -->
        <Transition name="sidebar-content">
            <div v-if="isExpanded || !collapsible" class="filter-sidebar__content">
                <slot />
            </div>
        </Transition>

        <!-- Actions (slot for buttons like "Clear All") -->
        <div v-if="$slots.actions && (isExpanded || !collapsible)" class="filter-sidebar__actions">
            <slot name="actions" />
        </div>
    </aside>
</template>

<style lang="scss" scoped>
.filter-sidebar {
    --sidebar-width: 280px;
    --sidebar-max-height: 100vh;
    
    background: var(--color-bg-secondary);
    border-right: 2px solid var(--color-border-base);
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width);
    flex-shrink: 0;

    &--divider {
        border-right: 2px solid var(--color-border-base);
    }

    &--sticky {
        position: sticky;
        top: 0;
        height: var(--sidebar-max-height);
        overflow-y: auto;
        
        // Scrollbar customizada
        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: var(--color-bg-secondary);
        }

        &::-webkit-scrollbar-thumb {
            background: var(--color-border-base);
            border-radius: 3px;

            &:hover {
                background: var(--color-text-tertiary);
            }
        }
    }

    // Padding variants
    &--padding-none {
        .filter-sidebar__content {
            padding: 0;
        }
    }

    &--padding-sm {
        .filter-sidebar__content {
            padding: var(--spacing-sm);
        }
    }

    &--padding-md {
        .filter-sidebar__content {
            padding: var(--spacing-md);
        }
    }

    &--padding-lg {
        .filter-sidebar__content {
            padding: var(--spacing-xl) var(--spacing-lg);
        }
    }

    // Header
    &__header {
        display: none; // Hidden by default, shown on mobile or when title is set
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--color-border-base);
        background: var(--color-bg-elevated);

        &--clickable {
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s;

            &:hover {
                background: var(--color-bg-secondary);
            }
        }
    }

    &__title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
    }

    &__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
        }

        .toggle-icon {
            font-size: 1.25rem;
            font-weight: 300;
        }
    }

    // Content
    &__content {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-xl) var(--spacing-lg);
    }

    // Actions
    &__actions {
        padding: var(--spacing-lg);
        border-top: 1px solid var(--color-border-base);
        background: var(--color-bg-elevated);
    }

    // Responsive - Mobile
    @media (max-width: 1024px) {
        position: static;
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 2px solid var(--color-border-base);

        &__header {
            display: flex;
        }

        &--collapsed {
            .filter-sidebar__content,
            .filter-sidebar__actions {
                display: none;
            }
        }

        &--sticky {
            position: static;
            height: auto;
            overflow-y: visible;
        }
    }
}

// Transitions
.sidebar-content-enter-active,
.sidebar-content-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.sidebar-content-enter-from,
.sidebar-content-leave-to {
    opacity: 0;
    max-height: 0;
}

.sidebar-content-enter-to,
.sidebar-content-leave-from {
    opacity: 1;
    max-height: 2000px;
}
</style>
