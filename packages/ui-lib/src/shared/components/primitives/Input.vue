<script setup lang="ts">
/**
 * Input - Campo de entrada de texto genérico
 * Primitivo base para formulários
 */
interface Props {
    modelValue?: string | number
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    errorMessage?: string
    label?: string
    hint?: string
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
    type: 'text',
    disabled: false,
    readonly: false,
    size: 'md',
    error: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div :class="['input-wrapper', `input-wrapper--${size}`, { 'input-wrapper--error': error }]">
        <label v-if="label" class="input-wrapper__label">
            {{ label }}
        </label>

        <input :class="['input', `input--${size}`, { 'input--error': error }]" :type="type" :value="modelValue"
            :placeholder="placeholder" :disabled="disabled" :readonly="readonly" @input="handleInput" />

        <span v-if="hint && !error" class="input-wrapper__hint">
            {{ hint }}
        </span>

        <span v-if="error && errorMessage" class="input-wrapper__error">
            {{ errorMessage }}
        </span>
    </div>
</template>

<style lang="scss">
/**
 * Estilos do input (primitivo genérico)
 * Não escope - será reutilizado globalmente
 */
.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    &__label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
    }

    &__hint {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
    }

    &__error {
        font-size: var(--font-size-xs);
        color: var(--color-error);
    }

    &--error {
        .input-wrapper__label {
            color: var(--color-error);
        }
    }
}

.input {
    width: 100%;

    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);

    color: var(--color-text-primary);
    font-family: inherit;
    font-weight: var(--font-weight-normal);

    transition: all var(--transition-fast);

    &::placeholder {
        color: var(--color-text-tertiary);
    }

    &:hover:not(:disabled):not(:read-only) {
        border-color: var(--color-border-dark);
    }

    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px hsla(var(--hsl-primary), 0.1);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:read-only {
        background: var(--color-bg-secondary);
        cursor: default;
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

    // Error state
    &--error {
        border-color: var(--color-error);

        &:focus {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px hsla(var(--hsl-error), 0.1);
        }
    }
}
</style>
