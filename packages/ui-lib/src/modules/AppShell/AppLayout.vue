<script setup lang="ts">
/**
 * AppLayout - Layout genérico para aplicações
 * Fornece estrutura com Navbar lateral, Header e área de conteúdo
 */
import { ref } from 'vue'
import { Navbar } from '@/shared/components'
import AppHeader from './components/AppHeader.vue'

interface Props {
    title?: string
    logo?: string
    userName?: string
    userAvatar?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: 'App',
    userName: 'User',
})

const navbarVisible = ref(true)

const handleToggle = (visible: boolean) => {
    navbarVisible.value = visible
}
</script>

<template>
    <div class="app-layout">
        <!-- Navbar lateral -->
        <Navbar position="left" @update:visible="handleToggle">
            <template #top>
                <slot name="nav-top"></slot>
            </template>

            <template #bottom>
                <slot name="nav-bottom"></slot>
            </template>
        </Navbar>

        <!-- Área principal -->
        <main class="main-content" :class="{ 'navbar-collapsed': !navbarVisible }">
            <!-- Header superior -->
            <AppHeader :title="props.title" :user-name="props.userName" :user-avatar="props.userAvatar">
                <template #actions>
                    <slot name="header-actions"></slot>
                </template>
            </AppHeader>

            <!-- Conteúdo da página -->
            <div class="page-content">
                <slot></slot>
            </div>

            <!-- Footer opcional -->
            <slot name="footer"></slot>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.app-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    transition: margin-left 0.3s ease;
    min-width: 0;
    margin-left: 280px; // Default Navbar width

    &.navbar-collapsed {
        margin-left: 0;
    }

    @media (max-width: 767px) {
        margin-left: 0 !important;
    }
}

.page-content {
    flex: 1;
    padding: var(--spacing-lg);
    overflow-y: auto;
}
</style>
