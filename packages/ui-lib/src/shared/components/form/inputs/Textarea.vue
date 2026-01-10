<script setup lang="ts">
/**
 * Textarea - Área de texto multi-linha genérica
 * Primitivo base para formulários
 */
interface Props {
    modelValue: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    rows?: number
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
    error?: boolean
    errorMessage?: string
    label?: string
    hint?: string
    maxLength?: number
}

withDefaults(defineProps<Props>(), {
    disabled: false,
    readonly: false,
    rows: 4,
    resize: 'vertical',
    error: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div :class="['textarea-wrapper', { 'textarea-wrapper--error': error }]">
        <label v-if="label" class="textarea-wrapper__label">
            {{ label }}
            <span v-if="maxLength" class="textarea-wrapper__counter">
                {{ modelValue.length }} / {{ maxLength }}
            </span>
        </label>

        <textarea :class="['textarea', `textarea--resize-${resize}`, { 'textarea--error': error }]" :value="modelValue"
            :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :rows="rows" :maxlength="maxLength"
            @input="handleInput" />

        <span v-if="hint && !error" class="textarea-wrapper__hint">
            {{ hint }}
        </span>

        <span v-if="error && errorMessage" class="textarea-wrapper__error">
            {{ errorMessage }}
        </span>
    </div>
</template>

<style lang="scss">
/**
 * Estilos do textarea (primitivo genérico)
 * Não escope - será reutilizado globalmente
 */
.textarea-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    &__label {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
    }

    &__counter {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-normal);
        color: var(--color-text-secondary);
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
        .textarea-wrapper__label {
            color: var(--color-error);
        }
    }
}

.textarea {
    width: 100%;
    min-height: 80px;

    padding: var(--spacing-sm) var(--spacing-md);

    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);

    color: var(--color-text-primary);
    font-family: inherit;
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-normal);
    line-height: 1.5;

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

    // Resize options
    &--resize-none {
        resize: none;
    }

    &--resize-vertical {
        resize: vertical;
    }

    &--resize-horizontal {
        resize: horizontal;
    }

    &--resize-both {
        resize: both;
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
