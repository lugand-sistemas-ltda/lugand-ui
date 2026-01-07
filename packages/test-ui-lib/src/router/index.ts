import { createRouter, createWebHistory } from 'vue-router'
import TestLayout from '../layouts/TestLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: TestLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/dashboard/HomeView.vue')
                },
                {
                    path: 'auth/login',
                    name: 'login',
                    component: () => import('../views/auth/LoginView.vue')
                },
                {
                    path: 'forms/user',
                    name: 'user-form',
                    component: () => import('../views/forms/UserForm.vue')
                }
            ]
        }
    ]
})

export default router
