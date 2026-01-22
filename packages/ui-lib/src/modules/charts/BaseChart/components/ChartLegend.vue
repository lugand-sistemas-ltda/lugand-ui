<script setup lang="ts">
/**
 * ChartLegend - Componente de legenda para gráficos
 */
interface LegendItem {
    label: string
    color: string
    visible?: boolean
}

interface Props {
    items: LegendItem[]
    interactive?: boolean
}

withDefaults(defineProps<Props>(), {
    interactive: true
})

const emit = defineEmits<{
    toggle: [index: number]
}>()

const handleToggle = (index: number) => {
    emit('toggle', index)
}
</script>

<template>
    <div class="chart-legend">
        <button v-for="(item, index) in items" :key="index" type="button" class="chart-legend__item"
            :class="{ 'chart-legend__item--hidden': item.visible === false }" :disabled="!interactive"
            @click="interactive && handleToggle(index)">
            <span class="chart-legend__color" :style="{ backgroundColor: item.color }" />
            <span class="chart-legend__label">{{ item.label }}</span>
        </button>
    </div>
</template>

<style lang="scss" scoped>
.chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);

    &__item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        background-color: var(--color-bg-secondary);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        cursor: pointer;
        transition: var(--transition-base);

        &:hover:not(:disabled) {
            background-color: var(--color-bg-tertiary);
            border-color: var(--color-border-base);
        }

        &:disabled {
            cursor: default;
        }

        &--hidden {
            opacity: 0.5;
            text-decoration: line-through;
        }
    }

    &__color {
        display: block;
        width: 12px;
        height: 12px;
        border-radius: var(--radius-sm);
        flex-shrink: 0;
    }

    &__label {
        font-weight: var(--font-weight-medium);
    }
}
</style>
