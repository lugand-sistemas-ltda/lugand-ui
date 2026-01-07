<script setup lang="ts">
/**
 * InputsView - Showcase de componentes Input
 */
import { ref } from 'vue'
import { Input, Textarea, Checkbox, Select, ComponentShowcase, CodeBlock } from '@/shared/components'

// Estados reativos para demonstração
const textInput = ref('')
const emailInput = ref('')
const passwordInput = ref('')
const searchInput = ref('')
const disabledInput = ref('Valor desabilitado')
const readonlyInput = ref('Valor somente leitura')
const errorInput = ref('valor com erro')
const textareaBasic = ref('')
const textareaWithCounter = ref('')
const textareaLarge = ref('')

// Checkbox
const checkboxBasic = ref(false)
const checkboxLabel = ref(true)
const checkboxDisabled = ref(true)

// Select
const selectValue = ref('')
const selectOptions = [
    { label: 'Opção 1', value: 'opt1' },
    { label: 'Opção 2', value: 'opt2' },
    { label: 'Opção 3', value: 'opt3' },
]
</script>

<template>
    <div class="inputs-view">
        <div class="inputs-view__header">
            <h1>Inputs</h1>
            <p class="inputs-view__description">
                Componentes de entrada de dados com suporte a validação e estados
            </p>
        </div>

        <!-- Input - Básico -->
        <ComponentShowcase title="Input Básico" description="Campo de entrada de texto simples">
            <template #preview>
                <Input v-model="textInput" placeholder="Digite algo..." />
            </template>

            <template #code>
                <CodeBlock :code="`<script setup>
import { ref } from 'vue'
const textInput = ref('')
</script>

<template>
  <Input v-model='textInput' placeholder='Digite algo...' />
</template>`" />
            </template>
        </ComponentShowcase>

        <!-- Input - Com Label e Hint -->
        <ComponentShowcase title="Input com Label e Hint" description="Campo com rótulo descritivo e dica auxiliar">
            <template #preview>
                <Input v-model="textInput" label="Nome completo" placeholder="Ex: João Silva"
                    hint="Digite seu nome completo como aparece no documento" />
            </template>

            <template #code>
                <CodeBlock :code="`<Input
  v-model='name'
  label='Nome completo'
  placeholder='Ex: João Silva'
  hint='Digite seu nome completo como aparece no documento'
/>`" />
            </template>
        </ComponentShowcase>

        <!-- Input - Tipos -->
        <ComponentShowcase title="Tipos de Input" description="Diferentes tipos nativos de HTML5">
            <template #preview>
                <div class="input-grid">
                    <Input v-model="textInput" type="text" label="Text" placeholder="Texto comum" />
                    <Input v-model="emailInput" type="email" label="Email" placeholder="seu@email.com" />
                    <Input v-model="passwordInput" type="password" label="Password" placeholder="Senha" />
                    <Input v-model="searchInput" type="search" label="Search" placeholder="Buscar..." />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<Input v-model='text' type='text' label='Text' />
<Input v-model='email' type='email' label='Email' />
<Input v-model='password' type='password' label='Password' />
<Input v-model='search' type='search' label='Search' />`" />
            </template>
        </ComponentShowcase>

        <!-- Input - Tamanhos -->
        <ComponentShowcase title="Tamanhos" description="Três tamanhos disponíveis">
            <template #preview>
                <div class="input-column">
                    <Input v-model="textInput" size="sm" label="Small" placeholder="Small input" />
                    <Input v-model="textInput" size="md" label="Medium" placeholder="Medium input" />
                    <Input v-model="textInput" size="lg" label="Large" placeholder="Large input" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<Input v-model='value' size='sm' label='Small' />
<Input v-model='value' size='md' label='Medium' />
<Input v-model='value' size='lg' label='Large' />`" />
            </template>
        </ComponentShowcase>

        <!-- Input - Estados -->
        <ComponentShowcase title="Estados" description="Diferentes estados: normal, disabled, readonly, error">
            <template #preview>
                <div class="input-column">
                    <Input v-model="textInput" label="Normal" placeholder="Campo normal" />
                    <Input v-model="disabledInput" label="Disabled" disabled />
                    <Input v-model="readonlyInput" label="Readonly" readonly />
                    <Input v-model="errorInput" label="Com erro" error error-message="Este campo contém um erro" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<Input v-model='value' label='Normal' />
<Input v-model='value' label='Disabled' disabled />
<Input v-model='value' label='Readonly' readonly />
<Input 
  v-model='value' 
  label='Com erro' 
  error 
  error-message='Este campo contém um erro'
/>`" />
            </template>
        </ComponentShowcase>

        <!-- Textarea - Básico -->
        <ComponentShowcase title="Textarea Básico" description="Campo de texto multi-linha">
            <template #preview>
                <Textarea v-model="textareaBasic" placeholder="Digite seu texto aqui..." />
            </template>

            <template #code>
                <CodeBlock :code="`<Textarea 
  v-model='text' 
  placeholder='Digite seu texto aqui...' 
/>`" />
            </template>
        </ComponentShowcase>

        <!-- Textarea - Com Label e Counter -->
        <ComponentShowcase title="Textarea com Label e Contador"
            description="Textarea com limite de caracteres e contador">
            <template #preview>
                <Textarea v-model="textareaWithCounter" label="Descrição"
                    placeholder="Descreva em até 200 caracteres..." hint="Seja claro e objetivo" :max-length="200"
                    :rows="5" />
            </template>

            <template #code>
                <CodeBlock :code="`<Textarea
  v-model='description'
  label='Descrição'
  placeholder='Descreva em até 200 caracteres...'
  hint='Seja claro e objetivo'
  :max-length='200'
  :rows='5'
/>`" />
            </template>
        </ComponentShowcase>

        <!-- Textarea - Resize Options -->
        <ComponentShowcase title="Textarea - Opções de Redimensionamento"
            description="Controle de redimensionamento do textarea">
            <template #preview>
                <div class="input-grid">
                    <Textarea v-model="textareaBasic" label="None (não redimensiona)" resize="none" :rows="3" />
                    <Textarea v-model="textareaBasic" label="Vertical (padrão)" resize="vertical" :rows="3" />
                    <Textarea v-model="textareaLarge" label="Both (ambas direções)" resize="both" :rows="3" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<Textarea v-model='text' resize='none' />
<Textarea v-model='text' resize='vertical' />
<Textarea v-model='text' resize='both' />`" />
            </template>
        </ComponentShowcase>

        <!-- Checkbox -->
        <div class="inputs-view__header" style="margin-top: 3rem;">
            <h1>Checkbox</h1>
            <p class="inputs-view__description">
                Componentes de seleção binária
            </p>
        </div>

        <ComponentShowcase title="Checkbox Básico" description="Estados do checkbox">
            <template #preview>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <Checkbox v-model="checkboxBasic" label="Aceito os termos" />
                    <Checkbox v-model="checkboxLabel" label="Opção marcada" />
                    <Checkbox v-model="checkboxDisabled" label="Desabilitado" disabled />
                </div>
            </template>
            <template #code>
                <CodeBlock :code="`<Checkbox v-model='checked' label='Aceito os termos' />`" />
            </template>
        </ComponentShowcase>

        <!-- Select -->
        <div class="inputs-view__header" style="margin-top: 3rem;">
            <h1>Select</h1>
            <p class="inputs-view__description">
                Componente de seleção de opções
            </p>
        </div>

        <ComponentShowcase title="Select Básico" description="Seleção simples">
            <template #preview>
                <div style="max-width: 300px;">
                    <Select v-model="selectValue" :options="selectOptions" label="Escolha uma opção"
                        placeholder="Selecione..." />
                    <p style="margin-top: 1rem; font-size: 0.9rem;">Valor selecionado: {{ selectValue }}</p>
                </div>
            </template>
            <template #code>
                <CodeBlock :code="`<Select 
  v-model='value' 
  :options='options'
  label='Escolha uma opção'
/>`" />
            </template>
        </ComponentShowcase>

    </div>
</template>

<style lang="scss" scoped>
.inputs-view {
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

.input-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    width: 100%;

    @media (max-width: 767px) {
        grid-template-columns: 1fr;
    }
}

.input-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    width: 100%;
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
    .inputs-view {
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

        thead {
            display: none;
        }

        tbody {
            tr {
                display: block;
                margin-bottom: var(--spacing-md);
                border: 1px solid var(--color-border-base);
                border-radius: var(--radius-md);
                padding: var(--spacing-xs);
            }

            td {
                display: block;
                width: 100%;
                padding: var(--spacing-sm);

                &:first-child {
                    padding-top: var(--spacing-md);
                    font-weight: var(--font-weight-semibold);
                }

                &:last-child {
                    padding-bottom: var(--spacing-md);
                }
            }
        }
    }
}
</style>
