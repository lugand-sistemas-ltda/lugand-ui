<script setup lang="ts">
/**
 * GridContainer - Layout responsivo inteligente
 * Resolve o problema de "quantos cards cabem aqui?" automaticamente
 */
interface Props {
    // Número de colunas em cada breakpoint
    cols?: number | 'auto' // auto = minmax(minItemWidth, 1fr)
    colsSm?: number
    colsMd?: number
    colsLg?: number
    colsXl?: number

    // Espaçamento (gap)
    gap?: 'sm' | 'md' | 'lg' | 'xl'

    // Utilidades de Estado
    loading?: boolean
    empty?: boolean

    // Largura mínima do item (usado quando cols='auto')
    minItemWidth?: string // ex: "280px"
}

withDefaults(defineProps<Props>(), {
    cols: 1, // Mobile first (1 coluna)
    colsSm: 2,
    colsMd: 3,
    colsLg: 4,
    colsXl: 4,
    gap: 'md',
    loading: false,
    empty: false,
    minItemWidth: '280px'
})

import Skeleton from '../display/Skeleton.vue'
</script>

<template>
    <div class="grid-container">
        <!-- Estado de Loading (Slot opcional ou default skeleton) -->
        <div v-if="loading" class="grid-container__layout" :class="[
            `gap-${gap}`,
            cols === 'auto' ? 'grid-auto' : 'grid-fixed'
        ]" :style="cols === 'auto'
            ? { '--min-width': minItemWidth }
            : {
                '--cols-xs': cols,
                '--cols-sm': colsSm,
                '--cols-md': colsMd,
                '--cols-lg': colsLg,
                '--cols-xl': colsXl
            }">
            <slot name="loading">
                <!-- Default Loading: 4 Skeletons -->
                <Skeleton v-for="i in 4" :key="i" height="300px" variant="rect" animation="pulse"
                    border-radius="var(--radius-md)" />
            </slot>
        </div>

        <!-- Estado Vazio -->
        <div v-else-if="empty" class="grid-container__empty">
            <slot name="empty">
                <p>Nenhum item encontrado.</p>
            </slot>
        </div>

        <!-- Conteúdo Real -->
        <div v-else class="grid-container__layout" :class="[
            `gap-${gap}`,
            cols === 'auto' ? 'grid-auto' : 'grid-fixed'
        ]" :style="cols === 'auto'
            ? { '--min-width': minItemWidth }
            : {
                '--cols-xs': cols,
                '--cols-sm': colsSm,
                '--cols-md': colsMd,
                '--cols-lg': colsLg,
                '--cols-xl': colsXl
            }">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.grid-container {
    width: 100%;

    &__layout {
        display: grid;

        // Gaps
        &.gap-sm {
            gap: var(--spacing-sm);
        }

        &.gap-md {
            gap: var(--spacing-md);
        }

        &.gap-lg {
            gap: var(--spacing-lg);
        }

        &.gap-xl {
            gap: var(--spacing-xl);
        }
    }

    // Modo AUTO (Responsivo Mágico sem Media Queries)
    .grid-auto {
        // Usa min() para garantir que colunas nunca excedam a largura do container (evita scroll horizontal)
        grid-template-columns: repeat(auto-fit, minmax(min(var(--min-width), 100%), 1fr));
    }

    // Modo FIXO (Controle Manual por Breakpoint)
    .grid-fixed {
        grid-template-columns: repeat(var(--cols-xs), 1fr);

        @media (min-width: 640px) {
            grid-template-columns: repeat(var(--cols-sm), 1fr);
        }

        @media (min-width: 768px) {
            grid-template-columns: repeat(var(--cols-md), 1fr);
        }

        @media (min-width: 1024px) {
            grid-template-columns: repeat(var(--cols-lg), 1fr);
        }

        @media (min-width: 1280px) {
            grid-template-columns: repeat(var(--cols-xl), 1fr);
        }
    }

    &__empty {
        width: 100%;
        grid-column: 1 / -1; // Ocupa toda a largura do grid se estiver dentro dele
        padding: var(--spacing-2xl);
        text-align: center;
        color: var(--color-text-secondary);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
        border: 1px dashed var(--color-border-base);
    }
}
</style>
