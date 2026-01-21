<script setup lang="ts">
/**
 * Spinner - Indicador de carregamento animado
 * 
 * Use cases: Loading states, processos assíncronos
 */
interface Props {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'primary' | 'secondary' | 'white'
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    variant: 'primary'
})
</script>

<template>
    <div 
        class="spinner" 
        :class="[`spinner--${size}`, `spinner--${variant}`]"
        role="status"
        aria-live="polite"
        aria-label="Carregando"
    >
        <svg viewBox="0 0 50 50" class="spinner__svg">
            <circle 
                class="spinner__circle" 
                cx="25" 
                cy="25" 
                r="20" 
                fill="none" 
                stroke-width="4"
            />
        </svg>
    </div>
</template>

<style lang="scss" scoped>
.spinner {
    display: inline-block;
    
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
