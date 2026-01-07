<script setup lang="ts">
/**
 * Botão base - primitivo genérico
 * Estende o elemento <button> com variantes visuais
 */
interface Props {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
})
</script>

<template>
    <button :class="['btn', `btn--${variant}`, `btn--${size}`]" :type="type" :disabled="disabled">
        <slot />
    </button>
</template>

<style lang="scss">
/**
 * Estilos do componente btn (primitivo genérico)
 * Não escope - será reutilizado globalmente
 */
.btn {
    // Base (herda estilos globais de button)
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);

    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-fast);

    // Remove estilos nativos
    border: 1px solid transparent;

    &:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 2px;
    }

    // Sizes
    &--sm {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: var(--font-size-sm);
    }

    &--md {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: var(--font-size-md);
    }

    &--lg {
        padding: var(--spacing-md) var(--spacing-lg);
        font-size: var(--font-size-lg);
    }

    // Variants
    &--primary {
        background-color: var(--color-primary);
        color: var(--color-text-inverse);

        &:hover:not(:disabled) {
            background-color: var(--color-primary-hover);
        }

        &:active:not(:disabled) {
            background-color: var(--color-primary-active);
        }
    }

    &--secondary {
        background-color: var(--color-secondary);
        color: var(--color-text-inverse);

        &:hover:not(:disabled) {
            background-color: var(--color-secondary-hover);
        }

        &:active:not(:disabled) {
            background-color: var(--color-secondary-active);
        }
    }

    &--ghost {
        background-color: transparent;
        color: var(--color-text-primary);
        border-color: var(--color-border-base);

        &:hover:not(:disabled) {
            background-color: var(--color-bg-secondary);
            border-color: var(--color-border-dark);
        }

        &:active:not(:disabled) {
            background-color: var(--color-bg-tertiary);
        }
    }

    &--danger {
        background-color: var(--color-error);
        color: var(--color-text-inverse);

        &:hover:not(:disabled) {
            opacity: 0.9;
        }

        &:active:not(:disabled) {
            opacity: 0.8;
        }
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
