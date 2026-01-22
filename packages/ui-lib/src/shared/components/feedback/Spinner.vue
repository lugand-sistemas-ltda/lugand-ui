<script setup lang="ts">
/**
 * Spinner - Indicador de carregamento animado
 * 
 * Use cases: Loading states, processos assíncronos
 */
interface Props {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'primary' | 'secondary' | 'white'
    /** Texto opcional exibido ao lado do spinner */
    text?: string
    /** Posição do texto em relação ao spinner */
    textPosition?: 'right' | 'bottom'
}

withDefaults(defineProps<Props>(), {
    size: 'md',
    variant: 'primary',
    textPosition: 'right'
})
</script>

<template>
    <div class="spinner-wrapper" :class="[`spinner-wrapper--${textPosition}`]" role="status" aria-live="polite"
        :aria-label="text || 'Carregando'">
        <div class="spinner" :class="[`spinner--${size}`, `spinner--${variant}`]">
            <svg viewBox="0 0 50 50" class="spinner__svg">
                <circle class="spinner__circle" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
            </svg>
        </div>
        <span v-if="text" class="spinner-text">{{ text }}</span>
    </div>
</template>

<style lang="scss" scoped>
.spinner-wrapper {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);

    &--right {
        flex-direction: row;
    }

    &--bottom {
        flex-direction: column;
    }
}

.spinner {
    display: inline-block;
    flex-shrink: 0;

    &--xs {
        width: 16px;
        height: 16px;
    }

    &--sm {
        width: 24px;
        height: 24px;
    }

    &--md {
        width: 32px;
        height: 32px;
    }

    &--lg {
        width: 48px;
        height: 48px;
    }

    &--xl {
        width: 64px;
        height: 64px;
    }
}

.spinner-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
}

.spinner__svg {
    animation: spinner-rotate 2s linear infinite;
    width: 100%;
    height: 100%;
}

.spinner__circle {
    stroke: var(--color-primary);
    stroke-linecap: round;
    animation: spinner-dash 1.5s ease-in-out infinite;

    .spinner--secondary & {
        stroke: var(--color-text-secondary);
    }

    .spinner--white & {
        stroke: #ffffff;
    }
}

@keyframes spinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes spinner-dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}
</style>
