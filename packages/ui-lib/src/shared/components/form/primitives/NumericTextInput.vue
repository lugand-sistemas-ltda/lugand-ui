<script setup lang="ts">
/**
 * NumericTextInput - Primitivo para entrada numérica
 * 
 * SEMPRE usa type="text" com inputmode="numeric" para garantir:
 * 1. Controle total sobre validação (sem quirks do navegador)
 * 2. Teclado numérico em dispositivos móveis
 * 3. Sanitização em tempo real (bloqueia letras, símbolos, SQL injection, XSS)
 * 
 * Use este componente para:
 * - Datas (DD/MM/YYYY, HH:mm)
 * - Máscaras numéricas (CPF, CNPJ, Phone)
 * - Campos numéricos com formatação customizada
 * 
 * NÃO use para:
 * - Campos de texto livre
 * - E-mails
 * - URLs
 */
import { computed } from 'vue'

interface Props {
    modelValue: string | number
    label?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: boolean
    errorMessage?: string
    hint?: string
    size?: 'sm' | 'md' | 'lg'
    maxlength?: number
    allowedChars?: string // Regex pattern para caracteres permitidos (padrão: apenas dígitos)
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    size: 'md',
    error: false,
    disabled: false,
    readonly: false,
    allowedChars: '0-9' // Padrão: apenas números
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

// Computed: Pattern HTML5 baseado em allowedChars
const pattern = computed(() => {
    return `[${props.allowedChars}]*`
})

// Sanitização: Remove caracteres não permitidos
const sanitize = (value: string): string => {
    // Cria regex dinâmica baseada em allowedChars
    const regex = new RegExp(`[^${props.allowedChars}]`, 'g')
    return String(value).replace(regex, '')
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const rawValue = target.value
    const cleanValue = sanitize(rawValue)

    // Se sanitizou algo, atualiza visualmente (feedback imediato)
    if (cleanValue !== rawValue) {
        target.value = cleanValue
    }

    // Emite sempre o valor limpo
    emit('update:modelValue', cleanValue)
}

// Computed: Classes do wrapper
const wrapperClasses = computed(() => [
    'numeric-input-wrapper',
    `numeric-input-wrapper--${props.size}`,
    { 'numeric-input-wrapper--error': props.error }
])

// Computed: Classes do input
const inputClasses = computed(() => [
    'numeric-input',
    `numeric-input--${props.size}`,
    { 'numeric-input--error': props.error }
])
</script>

<template>
    <div :class="wrapperClasses">
        <label v-if="label" class="numeric-input-wrapper__label">
            {{ label }}
        </label>

        <input :class="inputClasses" type="text" inputmode="numeric" :pattern="pattern" :value="modelValue"
            :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :maxlength="maxlength"
            @input="handleInput" />

        <span v-if="hint && !error" class="numeric-input-wrapper__hint">
            {{ hint }}
        </span>

        <span v-if="error && errorMessage" class="numeric-input-wrapper__error">
            {{ errorMessage }}
        </span>
    </div>
</template>

<style lang="scss">
/**
 * Estilos do NumericTextInput
 * Compatível com Input.vue para consistência visual
 */
.numeric-input-wrapper {
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
        .numeric-input-wrapper__label {
            color: var(--color-error);
        }
    }
}

.numeric-input {
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
