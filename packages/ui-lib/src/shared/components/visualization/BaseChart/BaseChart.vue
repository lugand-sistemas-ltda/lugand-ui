<script setup lang="ts">
/**
 * BaseChart - Componente pai para todos os gráficos
 * 
 * Responsabilidades:
 * - Container responsivo
 * - Header (título, subtítulo, ações)
 * - Toolbar (zoom, export, fullscreen)
 * - Legend (posição configurável)
 * - Loading/Error states
 * - Slot para gráfico filho
 */
import { ref, computed } from 'vue'
import { Spinner } from '@/shared/components'

interface BaseChartProps {
    /** Título do gráfico */
    title?: string
    /** Subtítulo do gráfico */
    subtitle?: string

    /** Largura (px, %, vw, etc.) */
    width?: string | number
    /** Altura (px, %, vh, etc.) */
    height?: string | number

    /** Variante visual */
    variant?: 'default' | 'minimal' | 'card'

    /** Mostrar legenda */
    showLegend?: boolean
    /** Posição da legenda */
    legendPosition?: 'top' | 'right' | 'bottom' | 'left'

    /** Mostrar toolbar de ações */
    showToolbar?: boolean
    /** Mostrar grid */
    showGrid?: boolean

    /** Estado de loading */
    loading?: boolean
    /** Mensagem de erro */
    error?: string

    /** Permitir export */
    exportable?: boolean
    /** Permitir fullscreen */
    fullscreenable?: boolean

    /** Cores customizadas (sobrescreve theme) */
    colors?: string[]
}

const props = withDefaults(defineProps<BaseChartProps>(), {
    variant: 'default',
    showLegend: true,
    legendPosition: 'top',
    showToolbar: true,
    showGrid: true,
    loading: false,
    exportable: true,
    fullscreenable: true
})

const emit = defineEmits<{
    export: [format: 'png' | 'svg' | 'csv']
    fullscreen: []
}>()

const isFullscreen = ref(false)

const containerClasses = computed(() => [
    'chart-container',
    `chart-container--${props.variant}`,
    {
        'chart-container--fullscreen': isFullscreen.value,
        'chart-container--loading': props.loading
    }
])

const handleExport = (format: 'png' | 'svg' | 'csv') => {
    emit('export', format)
}

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    emit('fullscreen')
}
</script>

<template>
    <div :class="containerClasses">
        <!-- Header -->
        <header v-if="title || subtitle || $slots.header" class="chart-header">
            <div class="chart-header__content">
                <slot name="header">
                    <h3 v-if="title" class="chart-header__title">{{ title }}</h3>
                    <p v-if="subtitle" class="chart-header__subtitle">{{ subtitle }}</p>
                </slot>
            </div>

            <!-- Toolbar -->
            <div v-if="showToolbar" class="chart-toolbar">
                <slot name="toolbar">
                    <button v-if="exportable" class="chart-toolbar__btn" type="button" title="Exportar"
                        @click="handleExport('png')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <polyline points="7 10 12 15 17 10" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <line x1="12" y1="15" x2="12" y2="3" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>

                    <button v-if="fullscreenable" class="chart-toolbar__btn" type="button" title="Fullscreen"
                        @click="toggleFullscreen">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </slot>
            </div>
        </header>

        <!-- Legend (top) -->
        <div v-if="showLegend && legendPosition === 'top'" class="chart-legend chart-legend--top">
            <slot name="legend" />
        </div>

        <!-- Main Content -->
        <div class="chart-body">
            <!-- Legend (left) -->
            <div v-if="showLegend && legendPosition === 'left'" class="chart-legend chart-legend--left">
                <slot name="legend" />
            </div>

            <!-- Chart Area -->
            <div class="chart-area">
                <!-- Loading State -->
                <div v-if="loading" class="chart-state chart-state--loading">
                    <Spinner size="lg" text="Carregando gráfico..." text-position="bottom" />
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="chart-state chart-state--error">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke-width="2" />
                        <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round" />
                        <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <p class="chart-state__message">{{ error }}</p>
                </div>

                <!-- Chart Slot -->
                <div v-else class="chart-canvas-wrapper">
                    <slot />
                </div>
            </div>

            <!-- Legend (right) -->
            <div v-if="showLegend && legendPosition === 'right'" class="chart-legend chart-legend--right">
                <slot name="legend" />
            </div>
        </div>

        <!-- Legend (bottom) -->
        <div v-if="showLegend && legendPosition === 'bottom'" class="chart-legend chart-legend--bottom">
            <slot name="legend" />
        </div>

        <!-- Footer -->
        <footer v-if="$slots.footer" class="chart-footer">
            <slot name="footer" />
        </footer>
    </div>
</template>

<style lang="scss" scoped>
.chart-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: var(--color-bg-primary);
    border-radius: var(--radius-md);

    &--card {
        border: 1px solid var(--color-border-light);
        padding: var(--spacing-md);
    }

    &--minimal {
        background: transparent;
    }

    &--fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        border-radius: 0;
        padding: var(--spacing-lg);
    }
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);

    &__content {
        flex: 1;
    }

    &__title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
    }

    &__subtitle {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: var(--spacing-xs) 0 0;
    }
}

.chart-toolbar {
    display: flex;
    gap: var(--spacing-xs);

    &__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        background-color: var(--color-bg-secondary);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: var(--transition-base);

        &:hover {
            background-color: var(--color-bg-tertiary);
            color: var(--color-text-primary);
            border-color: var(--color-border-base);
        }

        &:active {
            transform: scale(0.95);
        }

        svg {
            display: block;
        }
    }
}

.chart-body {
    display: flex;
    flex: 1;
    min-height: 0;
    gap: var(--spacing-md);
}

.chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);

    &--top,
    &--bottom {
        justify-content: center;
        margin: var(--spacing-md) 0;
    }

    &--left,
    &--right {
        flex-direction: column;
        justify-content: center;
    }

    &--left {
        padding-right: var(--spacing-md);
    }

    &--right {
        padding-left: var(--spacing-md);
    }
}

.chart-area {
    position: relative;
    flex: 1;
    min-height: 0;
    min-width: 0;
}

.chart-canvas-wrapper {
    width: 100%;
    height: 100%;
}

.chart-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: var(--spacing-md);

    &--error {
        color: var(--color-error);
    }

    &__message {
        font-size: var(--font-size-md);
        color: var(--color-text-secondary);
        text-align: center;
    }
}

.chart-footer {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border-light);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}
</style>
