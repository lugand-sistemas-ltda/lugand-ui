# 📊 Visualização de Dados - Showcase

Esta pasta contém todos os showcases e dados mockados para os componentes de visualização (charts).

## 📁 Estrutura

```
visualization/
├── ChartsView.vue     # View principal com todos os showcases
├── chartMocks.ts      # Dados mockados organizados por tipo de gráfico
└── README.md          # Este arquivo
```

## 🎯 ChartsView.vue

View completa com showcases de todos os 6 tipos de gráficos:

### 📈 Line Charts (3 exemplos)

- **Linha Simples**: Gráfico básico com um único dataset
- **Múltiplas Linhas**: Comparação entre vários datasets
- **Linha Suave com Preenchimento**: Curva suavizada com área preenchida

### 📊 Bar Charts (4 exemplos)

- **Barra Vertical Simples**: Gráfico de barras básico
- **Múltiplas Barras**: Comparação entre vários anos
- **Barras Empilhadas**: Visualização de composição com stacked
- **Barra Horizontal**: Ideal para labels longos

### 🥧 Pie Charts (3 exemplos)

- **Pizza Simples**: Gráfico de pizza padrão com percentuais
- **Donut Chart**: Variação com buraco no centro
- **Market Share**: Múltiplas fatias com cores personalizadas

### 🌄 Area Charts (3 exemplos)

- **Área Simples**: Gráfico de área básico
- **Múltiplas Áreas**: Comparação entre plataformas
- **Áreas Empilhadas**: Composição total ao longo do tempo

### ⚫ Scatter Charts (3 exemplos)

- **Dispersão Simples**: Scatter plot básico
- **Múltiplos Grupos**: Comparação entre diferentes grupos
- **Análise de Correlação**: Visualização de correlação positiva

### 🕸️ Graph Charts (4 exemplos)

- **Grafo Simples**: Network básico com 4 nós
- **Grafo Direcionado**: Fluxo de processo com setas e labels
- **Arquitetura de Sistema**: Network complexo com diferentes tamanhos
- **Rede Social**: Conexões sociais com tipos de relação

## 📦 chartMocks.ts

Arquivo centralizado com todos os dados mockados, organizados por tipo:

### Exports disponíveis:

**Line Chart Data:**

- `simpleLineData` - Vendas mensais (1 dataset)
- `multiLineData` - Produtos A/B/C (3 datasets)
- `smoothLineData` - Temperatura ao longo do dia (smooth + fill)

**Bar Chart Data:**

- `simpleBarData` - Receita mensal (1 dataset)
- `multiBarData` - Comparação anual 2022/2023/2024 (3 datasets)
- `stackedBarData` - Horas por atividade (3 datasets stacked)
- `horizontalBarData` - Distribuição da equipe (horizontal)

**Pie Chart Data:**

- `simplePieData` - Navegadores (5 segmentos)
- `donutData` - Departamentos (4 segmentos)
- `marketShareData` - Market share produtos (6 segmentos)

**Area Chart Data:**

- `simpleAreaData` - Usuários ativos (1 dataset)
- `multiAreaData` - Desktop/Mobile/Tablet (3 datasets)
- `stackedAreaData` - CPU/Memória/Disco (3 datasets stacked)

**Scatter Chart Data:**

- `simpleScatterData` - 7 pontos (1 dataset)
- `multiScatterData` - Grupos A/B/C (3 datasets, 5 pontos cada)
- `correlationData` - Altura vs Peso (8 pontos correlacionados)

**Graph Chart Data:**

- `simpleGraphData` - 4 nós, 4 arestas (circular)
- `directedGraphData` - 4 nós, 4 arestas direcionadas com labels (fluxo)
- `networkGraphData` - 7 nós, 6 arestas (arquitetura cliente-servidor)
- `socialGraphData` - 6 nós, 8 arestas com labels (rede social)

## 🎨 Padrão ComponentShowcase

Todos os exemplos seguem o padrão estabelecido:

```vue
<ComponentShowcase title="Título do Exemplo" description="Descrição breve">
  <template #component>
    <div style="height: 400px;">
      <ChartComponent 
        :data="mockData"
        title="Título do Gráfico"
        subtitle="Subtítulo opcional"
      />
    </div>
  </template>
  <template #code>
    <CodeBlock :code="exampleCode" language="vue" />
  </template>
</ComponentShowcase>
```

## 🔗 Navegação

A view está integrada no sistema de navegação:

- **Rota**: `/ui/visualization/charts`
- **Navbar**: UI → Visualization → Charts
- **Nome**: `ui-visualization-charts`

## 📝 Tipos TypeScript

Todos os dados mockados utilizam as interfaces corretas:

```typescript
import type {
  LineChartData,
  BarChartData,
  PieChartData,
  AreaChartData,
  ScatterChartData,
  GraphChartData,
} from "@/shared/components/visualization/types";
```

## 🎯 Recursos Demonstrados

Cada exemplo demonstra recursos específicos:

- ✅ Títulos e subtítulos
- ✅ Legendas em 4 posições (top, right, bottom, left)
- ✅ Toggle interativo de datasets via legenda
- ✅ Múltiplos datasets e cores
- ✅ Barras empilhadas (stacked)
- ✅ Barras horizontais
- ✅ Pie vs Donut
- ✅ Linhas suaves (smooth) e preenchimento (fill)
- ✅ Grafos direcionados com setas
- ✅ Labels em arestas
- ✅ Tamanhos customizados de nós
- ✅ Auto-scaling com margens (scatter)
- ✅ Force-directed layout (graph)

## 🚀 Próximas Iterações

Features planejadas para adicionar aos showcases:

- [ ] Exemplos com estado de loading
- [ ] Exemplos com estado de erro
- [ ] Exemplos com empty state
- [ ] Variantes (default, minimal, card)
- [ ] Tooltips interativos (quando implementado)
- [ ] Click events (quando implementado)
- [ ] Zoom e pan (quando implementado)
- [ ] Export PNG/SVG (quando implementado)

## 📚 Como Adicionar Novos Exemplos

1. **Adicionar dados mock** em `chartMocks.ts`:

   ```typescript
   export const newMockData: ChartType = {
     // ... dados
   };
   ```

2. **Importar em ChartsView.vue**:

   ```typescript
   import { newMockData } from "./chartMocks";
   ```

3. **Criar ComponentShowcase**:

   ```vue
   <ComponentShowcase title="..." description="...">
     <template #component>
       <ChartComponent :data="newMockData" />
     </template>
     <template #code>
       <CodeBlock :code="codeExample" />
     </template>
   </ComponentShowcase>
   ```

4. **Adicionar código de exemplo**:
   ```typescript
   const codeExample = `<script setup>...</script>...`;
   ```
