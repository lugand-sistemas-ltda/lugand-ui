/**
 * Mock Data para Charts - Dados organizados para showcase
 * 
 * Todos os dados são tipados com as interfaces corretas
 * dos componentes de visualização.
 */
import type {
    LineChartData,
    BarChartData,
    PieChartData,
    AreaChartData,
    ScatterChartData,
    GraphChartData,
} from '@/modules/charts/types'

// ============================================
// LINE CHART DATA
// ============================================

export const simpleLineData: LineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
        {
            label: 'Vendas 2024',
            data: [30, 45, 35, 50, 49, 60],
            color: '#3b82f6',
        },
    ],
}

export const multiLineData: LineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
    datasets: [
        {
            label: 'Produto A',
            data: [30, 45, 35, 50, 49, 60, 70, 81],
            color: '#3b82f6',
        },
        {
            label: 'Produto B',
            data: [20, 30, 42, 45, 55, 58, 62, 68],
            color: '#10b981',
        },
        {
            label: 'Produto C',
            data: [15, 25, 28, 35, 40, 45, 50, 55],
            color: '#f59e0b',
        },
    ],
}

export const smoothLineData: LineChartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
        {
            label: 'Temperatura (°C)',
            data: [18, 16, 20, 28, 32, 25, 20],
            color: '#ef4444',
            fill: true,
            smooth: true,
        },
    ],
}

// ============================================
// BAR CHART DATA
// ============================================

export const simpleBarData: BarChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
        {
            label: 'Receita (R$ mil)',
            data: [65, 59, 80, 81, 56, 75],
            color: '#8b5cf6',
        },
    ],
}

export const multiBarData: BarChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
        {
            label: '2022',
            data: [120, 150, 180, 200],
            color: '#3b82f6',
        },
        {
            label: '2023',
            data: [140, 170, 190, 220],
            color: '#10b981',
        },
        {
            label: '2024',
            data: [160, 190, 210, 250],
            color: '#f59e0b',
        },
    ],
}

export const stackedBarData: BarChartData = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    datasets: [
        {
            label: 'Desenvolvimento',
            data: [4, 5, 6, 4, 7],
            color: '#3b82f6',
        },
        {
            label: 'Reuniões',
            data: [2, 3, 2, 3, 1],
            color: '#10b981',
        },
        {
            label: 'Planejamento',
            data: [1, 1, 2, 1, 2],
            color: '#f59e0b',
        },
    ],
}

export const horizontalBarData: BarChartData = {
    labels: ['Frontend', 'Backend', 'DevOps', 'Design', 'QA'],
    datasets: [
        {
            label: 'Equipe',
            data: [8, 12, 5, 4, 6],
            color: '#ec4899',
        },
    ],
}

// ============================================
// PIE CHART DATA
// ============================================

export const simplePieData: PieChartData = {
    labels: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Outros'],
    values: [45, 25, 15, 10, 5],
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'],
}

export const donutData: PieChartData = {
    labels: ['Desenvolvimento', 'Design', 'Marketing', 'Vendas'],
    values: [40, 20, 25, 15],
    colors: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'],
    type: 'donut',
}

export const marketShareData: PieChartData = {
    labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E', 'Outros'],
    values: [30, 25, 20, 12, 8, 5],
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'],
}

// ============================================
// AREA CHART DATA
// ============================================

export const simpleAreaData: AreaChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
        {
            label: 'Usuários Ativos',
            data: [1200, 1900, 3000, 5000, 7000, 9500],
            color: '#3b82f6',
        },
    ],
}

export const multiAreaData: AreaChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
        {
            label: 'Desktop',
            data: [3000, 3200, 3500, 4000, 4200, 4500, 5000],
            color: '#3b82f6',
        },
        {
            label: 'Mobile',
            data: [2000, 2500, 3000, 3800, 4500, 5200, 6000],
            color: '#10b981',
        },
        {
            label: 'Tablet',
            data: [500, 600, 700, 800, 900, 1000, 1200],
            color: '#f59e0b',
        },
    ],
}

export const stackedAreaData: AreaChartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
        {
            label: 'CPU',
            data: [30, 25, 35, 60, 75, 50, 40],
            color: '#ef4444',
        },
        {
            label: 'Memória',
            data: [20, 20, 25, 40, 50, 35, 30],
            color: '#f59e0b',
        },
        {
            label: 'Disco',
            data: [10, 15, 15, 20, 25, 20, 15],
            color: '#3b82f6',
        },
    ],
}

// ============================================
// SCATTER CHART DATA
// ============================================

export const simpleScatterData: ScatterChartData = {
    datasets: [
        {
            label: 'Dataset 1',
            data: [
                { x: 10, y: 20 },
                { x: 15, y: 35 },
                { x: 20, y: 30 },
                { x: 25, y: 45 },
                { x: 30, y: 50 },
                { x: 35, y: 55 },
                { x: 40, y: 60 },
            ],
            color: '#3b82f6',
        },
    ],
}

export const multiScatterData: ScatterChartData = {
    datasets: [
        {
            label: 'Grupo A',
            data: [
                { x: 10, y: 20 },
                { x: 15, y: 25 },
                { x: 20, y: 30 },
                { x: 25, y: 35 },
                { x: 30, y: 40 },
            ],
            color: '#3b82f6',
        },
        {
            label: 'Grupo B',
            data: [
                { x: 15, y: 45 },
                { x: 20, y: 50 },
                { x: 25, y: 55 },
                { x: 30, y: 60 },
                { x: 35, y: 65 },
            ],
            color: '#10b981',
        },
        {
            label: 'Grupo C',
            data: [
                { x: 5, y: 60 },
                { x: 10, y: 55 },
                { x: 15, y: 50 },
                { x: 20, y: 45 },
                { x: 25, y: 40 },
            ],
            color: '#f59e0b',
        },
    ],
}

export const correlationData: ScatterChartData = {
    datasets: [
        {
            label: 'Altura vs Peso',
            data: [
                { x: 150, y: 50 },
                { x: 160, y: 60 },
                { x: 165, y: 65 },
                { x: 170, y: 70 },
                { x: 175, y: 75 },
                { x: 180, y: 80 },
                { x: 185, y: 85 },
                { x: 190, y: 90 },
            ],
            color: '#8b5cf6',
        },
    ],
}

// ============================================
// GRAPH CHART DATA
// ============================================

export const simpleGraphData: GraphChartData = {
    nodes: [
        { id: 'A', label: 'Node A', color: '#3b82f6' },
        { id: 'B', label: 'Node B', color: '#10b981' },
        { id: 'C', label: 'Node C', color: '#f59e0b' },
        { id: 'D', label: 'Node D', color: '#ec4899' },
    ],
    edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'A' },
    ],
}

export const directedGraphData: GraphChartData = {
    nodes: [
        { id: '1', label: 'Start', color: '#10b981' },
        { id: '2', label: 'Process', color: '#3b82f6' },
        { id: '3', label: 'Decision', color: '#f59e0b' },
        { id: '4', label: 'End', color: '#ef4444' },
    ],
    edges: [
        { from: '1', to: '2', directed: true, label: 'init' },
        { from: '2', to: '3', directed: true, label: 'check' },
        { from: '3', to: '2', directed: true, label: 'retry' },
        { from: '3', to: '4', directed: true, label: 'success' },
    ],
}

export const networkGraphData: GraphChartData = {
    nodes: [
        { id: 'server', label: 'Server', color: '#3b82f6', size: 20 },
        { id: 'db', label: 'Database', color: '#10b981', size: 18 },
        { id: 'cache', label: 'Cache', color: '#f59e0b', size: 15 },
        { id: 'client1', label: 'Client 1', color: '#ec4899', size: 12 },
        { id: 'client2', label: 'Client 2', color: '#ec4899', size: 12 },
        { id: 'client3', label: 'Client 3', color: '#ec4899', size: 12 },
        { id: 'api', label: 'API Gateway', color: '#8b5cf6', size: 16 },
    ],
    edges: [
        { from: 'client1', to: 'api' },
        { from: 'client2', to: 'api' },
        { from: 'client3', to: 'api' },
        { from: 'api', to: 'server', directed: true },
        { from: 'server', to: 'db', directed: true },
        { from: 'server', to: 'cache', directed: true },
    ],
}

export const socialGraphData: GraphChartData = {
    nodes: [
        { id: 'alice', label: 'Alice', color: '#ec4899' },
        { id: 'bob', label: 'Bob', color: '#3b82f6' },
        { id: 'charlie', label: 'Charlie', color: '#10b981' },
        { id: 'diana', label: 'Diana', color: '#f59e0b' },
        { id: 'eve', label: 'Eve', color: '#8b5cf6' },
        { id: 'frank', label: 'Frank', color: '#ef4444' },
    ],
    edges: [
        { from: 'alice', to: 'bob', label: 'friends' },
        { from: 'alice', to: 'charlie', label: 'friends' },
        { from: 'bob', to: 'diana', label: 'friends' },
        { from: 'charlie', to: 'diana', label: 'friends' },
        { from: 'diana', to: 'eve', label: 'friends' },
        { from: 'eve', to: 'frank', label: 'friends' },
        { from: 'frank', to: 'alice', label: 'friends' },
        { from: 'charlie', to: 'eve', label: 'colleagues' },
    ],
}
