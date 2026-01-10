<script setup lang="ts">
/**
 * Botão base - primitivo genérico
 * Estende o elemento <button> com variantes visuais
 */
interface Props {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
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

    border-radius: var(--btn-radius);
    font-weight: var(--btn-font-weight);
    transition: var(--btn-transition);

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
        background-color: var(--btn-primary-bg);
        color: var(--btn-primary-text);

        &:hover:not(:disabled) {
            background-color: var(--btn-primary-bg-hover);
        }

        &:active:not(:disabled) {
            background-color: var(--btn-primary-bg-active);
        }
    }

    &--secondary {
        background-color: var(--btn-secondary-bg);
        color: var(--btn-secondary-text);

        &:hover:not(:disabled) {
            background-color: var(--btn-secondary-bg-hover);
        }

        &:active:not(:disabled) {
            background-color: var(--btn-secondary-bg-active);
        }
    }

    &--ghost {
        background-color: transparent;
        color: var(--btn-ghost-text);
        border-color: var(--btn-ghost-border);

        &:hover:not(:disabled) {
            background-color: var(--btn-ghost-bg-hover);
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

    &--outline {
        background-color: transparent;
        color: var(--color-primary);
        border-color: var(--color-primary);

        &:hover:not(:disabled) {
            background-color: rgba(var(--color-primary-rgb), 0.1); // Assuming rgb var exists, else use standard opacity trick or lighten
            // Fallback if RGB var doesn't exist:
            background-color: var(--color-bg-secondary);
            border-color: var(--color-primary-hover);
            color: var(--color-primary-hover);
        }

        &:active:not(:disabled) {
            background-color: var(--color-bg-tertiary);
        }
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
