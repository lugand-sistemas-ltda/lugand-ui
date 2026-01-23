<script setup lang="ts">
/**
 * AreaChart - Gráfico de área
 * 
 * Features:
 * - Múltiplas áreas (datasets)
 * - Empilhado (stacked)
 * - Preenchimento gradiente
 * - Tooltip interativo
 * - Click events
 */
import { ref, watch, computed } from 'vue'
import BaseChart from '../../BaseChart/BaseChart.vue'
import ChartLegend from '../../BaseChart/components/ChartLegend.vue'
import ChartTooltip from '../../BaseChart/components/ChartTooltip.vue'
import { useChart } from '../../composables/useChart'
import { useChartInteraction, type ChartPoint } from '../../composables/useChartInteraction'
import type { AreaChartData, ChartOptions } from '../../types'

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

    // Props específicas do AreaChart
    data: AreaChartData
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
    'point-click': [data: { datasetIndex: number; dataIndex: number; value: number; label: string; color?: string }]
    'point-hover': [data: { datasetIndex: number; dataIndex: number; value: number; label: string; color?: string } | null]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

// Grid state (controlado pelo BaseChart via v-model)
const internalShowGrid = ref(props.showGrid)

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

// Array para armazenar pontos renderizados
const renderedPoints = ref<ChartPoint[]>([])

// Sistema de interação
const {
    tooltipData,
    tooltipX,
    tooltipY,
    hoveredPoint,
    onPointClick
} = useChartInteraction({
    canvasRef,
    getPoints: () => renderedPoints.value,
    enableTooltip: props.enableTooltip,
    enableClick: props.enableClick,
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
    emit('point-click', {
        datasetIndex: point.datasetIndex,
        dataIndex: point.dataIndex,
        value: point.value,
        label: point.label,
        color: point.color
    })
})

watch(hoveredPoint, (point) => {
    if (point) {
        emit('point-hover', {
            datasetIndex: point.datasetIndex,
            dataIndex: point.dataIndex,
            value: point.value,
            label: point.label,
            color: point.color
        })
    } else {
        emit('point-hover', null)
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

    // Limpar pontos renderizados
    renderedPoints.value = []

    const area = drawArea.value

    // Filtrar datasets visíveis
    const visibleData = props.data.datasets.filter((_, i) => datasetVisibility.value[i])
    if (visibleData.length === 0) return

    // Calcular min/max dos valores
    const allValues = visibleData.flatMap(d => d.data)
    const minValue = Math.min(...allValues, 0)
    const maxValue = props.data.stacked
        ? Math.max(...props.data.labels.map((_, i) =>
            visibleData.reduce((sum, d) => sum + (d.data[i] || 0), 0)
        ))
        : Math.max(...allValues)

    // Criar escalas
    const xScale = createLinearScale(0, props.data.labels.length - 1, [area.x, area.x + area.width])
    const yScale = createLinearScale(minValue, maxValue, [area.y + area.height, area.y])

    // Desenhar grid
    if (internalShowGrid.value) {
        drawGrid(xScale, yScale)
    }

    // Desenhar eixos
    drawAxes(xScale, yScale)

    // Desenhar áreas (de baixo para cima se stacked)
    const themeColors = getThemeColors()

    if (props.data.stacked) {
        // Empilhado: desenhar de baixo para cima
        const cumulativeData: number[][] = []

        visibleData.forEach((dataset, datasetIndex) => {
            const originalIndex = props.data.datasets.indexOf(dataset)
            if (!datasetVisibility.value[originalIndex]) return

            const color = dataset.color || themeColors[datasetIndex % themeColors.length] || '#000000'

            // Calcular valores acumulados
            const accumulated = dataset.data.map((value, index) => {
                const prevSum = datasetIndex > 0 && cumulativeData[datasetIndex - 1]
                    ? (cumulativeData[datasetIndex - 1]?.[index] ?? 0)
                    : 0
                return prevSum + value
            })

            cumulativeData.push(accumulated)

            // Pontos superiores
            const topPoints = accumulated.map((value, index) => ({
                x: xScale.toPixel(index),
                y: yScale.toPixel(value)
            }))

            // Adicionar pontos ao array de hit detection
            accumulated.forEach((value, index) => {
                renderedPoints.value.push({
                    x: xScale.toPixel(index),
                    y: yScale.toPixel(value),
                    datasetIndex: originalIndex,
                    dataIndex: index,
                    value: dataset.data[index] || 0,
                    label: props.data.labels[index] || `Point ${index + 1}`,
                    color
                })
            })

            // Pontos inferiores (camada anterior ou baseline)
            const bottomPoints = dataset.data.map((_, index) => {
                const prevValue = datasetIndex > 0 && cumulativeData[datasetIndex - 1]
                    ? (cumulativeData[datasetIndex - 1]?.[index] ?? 0)
                    : 0
                return {
                    x: xScale.toPixel(index),
                    y: yScale.toPixel(prevValue)
                }
            }).reverse()

            drawStackedArea(topPoints, bottomPoints, color)
        })
    } else {
        // Normal: cada área independente
        visibleData.forEach((dataset, datasetIndex) => {
            const originalIndex = props.data.datasets.indexOf(dataset)
            if (!datasetVisibility.value[originalIndex]) return

            const color = dataset.color || themeColors[datasetIndex % themeColors.length] || '#000000'
            const lineWidth = dataset.lineWidth ?? 2

            // Calcular pontos
            const points = dataset.data.map((value, index) => ({
                x: xScale.toPixel(index),
                y: yScale.toPixel(value)
            }))

            // Adicionar pontos ao array de hit detection
            dataset.data.forEach((value, index) => {
                renderedPoints.value.push({
                    x: xScale.toPixel(index),
                    y: yScale.toPixel(value),
                    datasetIndex: originalIndex,
                    dataIndex: index,
                    value,
                    label: props.data.labels[index] || `Point ${index + 1}`,
                    color
                })
            })

            // Desenhar área
            drawFilledArea(points, yScale.toPixel(0), color)

            // Desenhar linha de contorno
            drawLine(points, color, lineWidth)
        })
    }
}

const drawGrid = (xScale: any, _yScale: any) => {
    if (!ctx.value) return

    const area = drawArea.value
    const gridColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-border-light').trim()

    ctx.value.strokeStyle = gridColor
    ctx.value.lineWidth = 1
    ctx.value.setLineDash([4, 4])

    // Linhas horizontais
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
        const y = area.y + (area.height / yTicks) * i
        ctx.value.beginPath()
        ctx.value.moveTo(area.x, y)
        ctx.value.lineTo(area.x + area.width, y)
        ctx.value.stroke()
    }

    // Linhas verticais
    const xTicks = props.data.labels.length - 1
    for (let i = 0; i <= xTicks; i++) {
        const x = xScale.toPixel(i)
        ctx.value.beginPath()
        ctx.value.moveTo(x, area.y)
        ctx.value.lineTo(x, area.y + area.height)
        ctx.value.stroke()
    }

    ctx.value.setLineDash([])
}

const drawAxes = (xScale: any, yScale: any) => {
    if (!ctx.value) return

    const area = drawArea.value
    const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-secondary').trim()

    ctx.value.fillStyle = textColor
    ctx.value.font = '12px sans-serif'
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'top'

    // Labels do eixo X
    props.data.labels.forEach((label, index) => {
        const x = xScale.toPixel(index)
        ctx.value!.fillText(label, x, area.y + area.height + 10)
    })

    // Labels do eixo Y
    ctx.value.textAlign = 'right'
    ctx.value.textBaseline = 'middle'

    const yTicks = 5
    const minValue = yScale.min
    const maxValue = yScale.max

    for (let i = 0; i <= yTicks; i++) {
        const value = minValue + ((maxValue - minValue) / yTicks) * i
        const y = yScale.toPixel(value)
        ctx.value!.fillText(value.toFixed(0), area.x - 10, y)
    }
}

const drawLine = (points: { x: number; y: number }[], color: string, lineWidth: number) => {
    if (!ctx.value || points.length === 0) return

    ctx.value.strokeStyle = color
    ctx.value.lineWidth = lineWidth
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'

    ctx.value.beginPath()
    const firstPoint = points[0]
    if (!firstPoint) return
    ctx.value.moveTo(firstPoint.x, firstPoint.y)

    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        if (!point) continue
        ctx.value.lineTo(point.x, point.y)
    }

    ctx.value.stroke()
}

const drawFilledArea = (points: { x: number; y: number }[], baseline: number, color: string) => {
    if (!ctx.value || points.length === 0) return

    ctx.value.fillStyle = color + '40' // 40 = ~25% opacity

    ctx.value.beginPath()
    const firstPoint = points[0]
    if (!firstPoint) return
    ctx.value.moveTo(firstPoint.x, baseline)

    points.forEach(point => {
        ctx.value!.lineTo(point.x, point.y)
    })

    const lastPoint = points[points.length - 1]
    if (!lastPoint) return
    ctx.value.lineTo(lastPoint.x, baseline)
    ctx.value.closePath()
    ctx.value.fill()
}

const drawStackedArea = (
    topPoints: { x: number; y: number }[],
    bottomPoints: { x: number; y: number }[],
    color: string
) => {
    if (!ctx.value || topPoints.length === 0) return

    ctx.value.fillStyle = color + '60' // 60 = ~38% opacity

    ctx.value.beginPath()

    // Desenhar contorno superior
    const firstTop = topPoints[0]
    if (!firstTop) return
    ctx.value.moveTo(firstTop.x, firstTop.y)
    topPoints.forEach(point => {
        ctx.value!.lineTo(point.x, point.y)
    })

    // Desenhar contorno inferior (reverso)
    bottomPoints.forEach(point => {
        ctx.value!.lineTo(point.x, point.y)
    })

    ctx.value.closePath()
    ctx.value.fill()
}

// Lifecycle
// onMounted(() => {
//     draw() // Agora é chamado via onReady callback
// })

watch([() => props.data, internalShowGrid, dimensions], () => {
    draw()
}, { deep: true })
</script>

<template>
    <BaseChart :title="title" :subtitle="subtitle" :variant="variant" :show-legend="false" :show-toolbar="showToolbar"
        v-model:show-grid="internalShowGrid" :loading="loading" :error="error" :exportable="exportable"
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
