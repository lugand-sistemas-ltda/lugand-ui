<script setup lang="ts">
import { Spinner, Skeleton, GridContainer, Card, ComponentShowcase, CodeBlock } from '@/shared/components'
</script>

<template>
    <div class="loading-view">
        <div class="header">
            <h1>Estados de Carregamento</h1>
            <p class="lead">Componentes para indicar processos assíncronos e melhorar a percepção de performance.</p>
        </div>

        <!-- 1. SPINNER -->
        <ComponentShowcase title="Spinner (Indicador Animado)"
            description="Spinner circular para indicar carregamento de processos curtos e ações assíncronas.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div class="flex-wrap align-center">
                        <Spinner size="xs" />
                        <Spinner size="sm" />
                        <Spinner size="md" />
                        <Spinner size="lg" />
                        <Spinner size="xl" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Variantes de Cor</h4>
                    <div class="flex-wrap align-center">
                        <Spinner variant="primary" />
                        <Spinner variant="secondary" />
                        <Spinner variant="white" style="background: #333; padding: 1rem; border-radius: 8px;" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Com Texto</h4>
                    <div class="flex-wrap">
                        <Spinner text="Carregando..." />
                        <Spinner text="Processando..." text-position="bottom" />
                        <Spinner text="Aguarde..." size="lg" text-position="bottom" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Em Cards e Botões</h4>
                    <div class="flex-wrap">
                        <Card padding="lg" style="min-width: 200px; text-align: center;">
                            <Spinner text="Carregando dados..." text-position="bottom" />
                        </Card>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<!-- Básico -->
<Spinner />

<!-- Tamanhos -->
<Spinner size='xs' />
<Spinner size='sm' />
<Spinner size='md' />
<Spinner size='lg' />
<Spinner size='xl' />

<!-- Com texto -->
<Spinner text='Carregando...' />
<Spinner text='Processando...' text-position='bottom' />

<!-- Variantes -->
<Spinner variant='primary' />
<Spinner variant='secondary' />
<Spinner variant='white' />`" />
            </template>
        </ComponentShowcase>

        <!-- 2. SKELETON -->
        <ComponentShowcase title="Skeleton (Placeholder Animado)"
            description="Placeholders animados para simular conteúdo enquanto carrega. Melhora a percepção de performance.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Variantes de Forma</h4>
                    <div class="flex-wrap align-start">
                        <div style="width: 200px;">
                            <p style="font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-secondary);">
                                Circle</p>
                            <Skeleton variant="circle" width="80px" height="80px" />
                        </div>
                        <div style="width: 200px;">
                            <p style="font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-secondary);">
                                Text</p>
                            <Skeleton variant="text" width="100%" />
                            <Skeleton variant="text" width="90%" />
                            <Skeleton variant="text" width="60%" />
                        </div>
                        <div style="width: 200px;">
                            <p style="font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-secondary);">
                                Rectangle</p>
                            <Skeleton variant="rect" height="120px" />
                        </div>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Animações</h4>
                    <div class="flex-wrap">
                        <div style="width: 200px;">
                            <p style="font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-secondary);">
                                Pulse</p>
                            <Skeleton variant="rect" height="100px" animation="pulse" />
                        </div>
                        <div style="width: 200px;">
                            <p style="font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-secondary);">
                                Wave (Shimmer)</p>
                            <Skeleton variant="rect" height="100px" animation="wave" />
                        </div>
                        <div style="width: 200px;">
                            <p style="font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--color-text-secondary);">
                                None</p>
                            <Skeleton variant="rect" height="100px" animation="none" />
                        </div>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Padrões Comuns</h4>
                    <div class="flex-wrap align-start">
                        <Card padding="md" style="width: 300px;">
                            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                                <Skeleton variant="circle" width="50px" height="50px" />
                                <div style="flex: 1;">
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="90%" />
                                </div>
                            </div>
                            <Skeleton variant="rect" height="150px" animation="wave" />
                            <div style="margin-top: 1rem;">
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="80%" />
                            </div>
                        </Card>

                        <Card padding="md" style="width: 300px;">
                            <Skeleton variant="rect" height="200px" animation="wave" />
                            <div style="margin-top: 1rem;">
                                <Skeleton variant="text" width="70%" />
                                <Skeleton variant="text" width="50%" />
                            </div>
                        </Card>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<!-- Formas básicas -->
<Skeleton variant='circle' width='50px' height='50px' />
<Skeleton variant='text' width='80%' />
<Skeleton variant='rect' height='200px' />

<!-- Animações -->
<Skeleton animation='pulse' />
<Skeleton animation='wave' />
<Skeleton animation='none' />

<!-- Padrão de Card com Avatar -->
<div style='display: flex; gap: 1rem'>
  <Skeleton variant='circle' width='50px' height='50px' />
  <div style='flex: 1'>
    <Skeleton variant='text' width='60%' />
    <Skeleton variant='text' width='90%' />
  </div>
</div>
<Skeleton variant='rect' height='150px' animation='wave' />`" />
            </template>
        </ComponentShowcase>

        <!-- 3. GRIDCONTAINER COM LOADING -->
        <ComponentShowcase title="GridContainer com Loading State"
            description="GridContainer já possui suporte nativo para estados de loading usando Skeleton.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Estado Loading (com Skeletons automáticos)</h4>
                    <GridContainer :loading="true" :cols="3" gap="md" style="max-width: 800px;" />
                </div>

                <div class="showcase-group">
                    <h4>Loading Customizado (via slot)</h4>
                    <GridContainer :loading="true" :cols="2" gap="md" style="max-width: 600px;">
                        <template #loading>
                            <Card v-for="i in 4" :key="i" padding="md">
                                <div style="display: flex; gap: 1rem; align-items: center;">
                                    <Skeleton variant="circle" width="60px" height="60px" />
                                    <div style="flex: 1;">
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                    </div>
                                </div>
                            </Card>
                        </template>
                    </GridContainer>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<!-- Loading automático com Skeletons -->
<GridContainer :loading='true' :cols='3' gap='md'>
  <!-- Conteúdo será substituído por 4 Skeletons -->
</GridContainer>

<!-- Loading customizado -->
<GridContainer :loading='isLoading' :cols='2'>
  <template #loading>
    <Card v-for='i in 4' :key='i'>
      <Skeleton variant='circle' width='60px' height='60px' />
      <Skeleton variant='text' />
    </Card>
  </template>

    <!-- Conteúdo real aqui -->
    <Card v-for='item in items' :key='item.id'>
        {{ item.title }}
    </Card>
    </GridContainer>`" />
            </template>
        </ComponentShowcase>

        <!-- 4. BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 Boas Práticas de Loading</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Spinner</strong>: Use para ações rápidas (&#60;3s) - botões, formulários, pequenas
                    requisições
                </li>
                <li><strong>Skeleton</strong>: Use para carregamento de conteúdo estruturado - listas, cards, páginas
                    completas</li>
                <li><strong>Combine ambos</strong>: Skeleton para layout + Spinner para ações secundárias</li>
                <li><strong>Feedback visual</strong>: Sempre mostre algo enquanto carrega, nunca deixe a tela "travada"
                </li>
                <li><strong>Acessibilidade</strong>: Spinner tem aria-label="Carregando" automático</li>
                <li><strong>Performance percebida</strong>: Skeleton melhora a percepção mesmo que o loading seja lento
                </li>
            </ul>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.loading-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.header {
    margin-bottom: var(--spacing-lg);

    h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text-primary);
    }

    .lead {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        margin: 0;
        max-width: 800px;
    }
}

.showcase-group {
    margin-bottom: var(--spacing-lg);

    &:last-child {
        margin-bottom: 0;
    }

    h4 {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
    }
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);

    &.align-center {
        align-items: center;
    }

    &.align-start {
        align-items: flex-start;
    }
}
</style>
