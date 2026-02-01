<script setup lang="ts">
/**
 * TypographyView - Showcase de tipografia
 */
import { ComponentShowcase, CodeBlock } from '@/shared/components'
</script>

<template>
    <div class="typography-view">
        <div class="typography-view__header">
            <h1>Typography</h1>
            <p class="typography-view__description">
                Sistema de tipografia com escalas de tamanho, peso e cores temáticas
            </p>
        </div>

        <!-- Headings -->
        <ComponentShowcase title="Headings (Títulos)" description="Hierarquia de títulos usando variáveis CSS">
            <template #preview>
                <div class="typography-column">
                    <h1 class="heading-3xl">Heading 3XL</h1>
                    <h2 class="heading-2xl">Heading 2XL</h2>
                    <h3 class="heading-xl">Heading XL</h3>
                    <h4 class="heading-lg">Heading LG</h4>
                    <h5 class="heading-md">Heading MD</h5>
                    <h6 class="heading-sm">Heading SM</h6>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<h1 style='font-size: var(--font-size-3xl)'>Heading 3XL</h1>
<h2 style='font-size: var(--font-size-2xl)'>Heading 2XL</h2>
<h3 style='font-size: var(--font-size-xl)'>Heading XL</h3>
<h4 style='font-size: var(--font-size-lg)'>Heading LG</h4>
<h5 style='font-size: var(--font-size-md)'>Heading MD</h5>
<h6 style='font-size: var(--font-size-sm)'>Heading SM</h6>`" />
            </template>
        </ComponentShowcase>

        <!-- Font Sizes -->
        <ComponentShowcase title="Font Sizes (Tamanhos de Fonte)"
            description="Escala de tamanhos disponíveis no design system">
            <template #preview>
                <div class="typography-column">
                    <p class="size-3xl">3XL - var(--font-size-3xl) - 2rem / 32px</p>
                    <p class="size-2xl">2XL - var(--font-size-2xl) - 1.5rem / 24px</p>
                    <p class="size-xl">XL - var(--font-size-xl) - 1.25rem / 20px</p>
                    <p class="size-lg">LG - var(--font-size-lg) - 1.125rem / 18px</p>
                    <p class="size-base">Base - var(--font-size-base) - 1rem / 16px</p>
                    <p class="size-md">MD - var(--font-size-md) - 0.875rem / 14px</p>
                    <p class="size-sm">SM - var(--font-size-sm) - 0.813rem / 13px</p>
                    <p class="size-xs">XS - var(--font-size-xs) - 0.75rem / 12px</p>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<p style='font-size: var(--font-size-3xl)'>3XL - 2rem</p>
<p style='font-size: var(--font-size-base)'>Base - 1rem</p>
<p style='font-size: var(--font-size-xs)'>XS - 0.75rem</p>`" />
            </template>
        </ComponentShowcase>

        <!-- Font Weights -->
        <ComponentShowcase title="Font Weights (Pesos de Fonte)" description="Pesos tipográficos disponíveis">
            <template #preview>
                <div class="typography-column">
                    <p class="weight-light">Light (300) - var(--font-weight-light)</p>
                    <p class="weight-normal">Normal (400) - var(--font-weight-normal)</p>
                    <p class="weight-medium">Medium (500) - var(--font-weight-medium)</p>
                    <p class="weight-semibold">Semibold (600) - var(--font-weight-semibold)</p>
                    <p class="weight-bold">Bold (700) - var(--font-weight-bold)</p>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<p style='font-weight: var(--font-weight-light)'>Light (300)</p>
<p style='font-weight: var(--font-weight-normal)'>Normal (400)</p>
<p style='font-weight: var(--font-weight-medium)'>Medium (500)</p>
<p style='font-weight: var(--font-weight-semibold)'>Semibold (600)</p>
<p style='font-weight: var(--font-weight-bold)'>Bold (700)</p>`" />
            </template>
        </ComponentShowcase>

        <!-- Text Colors -->
        <ComponentShowcase title="Text Colors (Cores de Texto)" description="Cores temáticas adaptativas para texto">
            <template #preview>
                <div class="typography-column">
                    <p class="text-primary">Primary - var(--color-text-primary)</p>
                    <p class="text-secondary">Secondary - var(--color-text-secondary)</p>
                    <p class="text-tertiary">Tertiary - var(--color-text-tertiary)</p>
                    <p class="text-inverse">Inverse - var(--color-text-inverse)</p>
                    <p class="text-brand">Brand/Primary Color - var(--color-primary)</p>
                    <p class="text-success">Success - var(--color-success)</p>
                    <p class="text-warning">Warning - var(--color-warning)</p>
                    <p class="text-error">Error - var(--color-error)</p>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<p style='color: var(--color-text-primary)'>Primary</p>
<p style='color: var(--color-text-secondary)'>Secondary</p>
<p style='color: var(--color-primary)'>Brand Color</p>
<p style='color: var(--color-success)'>Success</p>`" />
            </template>
        </ComponentShowcase>

        <!-- Text Styles Combinations -->
        <ComponentShowcase title="Combinações Comuns"
            description="Exemplos de combinações práticas de tamanho, peso e cor">
            <template #preview>
                <div class="typography-column">
                    <h3 class="combo-title">Título de Seção</h3>
                    <p class="combo-subtitle">Subtítulo com ênfase média</p>
                    <p class="combo-body">
                        Texto de corpo padrão com leitura confortável. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                    </p>
                    <p class="combo-caption">Texto auxiliar ou caption em tamanho reduzido</p>
                    <p class="combo-label">Label de formulário</p>
                    <p class="combo-hint">Hint ou dica de preenchimento</p>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`/* Título de Seção */
font-size: var(--font-size-xl);
font-weight: var(--font-weight-semibold);
color: var(--color-text-primary);

/* Subtítulo */
font-size: var(--font-size-lg);
font-weight: var(--font-weight-medium);
color: var(--color-text-secondary);

/* Corpo de texto */
font-size: var(--font-size-base);
font-weight: var(--font-weight-normal);
color: var(--color-text-primary);

/* Caption */
font-size: var(--font-size-sm);
color: var(--color-text-tertiary);`" />
            </template>
        </ComponentShowcase>

        <!-- CSS Variables Reference -->
        <div class="api-reference">
            <h2>CSS Variables Reference</h2>

            <div class="api-section">
                <h3>Font Sizes</h3>
                <div class="variable-list">
                    <div class="variable-item">
                        <code>--font-size-3xl</code>
                        <span>2rem (32px)</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-size-2xl</code>
                        <span>1.5rem (24px)</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-size-xl</code>
                        <span>1.25rem (20px)</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-size-lg</code>
                        <span>1.125rem (18px)</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-size-base</code>
                        <span>1rem (16px)</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-size-md</code>
                        <span>0.875rem (14px)</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-size-sm</code>
                        <span>0.813rem (13px)</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-size-xs</code>
                        <span>0.75rem (12px)</span>
                    </div>
                </div>
            </div>

            <div class="api-section">
                <h3>Font Weights</h3>
                <div class="variable-list">
                    <div class="variable-item">
                        <code>--font-weight-light</code>
                        <span>300</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-weight-normal</code>
                        <span>400</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-weight-medium</code>
                        <span>500</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-weight-semibold</code>
                        <span>600</span>
                    </div>
                    <div class="variable-item">
                        <code>--font-weight-bold</code>
                        <span>700</span>
                    </div>
                </div>
            </div>

            <div class="api-section">
                <h3>Text Colors</h3>
                <div class="variable-list">
                    <div class="variable-item">
                        <code>--color-text-primary</code>
                        <span>Texto principal (contraste alto)</span>
                    </div>
                    <div class="variable-item">
                        <code>--color-text-secondary</code>
                        <span>Texto secundário (contraste médio)</span>
                    </div>
                    <div class="variable-item">
                        <code>--color-text-tertiary</code>
                        <span>Texto terciário (contraste baixo)</span>
                    </div>
                    <div class="variable-item">
                        <code>--color-text-inverse</code>
                        <span>Texto invertido (sobre fundos escuros)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.typography-view {
    max-width: 1200px;
    margin: 0 auto;

    &__header {
        margin-bottom: var(--spacing-2xl);

        h1 {
            margin-bottom: var(--spacing-sm);
        }
    }

    &__description {
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
        margin: 0;
    }
}

.typography-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
}

// Heading examples
.heading-3xl {
    font-size: var(--font-size-3xl);
    margin: 0;
}

.heading-2xl {
    font-size: var(--font-size-2xl);
    margin: 0;
}

.heading-xl {
    font-size: var(--font-size-xl);
    margin: 0;
}

.heading-lg {
    font-size: var(--font-size-lg);
    margin: 0;
}

.heading-md {
    font-size: var(--font-size-md);
    margin: 0;
}

.heading-sm {
    font-size: var(--font-size-sm);
    margin: 0;
}

// Font size examples
.size-3xl {
    font-size: var(--font-size-3xl);
    margin: 0;
}

.size-2xl {
    font-size: var(--font-size-2xl);
    margin: 0;
}

.size-xl {
    font-size: var(--font-size-xl);
    margin: 0;
}

.size-lg {
    font-size: var(--font-size-lg);
    margin: 0;
}

.size-base {
    font-size: var(--font-size-base);
    margin: 0;
}

.size-md {
    font-size: var(--font-size-md);
    margin: 0;
}

.size-sm {
    font-size: var(--font-size-sm);
    margin: 0;
}

.size-xs {
    font-size: var(--font-size-xs);
    margin: 0;
}

// Font weight examples
.weight-light {
    font-weight: var(--font-weight-light);
    margin: 0;
}

.weight-normal {
    font-weight: var(--font-weight-normal);
    margin: 0;
}

.weight-medium {
    font-weight: var(--font-weight-medium);
    margin: 0;
}

.weight-semibold {
    font-weight: var(--font-weight-semibold);
    margin: 0;
}

.weight-bold {
    font-weight: var(--font-weight-bold);
    margin: 0;
}

// Text color examples
.text-primary {
    color: var(--color-text-primary);
    margin: 0;
}

.text-secondary {
    color: var(--color-text-secondary);
    margin: 0;
}

.text-tertiary {
    color: var(--color-text-tertiary);
    margin: 0;
}

.text-inverse {
    color: var(--color-text-inverse);
    background: var(--color-text-primary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    display: inline-block;
    margin: 0;
}

.text-brand {
    color: var(--color-primary);
    margin: 0;
}

.text-success {
    color: var(--color-success);
    margin: 0;
}

.text-warning {
    color: var(--color-warning);
    margin: 0;
}

.text-error {
    color: var(--color-error);
    margin: 0;
}

// Combination examples
.combo-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
}

.combo-subtitle {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin: 0;
}

.combo-body {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-primary);
    line-height: 1.6;
    margin: 0;
}

.combo-caption {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
    margin: 0;
}

.combo-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    margin: 0;
}

.combo-hint {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    margin: 0;
}

// API Reference
.api-reference {
    margin-top: var(--spacing-3xl);
    padding: var(--spacing-xl);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-lg);

    h2 {
        margin-bottom: var(--spacing-xl);
    }

    h3 {
        margin-bottom: var(--spacing-md);
        color: var(--color-text-primary);
    }
}

.api-section {
    &:not(:last-child) {
        margin-bottom: var(--spacing-2xl);
    }
}

.variable-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.variable-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-sm);

    code {
        font-family: 'Fira Code', monospace;
        font-size: var(--font-size-sm);
        color: var(--color-primary);
        font-weight: var(--font-weight-medium);
    }

    span {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }
}

// Responsivo
@media (max-width: 767px) {
    .typography-view {
        &__header {
            margin-bottom: var(--spacing-xl);
        }

        &__description {
            font-size: var(--font-size-base);
        }
    }

    .api-reference {
        padding: var(--spacing-md);

        h2 {
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-lg);
        }

        h3 {
            font-size: var(--font-size-base);
        }
    }

    .variable-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs);
    }
}
</style>
