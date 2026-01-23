/**
 * useChartInteraction - Composable para interação com gráficos
 * 
 * Features:
 * - Detecção de hover sobre pontos
 * - Detecção de cliques
 * - Hit detection (calcular qual ponto está sob o cursor)
 * - Tooltip data
 */
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import type { TooltipData } from '../BaseChart/components/ChartTooltip.vue'

export interface ChartPoint {
    x: number
    y: number
    datasetIndex: number
    dataIndex: number
    value: number
    label: string
    color?: string
    // Para barras e áreas retangulares
    width?: number
    height?: number
    // Para determinar tipo de hit detection
    shape?: 'point' | 'rect'
}

export interface UseChartInteractionOptions {
    /** Referência ao elemento canvas */
    canvasRef: Ref<HTMLCanvasElement | null>
    /** Função que retorna todos os pontos renderizados no gráfico */
    getPoints: () => ChartPoint[]
    /** Raio de detecção (px) */
    hitRadius?: number
    /** Habilitar tooltip */
    enableTooltip?: boolean
    /** Habilitar eventos de click */
    enableClick?: boolean
    /** Formatter customizado para tooltip */
    tooltipFormatter?: (point: ChartPoint) => TooltipData
}

export interface UseChartInteractionReturn {
    /** Dados do tooltip (null quando não está hovering) */
    tooltipData: Ref<TooltipData | null>
    /** Posição X do tooltip */
    tooltipX: Ref<number>
    /** Posição Y do tooltip */
    tooltipY: Ref<number>
    /** Ponto atualmente sob o cursor (null quando não há) */
    hoveredPoint: Ref<ChartPoint | null>
    /** Callback de click (deve ser emitido pelo chart) */
    onPointClick: (callback: (point: ChartPoint) => void) => void
}

export function useChartInteraction(
    options: UseChartInteractionOptions
): UseChartInteractionReturn {
    const {
        canvasRef,
        getPoints,
        hitRadius = 10,
        enableTooltip = true,
        enableClick = true,
        tooltipFormatter
    } = options

    const tooltipData = ref<TooltipData | null>(null)
    const tooltipX = ref(0)
    const tooltipY = ref(0)
    const hoveredPoint = ref<ChartPoint | null>(null)

    // Callbacks de click registrados
    const clickCallbacks: ((point: ChartPoint) => void)[] = []

    // Encontrar ponto mais próximo do cursor
    const findPointAtPosition = (mouseX: number, mouseY: number): ChartPoint | null => {
        const points = getPoints()
        let closestPoint: ChartPoint | null = null
        let minDistance = hitRadius

        for (const point of points) {
            // Se for retângulo (barra), verificar se mouse está dentro
            if (point.shape === 'rect' && point.width && point.height) {
                const left = point.x - point.width / 2
                const right = point.x + point.width / 2
                const top = point.y - point.height / 2
                const bottom = point.y + point.height / 2

                if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                    return point
                }
            } else {
                // Para pontos circulares, usar distância euclidiana
                const dx = point.x - mouseX
                const dy = point.y - mouseY
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < minDistance) {
                    minDistance = distance
                    closestPoint = point
                }
            }
        }

        return closestPoint
    }

    // Gerar dados do tooltip
    const generateTooltipData = (point: ChartPoint): TooltipData => {
        if (tooltipFormatter) {
            return tooltipFormatter(point)
        }

        // Tooltip padrão
        return {
            title: point.label,
            items: [
                {
                    label: 'Value',
                    value: point.value,
                    color: point.color
                }
            ]
        }
    }

    // Handler de mousemove
    const handleMouseMove = (event: MouseEvent) => {
        if (!canvasRef.value || !enableTooltip) return

        const rect = canvasRef.value.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        // Encontrar ponto sob o cursor
        const point = findPointAtPosition(mouseX, mouseY)

        if (point) {
            hoveredPoint.value = point
            tooltipData.value = generateTooltipData(point)
            tooltipX.value = event.clientX
            tooltipY.value = event.clientY

            // Mudar cursor para pointer
            canvasRef.value.style.cursor = 'pointer'
        } else {
            hoveredPoint.value = null
            tooltipData.value = null
            canvasRef.value.style.cursor = 'default'
        }
    }

    // Handler de mouseleave
    const handleMouseLeave = () => {
        hoveredPoint.value = null
        tooltipData.value = null
        if (canvasRef.value) {
            canvasRef.value.style.cursor = 'default'
        }
    }

    // Handler de click
    const handleClick = (event: MouseEvent) => {
        if (!canvasRef.value || !enableClick) return

        const rect = canvasRef.value.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const point = findPointAtPosition(mouseX, mouseY)

        if (point) {
            // Notificar todos os callbacks registrados
            clickCallbacks.forEach(callback => callback(point))
        }
    }

    // Registrar callback de click
    const onPointClick = (callback: (point: ChartPoint) => void) => {
        clickCallbacks.push(callback)
    }

    // Lifecycle
    onMounted(() => {
        if (!canvasRef.value) return

        if (enableTooltip) {
            canvasRef.value.addEventListener('mousemove', handleMouseMove)
            canvasRef.value.addEventListener('mouseleave', handleMouseLeave)
        }

        if (enableClick) {
            canvasRef.value.addEventListener('click', handleClick)
        }
    })

    onBeforeUnmount(() => {
        if (!canvasRef.value) return

        canvasRef.value.removeEventListener('mousemove', handleMouseMove)
        canvasRef.value.removeEventListener('mouseleave', handleMouseLeave)
        canvasRef.value.removeEventListener('click', handleClick)
    })

    return {
        tooltipData,
        tooltipX,
        tooltipY,
        hoveredPoint,
        onPointClick
    }
}
