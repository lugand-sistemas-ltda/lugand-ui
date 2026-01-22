/**
 * useChart - Composable base para todos os gráficos
 * 
 * Fornece funcionalidades comuns:
 * - Dimensões do canvas
 * - Cálculo de escalas
 * - Sistema de coordenadas
 * - Cores do theme
 */
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'
import type { ChartDimensions, ChartScale, ChartOptions } from '../types'

export interface UseChartOptions {
    /** Referência ao elemento canvas */
    canvasRef: Ref<HTMLCanvasElement | null>
    /** Largura inicial */
    width?: number
    /** Altura inicial */
    height?: number
    /** Padding do gráfico */
    padding?: {
        top?: number
        right?: number
        bottom?: number
        left?: number
    }
    /** Opções do gráfico */
    options?: ChartOptions
}

export interface UseChartReturn {
    /** Contexto do canvas */
    ctx: Ref<CanvasRenderingContext2D | null>
    /** Dimensões do gráfico */
    dimensions: Ref<ChartDimensions>
    /** Dimensões da área de desenho (excluindo padding) */
    drawArea: Ref<{
        x: number
        y: number
        width: number
        height: number
    }>
    /** Criar escala linear */
    createLinearScale: (min: number, max: number, pixelRange: [number, number]) => ChartScale
    /** Redimensionar canvas */
    resize: () => void
    /** Limpar canvas */
    clear: () => void
    /** Obter cores do theme */
    getThemeColors: () => string[]
}

export function useChart(options: UseChartOptions): UseChartReturn {
    const { canvasRef, width: initialWidth = 600, height: initialHeight = 400, padding = {} } = options

    const ctx = ref<CanvasRenderingContext2D | null>(null)

    const dimensions = ref<ChartDimensions>({
        width: initialWidth,
        height: initialHeight,
        padding: {
            top: padding.top ?? 40,
            right: padding.right ?? 40,
            bottom: padding.bottom ?? 60,
            left: padding.left ?? 60
        }
    })

    // Área de desenho (excluindo padding)
    const drawArea = computed(() => {
        const { width, height, padding } = dimensions.value
        return {
            x: padding.left,
            y: padding.top,
            width: width - padding.left - padding.right,
            height: height - padding.top - padding.bottom
        }
    })

    // Criar escala linear
    const createLinearScale = (min: number, max: number, pixelRange: [number, number]): ChartScale => {
        const range = max - min
        const pixelMin = pixelRange[0]
        const pixelMax = pixelRange[1]
        const pixelRangeSize = pixelMax - pixelMin

        return {
            min,
            max,
            range,
            toPixel: (value: number) => {
                const normalized = (value - min) / range
                return pixelMin + normalized * pixelRangeSize
            },
            fromPixel: (pixel: number) => {
                const normalized = (pixel - pixelMin) / pixelRangeSize
                return min + normalized * range
            }
        }
    }

    // Redimensionar canvas
    const resize = () => {
        if (!canvasRef.value) return

        const parent = canvasRef.value.parentElement
        if (!parent) return

        const rect = parent.getBoundingClientRect()

        // Ajusta para device pixel ratio (para telas retina)
        const dpr = window.devicePixelRatio || 1

        dimensions.value.width = rect.width
        dimensions.value.height = rect.height

        canvasRef.value.width = rect.width * dpr
        canvasRef.value.height = rect.height * dpr

        // Escala o contexto para compensar o DPR
        if (ctx.value) {
            ctx.value.scale(dpr, dpr)
        }
    }

    // Limpar canvas
    const clear = () => {
        if (!ctx.value || !canvasRef.value) return
        ctx.value.clearRect(0, 0, dimensions.value.width, dimensions.value.height)
    }

    // Obter cores do theme
    const getThemeColors = (): string[] => {
        const root = document.documentElement
        const getColor = (varName: string) =>
            getComputedStyle(root).getPropertyValue(varName).trim()

        return [
            getColor('--color-primary'),
            getColor('--color-secondary'),
            getColor('--color-success'),
            getColor('--color-warning'),
            getColor('--color-error'),
            getColor('--color-info')
        ]
    }

    // Observer de redimensionamento
    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
        if (!canvasRef.value) return

        ctx.value = canvasRef.value.getContext('2d')
        resize()

        // Observa mudanças no tamanho do container
        if (options.options?.responsive !== false) {
            resizeObserver = new ResizeObserver(() => {
                resize()
            })

            if (canvasRef.value.parentElement) {
                resizeObserver.observe(canvasRef.value.parentElement)
            }
        }
    })

    onBeforeUnmount(() => {
        if (resizeObserver) {
            resizeObserver.disconnect()
        }
    })

    return {
        ctx,
        dimensions,
        drawArea,
        createLinearScale,
        resize,
        clear,
        getThemeColors
    }
}
