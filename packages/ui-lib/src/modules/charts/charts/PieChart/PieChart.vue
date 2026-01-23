<script setup lang="ts">
/**
 * PieChart - Gráfico de pizza/donut
 * 
 * Features:
 * - Pie ou Donut
 * - Cores automáticas do theme
 * - Tooltip interativo
 * - Click events
 */
import { ref, watch, computed } from 'vue'
import BaseChart from '../../BaseChart/BaseChart.vue'
import ChartLegend from '../../BaseChart/components/ChartLegend.vue'
import ChartTooltip from '../../BaseChart/components/ChartTooltip.vue'
import { useChart } from '../../composables/useChart'
import { useChartInteraction, type ChartPoint } from '../../composables/useChartInteraction'
import type { PieChartData, ChartOptions } from '../../types'

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

    // Props específicas do PieChart
    data: PieChartData
    options?: ChartOptions

    // Props de interatividade
    enableTooltip?: boolean
    enableClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showLegend: true,
    legendPosition: 'right',
    enableTooltip: true,
    enableClick: true
})

// Eventos
const emit = defineEmits<{
    'sector-click': [data: { sectorIndex: number; value: number; label: string; percentage: number; color?: string }]
    'sector-hover': [data: { sectorIndex: number; value: number; label: string; percentage: number; color?: string } | null]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const {
    ctx,
    dimensions,
    drawArea,
    clear,
    getThemeColors
} = useChart({
    canvasRef,
    options: props.options,
    onReady: () => {
        draw()
    }
})

// Array para armazenar setores renderizados (centro de cada setor)
const renderedSectors = ref<ChartPoint[]>([])

// Sistema de interação
const {
    tooltipData,
    tooltipX,
    tooltipY,
    hoveredPoint,
    onPointClick
} = useChartInteraction({
    canvasRef,
    getPoints: () => renderedSectors.value,
    enableTooltip: props.enableTooltip,
    enableClick: props.enableClick,
    hitRadius: 100, // Maior para setores
    tooltipFormatter: (point) => {
        const total = totalValue.value
        const percentage = total > 0 ? (point.value / total) * 100 : 0
        return {
            title: point.label,
            items: [
                {
                    label: 'Value',
                    value: point.value.toFixed(0),
                    color: point.color
                },
                {
                    label: 'Percentage',
                    value: `${percentage.toFixed(1)}%`,
                    color: point.color
                }
            ]
        }
    }
})

onPointClick((point) => {
    const total = totalValue.value
    const percentage = total > 0 ? (point.value / total) * 100 : 0
    emit('sector-click', {
        sectorIndex: point.dataIndex,
        value: point.value,
        label: point.label,
        percentage,
        color: point.color
    })
})

watch(hoveredPoint, (point) => {
    if (point) {
        const total = totalValue.value
        const percentage = total > 0 ? (point.value / total) * 100 : 0
        emit('sector-hover', {
            sectorIndex: point.dataIndex,
            value: point.value,
            label: point.label,
            percentage,
            color: point.color
        })
    } else {
        emit('sector-hover', null)
    }
})

// Controle de visibilidade dos setores
const sectorVisibility = ref<boolean[]>(
    props.data.values.map(() => true)
)

// Calcular total visível
const totalValue = computed(() => {
    return props.data.values.reduce((sum, value, index) => {
        return sectorVisibility.value[index] ? sum + value : sum
    }, 0)
})

// Legendas
const legendItems = computed(() => {
    const themeColors = getThemeColors()
    return props.data.labels.map((label, index) => ({
        label: `${label} (${props.data.values[index]})`,
        color: props.data.colors?.[index] || themeColors[index % themeColors.length] || '#000000',
        visible: sectorVisibility.value[index] ?? true
    }))
})

// Toggle visibilidade de setor
const toggleSector = (index: number) => {
    sectorVisibility.value[index] = !sectorVisibility.value[index]
    draw()
}

// Desenhar gráfico
const draw = () => {
    if (!ctx.value) return

    clear()

    // Limpar setores renderizados
    renderedSectors.value = []

    const area = drawArea.value

    // Calcular centro e raio
    const centerX = area.x + area.width / 2
    const centerY = area.y + area.height / 2
    const radius = Math.min(area.width, area.height) / 2 * 0.8

    const type = props.data.type || 'pie'
    const holeRadius = type === 'donut' ? radius * (props.data.holeRadius || 0.5) : 0

    const themeColors = getThemeColors()

    // Desenhar setores
    let startAngle = -Math.PI / 2 // Começar no topo

    props.data.values.forEach((value, index) => {
        if (!sectorVisibility.value[index]) return

        const percentage = value / totalValue.value
        const sweepAngle = percentage * Math.PI * 2
        const endAngle = startAngle + sweepAngle

        const color = props.data.colors?.[index] || themeColors[index % themeColors.length] || '#000000'

        // Desenhar setor
        drawSector(centerX, centerY, radius, holeRadius, startAngle, endAngle, color)

        // Adicionar centro do setor ao array de hit detection
        const sectorCenterAngle = startAngle + sweepAngle / 2
        const sectorCenterRadius = holeRadius + (radius - holeRadius) / 2
        const sectorCenterX = centerX + Math.cos(sectorCenterAngle) * sectorCenterRadius
        const sectorCenterY = centerY + Math.sin(sectorCenterAngle) * sectorCenterRadius

        renderedSectors.value.push({
            x: sectorCenterX,
            y: sectorCenterY,
            datasetIndex: 0,
            dataIndex: index,
            value,
            label: props.data.labels[index] || `Sector ${index + 1}`,
            color
        })

        // Desenhar label (se houver espaço)
        if (percentage > 0.05) { // Só mostra label se > 5%
            const labelAngle = startAngle + sweepAngle / 2
            const labelRadius = holeRadius + (radius - holeRadius) * 0.7
            const labelX = centerX + Math.cos(labelAngle) * labelRadius
            const labelY = centerY + Math.sin(labelAngle) * labelRadius

            drawLabel(labelX, labelY, `${(percentage * 100).toFixed(1)}%`)
        }

        startAngle = endAngle
    })
}

const drawSector = (
    centerX: number,
    centerY: number,
    radius: number,
    holeRadius: number,
    startAngle: number,
    endAngle: number,
    color: string
) => {
    if (!ctx.value) return

    ctx.value.fillStyle = color
    ctx.value.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg-primary').trim()
    ctx.value.lineWidth = 2

    ctx.value.beginPath()

    if (holeRadius > 0) {
        // Donut
        ctx.value.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.value.arc(centerX, centerY, holeRadius, endAngle, startAngle, true)
        ctx.value.closePath()
    } else {
        // Pie
        ctx.value.moveTo(centerX, centerY)
        ctx.value.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.value.closePath()
    }

    ctx.value.fill()
    ctx.value.stroke()
}

const drawLabel = (x: number, y: number, text: string) => {
    if (!ctx.value) return

    ctx.value.fillStyle = '#ffffff'
    ctx.value.font = 'bold 14px sans-serif'
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'middle'

    // Shadow para melhor legibilidade
    ctx.value.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.value.shadowBlur = 4
    ctx.value.shadowOffsetX = 0
    ctx.value.shadowOffsetY = 0

    ctx.value.fillText(text, x, y)

    // Reset shadow
    ctx.value.shadowColor = 'transparent'
    ctx.value.shadowBlur = 0
}

// Lifecycle
// onMounted(() => {
//     draw() // Agora é chamado via onReady callback
// })

watch([() => props.data, dimensions, sectorVisibility], () => {
    draw()
}, { deep: true })
</script>

<template>
    <BaseChart :title="title" :subtitle="subtitle" :variant="variant" :show-legend="false" :show-toolbar="showToolbar"
        :show-grid="false" :loading="loading" :error="error" :exportable="exportable" :fullscreenable="fullscreenable">
        <template #header>
            <slot name="header" />
        </template>

        <template #default>
            <canvas ref="canvasRef" />

            <!-- Tooltip interativo -->
            <ChartTooltip :data="tooltipData" :x="tooltipX" :y="tooltipY" />
        </template>

        <template #footer>
            <ChartLegend v-if="showLegend" :items="legendItems" @toggle="toggleSector" />
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
