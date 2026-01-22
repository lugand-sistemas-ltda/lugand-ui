import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

/**
 * Configuração Vite para BUILD DA BIBLIOTECA (npm package)
 * 
 * Este config gera o bundle para distribuição npm.
 * Para development (showcase), use vite.config.ts
 */
export default defineConfig({
    plugins: [
        vue(),
        dts({
            // Gerar tipos TypeScript
            insertTypesEntry: true,
            include: [
                'lib/**/*.ts',
                'src/shared/**/*.vue',
                'src/shared/**/*.ts',
                'src/core/**/*.ts',
                'src/modules/**/*.vue',
                'src/modules/**/*.ts',
            ],
            exclude: [
                'src/views/**/*',
                'src/layouts/**/*', // Antigo layouts (agora em modules/layouts/)
                'src/router/**/*',
                'src/App.vue',
                'src/main.ts',
            ],
            // Copiar declarações para dist/
            outDir: 'dist',
            // Resolver paths
            tsconfigPath: './tsconfig.app.json',
            // Entrypoint
            // entryRoot: 'lib', // Removido para permitir estrutura completa
        }),
    ],

    build: {
        lib: {
            // Entry point da biblioteca
            entry: resolve(__dirname, 'lib/index.ts'),

            // Nome global (para UMD, se necessário no futuro)
            name: 'VueUILibrary',

            // Formato: apenas ESM (moderno)
            formats: ['es'],

            // Nome do arquivo de saída
            fileName: 'vue-ui-lib',
        },

        rollupOptions: {
            // Externalize dependencies que não devem ser empacotadas
            external: ['vue', 'vue-router'],

            output: {
                // Globals para UMD (não usado agora, mas útil ter)
                globals: {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                },

                // Preservar estrutura de assets CSS
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'style.css'
                    }
                    return assetInfo.name || 'assets/[name][extname]'
                },
            },
        },

        // Output directory
        outDir: 'dist',

        // Limpar dist/ antes de build
        emptyOutDir: true,

        // Source maps para debugging
        sourcemap: true,

        // Minificação
        minify: 'esbuild',
    },

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
