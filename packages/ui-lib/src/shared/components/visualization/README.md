# 📊 Visualization Components

> Sistema de gráficos genéricos e modulares para Vue 3.

---

## 🎯 Visão Geral

Sistema de gráficos construído com padrão de **composição/herança**, onde:

- **BaseChart** = Componente pai (gerencia container, toolbar, legend, estados)
- **Gráficos específicos** = Componentes filhos (LineChart, BarChart, PieChart, etc.)

### ✅ Status de Implementação

| Componente     | Status       | Descrição                                               |
| -------------- | ------------ | ------------------------------------------------------- |
| `BaseChart`    | ✅ Completo  | Container base com header, toolbar, legend              |
| `ChartLegend`  | ✅ Completo  | Legenda interativa com toggle                           |
| `LineChart`    | ✅ Completo  | Gráfico de linhas com múltiplos datasets, smooth curves |
| `BarChart`     | ✅ Completo  | Gráfico de barras vertical/horizontal, stacked          |
| `PieChart`     | ✅ Completo  | Gráfico de pizza/donut com labels de percentual         |
| `AreaChart`    | ✅ Completo  | Gráfico de área, suporta stacked                        |
| `ScatterChart` | ✅ Completo  | Gráfico de dispersão (x, y) para correlações            |
| `GraphChart`   | ✅ Completo  | Gráfico de grafos/network com force-directed layout     |
| `ComboChart`   | 🔄 Planejado | Gráfico combinado (múltiplos tipos)                     |

---

## 🚀 Uso Básico

### LineChart Simples

```vue
<script setup lang="ts">
import { LineChart } from "@lugand/vue-ui-lib";
import type { LineChartData } from "@lugand/vue-ui-lib";

const data: LineChartData = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  datasets: [
    {
      label: "Vendas 2025",
      data: [150, 230, 180, 350, 400, 380],
    },
  ],
};
</script>

<template>
  <LineChart title="Vendas Mensais" :data="data" :height="400" />
</template>
```

### Múltiplos Datasets

```vue
<script setup lang="ts">
const data: LineChartData = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
  datasets: [
    {
      label: "Vendas 2025",
      data: [150, 230, 180, 350, 400],
      color: "#3b82f6",
      smooth: true,
    },
    {
      label: "Vendas 2024",
      data: [100, 180, 150, 280, 320],
      color: "#10b981",
      fill: true,
    },
  ],
};
</script>

<template>
  <LineChart
    title="Comparativo de Vendas"
    subtitle="Últimos 5 meses"
    :data="data"
    show-legend
    legend-position="top"
    exportable
    fullscreenable
  />
</template>
```

---

## 📦 API Reference

### BaseChart Props

```typescript
interface BaseChartProps {
  title?: string; // Título do gráfico
  subtitle?: string; // Subtítulo
  width?: string | number; // Largura (default: '100%')
  height?: string | number; // Altura (default: 400)
  variant?: "default" | "minimal" | "card"; // Variante visual
  showLegend?: boolean; // Mostrar legenda (default: true)
  legendPosition?: "top" | "right" | "bottom" | "left";
  showToolbar?: boolean; // Mostrar toolbar (default: true)
  showGrid?: boolean; // Mostrar grid (default: true)
  loading?: boolean; // Estado de loading
  error?: string; // Mensagem de erro
  exportable?: boolean; // Permitir export (default: true)
  fullscreenable?: boolean; // Permitir fullscreen (default: true)
}
```

### LineChart Props

```typescript
interface LineChartProps extends BaseChartProps {
  data: LineChartData;
  options?: ChartOptions;
}

interface LineChartData {
  labels: string[]; // Labels do eixo X
  datasets: {
    label: string; // Nome do dataset
    data: number[]; // Valores
    color?: string; // Cor (hex/rgb)
    fill?: boolean; // Preencher área
    lineWidth?: number; // Espessura da linha (default: 2)
    showPoints?: boolean; // Mostrar pontos (default: true)
    pointRadius?: number; // Raio dos pontos (default: 4)
    smooth?: boolean; // Suavizar linha (default: false)
  }[];
}
```

### ChartOptions

```typescript
interface ChartOptions {
  responsive?: boolean; // Responsivo (default: true)
  maintainAspectRatio?: boolean; // Manter aspect ratio
  animation?: boolean | AnimationOptions;
  interaction?: {
    hover?: boolean;
    click?: boolean;
    zoom?: boolean;
    pan?: boolean;
  };
  tooltip?: {
    enabled?: boolean;
    position?: "top" | "right" | "bottom" | "left" | "follow";
    format?: (value: any) => string;
  };
  grid?: {
    show?: boolean;
    color?: string;
    lineWidth?: number;
  };
  axes?: {
    x?: AxisOptions;
    y?: AxisOptions;
  };
}
```

---

## 🎨 Theming

Os gráficos usam as CSS variables do sistema de themes da lib:

```scss
// Cores automáticas baseadas no theme
--color-primary     // Dataset 1
--color-secondary   // Dataset 2
--color-success     // Dataset 3
--color-warning     // Dataset 4
--color-error       // Dataset 5
--color-info        // Dataset 6

// Estrutura
--color-bg-primary      // Background do container
--color-text-primary    // Texto do título
--color-text-secondary  // Texto dos eixos
--color-border-light    // Grid
```

### Cores Customizadas

```vue
<LineChart
  :data="{
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [10, 20, 30],
        color: '#ff6b6b', // ← Cor customizada
      },
    ],
  }"
/>
```

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
visualization/
├── BaseChart/
│   ├── BaseChart.vue           # Container base
│   └── components/
│       └── ChartLegend.vue     # Legenda reutilizável
├── charts/
│   └── LineChart/
│       └── LineChart.vue       # Gráfico de linhas
├── composables/
│   └── useChart.ts             # Lógica base compartilhada
├── types.ts                    # Tipos TypeScript
└── index.ts                    # Exports
```

### Padrão de Implementação

Todos os gráficos seguem o mesmo padrão:

1. **Herdam props do BaseChart** (title, variant, loading, etc.)
2. **Usam o composable `useChart`** (canvas, escalas, cores)
3. **Implementam método `draw()`** (renderização específica)
4. **Emitem eventos padronizados** (click, hover)

---

## 🔧 Desenvolvimento

### Criar Novo Gráfico

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import BaseChart from "../BaseChart/BaseChart.vue";
import { useChart } from "../composables/useChart";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { ctx, clear, drawArea, getThemeColors } = useChart({ canvasRef });

const draw = () => {
  if (!ctx.value) return;
  clear();

  // Implementar lógica de desenho
};

onMounted(() => draw());
watch(() => props.data, draw, { deep: true });
</script>

<template>
  <BaseChart v-bind="$attrs">
    <canvas ref="canvasRef" />
  </BaseChart>
</template>
```

---

## 📝 Roadmap

### Fase 1 - Gráficos Base (✅ 100% Completo!)

- [x] BaseChart com container
- [x] ChartLegend interativo
- [x] LineChart (linhas múltiplas, smooth curves)
- [x] BarChart (vertical/horizontal/stacked)
- [x] PieChart (pie/donut)
- [x] AreaChart (normal/stacked)
- [x] ScatterChart (dispersão x/y)
- [x] GraphChart (grafos com force-directed layout)
- [x] Sistema de cores do theme
- [x] Responsividade (ResizeObserver)

### Fase 2 - Interatividade (🔄 Próxima fase)

- [ ] Tooltip ao hover
- [ ] Click em pontos/barras/nós
- [ ] Zoom e pan
- [ ] Export PNG/SVG/CSV
- [ ] Animações de entrada

### Fase 3 - Features Avançadas

- [ ] ComboChart (múltiplos tipos)
- [ ] Realtime updates
- [ ] Drag de nós (GraphChart)
- [ ] Brush selection
- [ ] Configuração de eixos avançada

---

## 💡 Exemplos Avançados

### Com Loading State

```vue
<LineChart
  title="Dados em Tempo Real"
  :data="chartData"
  :loading="isLoading"
  :error="errorMessage"
/>
```

### Fullscreen + Export

```vue
<LineChart :data="data" exportable fullscreenable @export="handleExport" />
```

### Legend Customizada

```vue
<LineChart :data="data" :show-legend="false">
  <template #footer>
    <div class="custom-legend">
      <!-- Legenda customizada -->
    </div>
  </template>
</LineChart>
```

---

## 🐛 Troubleshooting

### Canvas em branco

- Verifique se o container pai tem altura definida
- Confirme que `data.labels` e `data.datasets` não estão vazios

### Cores não aparecem

- Verifique se o theme está carregado
- Use cores customizadas se necessário: `color: '#ff0000'`

### Performance lenta

- Reduza o número de pontos (use aggregation)
- Desabilite animações: `animation: false`
- Use debounce no resize

---

## 📚 Documentação Relacionada

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada
- [/docs/COMPONENTS.md](../../docs/COMPONENTS.md) - Todos os componentes
- [/docs/THEMES.md](../../docs/THEMES.md) - Sistema de themes
