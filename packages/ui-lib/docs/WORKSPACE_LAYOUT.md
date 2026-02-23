# WorkspaceLayout

Layout genérico e reutilizável para interfaces com painéis laterais, canvas central e propriedades.

## 🎯 Casos de Uso

- **Form Builder** - Paleta de campos + canvas de design + propriedades
- **Page Builder** - Paleta de widgets + canvas de página + configurações
- **Code Editor** - Explorador de arquivos + editor + outline
- **Map Editor** - Ferramentas + mapa + camadas/propriedades
- **Data Visualization** - Datasets + canvas + configurações de gráfico

## 📦 Estrutura

```
┌─────────────┬──────────────────────┬─────────────┐
│             │     Toolbar          │             │
│   Sidebar   ├──────────────────────┤ Properties  │
│  (Palette)  │                      │   (Config)  │
│             │      Canvas          │             │
│             │                      │             │
│             ├──────────────────────┤             │
│             │    Status Bar        │             │
└─────────────┴──────────────────────┴─────────────┘
```

## 🚀 Uso Básico

```vue
<template>
  <WorkspaceLayout
    sidebar-width="md"
    properties-width="lg"
    :canvas-padding="true"
  >
    <!-- Sidebar Header (opcional) -->
    <template #sidebarHeader>
      <h3>Paleta de Componentes</h3>
    </template>

    <!-- Sidebar Content -->
    <template #sidebar>
      <div class="component-list">
        <!-- Lista de componentes arrastáveis -->
      </div>
    </template>

    <!-- Toolbar (opcional) -->
    <template #toolbar>
      <Button>Salvar</Button>
      <Button>Exportar</Button>
    </template>

    <!-- Canvas Principal -->
    <template #canvas>
      <div class="design-area">
        <!-- Área de trabalho principal -->
      </div>
    </template>

    <!-- Properties Panel Header (opcional) -->
    <template #propertiesHeader>
      <h3>Propriedades</h3>
    </template>

    <!-- Properties Panel Content -->
    <template #properties>
      <div class="property-editor">
        <!-- Formulário de propriedades -->
      </div>
    </template>

    <!-- Status Bar (opcional) -->
    <template #statusbar>
      <span>Zoom: 100%</span>
      <span>1024x768</span>
    </template>
  </WorkspaceLayout>
</template>

<script setup lang="ts">
import { WorkspaceLayout } from '@lugand-sistemas-ltda/vue-ui-lib'
</script>
```

## 🎨 Props

### `sidebarWidth`
- **Tipo**: `'sm' | 'md' | 'lg' | 'xl' | string`
- **Default**: `'md'`
- **Descrição**: Largura da sidebar esquerda
- **Valores predefinidos**:
  - `sm`: 240px
  - `md`: 280px
  - `lg`: 320px
  - `xl`: 360px
  - Ou valor customizado: `'400px'`

### `propertiesWidth`
- **Tipo**: `'sm' | 'md' | 'lg' | 'xl' | string`
- **Default**: `'md'`
- **Descrição**: Largura do painel de propriedades direito
- **Valores**: Mesmos da `sidebarWidth`

### `sidebarCollapsed`
- **Tipo**: `boolean`
- **Default**: `false`
- **Descrição**: Sidebar colapsada (56px)

### `propertiesCollapsed`
- **Tipo**: `boolean`
- **Default**: `false`
- **Descrição**: Painel de propriedades colapsado

### `vertical`
- **Tipo**: `boolean`
- **Default**: `false`
- **Descrição**: Layout vertical (mobile)

### `canvasPadding`
- **Tipo**: `boolean`
- **Default**: `true`
- **Descrição**: Adicionar padding ao canvas

## 📱 Slots Disponíveis

| Slot | Descrição | Obrigatório |
|------|-----------|-------------|
| `sidebarHeader` | Cabeçalho da sidebar | ❌ |
| `sidebar` | Conteúdo da sidebar | ❌ |
| `toolbar` | Barra de ferramentas | ❌ |
| `canvas` | Área principal de trabalho | ✅ (ou default slot) |
| `propertiesHeader` | Cabeçalho do painel de propriedades | ❌ |
| `properties` | Conteúdo do painel de propriedades | ❌ |
| `statusbar` | Barra de status inferior | ❌ |

## 🎯 Exemplo: Form Builder

```vue
<template>
  <WorkspaceLayout
    sidebar-width="md"
    properties-width="lg"
  >
    <template #sidebarHeader>
      <Input
        v-model="searchQuery"
        placeholder="Buscar campos..."
        prefix-icon="search"
      />
    </template>

    <template #sidebar>
      <FieldPalette
        :fields="filteredFields"
        @field-drag-start="handleDragStart"
      />
    </template>

    <template #toolbar>
      <ButtonGroup>
        <Button variant="ghost" size="sm">
          <Icon name="undo" /> Desfazer
        </Button>
        <Button variant="ghost" size="sm">
          <Icon name="redo" /> Refazer
        </Button>
      </ButtonGroup>

      <div style="flex: 1"></div>

      <ButtonGroup>
        <Button variant="primary" @click="save">
          <Icon name="save" /> Salvar
        </Button>
        <Button variant="secondary" @click="exportCode">
          <Icon name="download" /> Exportar
        </Button>
      </ButtonGroup>
    </template>

    <template #canvas>
      <DesignCanvas
        v-model="formSchema"
        :drag-enabled="true"
        @field-select="handleFieldSelect"
      />
    </template>

    <template #propertiesHeader>
      <h3>Propriedades do Campo</h3>
    </template>

    <template #properties>
      <PropertiesPanel
        v-if="selectedField"
        :field="selectedField"
        @update="handleFieldUpdate"
      />
      <EmptyState v-else>
        Selecione um campo para editar
      </EmptyState>
    </template>

    <template #statusbar>
      <span>{{ formSchema.fields.length }} campos</span>
      <span>Modificado há {{ lastModified }}</span>
    </template>
  </WorkspaceLayout>
</template>
```

## 🎯 Exemplo: Map Editor

```vue
<template>
  <WorkspaceLayout
    sidebar-width="sm"
    properties-width="md"
  >
    <template #sidebarHeader>
      <h3>Ferramentas</h3>
    </template>

    <template #sidebar>
      <div class="tools-palette">
        <Button block>🖱️ Selecionar</Button>
        <Button block>📍 Marcador</Button>
        <Button block>📏 Medir</Button>
        <Button block>🖊️ Desenhar</Button>
      </div>
    </template>

    <template #toolbar>
      <Input
        v-model="searchLocation"
        placeholder="Buscar localização..."
        prefix-icon="search"
      />
      <Button>Centralizar</Button>
    </template>

    <template #canvas>
      <MapViewer
        :center="mapCenter"
        :zoom="mapZoom"
        :markers="markers"
      />
    </template>

    <template #propertiesHeader>
      <Tabs v-model="activeTab">
        <TabPanel value="layers">Camadas</TabPanel>
        <TabPanel value="properties">Propriedades</TabPanel>
      </Tabs>
    </template>

    <template #properties>
      <LayersPanel v-if="activeTab === 'layers'" />
      <MarkerProperties v-else :marker="selectedMarker" />
    </template>

    <template #statusbar>
      <span>Zoom: {{ mapZoom }}x</span>
      <span>Lat: {{ mapCenter.lat }}, Lng: {{ mapCenter.lng }}</span>
    </template>
  </WorkspaceLayout>
</template>
```

## 🎨 Customização de Tokens

Você pode customizar a aparência do WorkspaceLayout usando CSS custom properties:

```css
:root {
  /* Sidebar */
  --sidebar-width-sm: 240px;
  --sidebar-width-md: 280px;
  --sidebar-width-lg: 320px;
  --sidebar-width-xl: 360px;
  --sidebar-collapsed: 56px;
  
  /* Canvas */
  --canvas-bg: var(--color-bg-primary);
  --canvas-padding: var(--spacing-lg);
  
  /* Panel */
  --panel-bg: var(--color-bg-elevated);
  --panel-border: 1px solid var(--color-border-base);
  
  /* Toolbar */
  --toolbar-height: 48px;
  --toolbar-bg: var(--color-bg-elevated);
  
  /* Scrollbar */
  --scrollbar-width: 12px;
  --scrollbar-thumb-bg: var(--color-border-dark);
}
```

## 📱 Responsividade

Em telas menores que 768px, o layout automaticamente se ajusta para:
- Grid vertical (1 coluna)
- Sidebar e Properties em 100% de largura
- Sidebars colapsadas ficam ocultas

## ✅ Benefícios

- **Genérico**: Reutilizável em qualquer contexto (builders, editors, maps, etc)
- **Theme-Aware**: Todos os elementos respondem aos temas da lib
- **Scrollbars Padronizados**: Scrollbars customizados e theme-aware
- **Responsivo**: Adapta automaticamente para mobile
- **Flexível**: Todos os painéis são opcionais
- **Controlável**: Props para colapsar/expandir painéis
- **Acessível**: Scrollbars suportam Firefox e webkit

## 🔧 Dicas

1. **Use slots opcionais**: Não precisa usar todos os slots, apenas os necessários
2. **Customize larguras**: Ajuste `sidebarWidth` e `propertiesWidth` conforme necessidade
3. **Canvas padding**: Desative com `:canvas-padding="false"` se precisar fullscreen
4. **Controle de estado**: Use props `sidebarCollapsed` e `propertiesCollapsed` para controlar UI
5. **Mobile first**: Em mobile, considere ocultar painéis por padrão

## 🎯 Próximos Passos

- [ ] Adicionar suporte para painéis redimensionáveis
- [ ] Adicionar animações de transição
- [ ] Adicionar suporte para múltiplos painéis laterais
- [ ] Adicionar shortcuts de teclado (Ctrl+B para toggle sidebar)
