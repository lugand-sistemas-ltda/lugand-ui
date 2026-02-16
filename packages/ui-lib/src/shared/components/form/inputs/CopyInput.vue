<script setup lang="ts">
import { computed } from 'vue'
import CopyButton from '../../primitives/CopyButton.vue'

/**
 * CopyInput - Input read-only com botão de copiar integrado
 * 
 * Combinação de Input + CopyButton para facilitar cópia de URLs,
 * códigos, tokens, IDs, etc.
 * 
 * @example
 * ```vue
 * <!-- Básico -->
 * <CopyInput value="https://example.com/share/abc123" />
 * 
 * <!-- Com label -->
 * <CopyInput 
 *   value="sk_live_abc123xyz789" 
 *   label="API Token"
 * />
 * 
 * <!-- Variantes e sizes -->
 * <CopyInput value="..." variant="primary" size="sm" />
 * 
 * <!-- Com eventos -->
 * <CopyInput value="..." @copied="showToast" />
 * ```
 */

interface Props {
    /** Valor do input (texto a copiar) */
    value: string
    /** Label do input */
    label?: string
    /** Placeholder */
    placeholder?: string
    /** Variante visual do botão */
    variant?: 'default' | 'primary' | 'outline' | 'ghost'
    /** Tamanho */
    size?: 'sm' | 'md' | 'lg'
    /** Desabilitado */
    disabled?: boolean
    /** Tipo de input (para mascarar senhas) */
    type?: 'text' | 'password'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'ghost',
    size: 'md',
    disabled: false,
    type: 'text'
})

const emit = defineEmits<{
    copied: [text: string]
    error: [error: Error]
}>()

// Classes do container
const containerClasses = computed(() => [
    'copy-input',
    `copy-input--${props.size}`
])

// Classes do input
const inputClasses = computed(() => [
    'copy-input__field',
    {
        'copy-input__field--disabled': props.disabled
    }
])
</script>

<template>
    <div :class="containerClasses">
        <!-- Label -->
        <label v-if="label" class="copy-input__label">
            {{ label }}
        </label>

        <!-- Input group -->
        <div class="copy-input__group">
            <!-- Input -->
            <input :class="inputClasses" :type="type" :value="value" :placeholder="placeholder" :disabled="disabled"
                readonly />

            <!-- Copy button -->
            <CopyButton :text="value" :variant="variant" :size="size" :disabled="disabled"
                @copied="emit('copied', $event)" @error="emit('error', $event)" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.copy-input {
    --input-height: 40px;
    --input-font-size: 0.875rem;
    --input-padding: var(--spacing-sm) var(--spacing-md);

    width: 100%;

    // Sizes
    &--sm {
        --input-height: 32px;
        --input-font-size: 0.75rem;
        --input-padding: var(--spacing-xs) var(--spacing-sm);
    }

    &--md {
        --input-height: 40px;
        --input-font-size: 0.875rem;
        --input-padding: var(--spacing-sm) var(--spacing-md);
    }

    &--lg {
        --input-height: 48px;
        --input-font-size: 1rem;
        --input-padding: var(--spacing-md) var(--spacing-lg);
    }
}

.copy-input__label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
}

.copy-input__group {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    width: 100%;
}

.copy-input__field {
    flex: 1;
    height: var(--input-height);
    padding: var(--input-padding);
    font-size: var(--input-font-size);
    font-family: var(--font-mono, 'Courier New', monospace);
    color: var(--color-text-primary);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
        color: var(--color-text-tertiary);
    }

    &:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-bg);
    }

    &--disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    // Read-only styling
    &[readonly] {
        cursor: default;
        user-select: all;

        &:focus {
            border-color: var(--color-border-hover);
            box-shadow: none;
        }
    }
}
</style>
