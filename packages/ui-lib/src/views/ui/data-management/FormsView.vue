<script setup lang="ts">
/**
 * FormsView - Showcase de componentes Form
 */
import { ref } from 'vue'
import { ComponentShowcase, CodeBlock } from '@/shared/components'
import DynamicForm from '@/modules/DynamicForm/DynamicForm.vue'
import type { FormField } from '@/modules/DynamicForm/DynamicForm.vue'

const formData = ref({})

const formSchema: FormField[] = [
    {
        name: 'fullName',
        label: 'Nome Completo',
        type: 'text',
        placeholder: 'Digite seu nome',
        required: true,
        cols: 2
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'seu@email.com',
        required: true
    },
    {
        name: 'role',
        label: 'Cargo',
        type: 'select',
        options: [
            { label: 'Desenvolvedor', value: 'dev' },
            { label: 'Designer', value: 'design' },
            { label: 'Gerente', value: 'manager' }
        ],
        required: true
    },
    {
        name: 'bio',
        label: 'Biografia',
        type: 'textarea',
        placeholder: 'Conte um pouco sobre você',
        cols: 2
    },
    {
        name: 'newsletter',
        label: 'Receber novidades',
        type: 'checkbox'
    }
]

const handleSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2))
}
</script>

<template>
    <div class="view-container">
        <div class="view-header">
            <h1>Forms</h1>
            <p class="view-description">Formulários dinâmicos e validação</p>
        </div>

        <ComponentShowcase title="Dynamic Form" description="Formulário gerado a partir de um schema JSON">
            <template #preview>
                <div style="max-width: 600px; margin: 0 auto;">
                    <DynamicForm v-model="formData" :schema="formSchema" submit-label="Salvar Cadastro"
                        @submit="handleSubmit" />
                    <div
                        style="margin-top: 2rem; padding: 1rem; background: var(--color-bg-tertiary); border-radius: var(--radius-md);">
                        <h4 style="margin-bottom: 0.5rem;">Dados do Formulário (Live):</h4>
                        <pre style="font-size: 0.8rem;">{{ formData }}</pre>
                    </div>
                </div>
            </template>
            <template #code>
                <CodeBlock :code="`const schema = [
  { name: 'fullName', label: 'Nome', type: 'text', cols: 2 },
  { name: 'role', label: 'Cargo', type: 'select', options: [...] },
  { name: 'newsletter', label: 'Newsletter', type: 'checkbox' }
]

<DynamicForm 
  :schema='schema' 
  @submit='handleSubmit' 
/>`" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.view-container {
    max-width: 1200px;
    margin: 0 auto;

    .view-header {
        margin-bottom: var(--spacing-xl);

        h1 {
            margin-bottom: var(--spacing-sm);
        }

        .view-description {
            color: var(--color-text-secondary);
            font-size: var(--font-size-lg);
        }
    }
}
</style>
