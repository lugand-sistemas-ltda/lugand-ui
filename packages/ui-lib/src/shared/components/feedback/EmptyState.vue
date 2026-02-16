<script setup lang="ts">
/**
 * EmptyState - Componente para estados vazios
 * 
 * Use para: listas vazias, busca sem resultados, erros, estados iniciais
 */
import Button from '../primitives/Button.vue'
import Card from '../display/Card.vue'

interface Props {
    /** Ícone/Emoji exibido no topo */
    icon?: string
    /** Título principal */
    title: string
    /** Descrição opcional */
    description?: string
    /** Label do botão de ação */
    actionLabel?: string
    /** Variante visual (afeta cor do ícone) */
    variant?: 'default' | 'search' | 'error' | 'info'
    /** Tamanho do empty state */
    size?: 'sm' | 'md' | 'lg'
    /** Usar Card como wrapper */
    withCard?: boolean
}

withDefaults(defineProps<Props>(), {
    icon: '📦',
    variant: 'default',
    size: 'md',
    withCard: false
})

const emit = defineEmits<{
    action: []
}>()

const handleAction = () => {
    emit('action')
}
</script>

<template>
    <component :is="withCard ? Card : 'div'" :padding="withCard ? 'xl' : undefined" class="empty-state" :class="[
        `empty-state--${variant}`,
        `empty-state--${size}`
    ]">
        <!-- Icon Slot -->
        <div class="empty-state__icon">
            <slot name="icon">
                <span class="empty-state__icon-text">{{ icon }}</span>
            </slot>
        </div>

        <!-- Content -->
        <div class="empty-state__content">
            <h3 class="empty-state__title">{{ title }}</h3>
            <p v-if="description" class="empty-state__description">{{ description }}</p>

            <!-- Default Slot para conteúdo customizado -->
            <div v-if="$slots.default" class="empty-state__custom">
                <slot />
            </div>
        </div>

        <!-- Actions -->
        <div v-if="actionLabel || $slots.actions" class="empty-state__actions">
            <slot name="actions">
                <Button v-if="actionLabel" variant="primary" @click="handleAction">
                    {{ actionLabel }}
                </Button>
            </slot>
        </div>
    </component>
</template>

<style lang="scss" scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-2xl) var(--spacing-xl);
    width: 100%;

    // Sizes
    &--sm {
        padding: var(--spacing-lg) var(--spacing-md);

        .empty-state__icon-text {
            font-size: 2rem;
        }

        .empty-state__title {
            font-size: 1rem;
        }

        .empty-state__description {
            font-size: 0.875rem;
        }
    }

    &--md {
        padding: var(--spacing-2xl) var(--spacing-xl);

        .empty-state__icon-text {
            font-size: 3rem;
        }

        .empty-state__title {
            font-size: 1.25rem;
        }

        .empty-state__description {
            font-size: 1rem;
        }
    }

    &--lg {
        padding: var(--spacing-3xl) var(--spacing-2xl);

        .empty-state__icon-text {
            font-size: 4rem;
        }

        .empty-state__title {
            font-size: 1.5rem;
        }

        .empty-state__description {
            font-size: 1.125rem;
        }
    }

    // Variants (icon colors)
    &--default {
        .empty-state__icon {
            color: var(--color-text-secondary);
        }
    }

    &--search {
        .empty-state__icon {
            color: var(--color-info);
        }
    }

    &--error {
        .empty-state__icon {
            color: var(--color-error);
        }
    }

    &--info {
        .empty-state__icon {
            color: var(--color-primary);
        }
    }

    &__icon {
        margin-bottom: var(--spacing-lg);
        line-height: 1;
    }

    &__icon-text {
        display: inline-block;
        font-size: 3rem;
        line-height: 1;
    }

    &__content {
        max-width: 480px;
        margin-bottom: var(--spacing-lg);
    }

    &__title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-sm) 0;
    }

    &__description {
        font-size: 1rem;
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.6;
    }

    &__custom {
        margin-top: var(--spacing-md);
    }

    &__actions {
        display: flex;
        gap: var(--spacing-sm);
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>
