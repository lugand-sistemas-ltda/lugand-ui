<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * CopyButton - Botão para copiar texto para clipboard
 * 
 * Usa Clipboard API nativa do navegador para copiar texto.
 * Fornece feedback visual e emite eventos para integração com toasts.
 * 
 * @example
 * ```vue
 * <!-- Básico -->
 * <CopyButton text="https://example.com/share/123" />
 * 
 * <!-- Com label -->
 * <CopyButton text="Conteúdo a copiar" label="Copiar Texto" />
 * 
 * <!-- Sizes e variants -->
 * <CopyButton text="..." size="sm" variant="primary" />
 * 
 * <!-- Com feedback customizado -->
 * <CopyButton text="..." @copied="showToast" @error="handleError" />
 * 
 * <!-- Disabled -->
 * <CopyButton text="..." :disabled="true" />
 * ```
 */

interface Props {
    /** Texto a ser copiado */
    text: string
    /** Label do botão */
    label?: string
    /** Ícone quando não copiado */
    icon?: string
    /** Ícone quando copiado */
    copiedIcon?: string
    /** Variante visual */
    variant?: 'default' | 'primary' | 'outline' | 'ghost'
    /** Tamanho */
    size?: 'sm' | 'md' | 'lg'
    /** Desabilitado */
    disabled?: boolean
    /** Duração do feedback (ms) */
    feedbackDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
    icon: '📋',
    copiedIcon: '✅',
    variant: 'ghost',
    size: 'md',
    disabled: false,
    feedbackDuration: 2000
})

const emit = defineEmits<{
    /** Emitido quando texto é copiado com sucesso */
    copied: [text: string]
    /** Emitido quando ocorre erro ao copiar */
    error: [error: Error]
}>()

const isCopied = ref(false)
const isLoading = ref(false)

// Classes do botão
const buttonClasses = computed(() => [
    'copy-button',
    `copy-button--${props.size}`,
    `copy-button--${props.variant}`,
    {
        'copy-button--copied': isCopied.value,
        'copy-button--loading': isLoading.value
    }
])

// Ícone atual
const currentIcon = computed(() => {
    return isCopied.value ? props.copiedIcon : props.icon
})

// Handler de cópia
async function handleCopy() {
    if (props.disabled || isLoading.value) return

    try {
        isLoading.value = true

        // Tenta usar Clipboard API moderna
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(props.text)
        } else {
            // Fallback para navegadores antigos
            copyToClipboardFallback(props.text)
        }

        // Feedback visual
        isCopied.value = true
        emit('copied', props.text)

        // Reset após duração do feedback
        setTimeout(() => {
            isCopied.value = false
        }, props.feedbackDuration)

    } catch (error) {
        console.error('Failed to copy:', error)
        emit('error', error as Error)
    } finally {
        isLoading.value = false
    }
}

// Fallback para navegadores sem Clipboard API
function copyToClipboardFallback(text: string) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    try {
        document.execCommand('copy')
    } finally {
        document.body.removeChild(textarea)
    }
}
</script>

<template>
    <button :class="buttonClasses" type="button" :disabled="disabled" :title="isCopied ? 'Copiado!' : 'Copiar'"
        @click="handleCopy">
        <!-- Icon -->
        <span class="copy-button__icon">
            {{ currentIcon }}
        </span>

        <!-- Label -->
        <span v-if="label" class="copy-button__label">
            {{ isCopied ? 'Copiado!' : label }}
        </span>
    </button>
</template>

<style lang="scss" scoped>
.copy-button {
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

    &--ghost {
        // Estilos padrão já aplicados
    }

    // Copied state
    &--copied {
        color: var(--color-success);
        animation: copy-success 0.3s ease;
    }

    // Loading state
    &--loading {
        cursor: wait;
        opacity: 0.7;
    }
}

.copy-button__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--btn-icon-size);
    line-height: 1;
}

.copy-button__label {
    font-weight: 500;
    line-height: 1;
}

@keyframes copy-success {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}
</style>
