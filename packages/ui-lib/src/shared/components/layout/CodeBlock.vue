<script setup lang="ts">
/**
 * CodeBlock - Bloco de código com syntax highlight simples
 * Usado para mostrar exemplos de uso dos componentes
 */
import { ref } from 'vue'

interface Props {
    code: string
    language?: string
    collapsible?: boolean
}

withDefaults(defineProps<Props>(), {
    language: 'vue',
    collapsible: true,
})

const isExpanded = ref(false)

const toggleCode = () => {
    isExpanded.value = !isExpanded.value
}
</script>

<template>
    <div class="code-block">
        <div class="code-block__header">
            <span class="code-block__language">{{ language }}</span>
            <button v-if="collapsible" class="code-block__toggle" type="button" @click="toggleCode">
                {{ isExpanded ? '▼ Ocultar código' : '▶ Ver código' }}
            </button>
        </div>

        <div v-show="isExpanded || !collapsible" class="code-block__content">
            <pre class="code-block__pre"><code>{{ code }}</code></pre>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.code-block {
    background: var(--color-bg-tertiary);

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-bg-secondary);
        border-top: 1px solid var(--color-border-base);
    }

    &__language {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    &__toggle {
        background: transparent;
        border: none;
        color: var(--color-primary);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);

        &:hover {
            background: var(--color-bg-tertiary);
        }

        &:focus-visible {
            outline: 2px solid var(--color-border-focus);
            outline-offset: 2px;
        }
    }

    &__content {
        overflow-x: auto;
    }

    &__pre {
        margin: 0;
        padding: var(--spacing-md);

        code {
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: var(--font-size-sm);
            line-height: 1.6;
            color: var(--color-text-primary);
        }
    }

    // Responsivo
    @media (max-width: 767px) {
        &__header {
            padding: var(--spacing-xs) var(--spacing-sm);
        }

        &__pre {
            padding: var(--spacing-sm);

            code {
                font-size: var(--font-size-xs);
            }
        }
    }
}
</style>
