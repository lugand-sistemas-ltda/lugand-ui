import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      // Alias local do test-ui-lib
      '@': fileURLToPath(new URL('./src', import.meta.url)),

      // Aponta para o DIST da biblioteca (precisa buildar antes)
      // Usar npm workspaces resolve automaticamente via symlink
    },
    dedupe: ['vue', 'vue-router'], // IMPORTANTE: Força uma única instância
  },
  optimizeDeps: {
    // Forçar inclusão da biblioteca local
    include: ['@lugand/vue-ui-lib'],
    // Excluir vue-router do pre-bundling para usar a instância do projeto
    exclude: ['vue-router'],
  },
})