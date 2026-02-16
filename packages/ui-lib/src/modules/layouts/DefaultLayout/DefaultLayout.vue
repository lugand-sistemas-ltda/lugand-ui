<script setup lang="ts">
/**
 * Layout padrão - estrutura base para todas as views
 * Integra Navbar, Header, Footer e área de conteúdo principal
 */
import { ref, watch } from 'vue'
import { Navbar, NavItem, NavLink } from './components'
import AppHeader from '@/modules/AppShell/components/AppHeader.vue'
import AppFooter from '@/modules/AppShell/components/AppFooter.vue'
import ThemeSelector from '@/modules/AppShell/components/ThemeSelector.vue'

const navbarRef = ref<InstanceType<typeof Navbar>>()
const navbarVisible = ref(true)

// Observa mudanças na visibilidade do navbar
watch(
  () => navbarRef.value?.isVisible,
  (visible) => {
    if (visible !== undefined) {
      navbarVisible.value = visible
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="default-layout">
    <!-- Navbar lateral esquerdo -->
    <Navbar ref="navbarRef" position="left">
      <!-- Seção superior: navegação principal -->
      <template #top>
        <NavLink to="/" exact>
          <span>🏠</span>
          <span>Home</span>
        </NavLink>

        <NavItem label="UI" icon="🎨" :default-expanded="false">
          <NavItem label="Inputs" :default-expanded="false">
            <NavLink to="/ui/inputs/text">Text Inputs</NavLink>
            <NavLink to="/ui/inputs/selection">Selection Inputs</NavLink>
            <NavLink to="/ui/inputs/specialized">Specialized Inputs</NavLink>
          </NavItem>

          <NavItem label="Layout" :default-expanded="false">
            <NavLink to="/ui/layout/structure">Layout Structure</NavLink>
            <NavLink to="/ui/layout/typography">Typography</NavLink>
            <NavLink to="/ui/layout/themes">Themes</NavLink>
            <NavLink to="/ui/layout/page-header">PageHeader</NavLink>
            <NavLink to="/ui/layout/filter-sidebar">FilterSidebar</NavLink>
          </NavItem>

          <NavItem label="Display" :default-expanded="false">
            <NavLink to="/ui/display/cards">Cards</NavLink>
            <NavLink to="/ui/display/stat-cards">StatCards</NavLink>
            <NavLink to="/ui/display/timeline">Timeline</NavLink>
            <NavLink to="/ui/display/progress">Progress</NavLink>
            <NavLink to="/ui/display/rating">Rating</NavLink>
            <NavLink to="/ui/display/containers">Containers</NavLink>
            <NavLink to="/ui/elements/display">Badges & Tooltips</NavLink>
          </NavItem>

          <NavItem label="Navigation" :default-expanded="false">
            <NavLink to="/ui/navigation/drawers">Drawers</NavLink>
            <NavLink to="/ui/navigation/disclosure">Disclosure</NavLink>
            <NavLink to="/ui/navigation/tabs">Tabs</NavLink>
            <NavLink to="/ui/navigation/accordion">Accordion</NavLink>
            <NavLink to="/ui/navigation/dropdown">Dropdown</NavLink>
          </NavItem>

          <NavItem label="Alerts & Overlay" :default-expanded="false">
            <NavLink to="/ui/alerts-overlay/modals">Modals</NavLink>
            <NavLink to="/ui/alerts-overlay/alerts">Alerts</NavLink>
            <NavLink to="/ui/alerts-overlay/toasts">Toasts</NavLink>
          </NavItem>

          <NavItem label="Feedback" :default-expanded="false">
            <NavLink to="/ui/feedback/loading">Loading States</NavLink>
            <NavLink to="/ui/feedback/empty">Empty States</NavLink>
          </NavItem>

          <NavItem label="Actions" :default-expanded="false">
            <NavLink to="/ui/actions/buttons">Buttons</NavLink>
            <NavLink to="/ui/actions/action-buttons">ActionButtons</NavLink>
          </NavItem>

          <NavItem label="Data Management" :default-expanded="false">
            <NavLink to="/ui/data-management/forms">Forms</NavLink>
            <NavLink to="/ui/data-management/tables">Tables</NavLink>
            <NavLink to="/ui/data-management/crud">CRUD</NavLink>
          </NavItem>

          <NavItem label="Data Components" :default-expanded="false">
            <NavLink to="/ui/data/toolbar">DataToolbar</NavLink>
          </NavItem>

          <NavItem label="Data Visualization" :default-expanded="false">
            <NavLink to="/ui/visualization/charts">Charts</NavLink>
          </NavItem>

          <NavItem label="Icons" :default-expanded="false">
            <NavLink to="/ui/icons/emojis">Emojis</NavLink>
            <NavLink to="/ui/icons/brands">Brands</NavLink>
            <NavLink to="/ui/icons/ui">UI Icons</NavLink>
          </NavItem>

          <NavItem label="Utilities" :default-expanded="false">
            <NavLink to="/ui/utilities/clipboard">Clipboard</NavLink>
          </NavItem>
        </NavItem>

        <NavItem label="Docs" icon="📚" :default-expanded="false">
          <NavLink to="/docs/get-started">Get Started</NavLink>
          <NavLink to="/docs/layout">Layout System</NavLink>
          <NavLink to="/docs/theming">Theming</NavLink>
          <NavLink to="/docs/components">Components</NavLink>
        </NavItem>

        <NavLink to="/about">
          <span>ℹ️</span>
          <span>About</span>
        </NavLink>
      </template>

      <!-- Seção inferior: configurações -->
      <template #bottom>
        <NavItem label="Settings" icon="⚙️" :default-expanded="false">
          <NavLink to="/settings/preferences">Preferences</NavLink>
        </NavItem>

        <NavItem label="User" icon="👤" :default-expanded="false">
          <NavLink to="/user/profile">Profile</NavLink>
        </NavItem>
      </template>
    </Navbar>

    <!-- Container principal com offset para o navbar -->
    <div :class="['default-layout__container', { 'default-layout__container--full': !navbarVisible }]">
      <!-- Header -->
      <AppHeader sticky>
        <template #left>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <!-- Navbar Toggle on Mobile usually handled by Navbar itself, but we can add logo here -->
            <span style="font-size: 1.5rem;">🎨</span>
            <h1 class="default-layout__title">UI Lib</h1>
          </div>
        </template>

        <template #actions>
          <ThemeSelector />
          <a href="https://github.com/lugand/vue-ui-lib" target="_blank" class="github-link">
            GitHub
          </a>
        </template>
      </AppHeader>

      <!-- Conteúdo principal -->
      <main class="default-layout__main">
        <router-view />
      </main>

      <!-- Footer -->
      <AppFooter>
        <p>Component Library • 2026</p>
      </AppFooter>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  min-height: 100vh;

  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 280px; // Largura do navbar
    min-height: 100vh;
    transition: margin-left var(--transition-base);

    // Mobile: sem margin (navbar vira overlay)
    @media (max-width: 767px) {
      margin-left: 0 !important;
    }

    &--full {
      margin-left: 0; // Remove margin quando navbar está escondido
    }
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);

    // Mobile: fonte menor
    @media (max-width: 767px) {
      font-size: var(--font-size-lg);
    }
  }

  &__main {
    flex: 1;
    padding: var(--spacing-xl);
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;

    // Tablet: padding reduzido
    @media (max-width: 1024px) {
      padding: var(--spacing-lg);
    }

    // Mobile: padding menor
    @media (max-width: 767px) {
      padding: var(--spacing-md);
    }
  }
}
</style>
