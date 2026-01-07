<script setup lang="ts">
/**
 * App root - inicializa configurações globais
 */
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useTheme } from '@/shared/composables'

// Inicializa tema (carrega do localStorage e aplica)
useTheme()
</script>

<template>
  <DefaultLayout />
</template>
