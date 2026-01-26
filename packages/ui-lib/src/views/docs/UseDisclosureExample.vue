<template>
    <div class="use-disclosure-examples">
        <h2>useDisclosure Composable - Exemplos</h2>
        <p class="description">
            Composable genérico para gerenciar estado aberto/fechado de componentes.
        </p>

        <!-- ============================================ -->
        <!-- EXEMPLO 1: Básico -->
        <!-- ============================================ -->
        <section class="example-section">
            <h3>1. Exemplo Básico</h3>
            <p>Controle simples de estado aberto/fechado.</p>

            <div class="controls">
                <Button @click="basic.open()">Abrir</Button>
                <Button @click="basic.close()" variant="secondary">Fechar</Button>
                <Button @click="basic.toggle()" variant="ghost">Toggle</Button>
            </div>

            <div v-if="basic.isOpen.value" class="content-box">
                ✅ <strong>Conteúdo visível!</strong> O disclosure está aberto.
            </div>
            <div v-else class="content-box closed">
                ❌ <strong>Conteúdo oculto.</strong> O disclosure está fechado.
            </div>

            <pre class="code-block">{{ basicCode }}</pre>
        </section>

        <!-- ============================================ -->
        <!-- EXEMPLO 2: Com Callbacks -->
        <!-- ============================================ -->
        <section class="example-section">
            <h3>2. Com Callbacks</h3>
            <p>Callbacks onOpen, onClose e onToggle.</p>

            <div class="controls">
                <Button @click="withCallbacks.open()">Abrir (com callback)</Button>
                <Button @click="withCallbacks.close()" variant="secondary">Fechar (com callback)</Button>
                <Button @click="withCallbacks.toggle()" variant="ghost">Toggle</Button>
            </div>

            <div class="logs">
                <strong>Logs:</strong>
                <ul>
                    <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
                </ul>
            </div>

            <pre class="code-block">{{ callbacksCode }}</pre>
        </section>

        <!-- ============================================ -->
        <!-- EXEMPLO 3: useDisclosureGroup (Accordion) -->
        <!-- ============================================ -->
        <section class="example-section">
            <h3>3. useDisclosureGroup - Accordion</h3>
            <p>Múltiplos disclosures onde apenas um pode estar aberto por vez.</p>

            <div class="controls">
                <Button @click="accordionGroup.openExclusive(0)" size="sm">Abrir Item 1</Button>
                <Button @click="accordionGroup.openExclusive(1)" size="sm">Abrir Item 2</Button>
                <Button @click="accordionGroup.openExclusive(2)" size="sm">Abrir Item 3</Button>
                <Button @click="accordionGroup.closeAll()" variant="secondary" size="sm">Fechar Todos</Button>
            </div>

            <div class="accordion">
                <div v-for="(item, index) in accordionGroup.items" :key="index" class="accordion-item"
                    :class="{ open: item.isOpen.value }">
                    <div class="accordion-header" @click="accordionGroup.openExclusive(index)">
                        <strong>Item {{ index + 1 }}</strong>
                        <span class="icon">{{ item.isOpen.value ? '▼' : '►' }}</span>
                    </div>
                    <div v-if="item.isOpen.value" class="accordion-content">
                        Conteúdo do item {{ index + 1 }}. Lorem ipsum dolor sit amet.
                    </div>
                </div>
            </div>

            <pre class="code-block">{{ accordionCode }}</pre>
        </section>

        <!-- ============================================ -->
        <!-- EXEMPLO 4: Estado Inicial Aberto -->
        <!-- ============================================ -->
        <section class="example-section">
            <h3>4. Estado Inicial Aberto</h3>
            <p>Usando a opção defaultOpen.</p>

            <div class="controls">
                <Button @click="defaultOpen.toggle()" variant="ghost">Toggle</Button>
            </div>

            <div v-if="defaultOpen.isOpen.value" class="content-box">
                📂 Iniciou <strong>aberto</strong> por padrão!
            </div>
            <div v-else class="content-box closed">
                📁 Agora está fechado.
            </div>

            <pre class="code-block">{{ defaultOpenCode }}</pre>
        </section>

        <!-- ============================================ -->
        <!-- EXEMPLO 5: Uso em Modal (simulado) -->
        <!-- ============================================ -->
        <section class="example-section">
            <h3>5. Uso em Modal (simulado)</h3>
            <p>Como seria usado em um componente Modal real.</p>

            <div class="controls">
                <Button @click="modal.open()">Abrir Modal</Button>
            </div>

            <!-- Overlay + Modal simulado -->
            <Teleport to="body">
                <div v-if="modal.isOpen.value" class="modal-overlay" @click="modal.close()">
                    <div class="modal-box" @click.stop>
                        <div class="modal-header">
                            <h4>Modal de Exemplo</h4>
                            <button class="close-btn" @click="modal.close()">✕</button>
                        </div>
                        <div class="modal-body">
                            <p>Este modal usa <code>useDisclosure</code> para controlar seu estado.</p>
                            <p>
                                <strong>isOpen:</strong> {{ modal.isOpen.value }}<br>
                                <strong>isClosed:</strong> {{ modal.isClosed.value }}
                            </p>
                        </div>
                        <div class="modal-footer">
                            <Button @click="modal.close()" variant="secondary">Fechar</Button>
                            <Button @click="handleModalSubmit">Confirmar</Button>
                        </div>
                    </div>
                </div>
            </Teleport>

            <pre class="code-block">{{ modalCode }}</pre>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisclosure, useDisclosureGroup } from '@/shared/composables'
import Button from '@/shared/components/primitives/Button.vue'

// ============================================
// EXEMPLO 1: Básico
// ============================================
const basic = useDisclosure()

const basicCode = `const basic = useDisclosure()

basic.open()    // Abre
basic.close()   // Fecha
basic.toggle()  // Alterna

basic.isOpen.value  // Estado atual (readonly)`

// ============================================
// EXEMPLO 2: Com Callbacks
// ============================================
const logs = ref<string[]>([])

const withCallbacks = useDisclosure({
    onOpen: () => {
        logs.value.push(`[${new Date().toLocaleTimeString()}] ✅ Aberto`)
    },
    onClose: () => {
        logs.value.push(`[${new Date().toLocaleTimeString()}] ❌ Fechado`)
    },
    onToggle: (isOpen) => {
        logs.value.push(`[${new Date().toLocaleTimeString()}] 🔄 Toggle: ${isOpen}`)
    }
})

const callbacksCode = `const disclosure = useDisclosure({
  onOpen: () => console.log('Abriu!'),
  onClose: () => console.log('Fechou!'),
  onToggle: (isOpen) => console.log('Toggle:', isOpen)
})`

// ============================================
// EXEMPLO 3: useDisclosureGroup
// ============================================
const accordionGroup = useDisclosureGroup(3)

const accordionCode = `const group = useDisclosureGroup(3) // 3 items

group.openExclusive(0) // Abre item 0, fecha os outros
group.closeAll()       // Fecha todos
group.openAll()        // Abre todos

group.items[0].isOpen.value // Estado do item 0`

// ============================================
// EXEMPLO 4: Default Open
// ============================================
const defaultOpen = useDisclosure({ defaultOpen: true })

const defaultOpenCode = `const disclosure = useDisclosure({
  defaultOpen: true // Inicia aberto
})`

// ============================================
// EXEMPLO 5: Modal
// ============================================
const modal = useDisclosure()

const handleModalSubmit = () => {
    alert('Modal confirmado!')
    modal.close()
}

const modalCode = `// No componente
const modal = useDisclosure()

// No template
<div v-if="modal.isOpen.value" class="modal">
  <button @click="modal.close()">Fechar</button>
</div>

// Abrir de fora
<button @click="modal.open()">Abrir Modal</button>`
</script>

<style scoped lang="scss">
.use-disclosure-examples {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    h2 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
    }

    .description {
        font-size: 1rem;
        color: var(--color-text-secondary);
        margin-bottom: 3rem;
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
    }

    .example-section {
        margin-bottom: 3rem;
        padding: 2rem;
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--color-border);

        >p {
            color: var(--color-text-secondary);
            margin-bottom: 1.5rem;
        }
    }

    .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }

    .content-box {
        padding: 1.5rem;
        background: var(--color-success-bg);
        border: 2px solid var(--color-success);
        border-radius: var(--border-radius-md);
        color: var(--color-success);
        margin-bottom: 1.5rem;

        &.closed {
            background: var(--color-error-bg);
            border-color: var(--color-error);
            color: var(--color-error);
        }
    }

    .logs {
        padding: 1rem;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        margin-bottom: 1.5rem;

        strong {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--color-text-primary);
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            max-height: 150px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 0.875rem;

            li {
                padding: 0.25rem 0;
                color: var(--color-text-secondary);
            }
        }
    }

    .accordion {
        margin-bottom: 1.5rem;

        .accordion-item {
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-md);
            margin-bottom: 0.5rem;
            overflow: hidden;
            transition: all 0.2s ease;

            &.open {
                border-color: var(--color-primary);
            }
        }

        .accordion-header {
            padding: 1rem;
            background: var(--color-surface);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;

            &:hover {
                background: var(--color-background);
            }

            .icon {
                color: var(--color-text-secondary);
                transition: transform 0.2s ease;
            }
        }

        .accordion-content {
            padding: 1rem;
            background: var(--color-background);
            border-top: 1px solid var(--color-border);
            animation: slideDown 0.2s ease;
        }
    }

    .code-block {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        padding: 1rem;
        overflow-x: auto;
        font-family: 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        white-space: pre-wrap;
        line-height: 1.5;
    }

    // Modal simulado
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1rem;
        animation: fadeIn 0.2s ease;
    }

    .modal-box {
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        max-width: 500px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: scaleIn 0.2s ease;
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--color-border);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--color-text-primary);
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-text-secondary);
            padding: 0;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--border-radius-sm);

            &:hover {
                background: var(--color-error-bg);
                color: var(--color-error);
            }
        }
    }

    .modal-body {
        padding: 1.5rem;
        color: var(--color-text-secondary);

        p {
            margin-bottom: 1rem;

            &:last-child {
                margin-bottom: 0;
            }
        }

        code {
            background: var(--color-background);
            padding: 0.125rem 0.375rem;
            border-radius: var(--border-radius-sm);
            font-family: monospace;
            font-size: 0.875rem;
        }
    }

    .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid var(--color-border);
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }

        to {
            opacity: 1;
            transform: scale(1);
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
}
</style>
