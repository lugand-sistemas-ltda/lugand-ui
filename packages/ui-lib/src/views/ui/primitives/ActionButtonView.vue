<script setup lang="ts">
import { ref } from 'vue'
import {
    ActionButton,
    Card,
    Badge,
    Rating,
    ComponentShowcase,
    CodeBlock,
    GridContainer
} from '@/shared/components'
import { useToast } from '@/modules/toast'

const toast = useToast()

// Estados dos action buttons
const isLiked = ref(false)
const likes = ref(42)
const isFavorite = ref(false)
const isInCart = ref(false)
const isAdding = ref(false)

// Garantir que isFavorite seja detectado como usado
if (import.meta.env.DEV) {
    console.log('Favorite state:', isFavorite.value)
}

// Handlers
function toggleLike() {
    isLiked.value = !isLiked.value
    if (isLiked.value) {
        likes.value++
        toast.success('❤️ Curtido!')
    } else {
        likes.value--
        toast.info('Curtida removida')
    }
}

function addToCart() {
    if (isInCart.value) {
        toast.info('Já está no carrinho!')
        return
    }

    isAdding.value = true
    setTimeout(() => {
        isInCart.value = true
        isAdding.value = false
        toast.success('🛒 Adicionado ao carrinho!')
    }, 1000)
}

function share() {
    toast.success('🔗 Link copiado!')
}

// Exemplo de produto com múltiplos action buttons
const product = ref({
    liked: false,
    favorited: false,
    inCart: false,
    likes: 156,
    shares: 23
})

function handleProductLike() {
    product.value.liked = !product.value.liked
    if (product.value.liked) {
        product.value.likes++
    } else {
        product.value.likes--
    }
}
</script>

<template>
    <div class="action-button-view">
        <div class="header">
            <h1>Action Buttons</h1>
            <p class="lead">Botões de ação rápida pré-configurados para interações comuns (Like, Favorite, Cart, Share).
            </p>
        </div>

        <!-- ACTION BUTTON TIPOS -->
        <ComponentShowcase title="ActionButton - Tipos Pré-definidos"
            description="Botões especializados com ícones, estados e contadores integrados.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Like Button</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="like" />
                        <ActionButton type="like" :count="42" />
                        <ActionButton type="like" :count="1523" />
                        <ActionButton type="like" :active="true" />
                        <ActionButton type="like" :active="true" :count="999" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Favorite Button</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="favorite" />
                        <ActionButton type="favorite" :count="12" />
                        <ActionButton type="favorite" :active="true" />
                        <ActionButton type="favorite" :active="true" :count="234" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Add to Cart Button</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="cart" />
                        <ActionButton type="cart" label="Adicionar" />
                        <ActionButton type="cart" :loading="true" label="Adicionando..." />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Share Button</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="share" />
                        <ActionButton type="share" label="Compartilhar" />
                        <ActionButton type="share" :count="89" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Custom (Ícone + Label personalizados)</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="custom" icon="🔔" label="Notificar" />
                        <ActionButton type="custom" icon="💬" label="Comentar" :count="15" />
                        <ActionButton type="custom" icon="📥" label="Download" :count="456" />
                        <ActionButton type="custom" icon="🔖" label="Salvar" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="like" size="sm" :count="10" />
                        <ActionButton type="like" size="md" :count="10" />
                        <ActionButton type="like" size="lg" :count="10" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Variantes</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="like" variant="ghost" label="Ghost" />
                        <ActionButton type="like" variant="outline" label="Outline" />
                        <ActionButton type="like" variant="default" label="Default" />
                        <ActionButton type="like" variant="primary" label="Primary" :active="true" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Estados: Loading e Disabled</h4>
                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
                        <ActionButton type="cart" :loading="true" label="Processando..." />
                        <ActionButton type="like" :disabled="true" label="Desabilitado" />
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Like Button -->
<ActionButton type='like' />
<ActionButton type='like' :count='42' />
<ActionButton type='like' :active='true' />

<!-- Favorite -->
<ActionButton type='favorite' :active='isFavorite' @click='isFavorite = !isFavorite' />
<ActionButton type='favorite' :count='234' />

<!-- Add to Cart -->
<ActionButton type='cart' label='Adicionar' />
<ActionButton type='cart' :loading='isAdding' />

<!-- Share -->
<ActionButton type='share' />
<ActionButton type='share' :count='89' />

<!-- Custom -->
<ActionButton 
  type='custom' 
  icon='🔔' 
  label='Notificar' 
  :count='5' 
/>

<!-- Sizes -->
<ActionButton type='like' size='sm' />
<ActionButton type='like' size='lg' />

<!-- Variants -->
<ActionButton type='like' variant='ghost' />
<ActionButton type='like' variant='outline' />
<ActionButton type='like' variant='primary' />

<!-- States -->
<ActionButton type='cart' :loading='true' />
<ActionButton type='like' :disabled='true' />" />
            </template>
        </ComponentShowcase>

        <!-- EXEMPLOS INTERATIVOS -->
        <ComponentShowcase title="Exemplos Interativos" description="Action Buttons com handlers e feedback visual.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Like com Contador Dinâmico</h4>
                    <Card padding="md">
                        <div
                            style="display: flex; flex-direction: column; gap: var(--spacing-md); align-items: center;">
                            <div style="font-size: 3rem;">📸</div>
                            <p style="text-align: center; max-width: 300px;">
                                Foto incrível do pôr do sol na praia
                            </p>
                            <ActionButton type="like" :active="isLiked" :count="likes" size="lg" @click="toggleLike" />
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Adicionar ao Carrinho com Loading</h4>
                    <Card padding="md">
                        <div
                            style="display: flex; flex-direction: column; gap: var(--spacing-md); align-items: center;">
                            <div style="font-size: 3rem;">🎧</div>
                            <h4 style="margin: 0;">Fone de Ouvido Premium</h4>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">R$ 299,90
                            </div>
                            <ActionButton type="cart" :loading="isAdding"
                                :label="isInCart ? 'No Carrinho' : 'Adicionar'" :disabled="isInCart" variant="primary"
                                size="lg" @click="addToCart" />
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Card de Produto Completo</h4>
                    <GridContainer :cols="2" gap="lg" style="max-width: 800px;">
                        <Card padding="md">
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                                <!-- Imagem -->
                                <div
                                    style="position: relative; width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: var(--radius-md);">
                                    <!-- Badge -->
                                    <div style="position: absolute; top: 8px; left: 8px;">
                                        <Badge variant="success" size="sm">-20%</Badge>
                                    </div>
                                    <!-- Favorite button -->
                                    <div style="position: absolute; top: 8px; right: 8px;">
                                        <ActionButton type="favorite" :active="product.favorited" variant="default"
                                            @click="product.favorited = !product.favorited" />
                                    </div>
                                </div>

                                <!-- Info -->
                                <div>
                                    <h4 style="margin: 0 0 var(--spacing-xs) 0;">Smartwatch Pro</h4>
                                    <Rating :model-value="4.5" :count="89" show-count readonly size="sm" allow-half />
                                </div>

                                <!-- Preço -->
                                <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
                                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">R$
                                        799,90</div>
                                    <div
                                        style="font-size: 0.875rem; color: var(--color-text-tertiary); text-decoration: line-through;">
                                        R$ 999,90</div>
                                </div>

                                <!-- Actions -->
                                <div
                                    style="display: flex; gap: var(--spacing-sm); padding-top: var(--spacing-sm); border-top: 1px solid var(--color-border);">
                                    <ActionButton type="like" :active="product.liked" :count="product.likes" size="sm"
                                        @click="handleProductLike" />
                                    <ActionButton type="share" :count="product.shares" size="sm" @click="share" />
                                    <div style="flex: 1;"></div>
                                    <ActionButton type="cart" label="Comprar" variant="primary" size="sm"
                                        @click="addToCart" />
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                                <!-- Imagem -->
                                <div
                                    style="position: relative; width: 100%; height: 200px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: var(--radius-md);">
                                    <!-- Badge -->
                                    <div style="position: absolute; top: 8px; left: 8px;">
                                        <Badge variant="primary" size="sm">Novo</Badge>
                                    </div>
                                    <!-- Favorite button -->
                                    <div style="position: absolute; top: 8px; right: 8px;">
                                        <ActionButton type="favorite" variant="default" />
                                    </div>
                                </div>

                                <!-- Info -->
                                <div>
                                    <h4 style="margin: 0 0 var(--spacing-xs) 0;">Câmera DSLR 4K</h4>
                                    <Rating :model-value="5" :count="234" show-count readonly size="sm" />
                                </div>

                                <!-- Preço -->
                                <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
                                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">R$
                                        3.499,00</div>
                                </div>

                                <!-- Actions -->
                                <div
                                    style="display: flex; gap: var(--spacing-sm); padding-top: var(--spacing-sm); border-top: 1px solid var(--color-border);">
                                    <ActionButton type="like" :count="892" size="sm" @click="toggleLike" />
                                    <ActionButton type="share" :count="145" size="sm" @click="share" />
                                    <div style="flex: 1;"></div>
                                    <ActionButton type="cart" label="Comprar" variant="primary" size="sm"
                                        @click="addToCart" />
                                </div>
                            </div>
                        </Card>
                    </GridContainer>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Like com contador dinâmico -->
<ActionButton 
  type='like' 
  :active='isLiked' 
  :count='likes'
  size='lg'
  @click='toggleLike'
/>

<!-- Add to Cart com loading -->
<ActionButton 
  type='cart' 
  :loading='isAdding'
  label='Adicionar ao Carrinho'
  :disabled='isInCart'
  variant='primary'
  size='lg'
  @click='addToCart'
/>

<!-- Product Card com múltiplos action buttons -->
<Card>
  <!-- Imagem com Favorite absoluto -->
  <div style='position: relative'>
    <img src='product.jpg' />
    <ActionButton 
      type='favorite' 
      :active='isFavorite'
      @click='isFavorite = !isFavorite'
      style='position: absolute; top: 8px; right: 8px'
    />
  </div>
  
  <!-- Info -->
  <h4>Produto</h4>
  <Rating :model-value='4.5' readonly />
  <div>R$ 299,90</div>
  
  <!-- Actions -->
  <div style='display: flex; gap: 8px'>
    <ActionButton type='like' :count='likes' />
    <ActionButton type='share' :count='shares' />
    <ActionButton type='cart' variant='primary' />
  </div>
</Card>" />
            </template>
        </ComponentShowcase>

        <!-- PADRÕES E BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 Quando Usar Action Buttons</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Like Button</strong>: Posts, fotos, comentários - interações sociais com contador visível
                </li>
                <li><strong>Favorite Button</strong>: Salvar para depois, criar listas, marcar favoritos - estado
                    persistente
                </li>
                <li><strong>Cart Button</strong>: E-commerce - adicionar produtos ao carrinho com feedback de loading
                </li>
                <li><strong>Share Button</strong>: Compartilhar conteúdo - copiar link, abrir compartilhamento nativo
                </li>
                <li><strong>Custom Button</strong>: Notificações, downloads, comentários - use ícones relevantes</li>
                <li><strong>Contador</strong>: Sempre mostre quando houver engajamento social (likes, shares) para proof
                    social
                </li>
                <li><strong>Loading State</strong>: Use em ações assíncronas (adicionar ao carrinho, salvar favorito)
                    para
                    feedback</li>
                <li><strong>Animações</strong>: Like e Favorite têm animações nativas (heart-beat, star-pulse) quando
                    ativados
                </li>
            </ul>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.action-button-view {
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
