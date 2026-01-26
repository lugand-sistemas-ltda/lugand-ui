<script setup lang="ts">
import { Badge, Tooltip, Avatar, Skeleton, ComponentShowcase, CodeBlock, Button } from '@/shared/components'
</script>

<template>
    <div class="display-elements-view">
        <div class="header">
            <h1>Elementos de Display</h1>
            <p class="lead">Componentes primitivos para feedback, categorização e informações auxiliares.</p>
        </div>

        <!-- 1. BADGES -->
        <ComponentShowcase title="Badge (Rótulos)"
            description="Componente versátil para status, contadores, tags e categorias.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Variações de Cor (Filled)</h4>
                    <div class="flex-wrap">
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="error">Error</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge variant="neutral">Neutral</Badge>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Estilos Visuais</h4>
                    <div class="flex-wrap">
                        <Badge variant="primary" type="filled">Filled</Badge>
                        <Badge variant="primary" type="outline">Outline</Badge>
                        <Badge variant="primary" type="soft">Soft</Badge>
                        <Badge variant="primary" type="ghost">Ghost</Badge>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Formatos e Tamanhos</h4>
                    <div class="flex-wrap align-center">
                        <Badge size="sm" rounded="sm">Small Rect</Badge>
                        <Badge size="md" rounded="md">Medium Rect</Badge>
                        <Badge size="lg" rounded="lg">Large Rect</Badge>
                        <Badge size="md" rounded="pill">Pill Shape</Badge>
                        <Badge size="md" rounded="circle">1</Badge>
                        <div style="display: flex; gap: 8px; align-items: center">
                            <span>Dot:</span>
                            <Badge dot variant="success" size="sm" />
                            <Badge dot variant="error" size="md" />
                            <Badge dot variant="primary" size="lg" />
                        </div>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code='<!-- Cores -->
<Badge variant="success">Active</Badge>
<Badge variant="error" type="outline">Deleted</Badge>

<!-- Formatos -->
<Badge rounded="pill" type="soft">Tag Name</Badge>
<Badge dot variant="warning" />' />
            </template>
        </ComponentShowcase>

        <!-- 2. TOOLTIPS -->
        <ComponentShowcase title="Tooltip" description="Balões de informação contextual ativados por hover.">
            <template #preview>
                <div class="showcase-group">
                    <div class="tooltip-grid">
                        <!-- Top -->
                        <Tooltip text="Tooltip no Topo" position="top">
                            <Button>Hover Top</Button>
                        </Tooltip>

                        <!-- Bottom -->
                        <Tooltip text="Tooltip Abaixo" position="bottom">
                            <Button>Hover Bottom</Button>
                        </Tooltip>

                        <!-- Left -->
                        <Tooltip text="Tooltip na Esquerda" position="left">
                            <Button>Hover Left</Button>
                        </Tooltip>

                        <!-- Right -->
                        <Tooltip text="Tooltip na Direita" position="right">
                            <Button>Hover Right</Button>
                        </Tooltip>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Em Elementos de Texto</h4>
                    <p>
                        Você pode usar tooltips em <Tooltip text="Informação extra aqui!" position="top"><strong
                                style="text-decoration: underline; cursor: help">palavras específicas</strong></Tooltip>
                        dentro de um texto.
                    </p>
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Tooltip text="Salvar alterações" position="top">
  <Button icon="save">Salvar</Button>
</Tooltip>

<!-- Inline -->
<Tooltip text="Help info" position="right">
  <span>?</span>
</Tooltip>' />
            </template>
        </ComponentShowcase>

        <!-- 3. AVATARS -->
        <ComponentShowcase title="Avatar" description="Identidade visual de usuários ou entidades.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Tamanhos e Variantes</h4>
                    <div class="flex-wrap align-center">
                        <Avatar size="sm" name="Small User" />
                        <Avatar size="md" name="Medium User" variant="rounded" />
                        <Avatar size="lg" name="Large User" variant="square" />
                        <Avatar size="xl" src="https://i.pravatar.cc/150?img=68" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Status Indicators</h4>
                    <div class="flex-wrap align-center">
                        <Avatar name="Online" status="online" />
                        <Avatar name="Offline" status="offline" />
                        <Avatar name="Busy" status="busy" />
                        <Avatar name="Away" status="away" />
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Avatar src="url.jpg" size="lg" status="online" />
<Avatar name="John Doe" variant="circle" />' />
            </template>
        </ComponentShowcase>

        <!-- 4. SKELETONS -->
        <ComponentShowcase title="Skeleton Loading"
            description="Placeholders animados para melhorar a percepção de performance.">
            <template #preview>
                <div class="showcase-group" style="width: 300px">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem">
                        <Skeleton variant="circle" width="50px" height="50px" />
                        <div style="flex: 1">
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="90%" />
                        </div>
                    </div>

                    <Skeleton variant="rect" height="120px" animation="wave" />
                </div>
                <div class="showcase-group" style="width: 300px">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem">
                        <Skeleton variant="circle" width="50px" height="50px" />
                        <div style="flex: 1">
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="90%" />
                        </div>
                    </div>

                    <Skeleton variant="rect" height="120px" animation="wave" />
                </div>
                <div class="showcase-group" style="width: 300px">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem">
                        <Skeleton variant="circle" width="50px" height="50px" />
                        <div style="flex: 1">
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="90%" />
                        </div>
                    </div>

                    <Skeleton variant="rect" height="120px" animation="wave" />
                </div>
                <div class="showcase-group" style="width: 300px">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem">
                        <Skeleton variant="circle" width="50px" height="50px" />
                        <div style="flex: 1">
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="90%" />
                        </div>
                    </div>

                    <Skeleton variant="rect" height="120px" animation="wave" />
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Skeleton variant="circle" width="40px" height="40px" />
<Skeleton variant="text" width="80%" />
<Skeleton variant="rect" height="200px" animation="wave" />' />
            </template>
        </ComponentShowcase>
    </div>
</template>
<style lang="scss" scoped>
.display-elements-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.showcase-group {
    margin-bottom: var(--spacing-lg);
    width: 100%;

    h4 {
        margin-bottom: var(--spacing-sm);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);

    &.align-center {
        align-items: center;
    }
}

.tooltip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--spacing-xl);
    place-items: center;
    padding: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
}
</style>