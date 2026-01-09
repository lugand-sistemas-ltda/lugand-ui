<script setup lang="ts">
import { Icon, ComponentShowcase, CodeBlock, GridContainer, Card } from '@/shared/components'
import { BRANDS } from '@/core/constants/brands'
</script>

<template>
    <div class="brands-view">
        <div class="header">
            <h1>Ícones de Marcas (Brands)</h1>
            <p class="lead">Coleção de logos e marcas em formato SVG otimizado. Renderizados via componente Icon.
            </p>
        </div>

        <!-- 1. USO BÁSICO -->
        <ComponentShowcase title="Uso Básico"
            description="Utilize o tipo 'brand' e o nome da marca. Eles herdam a cor do texto (currentColor).">
            <template #preview>
                <div class="flex-wrap align-center gap-xl">
                    <div class="demo-item">
                        <Icon name="github" type="brand" size="2xl" />
                        <span>github</span>
                    </div>

                    <div class="demo-item">
                        <Icon name="youtube" type="brand" size="2xl" style="color: #FF0000;" />
                        <span>youtube (color)</span>
                    </div>

                    <div class="demo-item">
                        <Icon name="vue" type="brand" size="2xl" style="color: #42b883;" />
                        <span>vue (color)</span>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Icon name="github" type="brand" size="2xl" />
<Icon name="youtube" type="brand" class="text-red" />' />
            </template>
        </ComponentShowcase>

        <!-- 2. TAMANHOS -->
        <ComponentShowcase title="Tamanhos" description="Suporta os mesmos modificadores de tamanho que os emojis.">
            <template #preview>
                <div class="flex-wrap align-center gap-md">
                    <Icon name="node" type="brand" size="sm" />
                    <Icon name="node" type="brand" size="md" />
                    <Icon name="node" type="brand" size="lg" />
                    <Icon name="node" type="brand" size="xl" />
                    <Icon name="node" type="brand" size="2xl" />
                    <span class="divider">|</span>
                    <Icon name="node" type="brand" size="3rem" />
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Icon name="node" type="brand" size="sm" />
<Icon name="node" type="brand" size="2xl" />' />
            </template>
        </ComponentShowcase>

        <!-- 3. BIBLIOTECA -->
        <div class="library-section">
            <h2>Biblioteca de Marcas</h2>
            <p class="description">Marcas disponíveis no sistema.</p>

            <GridContainer cols="auto" min-item-width="120px" gap="sm">
                <Card v-for="(_val, key) in BRANDS" :key="String(key)" class="brand-card" padding="sm">
                    <Icon :name="String(key)" type="brand" size="2xl" />
                    <span class="brand-name">{{ _val.label }}</span>
                    <span class="brand-key">{{ key }}</span>
                </Card>
            </GridContainer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/utils/mixins.scss' as *;

.brands-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding-bottom: var(--spacing-2xl);
}

.header {
    margin-bottom: var(--spacing-lg);

    h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--spacing-sm);
        color: var(--color-text-primary);
    }

    .lead {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        max-width: 800px;
    }
}

.library-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);

    h2 {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin-top: var(--spacing-lg);
    }

    .description {
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
    }
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
}

.align-center {
    align-items: center;
}

.gap-md {
    gap: var(--spacing-md);
}

.gap-xl {
    gap: var(--spacing-xl);
}

.demo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);
    background-color: var(--color-bg-secondary);
    min-width: 100px;

    span {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }
}

.brand-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    text-align: center;
    height: 100%;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        @include elevate('sm');
    }

    .brand-name {
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
    }

    .brand-key {
        font-family: monospace;
        font-size: var(--font-size-xs);
        color: var(--color-text-muted);
        background: var(--color-bg-tertiary);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
    }
}

.divider {
    color: var(--color-border-base);
    font-size: var(--font-size-xl);
    margin: 0 var(--spacing-sm);
}
</style>