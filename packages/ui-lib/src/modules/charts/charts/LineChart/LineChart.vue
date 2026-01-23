<script setup lang="ts">
/**
 * LineChart - Gráfico de linhas
 * 
 * Features:
 * - Múltiplas linhas (datasets)
 * - Suavização (smooth curves)
 * - Preenchimento de área (fill)
 * - Pontos interativos
 * - Tooltip interativo
 * - Click events
 * - Animações
 */
import { ref, watch, computed } from 'vue'
import BaseChart from '../../BaseChart/BaseChart.vue'
import ChartLegend from '../../BaseChart/components/ChartLegend.vue'
import ChartTooltip from '../../BaseChart/components/ChartTooltip.vue'
import { useChart } from '../../composables/useChart'
import { useChartInteraction, type ChartPoint } from '../../composables/useChartInteraction'
import type { LineChartData, ChartOptions } from '../../types'

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

    // Props específicas do LineChart
    data: LineChartData
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
        // Desenha apenas quando o canvas estiver pronto
        draw()
    }
})

// Array para armazenar todos os pontos renderizados (para hit detection)
const renderedPoints = ref<ChartPoint[]>([])

// Sistema de interação (tooltip + click)
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
        // Formatter customizado para LineChart
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

// Registrar callback de click para emitir evento
onPointClick((point) => {
    emit('point-click', {
        datasetIndex: point.datasetIndex,
        dataIndex: point.dataIndex,
        value: point.value,
        label: point.label,
        color: point.color
    })
})

// Watch hover para emitir evento
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
    const maxValue = Math.max(...allValues)

    // Criar escalas
    const xScale = createLinearScale(0, props.data.labels.length - 1, [area.x, area.x + area.width])
    const yScale = createLinearScale(minValue, maxValue, [area.y + area.height, area.y])

    // Desenhar grid
    if (internalShowGrid.value) {
        drawGrid(xScale, yScale)
    }

    // Desenhar eixos
    drawAxes(xScale, yScale)

    // Desenhar datasets
    const themeColors = getThemeColors()

    props.data.datasets.forEach((dataset, datasetIndex) => {
        if (!datasetVisibility.value[datasetIndex]) return

        const color = dataset.color || themeColors[datasetIndex % themeColors.length] || '#000000'
        const lineWidth = dataset.lineWidth ?? 2
        const showPoints = dataset.showPoints ?? true
        const pointRadius = dataset.pointRadius ?? 4

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
                datasetIndex,
                dataIndex: index,
                value,
                label: props.data.labels[index] || `Point ${index + 1}`,
                color
            })
        })

        // Desenhar área preenchida
        if (dataset.fill) {
            drawFilledArea(points, yScale.toPixel(0), color)
        }

        // Desenhar linha
        drawLine(points, color, lineWidth, dataset.smooth)

        // Desenhar pontos
        if (showPoints) {
            drawPoints(points, color, pointRadius)
        }
    })
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

const drawLine = (points: { x: number; y: number }[], color: string, lineWidth: number, smooth?: boolean) => {
    if (!ctx.value || points.length === 0) return

    ctx.value.strokeStyle = color
    ctx.value.lineWidth = lineWidth
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'

    ctx.value.beginPath()
    const firstPoint = points[0]
    if (!firstPoint) return
    ctx.value.moveTo(firstPoint.x, firstPoint.y)

    if (smooth && points.length > 2) {
        // Bezier curves para suavização
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1]
            const curr = points[i]
            if (!prev || !curr) continue
            const cpx = (prev.x + curr.x) / 2
            ctx.value.quadraticCurveTo(prev.x, prev.y, cpx, (prev.y + curr.y) / 2)
        }
        const last = points[points.length - 1]
        if (last) {
            ctx.value.lineTo(last.x, last.y)
        }
    } else {
        // Linhas retas
        for (let i = 1; i < points.length; i++) {
            const point = points[i]
            if (!point) continue
            ctx.value.lineTo(point.x, point.y)
        }
    }

    ctx.value.stroke()
}

const drawFilledArea = (points: { x: number; y: number }[], baseline: number, color: string) => {
    if (!ctx.value || points.length === 0) return

    ctx.value.fillStyle = color + '20' // 20 = ~12% opacity

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

const drawPoints = (points: { x: number; y: number }[], color: string, radius: number) => {
    if (!ctx.value) return

    ctx.value.fillStyle = color
    ctx.value.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg-primary').trim()
    ctx.value.lineWidth = 2

    points.forEach(point => {
        ctx.value!.beginPath()
        ctx.value!.arc(point.x, point.y, radius, 0, Math.PI * 2)
        ctx.value!.fill()
        ctx.value!.stroke()
    })
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
