<script setup lang="ts">
/**
 * ModalsView - Showcase de componentes Modal
 */
import { ref } from 'vue'
import { Modal, Btn, Input, Card, ComponentShowcase, CodeBlock, Spinner } from '@/shared/components'
import { useModal, useConfirmModal } from '@/shared/composables'

// Basic Modal
const showBasicModal = ref(false)

// Sizes
const showSmModal = ref(false)
const showMdModal = ref(false)
const showLgModal = ref(false)
const showXlModal = ref(false)

// Variants
const showDangerModal = ref(false)
const showSuccessModal = ref(false)
const showWarningModal = ref(false)

// Features
const showPersistentModal = ref(false)
const showFullscreenModal = ref(false)
const showLoadingModal = ref(false)
const showCustomModal = ref(false)

// Form Modal Example
const showFormModal = ref(false)
const formData = ref({ name: '', email: '' })

const handleFormSubmit = () => {
    window.alert('Formulário enviado!')
    showFormModal.value = false
}

// Advanced Examples
const showLongContentModal = ref(false)
const showDeleteModal = ref(false)
const showComplexModal = ref(false)

const handleDeleteConfirm = () => {
    window.alert('Item deletado com sucesso!')
    showDeleteModal.value = false
}

// Using Composable
const { isOpen: composableModalOpen, open: openComposableModal, close: closeComposableModal } = useModal()

// Confirm Modal
const { isOpen: confirmOpen, options: confirmOptions, confirm, handleConfirm, handleCancel } = useConfirmModal()

const handleDelete = async () => {
    const confirmed = await confirm({
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
        confirmText: 'Sim, deletar',
        cancelText: 'Cancelar'
    })

    if (confirmed) {
        window.alert('Item deletado com sucesso!')
    }
}

// Loading simulation
const simulateLoading = () => {
    showLoadingModal.value = true
    setTimeout(() => {
        showLoadingModal.value = false
    }, 3000)
}

// Persistent modal handlers
const handlePersistentConfirm = () => {
    window.alert('Confirmado!')
    showPersistentModal.value = false
}

const handlePersistentCancel = () => {
    showPersistentModal.value = false
}

// Code examples
const basicExample = `<script setup lang="ts">
import { ref } from 'vue'
import { Modal, Btn } from '@lugand/vue-ui-lib'

const showModal = ref(false)
<\/script>

<template>
    <Btn @click="showModal = true">Abrir Modal</Btn>
    
    <Modal v-model="showModal" title="Título do Modal">
        <p>Conteúdo do modal aqui...</p>
    </Modal>
</template>`

const composableExample = `<script setup lang="ts">
import { useModal, Modal, Btn } from '@lugand/vue-ui-lib'

const { isOpen, open, close } = useModal()
<\/script>

<template>
    <Btn @click="open">Abrir Modal</Btn>
    
    <Modal v-model="isOpen" title="Com Composable">
        <p>Usando useModal() composable</p>
    </Modal>
</template>`

const confirmExample = `<script setup lang="ts">
import { useConfirmModal } from '@lugand/vue-ui-lib'

const { confirm } = useConfirmModal()

const handleDelete = async () => {
    const confirmed = await confirm({
        title: 'Confirmar exclusão',
        message: 'Esta ação não pode ser desfeita'
    })
    
    if (confirmed) {
        // executar ação
    }
}
<\/script>`
</script>

<template>
    <div class="view-container">
        <h1>Modals</h1>
        <p class="view-description">Diálogos e janelas modais - Overlay, teleport, focus trap e acessibilidade</p>

        <!-- Basic Usage -->
        <ComponentShowcase title="Basic Modal">
            <template #preview>
                <Btn @click="showBasicModal = true">Abrir Modal Básico</Btn>
                
                <Modal v-model="showBasicModal" title="Modal Básico">
                    <p>Este é um modal básico com header, body e footer padrão.</p>
                    <p>Clique fora do modal, pressione ESC ou clique no X para fechar.</p>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="basicExample" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Sizes -->
        <ComponentShowcase title="Tamanhos">
            <template #preview>
                <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                    <Btn size="sm" @click="showSmModal = true">Small</Btn>
                    <Btn size="sm" @click="showMdModal = true">Medium</Btn>
                    <Btn size="sm" @click="showLgModal = true">Large</Btn>
                    <Btn size="sm" @click="showXlModal = true">Extra Large</Btn>
                </div>

                <Modal v-model="showSmModal" title="Small Modal" size="sm">
                    <p>Modal pequeno (400px)</p>
                </Modal>

                <Modal v-model="showMdModal" title="Medium Modal" size="md">
                    <p>Modal médio (600px) - padrão</p>
                </Modal>

                <Modal v-model="showLgModal" title="Large Modal" size="lg">
                    <p>Modal grande (800px)</p>
                </Modal>

                <Modal v-model="showXlModal" title="Extra Large Modal" size="xl">
                    <p>Modal extra grande (1200px)</p>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='showModal' title='Título' size='lg'>
    <p>Conteúdo...</p>
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Variants -->
        <ComponentShowcase title="Variantes">
            <template #preview>
                <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                    <Btn variant="danger" @click="showDangerModal = true">Danger</Btn>
                    <Btn variant="primary" @click="showSuccessModal = true">Success</Btn>
                    <Btn variant="secondary" @click="showWarningModal = true">Warning</Btn>
                </div>

                <Modal v-model="showDangerModal" title="Ação Perigosa" variant="danger">
                    <p>Esta é uma ação destrutiva. Tem certeza?</p>
                </Modal>

                <Modal v-model="showSuccessModal" title="Sucesso!" variant="success">
                    <p>Operação realizada com sucesso!</p>
                </Modal>

                <Modal v-model="showWarningModal" title="Atenção" variant="warning">
                    <p>Por favor, revise os dados antes de continuar.</p>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='showModal' title='Título' variant='danger'>
    <p>Conteúdo...</p>
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Features -->
        <ComponentShowcase title="Features Especiais">
            <template #preview>
                <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                    <Btn @click="showPersistentModal = true">Persistent</Btn>
                    <Btn @click="showFullscreenModal = true">Fullscreen</Btn>
                    <Btn @click="simulateLoading">Loading</Btn>
                </div>

                <!-- Persistent - não fecha com ESC ou click fora -->
                <Modal 
                    v-model="showPersistentModal" 
                    title="Modal Persistente" 
                    persistent
                    @confirm="handlePersistentConfirm"
                    @cancel="handlePersistentCancel"
                >
                    <p>Este modal só fecha quando você clicar em "Confirmar" ou "Cancelar".</p>
                    <p>ESC e click fora estão desabilitados.</p>
                </Modal>

                <!-- Fullscreen -->
                <Modal v-model="showFullscreenModal" title="Modal Fullscreen" fullscreen>
                    <p>Este modal ocupa toda a tela.</p>
                    <p>Perfeito para formulários complexos ou visualizações detalhadas.</p>
                </Modal>

                <!-- Loading -->
                <Modal 
                    v-model="showLoadingModal" 
                    title="Processando..." 
                    :show-footer="false"
                    persistent
                    :closable="false"
                >
                    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-lg); padding: var(--spacing-xl);">
                        <Spinner size="lg" />
                        <p style="text-align: center; margin: 0;">Aguarde enquanto processamos sua solicitação...</p>
                        <p style="text-align: center; margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">Fecha automaticamente em 3 segundos</p>
                    </div>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='showModal' :show-footer='false' persistent :closable='false'>
    <div style='display: flex; flex-direction: column; align-items: center; gap: var(--spacing-lg);'>
        <Spinner size='lg' />
        <p>Processando...</p>
    </div>
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Form Example -->
        <ComponentShowcase title="Modal com Formulário">
            <template #preview>
                <Btn @click="showFormModal = true">Abrir Formulário</Btn>

                <Modal 
                    v-model="showFormModal" 
                    title="Cadastrar Usuário"
                    @confirm="handleFormSubmit"
                >
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                        <Input v-model="formData.name" label="Nome" placeholder="Digite seu nome" />
                        <Input v-model="formData.email" type="email" label="E-mail" placeholder="seu@email.com" />
                    </div>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='showFormModal' title='Formulário' @confirm='handleSubmit'>
    <Input v-model='formData.name' label='Nome' />
    <Input v-model='formData.email' type='email' label='E-mail' />
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Custom Slots -->
        <ComponentShowcase title="Custom Slots">
            <template #preview>
                <Btn @click="showCustomModal = true">Modal Customizado</Btn>

                <Modal v-model="showCustomModal" :show-footer="false">
                    <template #header>
                        <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 24px;">🎨</span>
                            <h2 style="margin: 0;">Header Customizado</h2>
                        </div>
                    </template>

                    <Card variant="flat" padding="md">
                        <p>Você pode customizar completamente o header e footer usando slots.</p>
                        <p>Este modal tem header customizado e footer desabilitado.</p>
                    </Card>
                    
                    <div style="margin-top: var(--spacing-md); text-align: right;">
                        <Btn @click="showCustomModal = false">Fechar</Btn>
                    </div>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='showModal' :show-footer='false'>
    <template #header>
        <h2>🎨 Header Customizado</h2>
    </template>
    <p>Conteúdo customizado...</p>
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Using Composable -->
        <ComponentShowcase title="Usando useModal() Composable">
            <template #preview>
                <Btn @click="openComposableModal">Abrir com Composable</Btn>

                <Modal v-model="composableModalOpen" title="Modal com Composable">
                    <p>Este modal é controlado pelo composable <code>useModal()</code>.</p>
                    <p>Você tem acesso a <code>isOpen</code>, <code>open()</code>, <code>close()</code> e <code>toggle()</code>.</p>
                    
                    <div style="margin-top: var(--spacing-md);">
                        <Btn variant="ghost" @click="closeComposableModal">Fechar via Composable</Btn>
                    </div>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="composableExample" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Long Content with Scroll -->
        <ComponentShowcase title="Conteúdo Longo (Scroll Vertical)">
            <template #preview>
                <Btn @click="showLongContentModal = true">Abrir Modal com Muito Conteúdo</Btn>

                <Modal v-model="showLongContentModal" title="Artigo Completo" size="lg">
                    <h3 style="margin-top: 0;">Lorem Ipsum - Texto de Exemplo</h3>
                    
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                    
                    <img src="https://picsum.photos/700/400" alt="Exemplo visual 1" style="width: 100%; height: auto; border-radius: var(--radius-md); margin: var(--spacing-md) 0;" />
                    
                    <h4>Seção 1: Introdução</h4>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                    
                    <h4>Seção 2: Desenvolvimento</h4>
                    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                    
                    <ul>
                        <li>Item de lista 1</li>
                        <li>Item de lista 2</li>
                        <li>Item de lista 3</li>
                        <li>Item de lista 4</li>
                    </ul>
                    
                    <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                    
                    <img src="https://picsum.photos/700/300" alt="Exemplo visual 2" style="width: 100%; height: auto; border-radius: var(--radius-md); margin: var(--spacing-md) 0;" />
                    
                    <h4>Seção 3: Conclusão</h4>
                    <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
                    
                    <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
                    
                    <Card variant="flat" padding="md" style="margin-top: var(--spacing-lg);">
                        <strong>💡 Nota:</strong> Este modal demonstra scroll vertical automático quando o conteúdo excede 90vh. Imagens se adaptam à largura (sem scroll horizontal).
                    </Card>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='show' title='Artigo' size='lg'>
    <h3>Título</h3>
    <p>Conteúdo muito longo...</p>
    <img src='...' style='width: 100%;' />
    <!-- Scroll vertical automático -->
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Delete Confirmation with Icon -->
        <ComponentShowcase title="Confirmação de Exclusão (com Ícone)">
            <template #preview>
                <Btn variant="danger" @click="showDeleteModal = true">🗑️ Deletar Item</Btn>

                <Modal 
                    v-model="showDeleteModal" 
                    title="Confirmar Exclusão"
                    variant="danger"
                    size="sm"
                    @confirm="handleDeleteConfirm"
                >
                    <div style="display: flex; align-items: flex-start; gap: var(--spacing-md);">
                        <div style="font-size: 48px; line-height: 1;">⚠️</div>
                        <div style="flex: 1;">
                            <p style="margin-top: 0;"><strong>Tem certeza que deseja excluir este item?</strong></p>
                            <p style="margin-bottom: 0; color: var(--color-text-secondary);">Esta ação não pode ser desfeita. Todos os dados relacionados serão permanentemente removidos.</p>
                        </div>
                    </div>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='show' title='Confirmar Exclusão' variant='danger' size='sm' @confirm='handleDelete'>
    <div style='display: flex; gap: var(--spacing-md);'>
        <div style='font-size: 48px;'>⚠️</div>
        <div>
            <p><strong>Tem certeza?</strong></p>
            <p>Esta ação não pode ser desfeita.</p>
        </div>
    </div>
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Complex Component Composition -->
        <ComponentShowcase title="Composição Complexa (Múltiplos Componentes)">
            <template #preview>
                <Btn @click="showComplexModal = true">Abrir Modal Complexo</Btn>

                <Modal v-model="showComplexModal" title="Dashboard de Configurações" size="xl">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);">
                        <!-- Card 1 -->
                        <Card variant="outline" padding="md">
                            <h4 style="margin-top: 0; display: flex; align-items: center; gap: var(--spacing-sm);">
                                👤 Perfil do Usuário
                            </h4>
                            <Input label="Nome" placeholder="Seu nome" style="margin-bottom: var(--spacing-sm);" />
                            <Input label="E-mail" type="email" placeholder="seu@email.com" />
                        </Card>

                        <!-- Card 2 -->
                        <Card variant="outline" padding="md">
                            <h4 style="margin-top: 0; display: flex; align-items: center; gap: var(--spacing-sm);">
                                🔔 Notificações
                            </h4>
                            <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Configure como deseja receber notificações</p>
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
                                <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                    <input type="checkbox" checked />
                                    <span>E-mail</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                    <input type="checkbox" />
                                    <span>SMS</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                    <input type="checkbox" checked />
                                    <span>Push</span>
                                </label>
                            </div>
                        </Card>

                        <!-- Card 3 -->
                        <Card variant="outline" padding="md">
                            <h4 style="margin-top: 0; display: flex; align-items: center; gap: var(--spacing-sm);">
                                🎨 Preferências
                            </h4>
                            <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Personalize sua experiência</p>
                            <div style="margin-top: var(--spacing-md);">
                                <Spinner size="sm" style="margin-right: var(--spacing-xs);" />
                                <span style="font-size: var(--font-size-sm);">Carregando preferências...</span>
                            </div>
                        </Card>

                        <!-- Card 4 -->
                        <Card variant="flat" padding="md">
                            <h4 style="margin-top: 0;">📊 Estatísticas</h4>
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Visitas</span>
                                    <strong>1,234</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Downloads</span>
                                    <strong>567</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Compartilhamentos</span>
                                    <strong>89</strong>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card variant="ghost" padding="md" style="margin-top: var(--spacing-lg);">
                        <strong>✨ Insight:</strong> Este exemplo demonstra que modals podem conter qualquer combinação de componentes (Cards, Inputs, Spinners, etc.) sem limitações.
                    </Card>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="`<Modal v-model='show' title='Dashboard' size='xl'>
    <div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);'>
        <Card>
            <Input label='Nome' />
        </Card>
        <Card>
            <Spinner />
        </Card>
        <!-- Qualquer componente funciona! -->
    </div>
</Modal>`" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- Confirm Modal Pattern -->
        <ComponentShowcase title="Confirm Modal Pattern">
            <template #preview>
                <Btn variant="danger" @click="handleDelete">Deletar Item</Btn>

                <Modal 
                    v-model="confirmOpen" 
                    :title="confirmOptions.title || 'Confirmar'"
                    variant="danger"
                    @confirm="handleConfirm"
                    @cancel="handleCancel"
                >
                    <p>{{ confirmOptions.message }}</p>
                </Modal>
            </template>
            <template #code>
                <CodeBlock :code="confirmExample" language="typescript" />
            </template>
        </ComponentShowcase>

        <!-- API Reference -->
        <ComponentShowcase title="Props">
            <template #preview>
                <div class="api-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Default</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>modelValue</code></td>
                                <td>boolean</td>
                                <td>false</td>
                                <td>Controla abertura/fechamento (v-model)</td>
                            </tr>
                            <tr>
                                <td><code>title</code></td>
                                <td>string</td>
                                <td>-</td>
                                <td>Título do modal</td>
                            </tr>
                            <tr>
                                <td><code>size</code></td>
                                <td>'sm' | 'md' | 'lg' | 'xl' | 'full'</td>
                                <td>'md'</td>
                                <td>Tamanho do modal</td>
                            </tr>
                            <tr>
                                <td><code>variant</code></td>
                                <td>'default' | 'danger' | 'success' | 'warning'</td>
                                <td>'default'</td>
                                <td>Variante visual (accent color)</td>
                            </tr>
                            <tr>
                                <td><code>closable</code></td>
                                <td>boolean</td>
                                <td>true</td>
                                <td>Mostra botão X no header</td>
                            </tr>
                            <tr>
                                <td><code>closeOnOverlay</code></td>
                                <td>boolean</td>
                                <td>true</td>
                                <td>Fecha ao clicar fora</td>
                            </tr>
                            <tr>
                                <td><code>closeOnEsc</code></td>
                                <td>boolean</td>
                                <td>true</td>
                                <td>Fecha ao pressionar ESC</td>
                            </tr>
                            <tr>
                                <td><code>persistent</code></td>
                                <td>boolean</td>
                                <td>false</td>
                                <td>Desabilita todos os métodos de fechamento automático</td>
                            </tr>
                            <tr>
                                <td><code>showHeader</code></td>
                                <td>boolean</td>
                                <td>true</td>
                                <td>Mostra o header</td>
                            </tr>
                            <tr>
                                <td><code>showFooter</code></td>
                                <td>boolean</td>
                                <td>true</td>
                                <td>Mostra o footer</td>
                            </tr>
                            <tr>
                                <td><code>loading</code></td>
                                <td>boolean</td>
                                <td>false</td>
                                <td>Estado de loading (desabilita botões)</td>
                            </tr>
                            <tr>
                                <td><code>fullscreen</code></td>
                                <td>boolean</td>
                                <td>false</td>
                                <td>Modo tela cheia</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </ComponentShowcase>

        <!-- Events -->
        <ComponentShowcase title="Events">
            <template #preview>
                <div class="api-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Payload</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>update:modelValue</code></td>
                                <td>boolean</td>
                                <td>Emitido quando o modal abre/fecha</td>
                            </tr>
                            <tr>
                                <td><code>open</code></td>
                                <td>-</td>
                                <td>Emitido quando o modal abre</td>
                            </tr>
                            <tr>
                                <td><code>close</code></td>
                                <td>-</td>
                                <td>Emitido quando o modal fecha</td>
                            </tr>
                            <tr>
                                <td><code>confirm</code></td>
                                <td>-</td>
                                <td>Emitido ao clicar no botão confirmar</td>
                            </tr>
                            <tr>
                                <td><code>cancel</code></td>
                                <td>-</td>
                                <td>Emitido ao clicar no botão cancelar</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </ComponentShowcase>

        <!-- Slots -->
        <ComponentShowcase title="Slots">
            <template #preview>
                <div class="api-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Slot</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>default</code></td>
                                <td>Conteúdo principal do modal (body)</td>
                            </tr>
                            <tr>
                                <td><code>header</code></td>
                                <td>Header customizado (substitui título padrão)</td>
                            </tr>
                            <tr>
                                <td><code>footer</code></td>
                                <td>Footer customizado (substitui botões padrão)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.view-container {
    h1 {
        margin-bottom: var(--spacing-sm);
    }

    .view-description {
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-xl);
    }

    code {
        background: var(--color-bg-tertiary);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
    }
}

.api-table {
    overflow-x: auto;
    
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--font-size-sm);
        
        th, td {
            text-align: left;
            padding: var(--spacing-sm);
            border: 1px solid var(--color-border-base);
        }
        
        th {
            background: var(--color-bg-tertiary);
            font-weight: 600;
            color: var(--color-text-primary);
        }
        
        td {
            background: var(--color-bg-secondary);
            color: var(--color-text-secondary);
        }
        
        code {
            white-space: nowrap;
        }
    }
}
</style>
