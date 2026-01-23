<script setup lang="ts">
/**
 * ChartTooltip - Tooltip interativo para gráficos
 * 
 * Features:
 * - Posicionamento inteligente (evita bordas)
 * - Suporte a formatação customizada
 * - Animação suave
 * - Acessível
 */
import { computed, type CSSProperties } from 'vue'

export interface TooltipData {
    /** Título do tooltip */
    title?: string
    /** Items do tooltip */
    items: {
        label: string
        value: string | number
        color?: string
    }[]
}

interface Props {
    /** Dados do tooltip */
    data: TooltipData | null
    /** Posição X do mouse */
    x: number
    /** Posição Y do mouse */
    y: number
    /** Offset do mouse (px) */
    offset?: number
    /** Largura máxima do tooltip */
    maxWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
    offset: 12,
    maxWidth: 250
})

// Posicionamento inteligente
const tooltipStyle = computed<CSSProperties>(() => {
    if (!props.data) return { display: 'none' }

    // Calcula posição básica com offset
    let left = props.x + props.offset
    let top = props.y + props.offset

    // Ajusta se estiver muito à direita
    if (left + props.maxWidth > window.innerWidth - 20) {
        left = props.x - props.maxWidth - props.offset
    }

    // Ajusta se estiver muito embaixo
    const estimatedHeight = 60 + (props.data.items.length * 24)
    if (top + estimatedHeight > window.innerHeight - 20) {
        top = props.y - estimatedHeight - props.offset
    }

    return {
        left: `${left}px`,
        top: `${top}px`,
        maxWidth: `${props.maxWidth}px`
    }
})
</script>

<template>
    <Transition name="tooltip">
        <div v-if="data" class="chart-tooltip" :style="tooltipStyle">
            <div v-if="data.title" class="chart-tooltip__title">
                {{ data.title }}
            </div>
            <div class="chart-tooltip__items">
                <div v-for="(item, index) in data.items" :key="index" class="chart-tooltip__item">
                    <span v-if="item.color" class="chart-tooltip__color" :style="{ backgroundColor: item.color }" />
                    <span class="chart-tooltip__label">{{ item.label }}:</span>
                    <span class="chart-tooltip__value">{{ item.value }}</span>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.chart-tooltip {
    position: fixed;
    z-index: 1000;
    padding: 8px 12px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    pointer-events: none;
    user-select: none;

    &__title {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 6px;
        padding-bottom: 6px;
        border-bottom: 1px solid var(--color-border-light);
    }

    &__items {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--color-text-secondary);
    }

    &__color {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 2px;
        flex-shrink: 0;
    }

    &__label {
        color: var(--color-text-secondary);
    }

    &__value {
        margin-left: auto;
        font-weight: 500;
        color: var(--color-text-primary);
    }
}

// Animação
.tooltip-enter-active,
.tooltip-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
