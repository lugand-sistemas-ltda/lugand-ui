<template>
  <div class="workspace-layout" :class="layoutClasses">
    <!-- Sidebar (Palette/Tools) -->
    <aside
      v-if="$slots.sidebar"
      class="workspace-sidebar"
      :class="{ 'is-collapsed': sidebarCollapsed }"
    >
      <div class="sidebar-header" v-if="$slots.sidebarHeader">
        <slot name="sidebarHeader" />
      </div>
      <div class="sidebar-content">
        <slot name="sidebar" />
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="workspace-main">
      <!-- Toolbar -->
      <header v-if="$slots.toolbar" class="workspace-toolbar">
        <slot name="toolbar" />
      </header>

      <!-- Canvas/Editor Area -->
      <main class="workspace-canvas">
        <slot name="canvas">
          <slot />
        </slot>
      </main>

      <!-- Status Bar -->
      <footer v-if="$slots.statusbar" class="workspace-statusbar">
        <slot name="statusbar" />
      </footer>
    </div>

    <!-- Properties Panel (Right) -->
    <aside
      v-if="$slots.properties"
      class="workspace-properties"
      :class="{ 'is-collapsed': propertiesCollapsed }"
    >
      <div class="properties-header" v-if="$slots.propertiesHeader">
        <slot name="propertiesHeader" />
      </div>
      <div class="properties-content">
        <slot name="properties" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface WorkspaceLayoutProps {
  /** Largura da sidebar (sm|md|lg|xl|custom) */
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl' | string
  /** Largura do painel de propriedades (sm|md|lg|xl|custom) */
  propertiesWidth?: 'sm' | 'md' | 'lg' | 'xl' | string
  /** Sidebar colapsada */
  sidebarCollapsed?: boolean
  /** Painel de propriedades colapsado */
  propertiesCollapsed?: boolean
  /** Layout vertical (mobile) */
  vertical?: boolean
  /** Adicionar padding ao canvas */
  canvasPadding?: boolean
}

const props = withDefaults(defineProps<WorkspaceLayoutProps>(), {
  sidebarWidth: 'md',
  propertiesWidth: 'md',
  sidebarCollapsed: false,
  propertiesCollapsed: false,
  vertical: false,
  canvasPadding: true,
})

const layoutClasses = computed(() => ({
  'is-vertical': props.vertical,
  'has-canvas-padding': props.canvasPadding,
  [`sidebar-${props.sidebarWidth}`]: !props.sidebarWidth.includes('px'),
  [`properties-${props.propertiesWidth}`]: !props.propertiesWidth.includes('px'),
}))
</script>

<style scoped lang="scss">
@use '@/styles/utils/mixins';

.workspace-layout {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  height: 100%;
  width: 100%;
  background: var(--color-bg-primary);
  overflow: hidden;

  // Variantes de largura da sidebar
  &.sidebar-sm {
    --current-sidebar-width: var(--sidebar-width-sm);
  }
  &.sidebar-md {
    --current-sidebar-width: var(--sidebar-width-md);
  }
  &.sidebar-lg {
    --current-sidebar-width: var(--sidebar-width-lg);
  }
  &.sidebar-xl {
    --current-sidebar-width: var(--sidebar-width-xl);
  }

  // Variantes de largura das propriedades
  &.properties-sm {
    --current-properties-width: var(--sidebar-width-sm);
  }
  &.properties-md {
    --current-properties-width: var(--sidebar-width-md);
  }
  &.properties-lg {
    --current-properties-width: var(--sidebar-width-lg);
  }
  &.properties-xl {
    --current-properties-width: var(--sidebar-width-xl);
  }

  // Layout vertical (mobile)
  &.is-vertical {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
}

// ============================================
// SIDEBAR (LEFT)
// ============================================
.workspace-sidebar {
  width: var(--current-sidebar-width, var(--sidebar-width-md));
  background: var(--panel-bg);
  border-right: var(--panel-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: var(--sidebar-transition);

  &.is-collapsed {
    width: var(--sidebar-collapsed);
  }

  .sidebar-header {
    padding: var(--spacing-md);
    border-bottom: var(--panel-border);
    background: var(--color-bg-elevated);
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    @include mixins.custom-scrollbar;
  }
}

// ============================================
// MAIN CONTENT AREA
// ============================================
.workspace-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--canvas-bg);
}

// Toolbar
.workspace-toolbar {
  height: var(--toolbar-height);
  background: var(--toolbar-bg);
  border-bottom: var(--toolbar-border);
  padding: var(--toolbar-padding);
  display: flex;
  align-items: center;
  gap: var(--toolbar-gap);
  flex-shrink: 0;
}

// Canvas/Editor
.workspace-canvas {
  flex: 1;
  overflow: auto;
  position: relative;
  @include mixins.custom-scrollbar;

  .has-canvas-padding & {
    padding: var(--canvas-padding);
  }
}

// Status Bar
.workspace-statusbar {
  height: var(--statusbar-height);
  background: var(--statusbar-bg);
  border-top: var(--statusbar-border);
  padding: var(--statusbar-padding);
  font-size: var(--statusbar-font-size);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

// ============================================
// PROPERTIES PANEL (RIGHT)
// ============================================
.workspace-properties {
  width: var(--current-properties-width, var(--sidebar-width-md));
  background: var(--panel-bg);
  border-left: var(--panel-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: var(--sidebar-transition);

  &.is-collapsed {
    width: var(--sidebar-collapsed);
  }

  .properties-header {
    padding: var(--spacing-md);
    border-bottom: var(--panel-border);
    background: var(--color-bg-elevated);
    font-weight: var(--font-weight-medium);
  }

  .properties-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    @include mixins.custom-scrollbar;
  }
}

// ============================================
// RESPONSIVE
// ============================================
@media (max-width: 768px) {
  .workspace-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }

  .workspace-sidebar,
  .workspace-properties {
    width: 100%;
    border: none;
    border-bottom: var(--panel-border);

    &.is-collapsed {
      display: none;
    }
  }
}
</style>
