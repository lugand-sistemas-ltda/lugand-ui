<script setup lang="ts">
import { ref } from 'vue'
import {
    CopyButton,
    CopyInput,
    Card,
    Button,
    Badge,
    ComponentShowcase,
    CodeBlock
} from '@/shared/components'
import { useToast } from '@/modules/toast'

const toast = useToast()

// URLs e links de exemplo
const shareUrl = ref('https://lugand-sistemas.com.br/products/premium-watch')
const apiToken = ref('api_key_1234567890abcdefghijklmnopqrstuvwxyz')
const webhookUrl = ref('https://api.example.com/webhooks/orders/abc123xyz789')

// Código de exemplo
const codeSnippet = ref(`import { CopyButton } from '@lugand-sistemas-ltda/vue-ui-lib'

<CopyButton 
  text="Conteúdo a copiar"
  @copied="handleCopy"
/>`)

// JSON de exemplo
const jsonData = ref(JSON.stringify({
    id: "prod_abc123",
    name: "Premium Watch",
    price: 299.90,
    currency: "BRL"
}, null, 2))

// Handlers
function handleCopied(text: string) {
    toast.success('✅ Copiado para área de transferência!')
    console.log('Copied:', text.substring(0, 50) + '...')
}

function handleError(error: Error) {
    toast.error('❌ Erro ao copiar: ' + error.message)
    console.error('Copy error:', error)
}

// Exemplo de uso em contexto
const productData = ref({
    id: 'prod_123',
    name: 'Smartwatch Pro',
    price: 'R$ 799,90',
    shareUrl: 'https://shop.example.com/products/smartwatch-pro',
    sku: 'WATCH-PRO-BLK-001'
})
</script>

<template>
    <div class="clipboard-view">
        <div class="header">
            <h1>Clipboard & Copy</h1>
            <p class="lead">Componentes para copiar texto para área de transferência usando Clipboard API.</p>
        </div>

        <!-- COPYBUTTON -->
        <ComponentShowcase title="CopyButton"
            description="Botão simples para copiar texto para clipboard com feedback visual.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Básico</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <CopyButton text="Texto simples para copiar" @copied="handleCopied" />
                        <CopyButton text="https://example.com/share/123" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Com Label</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <CopyButton text="https://example.com/share/123" label="Copiar Link" @copied="handleCopied" />
                        <CopyButton text="sk_live_abc123" label="Copiar Token" @copied="handleCopied" />
                        <CopyButton text="{'id': 123}" label="Copiar JSON" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <CopyButton text="..." size="sm" label="Small" @copied="handleCopied" />
                        <CopyButton text="..." size="md" label="Medium" @copied="handleCopied" />
                        <CopyButton text="..." size="lg" label="Large" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Variantes</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <CopyButton text="..." variant="ghost" label="Ghost" @copied="handleCopied" />
                        <CopyButton text="..." variant="outline" label="Outline" @copied="handleCopied" />
                        <CopyButton text="..." variant="default" label="Default" @copied="handleCopied" />
                        <CopyButton text="..." variant="primary" label="Primary" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Ícones Customizados</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <CopyButton text="..." icon="📎" copied-icon="✅" label="Anexar" @copied="handleCopied" />
                        <CopyButton text="..." icon="🔗" copied-icon="✨" label="Link" @copied="handleCopied" />
                        <CopyButton text="..." icon="💾" copied-icon="🎉" label="Salvo" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Estados: Desabilitado</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <CopyButton text="..." label="Desabilitado" :disabled="true" />
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Básico -->
<CopyButton text='Texto para copiar' />

<!-- Com label -->
<CopyButton 
  text='https://example.com/share/123' 
  label='Copiar Link'
/>

<!-- Sizes -->
<CopyButton text='...' size='sm' />
<CopyButton text='...' size='lg' />

<!-- Variants -->
<CopyButton text='...' variant='ghost' />
<CopyButton text='...' variant='primary' />

<!-- Ícones customizados -->
<CopyButton 
  text='...' 
  icon='🔗' 
  copied-icon='✨'
  label='Link'
/>

<!-- Com eventos -->
<CopyButton 
  text='...'
  @copied='handleCopied'
  @error='handleError'
/>

<!-- Desabilitado -->
<CopyButton text='...' :disabled='true' />" />
            </template>
        </ComponentShowcase>

        <!-- COPYINPUT -->
        <ComponentShowcase title="CopyInput"
            description="Input read-only com botão de copiar integrado. Ideal para URLs, tokens, códigos.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Básico</h4>
                    <CopyInput :value="shareUrl" @copied="handleCopied" />
                </div>

                <div class="showcase-group">
                    <h4>Com Label</h4>
                    <div style="display: grid; gap: var(--spacing-md); max-width: 600px;">
                        <CopyInput :value="shareUrl" label="URL de Compartilhamento" @copied="handleCopied" />
                        <CopyInput :value="apiToken" label="API Token" @copied="handleCopied" />
                        <CopyInput :value="webhookUrl" label="Webhook URL" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div style="display: grid; gap: var(--spacing-md); max-width: 600px;">
                        <CopyInput :value="shareUrl" label="Small" size="sm" @copied="handleCopied" />
                        <CopyInput :value="shareUrl" label="Medium" size="md" @copied="handleCopied" />
                        <CopyInput :value="shareUrl" label="Large" size="lg" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Variantes do Botão</h4>
                    <div style="display: grid; gap: var(--spacing-md); max-width: 600px;">
                        <CopyInput :value="shareUrl" variant="ghost" label="Ghost" @copied="handleCopied" />
                        <CopyInput :value="shareUrl" variant="outline" label="Outline" @copied="handleCopied" />
                        <CopyInput :value="shareUrl" variant="primary" label="Primary" @copied="handleCopied" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Tipo Password (Masked)</h4>
                    <CopyInput :value="apiToken" label="Secret Token" type="password" @copied="handleCopied"
                        style="max-width: 600px;" />
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Básico -->
<CopyInput value='https://example.com/share/123' />

<!-- Com label -->
<CopyInput 
  value='sk_live_abc123' 
  label='API Token'
/>

<!-- Sizes -->
<CopyInput value='...' size='sm' />
<CopyInput value='...' size='lg' />

<!-- Variants -->
<CopyInput value='...' variant='ghost' />
<CopyInput value='...' variant='primary' />

<!-- Password type (masked) -->
<CopyInput 
  value='secret_token_123'
  label='Secret Token'
  type='password'
/>

<!-- Com eventos -->
<CopyInput 
  value='...'
  @copied='handleCopied'
  @error='handleError'
/>" />
            </template>
        </ComponentShowcase>

        <!-- EXEMPLOS PRÁTICOS -->
        <ComponentShowcase title="Exemplos Práticos" description="Casos de uso reais com CopyButton e CopyInput.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Card de Produto com Compartilhamento</h4>
                    <Card padding="md" style="max-width: 400px;">
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                            <!-- Imagem -->
                            <div
                                style="width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: var(--radius-md);">
                            </div>

                            <!-- Info -->
                            <div>
                                <h3 style="margin: 0 0 var(--spacing-xs) 0;">{{ productData.name }}</h3>
                                <Badge variant="success" size="sm">Em estoque</Badge>
                            </div>

                            <!-- Preço -->
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                                {{ productData.price }}
                            </div>

                            <!-- Share -->
                            <div style="padding-top: var(--spacing-sm); border-top: 1px solid var(--color-border);">
                                <CopyInput :value="productData.shareUrl" label="Compartilhar Produto" size="sm"
                                    @copied="handleCopied" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Copiar Código / Snippet</h4>
                    <Card padding="md" style="max-width: 600px;">
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4 style="margin: 0;">Exemplo de Uso</h4>
                                <CopyButton :text="codeSnippet" label="Copiar Código" size="sm" variant="outline"
                                    @copied="handleCopied" />
                            </div>
                            <pre
                                style="margin: 0; padding: var(--spacing-md); background: var(--color-bg-tertiary); border-radius: var(--radius-md); overflow-x: auto; font-size: 0.875rem;">{{ codeSnippet }}</pre>
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Copiar JSON Data</h4>
                    <Card padding="md" style="max-width: 600px;">
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4 style="margin: 0;">Product JSON</h4>
                                <CopyButton :text="jsonData" label="Copiar JSON" size="sm" variant="outline"
                                    @copied="handleCopied" />
                            </div>
                            <pre
                                style="margin: 0; padding: var(--spacing-md); background: var(--color-bg-tertiary); border-radius: var(--radius-md); overflow-x: auto; font-size: 0.875rem;">{{ jsonData }}</pre>
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Dashboard de Desenvolvedor (API Keys)</h4>
                    <div style="display: grid; gap: var(--spacing-md); max-width: 100%;">
                        <Card padding="md">
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                                <div>
                                    <h4 style="margin: 0 0 var(--spacing-xs) 0;">Production API Key</h4>
                                    <p style="margin: 0; font-size: 0.875rem; color: var(--color-text-secondary);">
                                        Use esta chave nas requisições de produção
                                    </p>
                                </div>
                                <CopyInput value="prod_api_key_1234567890abcdefghijklmnopqrstuvwxyz" type="password"
                                    @copied="handleCopied" />
                            </div>
                        </Card>

                        <Card padding="md">
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                                <div>
                                    <h4 style="margin: 0 0 var(--spacing-xs) 0;">Development API Key</h4>
                                    <p style="margin: 0; font-size: 0.875rem; color: var(--color-text-secondary);">
                                        Use para testes e desenvolvimento
                                    </p>
                                </div>
                                <CopyInput value="dev_api_key_0987654321zyxwvutsrqponmlkjihgfedcba" type="password"
                                    @copied="handleCopied" />
                            </div>
                        </Card>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Card de Produto com Share -->
<Card>
  <h3>{{ product.name }}</h3>
  <div>{{ product.price }}</div>
  <CopyInput 
    :value='product.shareUrl' 
    label='Compartilhar Produto'
    size='sm'
    @copied='handleCopied'
  />
</Card>

<!-- Copiar Código -->
<Card>
  <div style='display: flex; justify-content: space-between'>
    <h4>Código</h4>
    <CopyButton 
      :text='codeSnippet' 
      label='Copiar'
      variant='outline'
    />
  </div>
  <pre>{{ codeSnippet }}</pre>
</Card>

<!-- API Keys -->
<Card>
  <h4>Production API Key</h4>
  <CopyInput 
    value='sk_live_abc123...'
    type='password'
    @copied='toast.success()'
  />
</Card>" />
            </template>
        </ComponentShowcase>

        <!-- BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 Clipboard API - Boas Práticas</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Feedback Visual</strong>: Sempre forneça feedback imediato (ícone muda, toast aparece)</li>
                <li><strong>Ícones Intuitivos</strong>: Use 📋 para copy, ✅ para copied, ou customize conforme contexto
                </li>
                <li><strong>Eventos</strong>: Use @copied para integrar com toasts ou analytics</li>
                <li><strong>Segurança</strong>: CopyInput type="password" oculta tokens sensíveis mas ainda permite
                    copiar</li>
                <li><strong>Acessibilidade</strong>: Botões têm title tooltip e são keyboard accessible</li>
                <li><strong>Fallback</strong>: Componente usa execCommand() como fallback para navegadores antigos</li>
                <li><strong>Contextos Comuns</strong>: URLs de compartilhamento, API tokens, códigos, IDs, JSONs</li>
            </ul>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.clipboard-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.header {
    margin-bottom: var(--spacing-lg);

    h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text-primary);
    }

    .lead {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        margin: 0;
        max-width: 800px;
    }
}

.showcase-group {
    margin-bottom: var(--spacing-lg);

    &:last-child {
        margin-bottom: 0;
    }

    h4 {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
    }
}
</style>
