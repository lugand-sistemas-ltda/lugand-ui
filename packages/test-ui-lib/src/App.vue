<script setup lang="ts">
import { useTheme } from '@lugand/vue-ui-lib'

// Inicializa o tema globalmente
useTheme()
</script>

<template>
  <router-view />
</template>

<style>
/* Reset básico para o app de teste */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
</style>