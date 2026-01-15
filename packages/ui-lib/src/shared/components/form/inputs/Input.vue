<script setup lang="ts">
import { useAttrs, computed, type StyleValue } from 'vue'
/**
 * Input - Campo de entrada de texto genérico
 * Primitivo base para formulários
 */
interface Props {
    modelValue?: string | number
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    errorMessage?: string
    label?: string
    hint?: string
}

defineOptions({
    inheritAttrs: false
})

const props = withDefaults(defineProps<Props>(), {
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

const attrs = useAttrs()

const wrapperAttrs = computed(() => {
    const { class: cls, style } = attrs
    return { class: cls, style: style as StyleValue }
})

const inputAttrs = computed(() => {
    const { class: cls, style, ...rest } = attrs
    return rest
})

// Computed: Tipo de input (prioriza attrs.type sobre props.type)
const inputType = computed(() => {
    // Se passou type via v-bind (como MaskInput faz), usa esse
    if (attrs.type) {
        return attrs.type as string
    }
    // Senão usa a prop type
    return props.type
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value: string | number = target.value

    // SECURITY: For number inputs, sanitize to prevent injection
    if (inputType.value === 'number' && typeof value === 'string') {
        // Remove all non-numeric characters (except decimal point and minus sign)
        value = value.replace(/[^\d.-]/g, '')
    }

    emit('update:modelValue', value)
}

// Computed: Atributos adicionais de segurança para inputs numéricos
const inputSecurityAttrs = computed(() => {
    if (inputType.value === 'number') {
        return {
            inputmode: 'numeric' as const,
            pattern: '[0-9]*'
        }
    }
    return {}
})

</script>

<template>
    <div v-bind="wrapperAttrs" :class="['input-wrapper', `input-wrapper--${size}`, { 'input-wrapper--error': error }]">
        <label v-if="label" class="input-wrapper__label">
            {{ label }}
        </label>

        <input v-bind="{ ...inputAttrs, ...inputSecurityAttrs }"
            :class="['input', `input--${size}`, { 'input--error': error }]" :type="inputType" :value="modelValue"
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
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: var(--input-radius);
    color: var(--input-text);
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
