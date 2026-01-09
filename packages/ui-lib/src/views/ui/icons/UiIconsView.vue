<script setup lang="ts">
import { Icon, ComponentShowcase, CodeBlock, GridContainer, Card } from '@/shared/components'
import { UI_ICONS } from '@/core/constants/ui-icons'

// Agrupamento para exibição
const groupedIcons = {
    'Navegação': ['home', 'menu', 'arrow_left', 'arrow_right', 'arrow_up', 'arrow_down', 'chevron_left', 'chevron_right', 'chevron_up', 'chevron_down', 'map', 'location'],
    'Ações': ['search', 'settings', 'user', 'login', 'logout', 'close', 'check', 'plus', 'minus', 'edit', 'delete', 'print'],
    'Comunicação': ['email', 'send', 'chat', 'share', 'link', 'notifications'],
    'Arquivos': ['file_document', 'folder', 'folder_open', 'save', 'download', 'upload', 'cloud_upload'],
    'Feedback & Status': ['info', 'warning', 'circle_check', 'visibility', 'visibility_off', 'lock', 'lock_open'],
    'Mídia & Tempo': ['play', 'pause', 'calendar', 'clock'],
    'Sistema': ['filter_list', 'more_vert', 'arrows_horizontal']
}
</script>

<template>
    <div class="ui-icons-view">
        <div class="header">
            <h1>Ícones de Interface (UI)</h1>
            <p class="lead">Ícones essenciais para navegação, controle e feedback do sistema. Baseados em Material
                Symbols (Filled).</p>
        </div>

        <!-- 1. USO BÁSICO -->
        <ComponentShowcase title="Uso Básico"
            description="Utilize o tipo 'ui' e o nome do ícone. Herdam a cor do texto (currentColor).">
            <template #preview>
                <div class="flex-wrap align-center gap-xl">
                    <div class="demo-item">
                        <Icon name="home" type="ui" size="2xl" />
                        <span>home</span>
                    </div>

                    <div class="demo-item">
                        <Icon name="settings" type="ui" size="2xl" />
                        <span>settings</span>
                    </div>

                    <div class="demo-item">
                        <Icon name="user" type="ui" size="2xl" />
                        <span>user</span>
                    </div>

                    <div class="demo-item">
                        <button class="btn-example">
                            <Icon name="search" type="ui" size="md" />
                            Buscar
                        </button>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Icon name="home" type="ui" size="2xl" />
<button>
  <Icon name="search" type="ui" /> Buscar
</button>' />
            </template>
        </ComponentShowcase>

        <!-- 2. BIBLIOTECA POR CATEGORIA -->
        <div class="library-section" v-for="(icons, category) in groupedIcons" :key="category">
            <h2>{{ category }}</h2>

            <GridContainer cols="auto" min-item-width="100px" gap="sm">
                <Card v-for="key in icons" :key="key" class="icon-card" padding="sm">
                    <Icon v-if="UI_ICONS[key]" :name="key" type="ui" size="xl" />
                    <span class="icon-key">{{ key }}</span>
                </Card>
            </GridContainer>
        </div>

    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/utils/mixins.scss' as *;

.ui-icons-view {
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
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
}

.align-center {
    align-items: center;
}

.gap-xl {
    gap: var(--spacing-xl);
}

.demo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    min-width: 80px;

    span {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        font-family: monospace;
    }
}

.icon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    height: 100%;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-bg-secondary);
        transform: translateY(-2px);
        @include elevate('sm');
    }

    .icon-key {
        font-size: 10px;
        color: var(--color-text-secondary);
        font-family: monospace;
        text-align: center;
    }
}

.btn-example {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
}

.group {
    display: flex;
    gap: 8px;
    padding: 16px;
    background: var(--color-bg-secondary);
    border-radius: 8px;
}
</style>