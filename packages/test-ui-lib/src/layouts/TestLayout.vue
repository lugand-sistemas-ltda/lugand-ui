<script setup lang="ts">
import { useTheme, AppLayout, NavItem, NavLink, ThemeSelector } from '@lugand/vue-ui-lib'
import { useRouter, useRoute } from 'vue-router'

const { currentTheme, setTheme } = useTheme()
const router = useRouter()
const route = useRoute()

const navItems = [
    { label: 'Dashboard', path: '/', exact: true },
    { label: 'Login Scenario', path: '/auth/login' },
    { label: 'Form Scenario', path: '/forms/user' },
]
</script>

<template>
    <AppLayout title="Test UI Lib" user-name="Tester">
        <template #nav-top>
            <NavLink v-for="item in navItems" :key="item.path" :to="item.path" :exact="item.exact">
                {{ item.label }}
            </NavLink>
        </template>

        <template #nav-bottom>
            <div style="padding: 1rem;">
                <ThemeSelector />
            </div>
        </template>

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </AppLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
