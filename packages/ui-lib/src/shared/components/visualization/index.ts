/**
 * Visualization Components - Sistema de gráficos
 */

// Base
export { default as BaseChart } from './BaseChart/BaseChart.vue'
export { default as ChartLegend } from './BaseChart/components/ChartLegend.vue'

// Charts
export { default as LineChart } from './charts/LineChart/LineChart.vue'
export { default as BarChart } from './charts/BarChart/BarChart.vue'
export { default as PieChart } from './charts/PieChart/PieChart.vue'
export { default as AreaChart } from './charts/AreaChart/AreaChart.vue'
export { default as ScatterChart } from './charts/ScatterChart/ScatterChart.vue'
export { default as GraphChart } from './charts/GraphChart/GraphChart.vue'

// Composables
export { useChart } from './composables/useChart'

// Types
export type {
    BaseChartProps,
    ChartOptions,
    ChartVariant,
    LegendPosition,
    LineChartData,
    BarChartData,
    PieChartData,
    AreaChartData,
    ScatterChartData,
    GraphChartData,
    Dataset,
    ChartEvents,
    ChartEventData,
    ExportFormat
} from './types'
