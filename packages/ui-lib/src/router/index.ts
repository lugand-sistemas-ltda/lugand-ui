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
    path: '/ui/simple/inputs',
    name: 'ui-simple-inputs',
    component: () => import('@/views/ui/simple/InputsView.vue'),
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
    path: '/ui/complex/alerts',
    name: 'ui-complex-alerts',
    component: () => import('@/views/ui/complex/AlertsView.vue'),
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
