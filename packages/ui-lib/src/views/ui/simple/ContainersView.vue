<script setup lang="ts">
import { GridContainer, ScrollContainer, MediaCard, ComponentShowcase, CodeBlock } from '@/shared/components'

// Mock Data
const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    image: `https://picsum.photos/seed/${i + 1}/300/200`,
    price: `R$ ${(Math.random() * 1000).toFixed(2)}`
}))
</script>

<template>
    <div class="containers-view">
        <h1>Containers & Layouts</h1>
        <p class="lead">Componentes estruturais para organizar conteúdo.</p>

        <!-- 1. Grid Container -->
        <ComponentShowcase title="Grid Container"
            description="Gerencia colunas responsivas, gaps e estados de loading automaticamente.">
            <template #preview>
                <!-- Section 1: Grid Automático -->
                <div class="showcase-section">
                    <h3>Modo Auto (Responsivo)</h3>
                    <p>Ajuste o tamanho da janela para ver as colunas mudarem.</p>

                    <GridContainer cols="auto" min-item-width="200px" gap="md">
                        <MediaCard v-for="prod in products.slice(0, 5)" :key="prod.id" :title="prod.title"
                            :image-src="prod.image" :hoverable="true">
                            <div style="font-weight: bold; color: var(--color-primary)">{{ prod.price }}</div>
                        </MediaCard>
                    </GridContainer>
                </div>

                <div class="divider"></div>

                <!-- Section 2: Loading & Empty States -->
                <div class="showcase-section">
                    <h3>Estados de Loading & Empty</h3>
                    <div class="grid-states">
                        <GridContainer loading :cols="3" gap="sm" />
                        <GridContainer empty :cols="3" gap="sm" />
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code='<GridContainer cols="auto" min-item-width="250px" gap="md">
  <Card v-for="item in items" />
</GridContainer>

<!-- Com Loading Automatico -->
<GridContainer :loading="isLoading" cols="4">
  <Card v-for="item in items" />
</GridContainer>' />
            </template>
        </ComponentShowcase>

        <!-- 2. Scroll Container -->
        <ComponentShowcase title="Scroll Container"
            description="Carousel horizontal com scroll snap e navegação por setas.">
            <template #preview>
                <ScrollContainer gap="md">
                    <div v-for="i in 10" :key="i" class="demo-card">
                        <div class="demo-content">Item {{ i }}</div>
                    </div>
                </ScrollContainer>
            </template>

            <template #code>
                <CodeBlock code='<ScrollContainer gap="md" show-arrows>
  <Card class="min-w-[280px]" />
  <Card class="min-w-[280px]" />
  <Card class="min-w-[280px]" />
</ScrollContainer>' />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.containers-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.grid-states {
    display: grid;
    grid-template-columns: 1fr; // Mobile First: empilhado
    gap: var(--spacing-lg);

    // Tablet/Desktop: lado a lado
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
}

.showcase-section {
    width: 100%;

    h3 {
        margin-bottom: var(--spacing-sm);
        color: var(--color-text-primary);
    }
}

.divider {
    width: 100%;
    height: 1px;
    background-color: var(--color-border-base);
    margin: var(--spacing-xl) 0;
}

.demo-card {
    width: 200px;
    height: 150px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0; // Importante para não encolher no flex
}
</style>
