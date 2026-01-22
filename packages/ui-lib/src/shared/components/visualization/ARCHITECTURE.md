# 📊 Visualization Components Architecture

> Sistema de gráficos genéricos com padrão de herança/composição.

---

## 🎯 Conceito

### Hierarquia de Componentes

```
BaseChart (Componente Pai)
├── Container
├── Header (título, subtítulo, ações)
├── Legend (legenda configurável)
├── Toolbar (zoom, export, fullscreen)
├── Slot para gráfico filho
└── Footer (notas, fonte de dados)

Gráficos Específicos (Componentes Filhos)
├── LineChart        - Gráfico de linhas
├── BarChart         - Gráfico de barras
├── PieChart         - Gráfico de pizza
├── AreaChart        - Gráfico de área
├── ScatterChart     - Gráfico de dispersão
├── GraphChart       - Gráfico de grafos/network
└── ComboChart       - Gráfico combinado
```

---

## 📁 Estrutura de Pastas

```
src/shared/components/visualization/
├── BaseChart/
│   ├── BaseChart.vue           # Componente pai genérico
│   ├── types.ts                # Types compartilhados
│   └── components/
│       ├── ChartHeader.vue     # Cabeçalho com título/ações
│       ├── ChartLegend.vue     # Legenda configurável
│       ├── ChartToolbar.vue    # Barra de ferramentas
│       └── ChartTooltip.vue    # Tooltip genérico
│
├── charts/
│   ├── LineChart/
│   │   ├── LineChart.vue       # Implementação do gráfico
│   │   ├── types.ts            # Types específicos
│   │   └── utils.ts            # Funções auxiliares
│   │
│   ├── BarChart/
│   │   ├── BarChart.vue
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── PieChart/
│   │   ├── PieChart.vue
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   └── ...
│
├── core/
│   ├── canvas.ts               # Funções de desenho no canvas
│   ├── scales.ts               # Cálculo de escalas (linear, log)
│   ├── axes.ts                 # Renderização de eixos
│   ├── animations.ts           # Sistema de animações
│   └── interactions.ts         # Hover, click, zoom
│
├── composables/
│   ├── useChart.ts             # Lógica base de gráficos
│   ├── useChartResize.ts       # Responsividade
│   ├── useChartInteraction.ts  # Interações (hover, click)
│   └── useChartExport.ts       # Export PNG/SVG/CSV
│
└── index.ts                    # Exports
```

---

## 🧩 Padrão de Implementação

### 1. BaseChart (Componente Pai)

**Responsabilidades:**

- Container responsivo
- Header com título/subtítulo/ações
- Toolbar com ações (zoom, export, fullscreen)
- Legend (posição configurável)
- Sistema de theming (usa CSS variables da lib)
- Loading state
- Empty state
- Error boundary

**Props:**

```typescript
interface BaseChartProps {
  // Conteúdo
  title?: string;
  subtitle?: string;

  // Aparência
  width?: string | number;
  height?: string | number;
  variant?: "default" | "minimal" | "card";

  // Features
  showLegend?: boolean;
  legendPosition?: "top" | "right" | "bottom" | "left";
  showToolbar?: boolean;
  showGrid?: boolean;

  // Estados
  loading?: boolean;
  error?: string;

  // Ações
  exportable?: boolean;
  fullscreenable?: boolean;

  // Theme
  colors?: string[];
}
```

### 2. Gráficos Específicos (Componentes Filhos)

**Responsabilidades:**

- Receber dados específicos do tipo de gráfico
- Processar dados (calcular escalas, posições)
- Renderizar no canvas/SVG
- Emitir eventos de interação

**Props Comum a Todos:**

```typescript
interface ChartDataProps<T = any> {
  data: T;
  options?: ChartOptions;
}

// Cada tipo de gráfico define seu formato de dados
type LineChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    fill?: boolean;
  }[];
};

type PieChartData = {
  labels: string[];
  values: number[];
  colors?: string[];
};

type BarChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
  orientation?: "vertical" | "horizontal";
};
```

---

## 🎨 Sistema de Theming

Usa as CSS variables existentes da lib:

```scss
.chart {
  --chart-bg: var(--color-bg-primary);
  --chart-text: var(--color-text-primary);
  --chart-grid: var(--color-border-light);
  --chart-axis: var(--color-text-secondary);

  // Cores padrão dos datasets (baseadas no theme)
  --chart-color-1: var(--color-primary);
  --chart-color-2: var(--color-secondary);
  --chart-color-3: var(--color-success);
  --chart-color-4: var(--color-warning);
  --chart-color-5: var(--color-error);
  --chart-color-6: var(--color-info);
}
```

---

## 🔄 Fluxo de Uso

### Exemplo: LineChart

```vue
<script setup lang="ts">
import { LineChart } from "@lugand/vue-ui-lib";

const chartData = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
  datasets: [
    {
      label: "Vendas 2025",
      data: [150, 230, 180, 350, 400],
      color: "#3b82f6",
    },
    {
      label: "Vendas 2024",
      data: [100, 180, 150, 280, 320],
      color: "#10b981",
    },
  ],
};

const handlePointClick = (point: any) => {
  console.log("Clicked:", point);
};
</script>

<template>
  <LineChart
    title="Vendas Mensais"
    subtitle="Comparativo anual"
    :data="chartData"
    :height="400"
    show-legend
    legend-position="top"
    exportable
    @point-click="handlePointClick"
  />
</template>
```

---

## 🚀 Features Planejadas

### Fase 1 - MVP (Básico)

- [x] BaseChart com container e header
- [x] LineChart básico
- [x] BarChart básico
- [x] PieChart básico
- [x] Sistema de cores do theme
- [x] Responsividade

### Fase 2 - Interatividade

- [ ] Tooltip ao hover
- [ ] Click em pontos/barras/setores
- [ ] Zoom e pan
- [ ] Export PNG/SVG/CSV

### Fase 3 - Avançado

- [ ] Animações de entrada
- [ ] AreaChart
- [ ] ScatterChart
- [ ] GraphChart (grafos)
- [ ] ComboChart (múltiplos tipos)
- [ ] Realtime updates

---

## 🎯 Decisões de Design

### Canvas vs SVG?

**Escolha: Canvas para performance, SVG para precisão**

- **Canvas**: LineChart, BarChart, ScatterChart (muitos pontos)
- **SVG**: PieChart, GraphChart (precisão, interatividade)

### Biblioteca externa ou vanilla?

**Escolha: Vanilla JS (zero dependencies)**

- Controle total sobre renderização
- Integração perfeita com theming da lib
- Sem dependências externas
- Menor bundle size

### Responsividade?

**Escolha: ResizeObserver + debounce**

```typescript
useChartResize(
  chartRef,
  (width, height) => {
    redrawChart(width, height);
  },
  150,
); // debounce 150ms
```

---

## 📊 Tipos Base

```typescript
// Tipos compartilhados por todos os gráficos
export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  animation?: boolean | AnimationOptions;
  interaction?: InteractionOptions;
  tooltip?: TooltipOptions;
  grid?: GridOptions;
  axes?: AxesOptions;
}

export interface AnimationOptions {
  duration?: number;
  easing?: "linear" | "easeInOut" | "easeOut" | "easeIn";
}

export interface InteractionOptions {
  hover?: boolean;
  click?: boolean;
  zoom?: boolean;
  pan?: boolean;
}

export interface TooltipOptions {
  enabled?: boolean;
  position?: "top" | "right" | "bottom" | "left" | "follow";
  format?: (value: any) => string;
}

export interface GridOptions {
  show?: boolean;
  color?: string;
  lineWidth?: number;
}

export interface AxesOptions {
  x?: AxisOptions;
  y?: AxisOptions;
}

export interface AxisOptions {
  show?: boolean;
  label?: string;
  min?: number;
  max?: number;
  ticks?: number;
  format?: (value: number) => string;
}
```

---

## 📝 Próximos Passos

1. Criar `BaseChart.vue` com container, header, toolbar
2. Criar `useChart.ts` composable base
3. Implementar `LineChart.vue` como primeiro filho
4. Criar sistema de cores baseado no theme
5. Documentar API no showcase
