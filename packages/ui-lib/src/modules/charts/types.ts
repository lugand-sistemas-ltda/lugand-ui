/**
 * Types base para o sistema de gráficos
 */

// ==================== CHART BASE ====================

export interface BaseChartProps {
    /** Título do gráfico */
    title?: string
    /** Subtítulo do gráfico */
    subtitle?: string

    /** Largura (px, %, vw, etc.) */
    width?: string | number
    /** Altura (px, %, vh, etc.) */
    height?: string | number

    /** Variante visual */
    variant?: ChartVariant

    /** Mostrar legenda */
    showLegend?: boolean
    /** Posição da legenda */
    legendPosition?: LegendPosition

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

export type ChartVariant = 'default' | 'minimal' | 'card'
export type LegendPosition = 'top' | 'right' | 'bottom' | 'left'

// ==================== CHART OPTIONS ====================

export interface ChartOptions {
    /** Responsivo (ajusta ao container) */
    responsive?: boolean
    /** Manter aspect ratio ao redimensionar */
    maintainAspectRatio?: boolean
    /** Configuração de animações */
    animation?: boolean | AnimationOptions
    /** Configuração de interações */
    interaction?: InteractionOptions
    /** Configuração de tooltip */
    tooltip?: TooltipOptions
    /** Configuração de grid */
    grid?: GridOptions
    /** Configuração de eixos */
    axes?: AxesOptions
}

export interface AnimationOptions {
    /** Duração da animação em ms */
    duration?: number
    /** Função de easing */
    easing?: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn' | 'easeInCubic' | 'easeOutCubic'
    /** Delay antes de iniciar */
    delay?: number
}

export interface InteractionOptions {
    /** Habilitar hover */
    hover?: boolean
    /** Habilitar click */
    click?: boolean
    /** Habilitar zoom */
    zoom?: boolean
    /** Habilitar pan (arrastar) */
    pan?: boolean
}

export interface TooltipOptions {
    /** Habilitar tooltip */
    enabled?: boolean
    /** Posição do tooltip */
    position?: 'top' | 'right' | 'bottom' | 'left' | 'follow'
    /** Formatação customizada */
    format?: (value: any, context?: any) => string
    /** Background color */
    backgroundColor?: string
    /** Text color */
    textColor?: string
}

export interface GridOptions {
    /** Mostrar grid */
    show?: boolean
    /** Cor das linhas */
    color?: string
    /** Espessura das linhas */
    lineWidth?: number
    /** Dasharray (para linhas tracejadas) */
    dash?: number[]
}

export interface AxesOptions {
    /** Configuração do eixo X */
    x?: AxisOptions
    /** Configuração do eixo Y */
    y?: AxisOptions
}

export interface AxisOptions {
    /** Mostrar eixo */
    show?: boolean
    /** Label do eixo */
    label?: string
    /** Valor mínimo */
    min?: number
    /** Valor máximo */
    max?: number
    /** Número de ticks */
    ticks?: number
    /** Formatação dos valores */
    format?: (value: number) => string
    /** Tipo de escala */
    scale?: 'linear' | 'logarithmic' | 'time'
}

// ==================== CHART DATA TYPES ====================

export interface Dataset {
    /** Nome do dataset */
    label: string
    /** Valores */
    data: number[]
    /** Cor (hex, rgb, etc.) */
    color?: string
}

export interface LineChartData {
    /** Labels do eixo X */
    labels: string[]
    /** Datasets */
    datasets: (Dataset & {
        /** Preencher área abaixo da linha */
        fill?: boolean
        /** Espessura da linha */
        lineWidth?: number
        /** Mostrar pontos */
        showPoints?: boolean
        /** Raio dos pontos */
        pointRadius?: number
        /** Linha suave (curva) */
        smooth?: boolean
    })[]
}

export interface BarChartData {
    /** Labels do eixo X */
    labels: string[]
    /** Datasets */
    datasets: (Dataset & {
        /** Orientação das barras */
        orientation?: 'vertical' | 'horizontal'
        /** Largura das barras (0-1) */
        barWidth?: number
    })[]
    /** Barras empilhadas */
    stacked?: boolean
}

export interface PieChartData {
    /** Labels dos setores */
    labels: string[]
    /** Valores dos setores */
    values: number[]
    /** Cores (opcional, usa palette do theme) */
    colors?: string[]
    /** Tipo (pie ou donut) */
    type?: 'pie' | 'donut'
    /** Raio do buraco (para donut, 0-1) */
    holeRadius?: number
}

export interface AreaChartData extends LineChartData {
    /** Empilhar áreas */
    stacked?: boolean
}

export interface ScatterChartData {
    /** Datasets */
    datasets: {
        label: string
        /** Pontos (x, y) */
        data: { x: number; y: number }[]
        color?: string
        /** Raio dos pontos */
        pointRadius?: number
    }[]
}

export interface GraphChartData {
    /** Nós do grafo */
    nodes: GraphNode[]
    /** Arestas (ligações) */
    edges: GraphEdge[]
}

export interface GraphNode {
    /** ID único */
    id: string
    /** Label */
    label: string
    /** Posição X (opcional, será calculada) */
    x?: number
    /** Posição Y (opcional, será calculada) */
    y?: number
    /** Cor */
    color?: string
    /** Tamanho */
    size?: number
    /** Dados customizados */
    data?: any
}

export interface GraphEdge {
    /** ID do nó de origem */
    from: string
    /** ID do nó de destino */
    to: string
    /** Label da aresta */
    label?: string
    /** Cor */
    color?: string
    /** Espessura */
    width?: number
    /** Direcionada (seta) */
    directed?: boolean
    /** Dados customizados */
    data?: any
}

// ==================== EVENTS ====================

export interface ChartEvents {
    /** Evento de hover sobre ponto/barra/setor */
    hover?: (data: ChartEventData) => void
    /** Evento de click sobre ponto/barra/setor */
    click?: (data: ChartEventData) => void
    /** Evento de zoom */
    zoom?: (zoomLevel: number) => void
    /** Evento de pan */
    pan?: (offset: { x: number; y: number }) => void
    /** Evento de redimensionamento */
    resize?: (size: { width: number; height: number }) => void
}

export interface ChartEventData {
    /** Índice do dataset */
    datasetIndex: number
    /** Índice do ponto */
    dataIndex: number
    /** Valor */
    value: number | { x: number; y: number }
    /** Label */
    label?: string
    /** Dataset completo */
    dataset?: Dataset
    /** Posição do mouse */
    position?: { x: number; y: number }
}

// ==================== INTERNAL TYPES ====================

export interface ChartDimensions {
    width: number
    height: number
    padding: {
        top: number
        right: number
        bottom: number
        left: number
    }
}

export interface ChartScale {
    min: number
    max: number
    range: number
    /** Converte valor para pixel */
    toPixel: (value: number) => number
    /** Converte pixel para valor */
    fromPixel: (pixel: number) => number
}

export interface ChartPoint {
    x: number
    y: number
    value: number
    datasetIndex: number
    dataIndex: number
}

export type ExportFormat = 'png' | 'svg' | 'csv' | 'json'
