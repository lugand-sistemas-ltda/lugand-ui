import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * Configuração de rotas - Flat structure
 * Todas as rotas usam DefaultLayout, views independentes
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  // UI Actions
  {
    path: '/ui/actions/buttons',
    name: 'ui-actions-buttons',
    component: () => import('@/views/ui/actions/ButtonsView.vue'),
  },
  {
    path: '/ui/actions/action-buttons',
    name: 'ui-actions-action-buttons',
    component: () => import('@/views/ui/primitives/ActionButtonView.vue'),
  },
  // UI Layout
  {
    path: '/ui/layout/structure',
    name: 'ui-layout-structure',
    component: () => import('@/views/ui/layout/LayoutStructureView.vue'),
  },
  {
    path: '/ui/layout/typography',
    name: 'ui-layout-typography',
    component: () => import('@/views/ui/layout/TypographyView.vue'),
  },
  {
    path: '/ui/layout/themes',
    name: 'ui-layout-themes',
    component: () => import('@/views/ui/layout/ThemesView.vue'),
  },
  {
    path: '/ui/layout/page-header',
    name: 'ui-layout-page-header',
    component: () => import('@/views/ui/layout/PageHeaderView.vue'),
  },
  {
    path: '/ui/layout/filter-sidebar',
    name: 'ui-layout-filter-sidebar',
    component: () => import('@/views/ui/layout/FilterSidebarView.vue'),
  },
  // UI Display
  {
    path: '/ui/display/cards',
    name: 'ui-display-cards',
    component: () => import('@/views/ui/display/CardsView.vue'),
  },
  {
    path: '/ui/display/stat-cards',
    name: 'ui-display-stat-cards',
    component: () => import('@/views/ui/display/StatCardView.vue'),
  },
  {
    path: '/ui/display/timeline',
    name: 'ui-display-timeline',
    component: () => import('@/views/ui/display/TimelineView.vue'),
  },
  {
    path: '/ui/display/progress',
    name: 'ui-display-progress',
    component: () => import('@/views/ui/display/ProgressView.vue'),
  },
  {
    path: '/ui/display/rating',
    name: 'ui-display-rating',
    component: () => import('@/views/ui/display/RatingView.vue'),
  },
  {
    path: '/ui/display/containers',
    name: 'ui-display-containers',
    component: () => import('@/views/ui/display/ContainersView.vue'),
  },
  // UI Navigation
  {
    path: '/ui/navigation/drawers',
    name: 'ui-navigation-drawers',
    component: () => import('@/views/ui/navigation/DrawersView.vue'),
  },
  {
    path: '/ui/navigation/disclosure',
    name: 'ui-navigation-disclosure',
    component: () => import('@/views/ui/navigation/DisclosureView.vue'),
  },
  {
    path: '/ui/navigation/tabs',
    name: 'ui-navigation-tabs',
    component: () => import('@/views/ui/navigation/TabsView.vue'),
  },
  {
    path: '/ui/navigation/accordion',
    name: 'ui-navigation-accordion',
    component: () => import('@/views/ui/navigation/AccordionView.vue'),
  },
  {
    path: '/ui/navigation/dropdown',
    name: 'ui-navigation-dropdown',
    component: () => import('@/views/ui/navigation/DropdownView.vue'),
  },
  // UI Alerts & Overlay
  {
    path: '/ui/alerts-overlay/modals',
    name: 'ui-alerts-overlay-modals',
    component: () => import('@/views/ui/alerts-overlay/ModalsView.vue'),
  },
  {
    path: '/ui/alerts-overlay/alerts',
    name: 'ui-alerts-overlay-alerts',
    component: () => import('@/views/ui/alerts-overlay/AlertsView.vue'),
  },
  {
    path: '/ui/alerts-overlay/toasts',
    name: 'ui-alerts-overlay-toasts',
    component: () => import('@/views/ui/alerts-overlay/ToastsView.vue'),
  },
  // UI Feedback
  {
    path: '/ui/feedback/loading',
    name: 'ui-feedback-loading',
    component: () => import('@/views/ui/feedback/LoadingView.vue'),
  },
  {
    path: '/ui/feedback/empty',
    name: 'ui-feedback-empty',
    component: () => import('@/views/ui/feedback/EmptyStateView.vue'),
  },
  // UI Inputs
  {
    path: '/ui/inputs/text',
    name: 'ui-inputs-text',
    component: () => import('@/views/ui/inputs/TextInputsView.vue'),
  },
  {
    path: '/ui/inputs/selection',
    name: 'ui-inputs-selection',
    component: () => import('@/views/ui/inputs/SelectionInputsView.vue'),
  },
  {
    path: '/ui/inputs/specialized',
    name: 'ui-inputs-specialized',
    component: () => import('@/views/ui/inputs/SpecializedInputsView.vue'),
  },
  // UI Elements
  {
    path: '/ui/elements/display',
    name: 'ui-elements-display',
    component: () => import('@/views/ui/elements/DisplayElementsView.vue'),
  },
  // UI Icons
  {
    path: '/ui/icons/emojis',
    name: 'ui-icons-emojis',
    component: () => import('@/views/ui/icons/EmojisView.vue'),
  },
  {
    path: '/ui/icons/brands',
    name: 'ui-icons-brands',
    component: () => import('@/views/ui/icons/BrandsView.vue'),
  },
  {
    path: '/ui/icons/ui',
    name: 'ui-icons-ui',
    component: () => import('@/views/ui/icons/UiIconsView.vue'),
  },
  // UI Data Management
  {
    path: '/ui/data-management/forms',
    name: 'ui-data-management-forms',
    component: () => import('@/views/ui/data-management/FormsView.vue'),
  },
  {
    path: '/ui/data-management/tables',
    name: 'ui-data-management-tables',
    component: () => import('@/views/ui/data-management/TablesView.vue'),
  },
  {
    path: '/ui/data-management/crud',
    name: 'ui-data-management-crud',
    component: () => import('@/views/ui/data-management/CrudView.vue'),
  },
  // UI Data Components
  {
    path: '/ui/data/toolbar',
    name: 'ui-data-toolbar',
    component: () => import('@/views/ui/data/DataToolbarView.vue'),
  },
  // UI Visualization Components
  {
    path: '/ui/visualization/charts',
    name: 'ui-visualization-charts',
    component: () => import('@/views/ui/visualization/ChartsView.vue'),
  },
  // UI Utilities
  {
    path: '/ui/utilities/clipboard',
    name: 'ui-utilities-clipboard',
    component: () => import('@/views/ui/utilities/ClipboardView.vue'),
  },
  {
    path: '/ui/utilities/files',
    name: 'ui-utilities-files',
    component: () => import('@/views/ui/utilities/FileManagementView.vue'),
  },
  // Docs
  {
    path: '/docs/get-started',
    name: 'docs-get-started',
    component: () => import('@/views/docs/GetStartedView.vue'),
  },
  {
    path: '/docs/layout',
    name: 'docs-layout',
    component: () => import('@/views/docs/LayoutDocsView.vue'),
  },
  {
    path: '/docs/theming',
    name: 'docs-theming',
    component: () => import('@/views/docs/ThemingView.vue'),
  },
  {
    path: '/docs/components',
    name: 'docs-components',
    component: () => import('@/views/docs/ComponentsView.vue'),
  },
  // About
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  // Settings
  {
    path: '/settings/preferences',
    name: 'settings-preferences',
    component: () => import('@/views/settings/PreferencesView.vue'),
  },
  // User
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user/ProfileView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
