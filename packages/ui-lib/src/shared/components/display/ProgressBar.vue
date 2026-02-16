<script setup lang="ts">
import { computed } from 'vue'

/**
 * ProgressBar - Barra de progresso horizontal
 * 
 * Exibe progresso visual de forma linear com múltiplas variantes e opções.
 * Útil para: upload de arquivos, carregamento de dados, metas/objetivos, status de tarefas.
 * 
 * @example
 * ```vue
 * <!-- Básico -->
 * <ProgressBar :value="75" />
 * 
 * <!-- Com label -->
 * <ProgressBar :value="60" label="Carregando..." />
 * 
 * <!-- Com porcentagem -->
 * <ProgressBar :value="85" show-percentage />
 * 
 * <!-- Variants -->
 * <ProgressBar :value="100" variant="success" />
 * <ProgressBar :value="40" variant="warning" />
 * <ProgressBar :value="20" variant="danger" />
 * 
 * <!-- Striped e animada -->
 * <ProgressBar :value="75" striped animated />
 * 
 * <!-- Sizes -->
 * <ProgressBar :value="50" size="sm" />
 * <ProgressBar :value="50" size="lg" />
 * ```
 */

interface Props {
    /** Valor do progresso (0-100) */
    value: number
    /** Valor máximo (padrão 100) */
    max?: number
    /** Label descritiva */
    label?: string
    /** Exibir porcentagem */
    showPercentage?: boolean
    /** Variante visual */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    /** Tamanho da barra */
    size?: 'sm' | 'md' | 'lg'
    /** Padrão listrado */
    striped?: boolean
    /** Animação de listras */
    animated?: boolean
    /** Barra com transição suave */
    smooth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    max: 100,
    variant: 'primary',
    size: 'md',
    striped: false,
    animated: false,
    smooth: true
})

// Calcular porcentagem
const percentage = computed(() => {
    const pct = Math.min(Math.max((props.value / props.max) * 100, 0), 100)
    return Math.round(pct)
})

// Classes da barra
const barClasses = computed(() => [
    'progress-bar__fill',
    `progress-bar__fill--${props.variant}`,
    {
        'progress-bar__fill--striped': props.striped,
        'progress-bar__fill--animated': props.animated
    }
])
</script>

<template>
    <div class="progress-bar" :class="[`progress-bar--${size}`]">
        <!-- Label superior -->
        <div v-if="label || showPercentage" class="progress-bar__header">
            <span v-if="label" class="progress-bar__label">{{ label }}</span>
            <span v-if="showPercentage" class="progress-bar__percentage">{{ percentage }}%</span>
        </div>

        <!-- Container da barra -->
        <div class="progress-bar__container">
            <div :class="barClasses" :style="{ width: `${percentage}%` }" role="progressbar" :aria-valuenow="value"
                :aria-valuemin="0" :aria-valuemax="max">
                <!-- Porcentagem dentro da barra (para barras grandes) -->
                <span v-if="showPercentage && size === 'lg' && percentage > 10" class="progress-bar__inner-text">
                    {{ percentage }}%
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.progress-bar {
    --progress-height: 8px;
    --progress-bg: var(--color-bg-tertiary);
    --progress-radius: var(--radius-full);
    --progress-transition: width 0.4s ease;

    width: 100%;

    // Sizes
    &--sm {
        --progress-height: 6px;
        font-size: 0.75rem;
    }

    &--md {
        --progress-height: 8px;
        font-size: 0.875rem;
    }

    &--lg {
        --progress-height: 20px;
        font-size: 0.875rem;
    }
}

.progress-bar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
    gap: var(--spacing-sm);
}

.progress-bar__label {
    color: var(--color-text-primary);
    font-weight: 500;
}

.progress-bar__percentage {
    color: var(--color-text-secondary);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.progress-bar__container {
    position: relative;
    width: 100%;
    height: var(--progress-height);
    background-color: var(--progress-bg);
    border-radius: var(--progress-radius);
    overflow: hidden;
}

.progress-bar__fill {
    height: 100%;
    border-radius: var(--progress-radius);
    transition: var(--progress-transition);
    display: flex;
    align-items: center;
    justify-content: center;

    // Variants
    &--default {
        background-color: var(--color-text-tertiary);
    }

    &--primary {
        background-color: var(--color-primary);
    }

    &--success {
        background-color: var(--color-success);
    }

    &--warning {
        background-color: var(--color-warning);
    }

    &--danger {
        background-color: var(--color-danger);
    }

    &--info {
        background-color: var(--color-info);
    }

    // Striped pattern
    &--striped {
        background-image: linear-gradient(45deg,
                rgba(255, 255, 255, 0.15) 25%,
                transparent 25%,
                transparent 50%,
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0.15) 75%,
                transparent 75%,
                transparent);
        background-size: 1rem 1rem;
    }

    // Animated stripes
    &--animated {
        animation: progress-stripes 1s linear infinite;
    }
}

.progress-bar__inner-text {
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
    padding: 0 var(--spacing-xs);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@keyframes progress-stripes {
    0% {
        background-position: 1rem 0;
    }

    100% {
        background-position: 0 0;
    }
}
</style>
