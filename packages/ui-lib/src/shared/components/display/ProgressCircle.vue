<script setup lang="ts">
import { computed } from 'vue'

/**
 * ProgressCircle - Progresso circular (SVG)
 * 
 * Exibe progresso de forma circular com porcentagem no centro.
 * Útil para: dashboards, loaders, metas visuais, KPIs.
 * 
 * @example
 * ```vue
 * <!-- Básico -->
 * <ProgressCircle :value="75" />
 * 
 * <!-- Com label -->
 * <ProgressCircle :value="60" label="Completo" />
 * 
 * <!-- Variants -->
 * <ProgressCircle :value="100" variant="success" />
 * <ProgressCircle :value="40" variant="warning" />
 * 
 * <!-- Sizes -->
 * <ProgressCircle :value="85" size="sm" />
 * <ProgressCircle :value="85" size="lg" />
 * 
 * <!-- Custom content (slot) -->
 * <ProgressCircle :value="75">
 *   <div>75<br><small>Tasks</small></div>
 * </ProgressCircle>
 * ```
 */

interface Props {
    /** Valor do progresso (0-100) */
    value: number
    /** Valor máximo (padrão 100) */
    max?: number
    /** Label abaixo do círculo */
    label?: string
    /** Variante visual */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    /** Tamanho do círculo */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    /** Espessura da linha (1-20) */
    strokeWidth?: number
    /** Exibir porcentagem no centro */
    showPercentage?: boolean
    /** Animação de transição */
    animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    max: 100,
    variant: 'primary',
    size: 'md',
    strokeWidth: 8,
    showPercentage: true,
    animated: true
})

// Dimensões baseadas no tamanho
const dimensions = computed(() => {
    const sizes = {
        sm: { width: 60, fontSize: '0.75rem' },
        md: { width: 100, fontSize: '1rem' },
        lg: { width: 140, fontSize: '1.5rem' },
        xl: { width: 180, fontSize: '2rem' }
    }
    return sizes[props.size]
})

// Calcular porcentagem
const percentage = computed(() => {
    const pct = Math.min(Math.max((props.value / props.max) * 100, 0), 100)
    return Math.round(pct)
})

// Cálculos SVG
const radius = computed(() => {
    return (dimensions.value.width - props.strokeWidth) / 2
})

const circumference = computed(() => {
    return 2 * Math.PI * radius.value
})

const strokeDashoffset = computed(() => {
    return circumference.value - (percentage.value / 100) * circumference.value
})

const center = computed(() => dimensions.value.width / 2)

// Cor baseada na variante
const strokeColor = computed(() => {
    const colors = {
        default: 'var(--color-text-tertiary)',
        primary: 'var(--color-primary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)'
    }
    return colors[props.variant]
})
</script>

<template>
    <div class="progress-circle" :class="[`progress-circle--${size}`]">
        <div class="progress-circle__svg-container">
            <svg :width="dimensions.width" :height="dimensions.width"
                :viewBox="`0 0 ${dimensions.width} ${dimensions.width}`" class="progress-circle__svg">
                <!-- Background circle -->
                <circle class="progress-circle__bg" :cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" />

                <!-- Progress circle -->
                <circle class="progress-circle__progress" :class="{ 'progress-circle__progress--animated': animated }"
                    :cx="center" :cy="center" :r="radius" :stroke="strokeColor" :stroke-width="strokeWidth"
                    :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset" />
            </svg>

            <!-- Center content -->
            <div class="progress-circle__content" :style="{ fontSize: dimensions.fontSize }">
                <slot>
                    <span v-if="showPercentage" class="progress-circle__percentage">{{ percentage }}%</span>
                </slot>
            </div>
        </div>

        <!-- Label -->
        <div v-if="label" class="progress-circle__label">
            {{ label }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.progress-circle {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);

    // Sizes
    &--sm {
        --circle-size: 60px;
    }

    &--md {
        --circle-size: 100px;
    }

    &--lg {
        --circle-size: 140px;
    }

    &--xl {
        --circle-size: 180px;
    }
}

.progress-circle__svg-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.progress-circle__svg {
    transform: rotate(-90deg);
    // Garante que o SVG não quebre o layout
    display: block;
}

.progress-circle__bg {
    fill: none;
    stroke: var(--color-bg-tertiary);
}

.progress-circle__progress {
    fill: none;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.6s ease;

    &--animated {
        transition: stroke-dashoffset 0.6s ease;
    }
}

.progress-circle__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    pointer-events: none;
}

.progress-circle__percentage {
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.progress-circle__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-align: center;
}
</style>
