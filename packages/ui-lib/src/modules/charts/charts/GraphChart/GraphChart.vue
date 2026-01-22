<script setup lang="ts">
/**
 * GraphChart - Gráfico de grafos/network
 * 
 * Features:
 * - Nós e arestas
 * - Force-directed layout (simulação de física)
 * - Direcionado ou não-direcionado
 * - Dragging de nós (futuro)
 */
import { ref, watch, onMounted } from 'vue'
import BaseChart from '../../BaseChart/BaseChart.vue'
import { useChart } from '../../composables/useChart'
import type { GraphChartData, ChartOptions } from '../../types'

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

    // Props específicas do GraphChart
    data: GraphChartData
    options?: ChartOptions
}

const props = withDefaults(defineProps<Props>(), {
    showLegend: false,
    legendPosition: 'top'
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

const {
    ctx,
    dimensions,
    drawArea,
    clear,
    getThemeColors
} = useChart({
    canvasRef,
    options: props.options
})

// Posições dos nós (calculadas ou fornecidas)
interface NodePosition {
    id: string
    x: number
    y: number
    vx: number // velocidade X
    vy: number // velocidade Y
}

const nodePositions = ref<NodePosition[]>([])

// Inicializar posições dos nós
const initializePositions = () => {
    const area = drawArea.value
    const centerX = area.x + area.width / 2
    const centerY = area.y + area.height / 2
    const radius = Math.min(area.width, area.height) * 0.3

    nodePositions.value = props.data.nodes.map((node, index) => {
        // Se o nó já tem posição, usa ela
        if (node.x !== undefined && node.y !== undefined) {
            return {
                id: node.id,
                x: node.x,
                y: node.y,
                vx: 0,
                vy: 0
            }
        }

        // Caso contrário, distribui em círculo
        const angle = (index / props.data.nodes.length) * Math.PI * 2
        return {
            id: node.id,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            vx: 0,
            vy: 0
        }
    })
}

// Simulação de física (force-directed layout)
const simulatePhysics = (iterations: number = 50) => {
    const area = drawArea.value

    for (let iter = 0; iter < iterations; iter++) {
        // Força de repulsão entre nós
        for (let i = 0; i < nodePositions.value.length; i++) {
            for (let j = i + 1; j < nodePositions.value.length; j++) {
                const nodeA = nodePositions.value[i]
                const nodeB = nodePositions.value[j]
                if (!nodeA || !nodeB) continue

                const dx = nodeB.x - nodeA.x
                const dy = nodeB.y - nodeA.y
                const distance = Math.sqrt(dx * dx + dy * dy) || 1
                const force = 500 / (distance * distance)

                const fx = (dx / distance) * force
                const fy = (dy / distance) * force

                nodeA.vx -= fx
                nodeA.vy -= fy
                nodeB.vx += fx
                nodeB.vy += fy
            }
        }

        // Força de atração nas arestas
        props.data.edges.forEach(edge => {
            const nodeA = nodePositions.value.find(n => n.id === edge.from)
            const nodeB = nodePositions.value.find(n => n.id === edge.to)
            if (!nodeA || !nodeB) return

            const dx = nodeB.x - nodeA.x
            const dy = nodeB.y - nodeA.y
            const distance = Math.sqrt(dx * dx + dy * dy) || 1
            const force = distance * 0.01

            const fx = (dx / distance) * force
            const fy = (dy / distance) * force

            nodeA.vx += fx
            nodeA.vy += fy
            nodeB.vx -= fx
            nodeB.vy -= fy
        })

        // Aplicar velocidades e damping
        nodePositions.value.forEach(node => {
            node.x += node.vx
            node.y += node.vy
            node.vx *= 0.8 // damping
            node.vy *= 0.8

            // Manter dentro dos limites
            const margin = 30
            node.x = Math.max(area.x + margin, Math.min(area.x + area.width - margin, node.x))
            node.y = Math.max(area.y + margin, Math.min(area.y + area.height - margin, node.y))
        })
    }
}

// Desenhar gráfico
const draw = () => {
    if (!ctx.value) return

    clear()

    if (nodePositions.value.length === 0) {
        initializePositions()
        simulatePhysics(100)
    }

    const themeColors = getThemeColors()
    const defaultNodeColor = themeColors[0] || '#3b82f6'
    const defaultEdgeColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-secondary').trim()

    // Desenhar arestas primeiro (para ficarem atrás dos nós)
    props.data.edges.forEach(edge => {
        const nodeA = nodePositions.value.find(n => n.id === edge.from)
        const nodeB = nodePositions.value.find(n => n.id === edge.to)
        if (!nodeA || !nodeB) return

        const color = edge.color || defaultEdgeColor
        const width = edge.width || 2

        drawEdge(nodeA.x, nodeA.y, nodeB.x, nodeB.y, color, width, edge.directed, edge.label)
    })

    // Desenhar nós
    props.data.nodes.forEach(node => {
        const position = nodePositions.value.find(n => n.id === node.id)
        if (!position) return

        const color = node.color || defaultNodeColor
        const size = node.size || 20

        drawNode(position.x, position.y, size, color, node.label)
    })
}

const drawEdge = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number,
    directed?: boolean,
    label?: string
) => {
    if (!ctx.value) return

    ctx.value.strokeStyle = color
    ctx.value.lineWidth = width
    ctx.value.lineCap = 'round'

    // Linha
    ctx.value.beginPath()
    ctx.value.moveTo(x1, y1)
    ctx.value.lineTo(x2, y2)
    ctx.value.stroke()

    // Seta (se direcionado)
    if (directed) {
        const angle = Math.atan2(y2 - y1, x2 - x1)
        const arrowSize = 10

        // Calcular ponto da seta (um pouco antes do nó de destino)
        const nodeRadius = 20
        const arrowX = x2 - Math.cos(angle) * nodeRadius
        const arrowY = y2 - Math.sin(angle) * nodeRadius

        ctx.value.fillStyle = color
        ctx.value.beginPath()
        ctx.value.moveTo(arrowX, arrowY)
        ctx.value.lineTo(
            arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
            arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.value.lineTo(
            arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
            arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.value.closePath()
        ctx.value.fill()
    }

    // Label da aresta
    if (label) {
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2

        ctx.value.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-bg-primary').trim()
        ctx.value.fillRect(midX - 20, midY - 8, 40, 16)

        ctx.value.fillStyle = color
        ctx.value.font = '12px sans-serif'
        ctx.value.textAlign = 'center'
        ctx.value.textBaseline = 'middle'
        ctx.value.fillText(label, midX, midY)
    }
}

const drawNode = (x: number, y: number, size: number, color: string, label: string) => {
    if (!ctx.value) return

    const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg-primary').trim()

    // Círculo do nó
    ctx.value.fillStyle = color
    ctx.value.strokeStyle = bgColor
    ctx.value.lineWidth = 3

    ctx.value.beginPath()
    ctx.value.arc(x, y, size, 0, Math.PI * 2)
    ctx.value.fill()
    ctx.value.stroke()

    // Label do nó
    ctx.value.fillStyle = '#ffffff'
    ctx.value.font = 'bold 12px sans-serif'
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'middle'

    // Shadow para melhor legibilidade
    ctx.value.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.value.shadowBlur = 4

    ctx.value.fillText(label, x, y)

    // Reset shadow
    ctx.value.shadowColor = 'transparent'
    ctx.value.shadowBlur = 0
}

// Lifecycle
onMounted(() => {
    initializePositions()
    simulatePhysics(100)
    draw()
})

watch([() => props.data, dimensions], () => {
    nodePositions.value = []
    initializePositions()
    simulatePhysics(100)
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
