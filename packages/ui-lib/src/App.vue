<script setup lang="ts">
/**
 * App root - inicializa configurações globais
 */
import DefaultLayout from '@/modules/layouts/DefaultLayout/DefaultLayout.vue'
import { ToastProvider } from '@/modules/toast'
import { useTheme } from '@/shared/composables'

// Inicializa tema (carrega do localStorage e aplica)
useTheme()
</script>

<template>
  <DefaultLayout />
  <ToastProvider />
</template>
