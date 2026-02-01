<script setup lang="ts">
/**
 * DisclosureView - Showcase do composable useDisclosure
 */
import { ref } from 'vue'
import { useDisclosure, useDisclosureGroup } from '@/shared/composables'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'
import Button from '@/shared/components/primitives/Button.vue'

// Exemplo 1: Básico
const basic = useDisclosure()

// Exemplo 2: Com Callbacks
const logs = ref<string[]>([])
const withCallbacks = useDisclosure({
    onOpen: () => logs.value.push(`[${new Date().toLocaleTimeString()}] ✅ Aberto`),
    onClose: () => logs.value.push(`[${new Date().toLocaleTimeString()}] ❌ Fechado`),
    onToggle: (isOpen) => logs.value.push(`[${new Date().toLocaleTimeString()}] 🔄 ${isOpen ? 'Aberto' : 'Fechado'}`),
})

// Exemplo 3: Accordion
const accordionGroup = useDisclosureGroup()
const item1 = useDisclosure({ group: accordionGroup })
const item2 = useDisclosure({ group: accordionGroup })
const item3 = useDisclosure({ group: accordionGroup })

// Exemplo 4: Default Open
const defaultOpen = useDisclosure({ defaultOpen: true })

// Exemplo 5: Modal
const modal = useDisclosure()
</script>

<template>
    <div class="disclosure-view">
        <div class="view-header">
            <h1>🔓 Disclosure</h1>
            <p class="view-description">
                Composable para gerenciar estado aberto/fechado de componentes.
            </p>
        </div>

        <!-- Showcase 1: Básico -->
        <ComponentShowcase title="1. Uso Básico" description="Controle simples com open(), close() e toggle()">
            <template #preview>
                <div class="controls">
                    <Button @click="basic.open()">Abrir</Button>
                    <Button @click="basic.close()" variant="secondary">Fechar</Button>
                    <Button @click="basic.toggle()" variant="ghost">Toggle</Button>
                </div>

                <div v-if="basic.isOpen.value" class="content-box open">
                    ✅ Conteúdo visível!
                </div>
                <div v-else class="content-box closed">
                    ❌ Conteúdo oculto.
                </div>
            </template>

            <template #code>
                <CodeBlock language="typescript" code="const disclosure = useDisclosure()

// Métodos
disclosure.open()
disclosure.close()
disclosure.toggle()

// Estado (readonly)
disclosure.isOpen.value
disclosure.isClosed.value" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 2: Callbacks -->
        <ComponentShowcase title="2. Com Callbacks" description="Callbacks para reagir a mudanças de estado">
            <template #preview>
                <div class="controls">
                    <Button @click="withCallbacks.open()">Abrir</Button>
                    <Button @click="withCallbacks.close()" variant="secondary">Fechar</Button>
                    <Button @click="withCallbacks.toggle()" variant="ghost">Toggle</Button>
                    <Button @click="logs = []" variant="ghost">Limpar</Button>
                </div>

                <div class="logs-container">
                    <strong>📋 Logs:</strong>
                    <div class="logs">
                        <div v-if="logs.length === 0" class="log-empty">Nenhum evento...</div>
                        <div v-for="(log, i) in logs" :key="i" class="log-item">{{ log }}</div>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock language="typescript" code="const disclosure = useDisclosure({
  onOpen: () => console.log('Aberto!'),
  onClose: () => console.log('Fechado!'),
  onToggle: (isOpen) => console.log('Toggle:', isOpen)
})" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 3: Accordion -->
        <ComponentShowcase title="3. Accordion (Group)" description="Múltiplos disclosures sincronizados">
            <template #preview>
                <div class="accordion">
                    <div class="accordion-item" :class="{ active: item1.isOpen.value }">
                        <button class="accordion-header" @click="item1.toggle()">
                            <span>📦 Item 1</span>
                            <span class="icon">{{ item1.isOpen.value ? '−' : '+' }}</span>
                        </button>
                        <div v-if="item1.isOpen.value" class="accordion-content">
                            <p>Conteúdo do item 1.</p>
                        </div>
                    </div>

                    <div class="accordion-item" :class="{ active: item2.isOpen.value }">
                        <button class="accordion-header" @click="item2.toggle()">
                            <span>🎨 Item 2</span>
                            <span class="icon">{{ item2.isOpen.value ? '−' : '+' }}</span>
                        </button>
                        <div v-if="item2.isOpen.value" class="accordion-content">
                            <p>Conteúdo do item 2.</p>
                        </div>
                    </div>

                    <div class="accordion-item" :class="{ active: item3.isOpen.value }">
                        <button class="accordion-header" @click="item3.toggle()">
                            <span>📚 Item 3</span>
                            <span class="icon">{{ item3.isOpen.value ? '−' : '+' }}</span>
                        </button>
                        <div v-if="item3.isOpen.value" class="accordion-content">
                            <p>Conteúdo do item 3.</p>
                        </div>
                    </div>
                </div>

                <div class="controls">
                    <Button @click="accordionGroup.closeAll()" variant="secondary">Fechar Todos</Button>
                </div>
            </template>

            <template #code>
                <CodeBlock language="typescript" code="const group = useDisclosureGroup()

const item1 = useDisclosure({ group })
const item2 = useDisclosure({ group })
const item3 = useDisclosure({ group })

// Métodos do grupo
group.openExclusive(item1)
group.closeAll()" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 4: Default Open -->
        <ComponentShowcase title="4. Estado Inicial Aberto" description="Começa aberto por padrão">
            <template #preview>
                <div class="content-box open">
                    ✅ Começo aberto!
                </div>

                <div class="controls">
                    <Button @click="defaultOpen.toggle()">
                        {{ defaultOpen.isOpen.value ? 'Fechar' : 'Abrir' }}
                    </Button>
                </div>
            </template>

            <template #code>
                <CodeBlock language="typescript" code="const disclosure = useDisclosure({ 
  defaultOpen: true 
})" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 5: Modal -->
        <ComponentShowcase title="5. Modal Simulation" description="Exemplo com overlay e Teleport">
            <template #preview>
                <div class="controls">
                    <Button @click="modal.open()">Abrir Modal</Button>
                </div>

                <Teleport to="body">
                    <div v-if="modal.isOpen.value" class="modal-overlay" @click="modal.close()">
                        <div class="modal-content" @click.stop>
                            <div class="modal-header">
                                <h3>🎉 Modal</h3>
                                <button class="close-btn" @click="modal.close()">×</button>
                            </div>
                            <div class="modal-body">
                                <p>Exemplo de modal com useDisclosure.</p>
                            </div>
                            <div class="modal-footer">
                                <Button @click="modal.close()" variant="secondary">Cancelar</Button>
                                <Button @click="modal.close()">OK</Button>
                            </div>
                        </div>
                    </div>
                </Teleport>
            </template>

            <template #code>
                <CodeBlock language="typescript" code="const modal = useDisclosure()

// No template:
// <Teleport to='body'>
//   <div v-if='modal.isOpen.value'>
//     ...modal content...
//   </div>
// </Teleport>" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style scoped lang="scss">
.disclosure-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.view-header {
    h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-sm) 0;
    }

    .view-description {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;
    }
}

.controls {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-bottom: var(--spacing-md);
}

.content-box {
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 2px solid;
    margin-bottom: var(--spacing-md);

    &.open {
        background: var(--color-success-bg);
        border-color: var(--color-success);
    }

    &.closed {
        background: var(--color-danger-bg);
        border-color: var(--color-danger);
    }
}

.logs-container {
    strong {
        color: var(--color-text-primary);
        display: block;
        margin-bottom: var(--spacing-sm);
    }
}

.logs {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    max-height: 200px;
    overflow-y: auto;
    font-family: monospace;
    font-size: var(--font-size-sm);

    .log-empty {
        color: var(--color-text-tertiary);
        font-style: italic;
        text-align: center;
    }

    .log-item {
        padding: 0.25rem 0;
        color: var(--color-text-secondary);
        border-bottom: 1px solid var(--color-border);

        &:last-child {
            border-bottom: none;
        }
    }
}

.accordion {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: var(--spacing-md);
}

.accordion-item {
    border-bottom: 1px solid var(--color-border);

    &:last-child {
        border-bottom: none;
    }

    &.active {
        background: var(--color-primary-bg);
    }
}

.accordion-header {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);

    &:hover {
        background: var(--color-bg-tertiary);
    }

    .icon {
        font-size: 1.5rem;
        font-weight: var(--font-weight-bold);
        color: var(--color-primary);
    }
}

.accordion-content {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-background);
    animation: slideDown 0.2s ease;

    p {
        margin: 0;
        color: var(--color-text-secondary);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: var(--color-background);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    max-width: 500px;
    width: 90%;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        margin: 0;
        font-size: var(--font-size-xl);
        color: var(--color-text-primary);
    }

    .close-btn {
        background: transparent;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--color-text-tertiary);
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);

        &:hover {
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
        }
    }
}

.modal-body {
    padding: var(--spacing-lg);

    p {
        margin: 0;
        color: var(--color-text-secondary);
        line-height: 1.6;
    }
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
}
</style>
