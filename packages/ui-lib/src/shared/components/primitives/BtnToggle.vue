<script setup lang="ts">
/**
 * Toggle Button - botão de alternância (on/off)
 * Primitivo genérico para estados binários
 */
interface Props {
    modelValue: boolean
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    size: 'md',
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const toggle = () => {
    if (!props.disabled) {
        emit('update:modelValue', !props.modelValue)
    }
}
</script>

<template>
    <button :class="['btn-toggle', `btn-toggle--${size}`, { 'btn-toggle--active': modelValue }]" 
    type="button" role="switch" :aria-checked="modelValue ? 'true' : 'false'" :disabled="disabled" @click="toggle">
        <span class="btn-toggle__track">
            <span class="btn-toggle__thumb" />
        </span>
        <span v-if="$slots.default" class="btn-toggle__label">
            <slot />
        </span>
    </button>
</template>

<style lang="scss">
/**
 * Estilos do btn-toggle (primitivo genérico)
 * Não escope - será reutilizado globalmente
 */
.btn-toggle {
    // Base
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);

    background: transparent;
    border: none;
    padding: 0;

    cursor: pointer;
    transition: opacity var(--transition-fast);

    &:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 4px;
        border-radius: var(--radius-full);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    // Track (trilha do toggle)
    &__track {
        position: relative;
        display: flex;
        align-items: center;

        background-color: var(--color-border-dark);
        border-radius: var(--radius-full);

        transition: background-color var(--transition-base);
    }

    // Thumb (botão que desliza)
    &__thumb {
        display: block;
        background-color: white;
        border-radius: var(--radius-full);

        transition: transform var(--transition-base);
        box-shadow: var(--shadow-sm);
    }

    // Label
    &__label {
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        user-select: none;
    }

    // Sizes
    &--sm {
        .btn-toggle__track {
            width: 2.25rem; // 36px
            height: 1.25rem; // 20px
            padding: 2px;
        }

        .btn-toggle__thumb {
            width: 1rem; // 16px
            height: 1rem;
        }

        .btn-toggle__label {
            font-size: var(--font-size-sm);
        }
    }

    &--md {
        .btn-toggle__track {
            width: 2.75rem; // 44px
            height: 1.5rem; // 24px
            padding: 2px;
        }

        .btn-toggle__thumb {
            width: 1.25rem; // 20px
            height: 1.25rem;
        }
    }

    &--lg {
        .btn-toggle__track {
            width: 3.5rem; // 56px
            height: 2rem; // 32px
            padding: 3px;
        }

        .btn-toggle__thumb {
            width: 1.625rem; // 26px
            height: 1.625rem;
        }

        .btn-toggle__label {
            font-size: var(--font-size-lg);
        }
    }

    // Active state
    &--active {
        .btn-toggle__track {
            background-color: var(--color-primary);
        }

        &.btn-toggle--sm .btn-toggle__thumb {
            transform: translateX(1rem); // 16px
        }

        &.btn-toggle--md .btn-toggle__thumb {
            transform: translateX(1.25rem); // 20px
        }

        &.btn-toggle--lg .btn-toggle__thumb {
            transform: translateX(1.5rem); // 24px
        }
    }
}
</style>
