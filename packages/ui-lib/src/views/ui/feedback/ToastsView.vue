<script setup lang="ts">
import { ref } from 'vue'
import {
    ComponentShowcase,
    GridContainer,
    Btn,
    Input,
    Select,
    Checkbox,
    CodeBlock
} from '@/shared/components'
import { useToast } from '@/shared/composables/useToast'
import type { ToastPosition, ToastType } from '@/shared/components/feedback/Toast/types'

const toast = useToast()

// Playground State
const pTitle = ref('Notification Title')
const pMessage = ref('This is a descriptive message for the user.')
const pType = ref<ToastType>('default')
const pPosition = ref<ToastPosition>('top-right')
const pDuration = ref(5000)
const pDismissible = ref(true)
const pHasAction = ref(false)
const pActionLabel = ref('Undo')

const typeOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Success', value: 'success' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'Info', value: 'info' }
]

const positionOptions = [
    { label: 'Top Right', value: 'top-right' },
    { label: 'Top Center', value: 'top-center' },
    { label: 'Top Left', value: 'top-left' },
    { label: 'Bottom Right', value: 'bottom-right' },
    { label: 'Bottom Center', value: 'bottom-center' },
    { label: 'Bottom Left', value: 'bottom-left' }
]

function showPlaygroundToast() {
    toast.add({
        title: pTitle.value,
        message: pMessage.value,
        type: pType.value,
        position: pPosition.value,
        duration: Number(pDuration.value),
        dismissible: pDismissible.value,
        action: pHasAction.value ? {
            label: pActionLabel.value,
            onClick: () => alert('Action clicked!')
        } : undefined
    })
}

function showStackDemo() {
    toast.info({ title: 'Processing', message: 'Starting upload...', duration: 2000 })
    setTimeout(() => toast.success({ title: 'Success', message: 'File 1 uploaded', duration: 3000 }), 1000)
    setTimeout(() => toast.success({ title: 'Success', message: 'File 2 uploaded', duration: 3000 }), 1500)
    setTimeout(() => toast.success({ title: 'Finished', message: 'All files uploaded!', duration: 5000 }), 2500)
}

function showPersistentToast() {
    toast.warning({
        title: 'System Update',
        message: 'The system will update in 10 minutes. Please save your work.',
        duration: 0, // Indefinite
        dismissible: true,
        action: {
            label: 'Details',
            onClick: () => window.open('https://github.com', '_blank')
        }
    })
}

function showCustomGradient() {
    toast.custom({
        title: 'Gradient Power',
        message: 'This toast uses inline styles for a unique look.',
        icon: 'star', // Using a generic icon available, or 'info'
        style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        },
        // We might need to handle text colors inside if specificity ignores it, but inherit works mostly
    })
}

function showCustomClass() {
    toast.custom({
        title: 'Neon Vibes',
        message: 'This toast uses a custom CSS class.',
        className: 'toast-neon-custom',
        icon: 'notifications'
    })
}
</script>

<template>
    <div class="toasts-view">
        <div class="header">
            <h1>Toasts & Notifications</h1>
            <p class="lead">Mensagens temporárias que aparecem sobre o conteúdo para fornecer feedback ao usuário.
                Persistentes durante a navegação.</p>
        </div>

        <!-- 1. PLAYGROUND (BUILDER) -->
        <ComponentShowcase title="Playground" description="Construa e teste diferentes variações de notificação.">
            <template #preview>
                <div class="playground-controls">
                    <GridContainer cols="2">
                        <Input label="Título" v-model="pTitle" placeholder="Ex: Success" />
                        <Input label="Mensagem" v-model="pMessage" placeholder="Mensagem principal" />

                        <Select label="Tipo" v-model="pType" :options="typeOptions" />
                        <Select label="Posição" v-model="pPosition" :options="positionOptions" />

                        <Input label="Duração (ms)" type="number" v-model="pDuration" hint="0 para persistente" />

                        <div class="checkbox-group">
                            <Checkbox label="Botão Fechar" v-model="pDismissible" />
                            <Checkbox label="Com Ação" v-model="pHasAction" />
                        </div>

                        <Input v-if="pHasAction" label="Texto da Ação" v-model="pActionLabel" />
                    </GridContainer>

                    <div class="actions">
                        <Btn variant="primary" @click="showPlaygroundToast">Disparar Toast</Btn>
                        <Btn variant="outline" @click="toast.clear()">Limpar Todos</Btn>
                    </div>
                </div>
            </template>
            <template #code>
                <CodeBlock language="typescript" :code="`
import { useToast } from '@/shared/composables'

const toast = useToast()

toast.add({
    title: '${pTitle}',
    message: '${pMessage}',
    type: '${pType}',
    position: '${pPosition}',
    duration: ${pDuration},
    dismissible: ${pDismissible}
})
                `" />
            </template>
        </ComponentShowcase>

        <!-- 2. VARIANTS -->
        <ComponentShowcase title="Variantes Semânticas" description="Shortcuts para mensagens de status comuns.">
            <template #preview>
                <div class="button-group">
                    <Btn color="success" @click="toast.success('Operação realizada com sucesso!')">Success</Btn>
                    <Btn color="warning" @click="toast.warning('Atenção: verifique os dados.')">Warning</Btn>
                    <Btn color="danger" @click="toast.error('Erro ao conectar ao servidor.')">Error</Btn>
                    <Btn color="info" @click="toast.info('Nova atualização disponível.')">Info</Btn>
                </div>
            </template>
            <template #code>
                <CodeBlock language="typescript" code="
toast.success('Operação realizada com sucesso!')
toast.error('Erro ao processar')
toast.warning('Atenção necessária')
toast.info('Informação útil')
                " />
            </template>
        </ComponentShowcase>

        <!-- 3. ADVANCED USAGE -->
        <ComponentShowcase title="Cenários Avançados" description="Empilhamento, Persistência e Ações.">
            <template #preview>
                <div class="button-group">
                    <Btn variant="outline" @click="showStackDemo">Simular Fila (Stack)</Btn>
                    <Btn variant="outline" @click="showPersistentToast">Toast Persistente com Ação</Btn>
                </div>
            </template>
            <template #code>
                <CodeBlock language="typescript" code="
// Toast com ação e sem timeout
toast.add({
    title: 'Update Required',
    message: 'Please restart application.',
    duration: 0,
    action: {
        label: 'Restart',
        onClick: () => reloadApp()
    }
})
                " />
            </template>
        </ComponentShowcase>

        <!-- 4. CUSTOM STYLES -->
        <ComponentShowcase title="Estilização Customizada"
            description="Exemplo de toast com estilos CSS personalizados inline ou via classes.">
            <template #preview>
                <div class="button-group">
                    <Btn @click="showCustomGradient">Toast Gradiente (Style)</Btn>
                    <Btn @click="showCustomClass">Toast Neon (Class)</Btn>
                </div>
            </template>
            <template #code>
                <CodeBlock language="typescript" code="
// Custom Style Object
toast.custom({
    title: 'Gradient Power',
    message: 'Estilos CSS diretos via JS',
    style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    },
    icon: 'star'
})

// Custom Class
toast.custom({
    title: 'Neon Vibes',
    className: 'toast-neon-custom' // Defined in global CSS or deep selector
})
                " />
            </template>
        </ComponentShowcase>

    </div>
</template>

<style lang="scss">
// Global or unscoped style for custom class demo
.toast-neon-custom {
    background: #000 !important;
    color: #0f0 !important;
    border: 1px solid #0f0 !important;
    box-shadow: 0 0 10px #0f0 !important;

    .toast-title,
    .toast-message,
    .toast-icon {
        color: #0f0 !important;
    }
}
</style>

<style lang="scss" scoped>
.toasts-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding-bottom: var(--spacing-2xl);
}

.header {
    h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--spacing-sm);
        color: var(--color-text-primary);
    }

    .lead {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
    }
}

.playground-controls {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    width: 100%;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding-top: var(--spacing-md);
}

.actions {
    display: flex;
    gap: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
}

.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
}
</style>
