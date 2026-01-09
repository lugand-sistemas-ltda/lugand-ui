<script setup lang="ts">
import { Icon, ComponentShowcase, CodeBlock, GridContainer, Card } from '@/shared/components'
import {
    SMILEYS_PEOPLE,
    ANIMALS_NATURE,
    FOOD_DRINK,
    ACTIVITIES,
    TRAVEL_PLACES,
    OBJECTS,
    SYMBOLS,
    FLAGS
} from '@/core/constants/emojis'

const categories = [
    { title: 'Smileys & People', icons: SMILEYS_PEOPLE },
    { title: 'Animals & Nature', icons: ANIMALS_NATURE },
    { title: 'Food & Drink', icons: FOOD_DRINK },
    { title: 'Activities', icons: ACTIVITIES },
    { title: 'Travel & Places', icons: TRAVEL_PLACES },
    { title: 'Objects', icons: OBJECTS },
    { title: 'Symbols', icons: SYMBOLS },
    { title: 'Flags', icons: FLAGS }
]
</script>

<template>
    <div class="emoji-view">
        <div class="header">
            <h1>Ícones (Emojis)</h1>
            <p class="lead">Sistema de ícones baseado em Unicode nativo. Leve, acessível e sem dependências.</p>
        </div>

        <!-- 1. USO BÁSICO -->
        <ComponentShowcase title="Uso Básico"
            description="Utilize o nome semântico para garantir consistência em toda a aplicação.">
            <template #preview>
                <div class="flex-wrap align-center gap-xl">
                    <div class="demo-item">
                        <Icon name="thumbsup" size="2xl" />
                        <span>thumbsup</span>
                    </div>

                    <div class="demo-item">
                        <Icon name="heart" size="2xl" />
                        <span>heart</span>
                    </div>

                    <div class="demo-item">
                        <Icon name="white_check_mark" size="2xl" />
                        <span>white_check_mark</span>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Icon name="thumbsup" size="lg" />
<Icon name="white_check_mark" />' />
            </template>
        </ComponentShowcase>

        <!-- 2. TAMANHOS -->
        <ComponentShowcase title="Tamanhos" description="Escala tipográfica padronizada ou tamanho customizado.">
            <template #preview>
                <div class="flex-wrap align-center gap-md">
                    <Icon name="smile" size="sm" />
                    <Icon name="smile" size="md" />
                    <Icon name="smile" size="lg" />
                    <Icon name="smile" size="xl" />
                    <Icon name="smile" size="2xl" />
                    <span class="divider">|</span>
                    <Icon name="smile" size="3rem" /> <!-- Custom CSS size -->
                </div>
            </template>

            <template #code>
                <CodeBlock code='<Icon name="smile" size="sm" />
<Icon name="smile" size="2xl" />
<Icon name="smile" size="48px" /> <!-- Custom -->' />
            </template>
        </ComponentShowcase>

        <!-- 3. BIBLIOTECA -->
        <div class="library-section">
            <h2>Biblioteca Atual</h2>
            <p class="description">Todos os emojis mapeados no sistema, separados por categoria.</p>

            <div v-for="cat in categories" :key="cat.title" class="category-block">
                <h3 class="category-title">{{ cat.title }}</h3>
                <GridContainer cols="auto" min-item-width="120px" gap="sm">
                    <Card v-for="(_val, key) in cat.icons" :key="String(key)" class="emoji-card" padding="sm">
                        <Icon :name="String(key)" size="2xl" />
                        <span class="emoji-name">{{ key }}</span>
                    </Card>
                </GridContainer>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.emoji-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;

    &.align-center {
        align-items: center;
    }

    &.gap-xl {
        gap: var(--spacing-xl);
    }

    &.gap-md {
        gap: var(--spacing-md);
    }
}

.demo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
}

.library-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);

    h2 {
        margin: 0;
        font-size: var(--font-size-xl);
    }

    .description {
        margin: 0;
        color: var(--color-text-secondary);
    }
}

.category-block {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);

    .category-title {
        font-size: var(--font-size-lg);
        color: var(--color-primary);
        border-bottom: 1px solid var(--color-border-base);
        padding-bottom: var(--spacing-xs);
        margin-top: var(--spacing-lg);
    }
}

.divider {
    color: var(--color-border-base);
    margin: 0 var(--spacing-sm);
}

.emoji-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
        background-color: var(--color-bg-secondary);
    }
}

.emoji-name {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    font-family: monospace;
}
</style>