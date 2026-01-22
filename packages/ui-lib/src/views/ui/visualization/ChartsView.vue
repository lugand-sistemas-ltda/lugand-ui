<script setup lang="ts">
/**
 * ChartsView - Showcase completo de todos os componentes de visualização
 * 
 * Demonstra todos os 6 tipos de gráficos:
 * - LineChart: gráficos de linha (simples, múltiplos, smooth)
 * - BarChart: gráficos de barra (vertical, horizontal, stacked)
 * - PieChart: gráficos de pizza/donut
 * - AreaChart: gráficos de área (simples, múltiplos, stacked)
 * - ScatterChart: gráficos de dispersão (correlação x/y)
 * - GraphChart: grafos e networks (simples, direcionado, social)
 */
import { ref } from 'vue'
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  ScatterChart,
  GraphChart,
  ComponentShowcase,
  CodeBlock,
  Card,
} from '@/shared/components'

import {
  // Line Chart Data
  simpleLineData,
  multiLineData,
  smoothLineData,
  // Bar Chart Data
  simpleBarData,
  multiBarData,
  stackedBarData,
  horizontalBarData,
  // Pie Chart Data
  simplePieData,
  donutData,
  marketShareData,
  // Area Chart Data
  simpleAreaData,
  multiAreaData,
  stackedAreaData,
  // Scatter Chart Data
  simpleScatterData,
  multiScatterData,
  correlationData,
  // Graph Chart Data
  simpleGraphData,
  directedGraphData,
  networkGraphData,
  socialGraphData,
} from './chartMocks'

// Loading states para demonstração
const loading = ref(false)

// Code examples
const lineChartBasicCode = `<script setup lang="ts">
import { LineChart } from '@lugand/vue-ui-lib'

const data = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Vendas 2024',
    data: [30, 45, 35, 50, 49, 60],
    color: '#3b82f6',
  }]
}
<\/script>

<template>
  <LineChart 
    :data="data" 
    title="Vendas Mensais"    subtitle="Dados de 2024"
  height="400px"
  />
</template>`

const lineChartMultiCode = `<script setup lang="ts">
import { LineChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <LineChart 
    :data="data" 
    title="Comparação de Produtos"    legend-position="bottom"
  height="400px"
  />
</template>`

const lineChartSmoothCode = `<script setup lang="ts">
import { LineChart } from '@lugand/vue-ui-lib'

const data = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [{
    label: 'Temperatura (°C)',
    data: [18, 16, 20, 28, 32, 25, 20],
    color: '#ef4444',
    fill: true,
    smooth: true,
  }]
}
<\/script>

<template>
  <LineChart 
    :data="data"     title="Temperatura ao longo do dia"
  height="400px"
  />
</template>`

const barChartBasicCode = `<script setup lang="ts">
import { BarChart } from '@lugand/vue-ui-lib'

const data = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Receita (R$ mil)',
    data: [65, 59, 80, 81, 56, 75],
    color: '#8b5cf6',
  }]
}
<\/script>

<template>
  <BarChart 
    :data="data"     title="Receita Mensal"
  height="400px"
  />
</template>`

const barChartMultiCode = `<script setup lang="ts">
import { BarChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <BarChart 
    :data="data" 
    title="Comparação Anual"    legend-position="top"
  height="400px"
  />
</template>`

const barChartStackedCode = `<script setup lang="ts">
import { BarChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <BarChart 
    :data="data" 
    title="Horas por Atividade"    stacked
  height="400px"
  />
</template>`

const barChartHorizontalCode = `<script setup lang="ts">
import { BarChart } from '@lugand/vue-ui-lib'

const data = {
  labels: ['Frontend', 'Backend', 'DevOps', 'Design', 'QA'],
  datasets: [{
    label: 'Equipe',
    data: [8, 12, 5, 4, 6],
    color: '#ec4899',
  }]
}
<\/script>

<template>
  <BarChart 
    :data="data" 
    title="Distribuição da Equipe"    horizontal
  height="400px"
  />
</template>`

const pieChartBasicCode = `<script setup lang="ts">
import { PieChart } from '@lugand/vue-ui-lib'

const data = {
  labels: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Outros'],
  datasets: [{
    label: 'Navegadores',
    data: [45, 25, 15, 10, 5],
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'],
  }]
}
<\/script>

<template>
  <PieChart 
    :data="data"     title="Navegadores mais usados"
  height="400px"
  />
</template>`

const pieChartDonutCode = `<script setup lang="ts">
import { PieChart } from '@lugand/vue-ui-lib'

const data = {
  labels: ['Desenvolvimento', 'Design', 'Marketing', 'Vendas'],
  datasets: [{
    label: 'Departamentos',
    data: [40, 20, 25, 15],
    colors: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'],
  }]
}
<\/script>

<template>
  <PieChart 
    :data="data" 
    title="Departamentos"    donut
  height="400px"
  />
</template>`

const areaChartBasicCode = `<script setup lang="ts">
import { AreaChart } from '@lugand/vue-ui-lib'

const data = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Usuários Ativos',
    data: [1200, 1900, 3000, 5000, 7000, 9500],
    color: '#3b82f6',
  }]
}
<\/script>

<template>
  <AreaChart 
    :data="data"     title="Crescimento de Usuários"
  height="400px"
  />
</template>`

const areaChartMultiCode = `<script setup lang="ts">
import { AreaChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <AreaChart 
    :data="data" 
    title="Usuários por Plataforma"    legend-position="bottom"
  height="400px"
  />
</template>`

const areaChartStackedCode = `<script setup lang="ts">
import { AreaChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <AreaChart 
    :data="data" 
    title="Uso de Recursos"    stacked
  height="400px"
  />
</template>`

const scatterChartBasicCode = `<script setup lang="ts">
import { ScatterChart } from '@lugand/vue-ui-lib'

const data = {
  datasets: [{
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
  }]
}
<\/script>

<template>
  <ScatterChart 
    :data="data"     title="Dispersão Simples"
  height="400px"
  />
</template>`

const scatterChartMultiCode = `<script setup lang="ts">
import { ScatterChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <ScatterChart 
    :data="data" 
    title="Múltiplos Grupos"    legend-position="right"
  height="400px"
  />
</template>`

const scatterChartCorrelationCode = `<script setup lang="ts">
import { ScatterChart } from '@lugand/vue-ui-lib'

const data = {
  datasets: [{
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
  }]
}
<\/script>

<template>
  <ScatterChart 
    :data="data" 
    title="Correlação: Altura x Peso"    subtitle="Demonstração de correlação positiva"
  height="400px"
  />
</template>`

const graphChartBasicCode = `<script setup lang="ts">
import { GraphChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <GraphChart 
    :data="data"     title="Grafo Simples"
  height="400px"
  />
</template>`

const graphChartDirectedCode = `<script setup lang="ts">
import { GraphChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <GraphChart 
    :data="data" 
    title="Fluxo de Processo"    subtitle="Grafo direcionado com labels"
  height="400px"
  />
</template>`

const graphChartNetworkCode = `<script setup lang="ts">
import { GraphChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <GraphChart 
    :data="data"     title="Arquitetura de Sistema"
  height="400px"
  />
</template>`

const graphChartSocialCode = `<script setup lang="ts">
import { GraphChart } from '@lugand/vue-ui-lib'

const data = {
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
  ]
}
<\/script>

<template>
  <GraphChart 
    :data="data" 
    title="Rede Social"    subtitle="Conexões entre pessoas"
  height="400px"
  />
</template>`
</script>

<template>
  <div class="charts-view">
    <div class="charts-view__header">
      <h1>📊 Visualização de Dados</h1>
      <p class="charts-view__description">
        Sistema completo de gráficos e visualizações com arquitetura pai-filho.
        Todos os componentes compartilham a mesma base (<code>BaseChart</code>) e oferecem
        recursos como legendas interativas, posicionamento flexível, estados de loading/erro,
        e renderização otimizada com Canvas API.
      </p>
    </div>

    <!-- ============================================ -->
    <!-- LINE CHARTS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">📈 Line Charts</h2>
      <p class="charts-view__section-description">
        Gráficos de linha para visualizar tendências ao longo do tempo ou categorias.
        Suporta múltiplos datasets, curvas suaves, preenchimento de área e pontos customizáveis.
      </p>

      <!-- Simple Line Chart -->
      <ComponentShowcase title="Linha Simples" description="Gráfico de linha básico com um único dataset">
        <template #preview>
          <LineChart 
            :data="simpleLineData" 
            title="Vendas Mensais"
            subtitle="Dados de 2024"
            :loading="loading"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="lineChartBasicCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Multiple Lines -->
      <ComponentShowcase title="Múltiplas Linhas" description="Comparação entre vários datasets com legenda">
        <template #preview>
            <LineChart 
              :data="multiLineData" 
              title="Comparação de Produtos"
              subtitle="Performance mensal"              legend-position="bottom"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="lineChartMultiCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Smooth Line with Fill -->
      <ComponentShowcase title="Linha Suave com Preenchimento" description="Curva suavizada com área preenchida">
        <template #preview>
            <LineChart 
              :data="smoothLineData" 
              title="Temperatura ao longo do dia"              subtitle="Medições a cada 4 horas"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="lineChartSmoothCode" language="vue" />
        </template>
      </ComponentShowcase>
    </section>

    <!-- ============================================ -->
    <!-- BAR CHARTS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">📊 Bar Charts</h2>
      <p class="charts-view__section-description">
        Gráficos de barra para comparação entre categorias. Suporta orientação vertical/horizontal,
        barras empilhadas (stacked), múltiplos datasets e cores customizáveis.
      </p>

      <!-- Simple Bar Chart -->
      <ComponentShowcase title="Barra Vertical Simples" description="Gráfico de barras básico">
        <template #preview>
            <BarChart 
              :data="simpleBarData" 
              title="Receita Mensal"              subtitle="Em milhares de reais"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="barChartBasicCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Multiple Bars -->
      <ComponentShowcase title="Múltiplas Barras" description="Comparação entre vários anos">
        <template #preview>
            <BarChart 
              :data="multiBarData" 
              title="Comparação Anual"
              subtitle="Receita por trimestre"              legend-position="top"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="barChartMultiCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Stacked Bar Chart -->
      <ComponentShowcase title="Barras Empilhadas" description="Visualização de composição com barras stacked">
        <template #preview>
            <BarChart 
              :data="stackedBarData" 
              title="Horas por Atividade"
              subtitle="Distribuição semanal"
              stacked              legend-position="bottom"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="barChartStackedCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Horizontal Bar Chart -->
      <ComponentShowcase title="Barra Horizontal" description="Ideal para labels longos ou comparações">
        <template #preview>
            <BarChart 
              :data="horizontalBarData" 
              title="Distribuição da Equipe"
              subtitle="Número de pessoas por área"              horizontal
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="barChartHorizontalCode" language="vue" />
        </template>
      </ComponentShowcase>
    </section>

    <!-- ============================================ -->
    <!-- PIE CHARTS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">🥧 Pie Charts</h2>
      <p class="charts-view__section-description">
        Gráficos de pizza e donut para visualizar proporções e percentuais.
        Exibe automaticamente porcentagens e permite toggle de setores via legenda.
      </p>

      <!-- Simple Pie Chart -->
      <ComponentShowcase title="Pizza Simples" description="Gráfico de pizza padrão com percentuais">
        <template #preview>
            <PieChart 
              :data="simplePieData" 
              title="Navegadores mais usados"
              subtitle="Dados de 2024"              legend-position="right"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="pieChartBasicCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Donut Chart -->
      <ComponentShowcase title="Donut Chart" description="Variação com buraco no centro">
        <template #preview>
            <PieChart 
              :data="donutData" 
              title="Departamentos"
              subtitle="Distribuição da empresa"
              donut              legend-position="bottom"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="pieChartDonutCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Market Share Pie -->
      <ComponentShowcase title="Market Share" description="Múltiplas fatias com cores personalizadas">
        <template #preview>
            <PieChart 
              :data="marketShareData" 
              title="Market Share - Produtos"
              subtitle="Participação de mercado em 2024"              legend-position="right"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="pieChartBasicCode" language="vue" />
        </template>
      </ComponentShowcase>
    </section>

    <!-- ============================================ -->
    <!-- AREA CHARTS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">🌄 Area Charts</h2>
      <p class="charts-view__section-description">
        Gráficos de área para enfatizar volume e magnitude ao longo do tempo.
        Suporta múltiplos datasets, empilhamento (stacked) e opacidade customizável.
      </p>

      <!-- Simple Area Chart -->
      <ComponentShowcase title="Área Simples" description="Gráfico de área básico">
        <template #preview>
            <AreaChart 
              :data="simpleAreaData" 
              title="Crescimento de Usuários"              subtitle="Usuários ativos por mês"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="areaChartBasicCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Multiple Areas -->
      <ComponentShowcase title="Múltiplas Áreas" description="Comparação entre plataformas">
        <template #preview>
            <AreaChart 
              :data="multiAreaData" 
              title="Usuários por Plataforma"
              subtitle="Crescimento em diferentes dispositivos"              legend-position="bottom"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="areaChartMultiCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Stacked Area Chart -->
      <ComponentShowcase title="Áreas Empilhadas" description="Visualização de composição total ao longo do tempo">
        <template #preview>
            <AreaChart 
              :data="stackedAreaData" 
              title="Uso de Recursos"
              subtitle="CPU, Memória e Disco ao longo do dia"
              stacked              legend-position="top"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="areaChartStackedCode" language="vue" />
        </template>
      </ComponentShowcase>
    </section>

    <!-- ============================================ -->
    <!-- SCATTER CHARTS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">⚫ Scatter Charts</h2>
      <p class="charts-view__section-description">
        Gráficos de dispersão para visualizar correlações entre duas variáveis (x, y).
        Ideal para análise estatística, detecção de padrões e outliers.
        Suporta múltiplos datasets e escala automática com margens.
      </p>

      <!-- Simple Scatter -->
      <ComponentShowcase title="Dispersão Simples" description="Scatter plot básico">
        <template #preview>
            <ScatterChart 
              :data="simpleScatterData" 
              title="Dispersão Simples"              subtitle="Dados de exemplo"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="scatterChartBasicCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Multiple Scatter Groups -->
      <ComponentShowcase title="Múltiplos Grupos" description="Comparação entre diferentes grupos">
        <template #preview>
            <ScatterChart 
              :data="multiScatterData" 
              title="Múltiplos Grupos"
              subtitle="Três conjuntos de dados"              legend-position="right"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="scatterChartMultiCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Correlation Scatter -->
      <ComponentShowcase title="Análise de Correlação" description="Visualização de correlação positiva">
        <template #preview>
            <ScatterChart 
              :data="correlationData" 
              title="Correlação: Altura x Peso"              subtitle="Demonstração de correlação positiva"
            height="400px"
          />
        </template>
        <template #code>
          <CodeBlock :code="scatterChartCorrelationCode" language="vue" />
        </template>
      </ComponentShowcase>
    </section>

    <!-- ============================================ -->
    <!-- GRAPH CHARTS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">🕸️ Graph Charts (Networks)</h2>
      <p class="charts-view__section-description">
        Gráficos de grafo e network para visualizar relações e conexões entre entidades.
        Utiliza algoritmo force-directed para layout automático. Suporta grafos direcionados,
        labels em arestas, tamanhos de nós customizáveis e cores personalizadas.
      </p>

      <!-- Simple Graph -->
      <ComponentShowcase title="Grafo Simples" description="Network básico com 4 nós">
        <template #preview>
            <GraphChart 
              :data="simpleGraphData" 
              title="Grafo Simples"              subtitle="Estrutura básica de grafo"
            height="500px"
          />
        </template>
        <template #code>
          <CodeBlock :code="graphChartBasicCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Directed Graph -->
      <ComponentShowcase title="Grafo Direcionado" description="Fluxo de processo com setas e labels">
        <template #preview>
            <GraphChart 
              :data="directedGraphData" 
              title="Fluxo de Processo"              subtitle="Grafo direcionado com labels nas arestas"
            height="500px"
          />
        </template>
        <template #code>
          <CodeBlock :code="graphChartDirectedCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Network Graph -->
      <ComponentShowcase title="Arquitetura de Sistema" description="Network complexo com diferentes tamanhos de nós">
        <template #preview>
            <GraphChart 
              :data="networkGraphData" 
              title="Arquitetura de Sistema"              subtitle="Infraestrutura com clientes, API, servidor e banco"
            height="500px"
          />
        </template>
        <template #code>
          <CodeBlock :code="graphChartNetworkCode" language="vue" />
        </template>
      </ComponentShowcase>

      <!-- Social Network Graph -->
      <ComponentShowcase title="Rede Social" description="Conexões sociais com labels nas relações">
        <template #preview>
            <GraphChart 
              :data="socialGraphData" 
              title="Rede Social"              subtitle="Conexões entre pessoas com tipos de relação"
            height="500px"
          />
        </template>
        <template #code>
          <CodeBlock :code="graphChartSocialCode" language="vue" />
        </template>
      </ComponentShowcase>
    </section>

    <!-- ============================================ -->
    <!-- RECURSOS GERAIS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">🎯 Recursos Gerais</h2>
      <p class="charts-view__section-description">
        Todos os componentes de gráfico compartilham recursos comuns através do <code>BaseChart</code>:
      </p>

      <Card>
        <ul class="charts-view__features-list">
          <li>
            <strong>🎨 Temas:</strong> Integração automática com sistema de temas da biblioteca
          </li>
          <li>
            <strong>📱 Responsivo:</strong> Adaptação automática ao container usando ResizeObserver
          </li>
          <li>
            <strong>🔄 Estados:</strong> Loading state, error state e empty state
          </li>
          <li>
            <strong>📊 Legendas:</strong> 4 posições (top, right, bottom, left) com toggle interativo
          </li>
          <li>
            <strong>🎯 Variants:</strong> 3 estilos (default, minimal, card) para diferentes contextos
          </li>
          <li>
            <strong>🖼️ Toolbar:</strong> Botões para export (PNG) e fullscreen
          </li>
          <li>
            <strong>⚡ Performance:</strong> Renderização otimizada com Canvas API e device pixel ratio
          </li>
          <li>
            <strong>🎨 Customização:</strong> Props para título, subtítulo, altura, cores e mais
          </li>
          <li>
            <strong>♿ Acessibilidade:</strong> Estrutura semântica com ARIA labels
          </li>
          <li>
            <strong>🔌 Slots:</strong> Slots para customização de header, toolbar e footer
          </li>
        </ul>
      </Card>
    </section>

    <!-- ============================================ -->
    <!-- PRÓXIMOS PASSOS -->
    <!-- ============================================ -->
    <section class="charts-view__section">
      <h2 class="charts-view__section-title">🚀 Próximos Passos</h2>
      <p class="charts-view__section-description">
        Funcionalidades planejadas para as próximas versões:
      </p>

      <Card>
        <ul class="charts-view__roadmap-list">
          <li>
            <strong>Phase 2 - Interatividade:</strong>
            <ul>
              <li>✨ Tooltips ao passar o mouse sobre pontos/barras/setores</li>
              <li>🖱️ Click events para interação com dados</li>
              <li>🔍 Zoom e pan para exploração detalhada</li>
              <li>📤 Export em múltiplos formatos (PNG, SVG, JSON)</li>
              <li>⚙️ Configurações avançadas de eixos e grid</li>
            </ul>
          </li>
          <li>
            <strong>Phase 3 - Recursos Avançados:</strong>
            <ul>
              <li>🎨 Gradientes e padrões em cores</li>
              <li>📊 Eixos logarítmicos e customizados</li>
              <li>🎭 Animações avançadas e transições</li>
              <li>🌐 Mapas geográficos (Geo Charts)</li>
              <li>📈 Indicadores e métricas (KPI Cards)</li>
            </ul>
          </li>
        </ul>
      </Card>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.charts-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  &__header {
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
  }

  &__description {
    font-size: 1.125rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 1rem;

    code {
      background: var(--bg-tertiary);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
      color: var(--primary);
    }
  }

  &__section {
    margin-bottom: 4rem;
  }

  &__section-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
  }

  &__section-description {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;

    code {
      background: var(--bg-tertiary);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
      color: var(--primary);
    }
  }

  &__features-list,
  &__roadmap-list {
    list-style: none;
    padding: 0;

    > li {
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      strong {
        color: var(--text-primary);
        font-weight: 600;
      }

      ul {
        margin-top: 0.5rem;
        margin-left: 1.5rem;
        list-style-type: disc;

        li {
          padding: 0.25rem 0;
          color: var(--text-secondary);
        }
      }
    }
  }
}
</style>
