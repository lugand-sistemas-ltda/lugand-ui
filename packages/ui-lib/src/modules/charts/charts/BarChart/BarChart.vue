<script setup lang="ts">
/**
 * BarChart - Gráfico de barras
 * 
 * Features:
 * - Múltiplos datasets
 * - Vertical ou horizontal
 * - Empilhado (stacked)
 * - Largura de barra configurável
 * - Tooltip interativo
 * - Click events
 */
import { ref, watch, computed } from 'vue'
import BaseChart from '../../BaseChart/BaseChart.vue'
import ChartLegend from '../../BaseChart/components/ChartLegend.vue'
import ChartTooltip from '../../BaseChart/components/ChartTooltip.vue'
import { useChart } from '../../composables/useChart'
import { useChartInteraction, type ChartPoint } from '../../composables/useChartInteraction'
import type { BarChartData, ChartOptions } from '../../types'

interface Props {
    // Props do BaseChart
    title?: string
    subtitle?: string
    width?: string | number
    height?: string | number
    variant?: 'default' | 'minimal' | 'card'
    showLegend?: boolean
    legendPosition?: 'top' | 'right' | 'bottom' | 'left'
    showToolbar?: boolean
    showGrid?: boolean
    loading?: boolean
    error?: string
    exportable?: boolean
    fullscreenable?: boolean

    // Props específicas do BarChart
    data: BarChartData
    options?: ChartOptions

    // Props de interatividade
    enableTooltip?: boolean
    enableClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showLegend: true,
    legendPosition: 'top',
    showToolbar: true,
    showGrid: true,
    exportable: true,
    fullscreenable: true,
    enableTooltip: true,
    enableClick: true
})

// Eventos
const emit = defineEmits<{
    'bar-click': [data: { datasetIndex: number; dataIndex: number; value: number; label: string; color?: string }]
    'bar-hover': [data: { datasetIndex: number; dataIndex: number; value: number; label: string; color?: string } | null]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const {
    ctx,
    dimensions,
    drawArea,
    createLinearScale,
    clear,
    getThemeColors
} = useChart({
    canvasRef,
    options: props.options,
    onReady: () => {
        draw()
    }
})

// Array para armazenar barras renderizadas (para hit detection)
const renderedBars = ref<ChartPoint[]>([])

// Sistema de interação
const {
    tooltipData,
    tooltipX,
    tooltipY,
    hoveredPoint,
    onPointClick
} = useChartInteraction({
    canvasRef,
    getPoints: () => renderedBars.value,
    enableTooltip: props.enableTooltip,
    enableClick: props.enableClick,
    hitRadius: 20, // Maior para barras
    tooltipFormatter: (point) => {
        const dataset = props.data.datasets[point.datasetIndex]
        return {
            title: point.label,
            items: [
                {
                    label: dataset?.label || `Dataset ${point.datasetIndex + 1}`,
                    value: point.value.toFixed(2),
                    color: point.color
                }
            ]
        }
    }
})

onPointClick((point) => {
    emit('bar-click', {
        datasetIndex: point.datasetIndex,
        dataIndex: point.dataIndex,
        value: point.value,
        label: point.label,
        color: point.color
    })
})

watch(hoveredPoint, (point) => {
    if (point) {
        emit('bar-hover', {
            datasetIndex: point.datasetIndex,
            dataIndex: point.dataIndex,
            value: point.value,
            label: point.label,
            color: point.color
        })
    } else {
        emit('bar-hover', null)
    }
})

// Controle de visibilidade dos datasets
const datasetVisibility = ref<boolean[]>(
    props.data.datasets.map(() => true)
)

// Legendas
const legendItems = computed(() => {
    const themeColors = getThemeColors()
    return props.data.datasets.map((dataset, index) => ({
        label: dataset.label,
        color: dataset.color || themeColors[index % themeColors.length] || '#000000',
        visible: datasetVisibility.value[index] ?? true
    }))
})

// Toggle visibilidade de dataset
const toggleDataset = (index: number) => {
    datasetVisibility.value[index] = !datasetVisibility.value[index]
    draw()
}

// Desenhar gráfico
const draw = () => {
    if (!ctx.value) return

    clear()

    // Limpar barras renderizadas
    renderedBars.value = []

    const area = drawArea.value
    const isHorizontal = props.data.datasets[0]?.orientation === 'horizontal'

    // Filtrar datasets visíveis
    const visibleData = props.data.datasets.filter((_, i) => datasetVisibility.value[i])
    if (visibleData.length === 0) return

    // Calcular min/max dos valores
    const allValues = visibleData.flatMap(d => d.data)
    const minValue = props.data.stacked ? 0 : Math.min(...allValues, 0)
    const maxValue = props.data.stacked
        ? Math.max(...props.data.labels.map((_, i) =>
            visibleData.reduce((sum, d) => sum + (d.data[i] || 0), 0)
        ))
        : Math.max(...allValues)

    // Criar escalas
    let categoryScale, valueScale

    if (isHorizontal) {
        categoryScale = createLinearScale(0, props.data.labels.length - 1, [area.y, area.y + area.height])
        valueScale = createLinearScale(minValue, maxValue, [area.x, area.x + area.width])
    } else {
        categoryScale = createLinearScale(0, props.data.labels.length - 1, [area.x, area.x + area.width])
        valueScale = createLinearScale(minValue, maxValue, [area.y + area.height, area.y])
    }

    // Desenhar grid
    if (props.showGrid) {
        drawGrid(categoryScale, valueScale, isHorizontal)
    }

    // Desenhar eixos
    drawAxes(categoryScale, valueScale, isHorizontal)

    // Desenhar barras
    const themeColors = getThemeColors()
    const barWidth = 0.8 / (props.data.stacked ? 1 : visibleData.length)

    visibleData.forEach((dataset, datasetIndex) => {
        const originalIndex = props.data.datasets.indexOf(dataset)
        if (!datasetVisibility.value[originalIndex]) return

        const color = dataset.color || themeColors[datasetIndex % themeColors.length] || '#000000'

        dataset.data.forEach((value, index) => {
            let barCenterX, barCenterY, barWidthPx, barHeightPx

            if (props.data.stacked) {
                // Empilhado: calcular offset baseado em datasets anteriores
                const offset = visibleData
                    .slice(0, datasetIndex)
                    .reduce((sum, d) => sum + (d.data[index] || 0), 0)

                drawBar(
                    index,
                    offset,
                    offset + value,
                    color,
                    categoryScale,
                    valueScale,
                    barWidth,
                    isHorizontal
                )

                // Calcular dimensões da barra para hit detection
                const categoryPos = categoryScale.toPixel(index)
                const valueStartPos = valueScale.toPixel(offset)
                const valueEndPos = valueScale.toPixel(offset + value)
                const categorySize = Math.abs(categoryScale.toPixel(1) - categoryScale.toPixel(0)) * barWidth

                if (isHorizontal) {
                    barCenterX = (valueStartPos + valueEndPos) / 2
                    barCenterY = categoryPos
                    barWidthPx = Math.abs(valueEndPos - valueStartPos)
                    barHeightPx = categorySize
                } else {
                    barCenterX = categoryPos
                    barCenterY = (valueStartPos + valueEndPos) / 2
                    barWidthPx = categorySize
                    barHeightPx = Math.abs(valueEndPos - valueStartPos)
                }
            } else {
                // Lado a lado
                const barOffset = (datasetIndex - (visibleData.length - 1) / 2) * barWidth
                const actualBarWidth = barWidth * 0.9

                drawBar(
                    index + barOffset,
                    0,
                    value,
                    color,
                    categoryScale,
                    valueScale,
                    actualBarWidth,
                    isHorizontal
                )

                // Calcular dimensões da barra
                const categoryPos = categoryScale.toPixel(index + barOffset)
                const valueStartPos = valueScale.toPixel(0)
                const valueEndPos = valueScale.toPixel(value)
                const categorySize = Math.abs(categoryScale.toPixel(1) - categoryScale.toPixel(0)) * actualBarWidth

                if (isHorizontal) {
                    barCenterX = (valueStartPos + valueEndPos) / 2
                    barCenterY = categoryPos
                    barWidthPx = Math.abs(valueEndPos - valueStartPos)
                    barHeightPx = categorySize
                } else {
                    barCenterX = categoryPos
                    barCenterY = (valueStartPos + valueEndPos) / 2
                    barWidthPx = categorySize
                    barHeightPx = Math.abs(valueEndPos - valueStartPos)
                }
            }

            // Adicionar ao array de hit detection com dimensões retangulares
            renderedBars.value.push({
                x: barCenterX,
                y: barCenterY,
                width: barWidthPx,
                height: barHeightPx,
                shape: 'rect',
                datasetIndex: originalIndex,
                dataIndex: index,
                value,
                label: props.data.labels[index] || `Bar ${index + 1}`,
                color
            })
        })
    })
}

const drawGrid = (_categoryScale: any, _valueScale: any, isHorizontal: boolean) => {
    if (!ctx.value) return

    const area = drawArea.value
    const gridColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-border-light').trim()

    ctx.value.strokeStyle = gridColor
    ctx.value.lineWidth = 1
    ctx.value.setLineDash([4, 4])

    const ticks = 5

    for (let i = 0; i <= ticks; i++) {
        if (isHorizontal) {
            const x = area.x + (area.width / ticks) * i
            ctx.value.beginPath()
            ctx.value.moveTo(x, area.y)
            ctx.value.lineTo(x, area.y + area.height)
            ctx.value.stroke()
        } else {
            const y = area.y + (area.height / ticks) * i
            ctx.value.beginPath()
            ctx.value.moveTo(area.x, y)
            ctx.value.lineTo(area.x + area.width, y)
            ctx.value.stroke()
        }
    }

    ctx.value.setLineDash([])
}

const drawAxes = (categoryScale: any, valueScale: any, isHorizontal: boolean) => {
    if (!ctx.value) return

    const area = drawArea.value
    const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-secondary').trim()

    ctx.value.fillStyle = textColor
    ctx.value.font = '12px sans-serif'

    if (isHorizontal) {
        // Labels no eixo Y (categorias)
        ctx.value.textAlign = 'right'
        ctx.value.textBaseline = 'middle'
        props.data.labels.forEach((label, index) => {
            const y = categoryScale.toPixel(index)
            ctx.value!.fillText(label, area.x - 10, y)
        })

        // Labels no eixo X (valores)
        ctx.value.textAlign = 'center'
        ctx.value.textBaseline = 'top'
        const ticks = 5
        const minValue = valueScale.min
        const maxValue = valueScale.max
        for (let i = 0; i <= ticks; i++) {
            const value = minValue + ((maxValue - minValue) / ticks) * i
            const x = valueScale.toPixel(value)
            ctx.value!.fillText(value.toFixed(0), x, area.y + area.height + 10)
        }
    } else {
        // Labels no eixo X (categorias)
        ctx.value.textAlign = 'center'
        ctx.value.textBaseline = 'top'
        props.data.labels.forEach((label, index) => {
            const x = categoryScale.toPixel(index)
            ctx.value!.fillText(label, x, area.y + area.height + 10)
        })

        // Labels no eixo Y (valores)
        ctx.value.textAlign = 'right'
        ctx.value.textBaseline = 'middle'
        const ticks = 5
        const minValue = valueScale.min
        const maxValue = valueScale.max
        for (let i = 0; i <= ticks; i++) {
            const value = minValue + ((maxValue - minValue) / ticks) * i
            const y = valueScale.toPixel(value)
            ctx.value!.fillText(value.toFixed(0), area.x - 10, y)
        }
    }
}

const drawBar = (
    index: number,
    valueStart: number,
    valueEnd: number,
    color: string,
    categoryScale: any,
    valueScale: any,
    barWidth: number,
    isHorizontal: boolean
) => {
    if (!ctx.value) return

    const categoryPos = categoryScale.toPixel(index)
    const valueStartPos = valueScale.toPixel(valueStart)
    const valueEndPos = valueScale.toPixel(valueEnd)

    const categorySize = Math.abs(categoryScale.toPixel(1) - categoryScale.toPixel(0)) * barWidth

    ctx.value.fillStyle = color

    if (isHorizontal) {
        const y = categoryPos - categorySize / 2
        const x = Math.min(valueStartPos, valueEndPos)
        const width = Math.abs(valueEndPos - valueStartPos)
        const height = categorySize

        ctx.value.fillRect(x, y, width, height)
    } else {
        const x = categoryPos - categorySize / 2
        const y = Math.min(valueStartPos, valueEndPos)
        const width = categorySize
        const height = Math.abs(valueEndPos - valueStartPos)

        ctx.value.fillRect(x, y, width, height)
    }
}

// Lifecycle
// onMounted(() => {
//     draw() // Agora é chamado via onReady callback
// })

watch([() => props.data, () => props.showGrid, dimensions], () => {
    draw()
}, { deep: true })
</script>

<template>
    <BaseChart :title="title" :subtitle="subtitle" :variant="variant" :show-legend="false" :show-toolbar="showToolbar"
        :show-grid="showGrid" :loading="loading" :error="error" :exportable="exportable"
        :fullscreenable="fullscreenable">
        <template #header>
            <slot name="header" />
        </template>

        <template #default>
            <canvas ref="canvasRef" />

            <!-- Tooltip interativo -->
            <ChartTooltip :data="tooltipData" :x="tooltipX" :y="tooltipY" />
        </template>

        <template #footer>
            <ChartLegend v-if="showLegend" :items="legendItems" @toggle="toggleDataset" />
        </template>
    </BaseChart>
</template>

<style lang="scss" scoped>
canvas {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
