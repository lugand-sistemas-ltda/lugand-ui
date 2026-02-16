<script setup lang="ts">
import { computed } from 'vue'

/**
 * ActionButton - Botões de ação rápida pré-configurados
 * 
 * Botões especializados para ações comuns (Like, Favorite, Share, AddToCart)
 * com estados, contadores e animações integradas.
 * 
 * @example
 * ```vue
 * <!-- Like button -->
 * <ActionButton type="like" :active="isLiked" @click="toggleLike" />
 * <ActionButton type="like" :count="42" @click="toggleLike" />
 * 
 * <!-- Favorite -->
 * <ActionButton type="favorite" :active="isFavorite" @click="toggleFavorite" />
 * 
 * <!-- Add to Cart -->
 * <ActionButton type="cart" :loading="adding" @click="addToCart" />
 * 
 * <!-- Share -->
 * <ActionButton type="share" @click="share" />
 * 
 * <!-- Custom -->
 * <ActionButton icon="🔔" label="Notificar" :count="5" @click="notify" />
 * ```
 */

interface Props {
    /** Tipo de ação pré-definido */
    type?: 'like' | 'favorite' | 'cart' | 'share' | 'custom'
    /** Ícone customizado (para type="custom") */
    icon?: string
    /** Label do botão */
    label?: string
    /** Estado ativo (para like/favorite) */
    active?: boolean
    /** Contador */
    count?: number
    /** Exibir contador */
    showCount?: boolean
    /** Tamanho */
    size?: 'sm' | 'md' | 'lg'
    /** Variante visual */
    variant?: 'default' | 'primary' | 'outline' | 'ghost'
    /** Loading state */
    loading?: boolean
    /** Desabilitado */
    disabled?: boolean
    /** Tooltip */
    tooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'custom',
    size: 'md',
    variant: 'ghost',
    active: false,
    showCount: true,
    loading: false,
    disabled: false
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

// Configurações por tipo
const typeConfig = computed(() => {
    const configs = {
        like: {
            icon: props.active ? '❤️' : '🤍',
            label: props.label || 'Curtir',
            activeClass: 'action-button--liked'
        },
        favorite: {
            icon: props.active ? '⭐' : '☆',
            label: props.label || 'Favoritar',
            activeClass: 'action-button--favorited'
        },
        cart: {
            icon: '🛒',
            label: props.label || 'Adicionar',
            activeClass: ''
        },
        share: {
            icon: '🔗',
            label: props.label || 'Compartilhar',
            activeClass: ''
        },
        custom: {
            icon: props.icon || '✨',
            label: props.label || '',
            activeClass: ''
        }
    }
    return configs[props.type]
})

// Classes do botão
const buttonClasses = computed(() => [
    'action-button',
    `action-button--${props.size}`,
    `action-button--${props.variant}`,
    {
        'action-button--active': props.active,
        'action-button--loading': props.loading,
        'action-button--with-count': props.showCount && props.count !== undefined,
        [typeConfig.value.activeClass]: props.active && typeConfig.value.activeClass
    }
])

// Handler
function handleClick(event: MouseEvent) {
    if (!props.disabled && !props.loading) {
        emit('click', event)
    }
}

// Formatar contador
function formatCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
}
</script>

<template>
    <button :class="buttonClasses" :disabled="disabled || loading" :title="tooltip || typeConfig.label" type="button"
        @click="handleClick">
        <!-- Loading spinner -->
        <span v-if="loading" class="action-button__spinner">⏳</span>

        <!-- Icon -->
        <span v-else class="action-button__icon">
            {{ typeConfig.icon }}
        </span>

        <!-- Label -->
        <span v-if="typeConfig.label" class="action-button__label">
            {{ typeConfig.label }}
        </span>

        <!-- Counter -->
        <span v-if="showCount && count !== undefined && count > 0" class="action-button__count">
            {{ formatCount(count) }}
        </span>
    </button>
</template>

<style lang="scss" scoped>
.action-button {
    --btn-height: 36px;
    --btn-padding: var(--spacing-sm) var(--spacing-md);
    --btn-font-size: 0.875rem;
    --btn-icon-size: 1.25rem;
    --btn-gap: var(--spacing-xs);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--btn-gap);
    height: var(--btn-height);
    padding: var(--btn-padding);
    font-size: var(--btn-font-size);
    font-weight: 500;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    white-space: nowrap;

    &:hover:not(:disabled) {
        background: var(--color-bg-secondary);
        color: var(--color-text-primary);
        transform: translateY(-1px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    // Sizes
    &--sm {
        --btn-height: 28px;
        --btn-padding: var(--spacing-xs) var(--spacing-sm);
        --btn-font-size: 0.75rem;
        --btn-icon-size: 1rem;
        --btn-gap: 4px;
    }

    &--md {
        --btn-height: 36px;
        --btn-padding: var(--spacing-sm) var(--spacing-md);
        --btn-font-size: 0.875rem;
        --btn-icon-size: 1.25rem;
        --btn-gap: var(--spacing-xs);
    }

    &--lg {
        --btn-height: 44px;
        --btn-padding: var(--spacing-md) var(--spacing-lg);
        --btn-font-size: 1rem;
        --btn-icon-size: 1.5rem;
        --btn-gap: var(--spacing-sm);
    }

    // Variants
    &--default {
        background: var(--color-bg-secondary);
        border-color: var(--color-border);

        &:hover:not(:disabled) {
            background: var(--color-bg-tertiary);
            border-color: var(--color-border-hover);
        }
    }

    &--primary {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);

        &:hover:not(:disabled) {
            background: var(--color-primary-hover);
            border-color: var(--color-primary-hover);
        }
    }

    &--outline {
        border-color: var(--color-border);

        &:hover:not(:disabled) {
            border-color: var(--color-primary);
            color: var(--color-primary);
            background: var(--color-primary-bg);
        }
    }

    // Active state (like/favorite)
    &--active {
        color: var(--color-primary);

        &.action-button--liked {
            animation: heart-beat 0.3s ease;
        }

        &.action-button--favorited {
            animation: star-pulse 0.3s ease;
        }
    }

    // Loading state
    &--loading {
        cursor: wait;
        opacity: 0.7;
    }
}

.action-button__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--btn-icon-size);
    line-height: 1;
}

.action-button__spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--btn-icon-size);
    animation: spin 1s linear infinite;
}

.action-button__label {
    font-weight: 500;
    line-height: 1;
}

.action-button__count {
    font-size: 0.75em;
    font-weight: 600;
    padding: 2px 6px;
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
}

// Animations
@keyframes heart-beat {

    0%,
    100% {
        transform: scale(1);
    }

    25% {
        transform: scale(1.3);
    }

    50% {
        transform: scale(1.1);
    }
}

@keyframes star-pulse {

    0%,
    100% {
        transform: scale(1) rotate(0deg);
    }

    50% {
        transform: scale(1.2) rotate(10deg);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
