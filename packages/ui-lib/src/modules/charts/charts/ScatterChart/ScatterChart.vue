<script setup lang="ts">
/**
 * ScatterChart - Gráfico de dispersão (scatter plot)
 * 
 * Features:
 * - Pontos (x, y)
 * - Múltiplos datasets
 * - Tamanhos configuráveis
 * - Tooltip interativo
 * - Click events
 */
import { ref, watch, computed } from 'vue'
import BaseChart from '../../BaseChart/BaseChart.vue'
import ChartLegend from '../../BaseChart/components/ChartLegend.vue'
import ChartTooltip from '../../BaseChart/components/ChartTooltip.vue'
import { useChart } from '../../composables/useChart'
import { useChartInteraction, type ChartPoint } from '../../composables/useChartInteraction'
import type { ScatterChartData, ChartOptions } from '../../types'

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

    // Props específicas do ScatterChart
    data: ScatterChartData
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
    'point-click': [data: { datasetIndex: number; dataIndex: number; x: number; y: number; label: string; color?: string }]
    'point-hover': [data: { datasetIndex: number; dataIndex: number; x: number; y: number; label: string; color?: string } | null]
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
            title: dataset?.label || `Dataset ${point.datasetIndex + 1}`,
            items: [
                {
                    label: 'X',
                    value: point.value.toFixed(2),
                    color: point.color
                },
                {
                    label: 'Y',
                    value: (point.y || 0).toFixed(2),
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
        x: point.value,
        y: point.y || 0,
        label: point.label,
        color: point.color
    })
})

watch(hoveredPoint, (point) => {
    if (point) {
        emit('point-hover', {
            datasetIndex: point.datasetIndex,
            dataIndex: point.dataIndex,
            x: point.value,
            y: point.y || 0,
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

    // Calcular min/max dos valores X e Y
    const allPoints = visibleData.flatMap(d => d.data)
    const xValues = allPoints.map(p => p.x)
    const yValues = allPoints.map(p => p.y)

    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    // Adicionar margem (10%)
    const xMargin = (maxX - minX) * 0.1
    const yMargin = (maxY - minY) * 0.1

    // Criar escalas
    const xScale = createLinearScale(
        minX - xMargin,
        maxX + xMargin,
        [area.x, area.x + area.width]
    )
    const yScale = createLinearScale(
        minY - yMargin,
        maxY + yMargin,
        [area.y + area.height, area.y]
    )

    // Desenhar grid
    if (internalShowGrid.value) {
        drawGrid(xScale, yScale)
    }

    // Desenhar eixos
    drawAxes(xScale, yScale)

    // Desenhar pontos
    const themeColors = getThemeColors()

    visibleData.forEach((dataset, datasetIndex) => {
        const originalIndex = props.data.datasets.indexOf(dataset)
        if (!datasetVisibility.value[originalIndex]) return

        const color = dataset.color || themeColors[datasetIndex % themeColors.length] || '#000000'
        const pointRadius = dataset.pointRadius ?? 4

        dataset.data.forEach((point, pointIndex) => {
            const x = xScale.toPixel(point.x)
            const y = yScale.toPixel(point.y)

            drawPoint(x, y, pointRadius, color)

            // Adicionar ao array de hit detection
            renderedPoints.value.push({
                x,
                y,
                datasetIndex: originalIndex,
                dataIndex: pointIndex,
                value: point.x, // Valor X principal
                label: point.label || `(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`,
                color
            })
        })
    })
}

const drawGrid = (_xScale: any, _yScale: any) => {
    if (!ctx.value) return

    const area = drawArea.value
    const gridColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-border-light').trim()

    ctx.value.strokeStyle = gridColor
    ctx.value.lineWidth = 1
    ctx.value.setLineDash([4, 4])

    const ticks = 5

    // Linhas horizontais
    for (let i = 0; i <= ticks; i++) {
        const y = area.y + (area.height / ticks) * i
        ctx.value.beginPath()
        ctx.value.moveTo(area.x, y)
        ctx.value.lineTo(area.x + area.width, y)
        ctx.value.stroke()
    }

    // Linhas verticais
    for (let i = 0; i <= ticks; i++) {
        const x = area.x + (area.width / ticks) * i
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

    // Labels do eixo X
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'top'
    const xTicks = 5
    const minX = xScale.min
    const maxX = xScale.max

    for (let i = 0; i <= xTicks; i++) {
        const value = minX + ((maxX - minX) / xTicks) * i
        const x = xScale.toPixel(value)
        ctx.value.fillText(value.toFixed(1), x, area.y + area.height + 10)
    }

    // Labels do eixo Y
    ctx.value.textAlign = 'right'
    ctx.value.textBaseline = 'middle'
    const yTicks = 5
    const minY = yScale.min
    const maxY = yScale.max

    for (let i = 0; i <= yTicks; i++) {
        const value = minY + ((maxY - minY) / yTicks) * i
        const y = yScale.toPixel(value)
        ctx.value.fillText(value.toFixed(1), area.x - 10, y)
    }
}

const drawPoint = (x: number, y: number, radius: number, color: string) => {
    if (!ctx.value) return

    const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg-primary').trim()

    // Ponto preenchido
    ctx.value.fillStyle = color
    ctx.value.beginPath()
    ctx.value.arc(x, y, radius, 0, Math.PI * 2)
    ctx.value.fill()

    // Contorno
    ctx.value.strokeStyle = bgColor
    ctx.value.lineWidth = 2
    ctx.value.stroke()
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
