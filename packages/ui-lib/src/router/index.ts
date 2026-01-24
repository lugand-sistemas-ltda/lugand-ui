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
  // UI Simple Components
  {
    path: '/ui/simple/buttons',
    name: 'ui-simple-buttons',
    component: () => import('@/views/ui/simple/ButtonsView.vue'),
  },
  {
    path: '/ui/simple/typography',
    name: 'ui-simple-typography',
    component: () => import('@/views/ui/simple/TypographyView.vue'),
  },
  {
    path: '/ui/simple/cards',
    name: 'ui-simple-cards',
    component: () => import('@/views/ui/simple/CardsView.vue'),
  },
  {
    path: '/ui/simple/containers',
    name: 'ui-simple-containers',
    component: () => import('@/views/ui/simple/ContainersView.vue'),
  },
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
  // UI Complex Components
  {
    path: '/ui/complex/forms',
    name: 'ui-complex-forms',
    component: () => import('@/views/ui/complex/FormsView.vue'),
  },
  {
    path: '/ui/complex/tables',
    name: 'ui-complex-tables',
    component: () => import('@/views/ui/complex/TablesView.vue'),
  },
  {
    path: '/ui/complex/modals',
    name: 'ui-complex-modals',
    component: () => import('@/views/ui/complex/ModalsView.vue'),
  },
  {
    path: '/ui/complex/crud',
    name: 'ui-complex-crud',
    component: () => import('@/views/ui/complex/CrudView.vue'),
  },
  // UI Feedback Components
  {
    path: '/ui/feedback/alerts',
    name: 'ui-feedback-alerts',
    component: () => import('@/views/ui/feedback/AlertsView.vue'),
  },
  {
    path: '/ui/feedback/toasts',
    name: 'ui-feedback-toasts',
    component: () => import('@/views/ui/feedback/ToastsView.vue'),
  },
  // UI Visualization Components
  {
    path: '/ui/visualization/charts',
    name: 'ui-visualization-charts',
    component: () => import('@/views/ui/visualization/ChartsView.vue'),
  },
  // Docs
  {
    path: '/docs/get-started',
    name: 'docs-get-started',
    component: () => import('@/views/docs/GetStartedView.vue'),
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
