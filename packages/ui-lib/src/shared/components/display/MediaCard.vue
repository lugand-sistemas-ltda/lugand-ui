<script setup lang="ts">
/**
 * MediaCard - Card rico para exibir items com mídia (produtos, artigos, users)
 * Extende o componente Card base com slots estruturados
 */
import Card from './Card.vue'

interface Props {
    // Dados principais
    title: string
    subtitle?: string
    imageSrc?: string
    imageAlt?: string

    // Badge/Label (ex: "Promoção", "Novo")
    badge?: string
    badgeColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info'

    // Comportamento
    hoverable?: boolean
    clickable?: boolean
}

withDefaults(defineProps<Props>(), {
    imageAlt: 'Imagem do item',
    badgeColor: 'primary',
    hoverable: true,
    clickable: false
})

const emit = defineEmits<{
    click: [e: MouseEvent]
    'click:badge': [e: MouseEvent]
}>()
</script>

<template>
    <Card class="media-card" padding="none" :hoverable="hoverable" :clickable="clickable"
        @click="emit('click', $event)">
        <!-- Badge Flutuante (Opcional) -->
        <div v-if="badge" class="media-card__badge" :class="`media-card__badge--${badgeColor}`"
            @click.stop="emit('click:badge', $event)">
            {{ badge }}
        </div>

        <!-- Área de Mídia (Imagem) -->
        <div class="media-card__media">
            <slot name="media">
                <img v-if="imageSrc" :src="imageSrc" :alt="imageAlt" class="media-card__img" loading="lazy" />
                <div v-else class="media-card__placeholder">
                    No Image
                </div>
            </slot>
        </div>

        <!-- Conteúdo -->
        <div class="media-card__body">
            <!-- Cabeçalho -->
            <header class="media-card__header">
                <slot name="header">
                    <h3 class="media-card__title">{{ title }}</h3>
                    <p v-if="subtitle" class="media-card__subtitle">{{ subtitle }}</p>
                </slot>
            </header>

            <!-- Características / Detalhes extras -->
            <div v-if="$slots.features" class="media-card__features">
                <slot name="features" />
            </div>

            <!-- Texto livre -->
            <div v-if="$slots.default" class="media-card__content">
                <slot />
            </div>
        </div>

        <!-- Ações / Footer -->
        <div v-if="$slots.actions" class="media-card__actions">
            <slot name="actions" />
        </div>
    </Card>
</template>

<style lang="scss" scoped>
.media-card {
    display: flex;
    flex-direction: column;
    height: 100%; // Ocupa altura do pai (bom para grids)

    &__badge {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        z-index: 10;

        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: var(--shadow-sm);

        // Cores do Badge
        &--primary {
            background: var(--color-primary);
            color: white;
        }

        &--success {
            background: var(--color-success);
            color: white;
        }

        &--warning {
            background: var(--color-warning);
            color: black;
        }

        &--danger {
            background: var(--color-danger);
            color: white;
        }

        &--info {
            background: var(--color-info);
            color: white;
        }
    }

    &__media {
        position: relative;
        aspect-ratio: 16/9; // Padrão widescreen, pode ser sobrescrito
        overflow: hidden;
        background-color: var(--color-surface-dim);
        border-bottom: 1px solid var(--color-border);
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    // Efeito de zoom na imagem ao passar mouse no card
    &:hover .media-card__img {
        transform: scale(1.05);
    }

    &__placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-dim);
        font-size: 0.875rem;
    }

    &__body {
        padding: var(--spacing-md);
        flex: 1; // Empurra actions para baixo
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    &__title {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
        line-height: 1.4;
    }

    &__subtitle {
        margin: 0;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    &__features {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xs);
        margin-top: var(--spacing-xs);
    }

    &__content {
        margin-top: var(--spacing-sm);
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    &__actions {
        padding: var(--spacing-md);
        padding-top: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end; // Botões à direita por padrão
        gap: var(--spacing-sm);
    }
}
</style>
