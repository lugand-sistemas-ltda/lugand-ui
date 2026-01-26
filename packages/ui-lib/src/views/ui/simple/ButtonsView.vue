<script setup lang="ts">
/**
 * ButtonsView - Showcase de componentes Button
 */
import { ref } from 'vue'
import { Button, BtnToggle, ComponentShowcase, CodeBlock } from '@/shared/components'

// Estados reativos para demonstração
const toggleState = ref(false)
const toggleWithLabel = ref(true)
const disabledToggle = ref(false)
</script>

<template>
    <div class="buttons-view">
        <div class="buttons-view__header">
            <h1>Buttons</h1>
            <p class="buttons-view__description">
                Componentes de botão e controles de alternância (toggle)
            </p>
        </div>

        <!-- Btn - Variantes -->
        <ComponentShowcase title="Variantes de Botão" description="Diferentes estilos visuais para contextos distintos">
            <template #preview>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
            </template>

            <template #code>
                <CodeBlock :code="`<Button variant='primary'>Primary</Button>
<Button variant='secondary'>Secondary</Button>
<Button variant='ghost'>Ghost</Button>
<Button variant='danger'>Danger</Button>`" />
            </template>
        </ComponentShowcase>

        <!-- Btn - Tamanhos -->
        <ComponentShowcase title="Tamanhos"
            description="Três tamanhos disponíveis para diferentes necessidades de layout">
            <template #preview>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
            </template>

            <template #code>
                <CodeBlock :code="`<Button size='sm'>Small</Button>
<Button size='md'>Medium</Button>
<Button size='lg'>Large</Button>`" />
            </template>
        </ComponentShowcase>

        <!-- Btn - Estados -->
        <ComponentShowcase title="Estados" description="Botões desabilitados e diferentes tipos">
            <template #preview>
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button type="submit" variant="secondary">Submit</Button>
                <Button type="reset" variant="ghost">Reset</Button>
            </template>

            <template #code>
                <CodeBlock :code="`<Button>Normal</Button>
<Button disabled>Disabled</Button>
<Button type='submit' variant='secondary'>Submit</Button>
<Button type='reset' variant='ghost'>Reset</Button>`" />
            </template>
        </ComponentShowcase>

        <!-- Btn - Combinações -->
        <ComponentShowcase title="Combinações de Tamanho e Variante" description="Exemplos de diferentes combinações">
            <template #preview>
                <div class="combination-group">
                    <Button size="sm" variant="primary">Small Primary</Button>
                    <Button size="sm" variant="secondary">Small Secondary</Button>
                    <Button size="sm" variant="ghost">Small Ghost</Button>
                </div>
                <div class="combination-group">
                    <Button size="lg" variant="primary">Large Primary</Button>
                    <Button size="lg" variant="danger">Large Danger</Button>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<Button size='sm' variant='primary'>Small Primary</Button>
<Button size='lg' variant='danger'>Large Danger</Button>`" />
            </template>
        </ComponentShowcase>

        <!-- BtnToggle - Básico -->
        <ComponentShowcase title="Toggle Button" description="Botão de alternância para estados binários (on/off)">
            <template #preview>
                <BtnToggle v-model="toggleState" />
                <span class="toggle-status">Estado: {{ toggleState ? 'ON' : 'OFF' }}</span>
            </template>

            <template #code>
                <CodeBlock :code="`<script setup>
import { ref } from 'vue'
const toggleState = ref(false)
</script>

<template>
  <BtnToggle v-model='toggleState' />
  <span>Estado: {{ toggleState ? 'ON' : 'OFF' }}</span>
</template>`" />
            </template>
        </ComponentShowcase>

        <!-- BtnToggle - Com Label -->
        <ComponentShowcase title="Toggle com Label" description="Toggle com texto descritivo">
            <template #preview>
                <BtnToggle v-model="toggleWithLabel">
                    Modo escuro
                </BtnToggle>
                <BtnToggle v-model="toggleState" size="sm">
                    Notificações
                </BtnToggle>
            </template>

            <template #code>
                <CodeBlock :code="`<BtnToggle v-model='darkMode'>
  Modo escuro
</BtnToggle>

<BtnToggle v-model='notifications' size='sm'>
  Notificações
</BtnToggle>`" />
            </template>
        </ComponentShowcase>

        <!-- BtnToggle - Tamanhos e Estados -->
        <ComponentShowcase title="Toggle - Tamanhos e Estados" description="Diferentes tamanhos e estado desabilitado">
            <template #preview>
                <BtnToggle v-model="toggleState" size="sm">Small</BtnToggle>
                <BtnToggle v-model="toggleState" size="md">Medium</BtnToggle>
                <BtnToggle v-model="toggleState" size="lg">Large</BtnToggle>
                <BtnToggle v-model="disabledToggle" disabled>Disabled</BtnToggle>
            </template>

            <template #code>
                <CodeBlock :code="`<BtnToggle v-model='state' size='sm'>Small</BtnToggle>
<BtnToggle v-model='state' size='md'>Medium</BtnToggle>
<BtnToggle v-model='state' size='lg'>Large</BtnToggle>
<BtnToggle v-model='state' disabled>Disabled</BtnToggle>`" />
            </template>
        </ComponentShowcase>

        <!-- Props API Reference -->
        <div class="api-reference">
            <h2>API Reference</h2>

            <div class="api-section">
                <h3>Btn Props</h3>
                <table class="props-table">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>variant</code></td>
                            <td><code>'primary' | 'secondary' | 'ghost' | 'danger'</code></td>
                            <td><code>'primary'</code></td>
                            <td>Estilo visual do botão</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td><code>'sm' | 'md' | 'lg'</code></td>
                            <td><code>'md'</code></td>
                            <td>Tamanho do botão</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Desabilita interação</td>
                        </tr>
                        <tr>
                            <td><code>type</code></td>
                            <td><code>'button' | 'submit' | 'reset'</code></td>
                            <td><code>'button'</code></td>
                            <td>Tipo nativo do button</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="api-section">
                <h3>BtnToggle Props</h3>
                <table class="props-table">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>modelValue</code></td>
                            <td><code>boolean</code></td>
                            <td><code>-</code></td>
                            <td>Estado do toggle (v-model)</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td><code>'sm' | 'md' | 'lg'</code></td>
                            <td><code>'md'</code></td>
                            <td>Tamanho do toggle</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Desabilita interação</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.buttons-view {
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

.combination-group {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.toggle-status {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-sm);
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

.props-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);

    thead {
        background: var(--color-bg-tertiary);

        th {
            text-align: left;
            padding: var(--spacing-sm) var(--spacing-md);
            font-weight: var(--font-weight-semibold);
            color: var(--color-text-primary);
            border-bottom: 2px solid var(--color-border-base);
        }
    }

    tbody {
        tr {
            border-bottom: 1px solid var(--color-border-base);

            &:last-child {
                border-bottom: none;
            }

            &:hover {
                background: var(--color-bg-tertiary);
            }
        }

        td {
            padding: var(--spacing-md);
            color: var(--color-text-secondary);

            code {
                background: var(--color-bg-tertiary);
                padding: var(--spacing-2xs) var(--spacing-xs);
                border-radius: var(--radius-sm);
                font-family: 'Fira Code', monospace;
                font-size: var(--font-size-xs);
                color: var(--color-primary);
            }

            &:first-child {
                font-weight: var(--font-weight-medium);
            }
        }
    }
}

// Responsivo
@media (max-width: 767px) {
    .buttons-view {
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

    .props-table {
        font-size: var(--font-size-xs);

        thead th,
        tbody td {
            padding: var(--spacing-sm);
        }

        // Empilha células em mobile se necessário
        tbody td {
            display: block;
            width: 100%;

            &:first-child {
                padding-top: var(--spacing-md);
                font-weight: var(--font-weight-semibold);
            }

            &:last-child {
                padding-bottom: var(--spacing-md);
            }
        }

        thead {
            display: none;
        }

        tbody tr {
            display: block;
            margin-bottom: var(--spacing-md);
            border: 1px solid var(--color-border-base);
            border-radius: var(--radius-md);
            padding: var(--spacing-xs);
        }
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    .props-table {

        thead th,
        tbody td {
            padding: var(--spacing-sm) var(--spacing-md);
        }
    }
}
</style>
