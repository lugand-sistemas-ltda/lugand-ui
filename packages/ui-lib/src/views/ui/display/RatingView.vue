<script setup lang="ts">
import { ref } from 'vue'
import {
    Rating,
    Card,
    Badge,
    Avatar,
    Button,
    ComponentShowcase,
    CodeBlock,
    GridContainer
} from '@/shared/components'

// Estados interativos
const userRating = ref(0)
const product1Rating = ref(4.5)
const heartRating = ref(0)
const thumbsRating = ref(0)
</script>

<template>
    <div class="rating-view">
        <div class="header">
            <h1>Rating & Reviews</h1>
            <p class="lead">Sistema de avaliação interativo com estrelas e ícones customizados.</p>
        </div>

        <!-- RATING BÁSICO -->
        <ComponentShowcase title="Rating"
            description="Componente de avaliação com suporte a interação, half-stars e ícones customizados.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Read-Only (Exibição)</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: center;">
                        <Rating :model-value="5" readonly />
                        <Rating :model-value="4" readonly />
                        <Rating :model-value="3" readonly />
                        <Rating :model-value="2" readonly />
                        <Rating :model-value="1" readonly />
                        <Rating :model-value="0" readonly />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Half Stars (Valores Decimais)</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: center;">
                        <Rating :model-value="4.5" allow-half readonly />
                        <Rating :model-value="3.5" allow-half readonly />
                        <Rating :model-value="2.5" allow-half readonly />
                        <Rating :model-value="1.5" allow-half readonly />
                        <Rating :model-value="0.5" allow-half readonly />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Com Contador de Avaliações</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: center;">
                        <Rating :model-value="4.8" :count="1523" show-count readonly />
                        <Rating :model-value="4.2" :count="456" show-count readonly />
                        <Rating :model-value="3.7" :count="89" show-count readonly />
                        <Rating :model-value="2.5" :count="12" show-count allow-half readonly />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: center;">
                        <Rating :model-value="4" size="sm" readonly />
                        <Rating :model-value="4" size="md" readonly />
                        <Rating :model-value="4" size="lg" readonly />
                        <Rating :model-value="4" size="xl" readonly />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Interativo (Clicável)</h4>
                    <Card padding="md">
                        <div
                            style="display: flex; flex-direction: column; gap: var(--spacing-md); align-items: center;">
                            <div style="font-weight: 600;">Avalie este produto:</div>
                            <Rating v-model="userRating" size="lg" />
                            <div v-if="userRating > 0" style="color: var(--color-text-secondary);">
                                Você deu {{ userRating }} estrela{{ userRating !== 1 ? 's' : '' }}
                            </div>
                            <Button v-if="userRating > 0" variant="outline" size="sm" @click="userRating = 0">
                                Limpar Avaliação
                            </Button>
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Half Stars Interativo</h4>
                    <Card padding="md">
                        <div
                            style="display: flex; flex-direction: column; gap: var(--spacing-md); align-items: center;">
                            <div style="font-weight: 600;">Avaliação com meio valores:</div>
                            <Rating v-model="product1Rating" allow-half size="lg" />
                            <div style="color: var(--color-text-secondary);">
                                Rating: {{ product1Rating }} / 5
                            </div>
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Ícones Customizados</h4>
                    <div style="display: grid; gap: var(--spacing-lg);">
                        <!-- Hearts -->
                        <Card padding="md">
                            <div
                                style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
                                <div style="font-weight: 600;">Curtir com corações:</div>
                                <Rating v-model="heartRating" icon="❤️" color="#ef4444" size="lg" />
                            </div>
                        </Card>

                        <!-- Thumbs -->
                        <Card padding="md">
                            <div
                                style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
                                <div style="font-weight: 600;">Aprovação com 👍:</div>
                                <Rating v-model="thumbsRating" icon="👍" color="#3b82f6" size="lg" />
                            </div>
                        </Card>

                        <!-- Read-only examples -->
                        <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: center;">
                            <Rating :model-value="5" icon="🔥" color="#f97316" readonly />
                            <Rating :model-value="4" icon="💎" color="#8b5cf6" readonly />
                            <Rating :model-value="3" icon="🎯" color="#10b981" readonly />
                        </div>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Exemplo: Card de Produto com Rating</h4>
                    <GridContainer :cols="3" gap="md" style="max-width: 900px;">
                        <Card padding="md">
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                                <div
                                    style="width: 100%; height: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: var(--radius-md);">
                                </div>
                                <h4 style="margin: var(--spacing-sm) 0;">Produto Premium</h4>
                                <Rating :model-value="4.8" :count="245" show-count readonly size="sm" />
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">R$
                                    299,90</div>
                                <Badge variant="success" size="sm">Em estoque</Badge>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                                <div
                                    style="width: 100%; height: 120px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: var(--radius-md);">
                                </div>
                                <h4 style="margin: var(--spacing-sm) 0;">Produto Popular</h4>
                                <Rating :model-value="4.5" :count="892" show-count readonly size="sm" allow-half />
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">R$
                                    199,90</div>
                                <Badge variant="primary" size="sm">Mais vendido</Badge>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                                <div
                                    style="width: 100%; height: 120px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: var(--radius-md);">
                                </div>
                                <h4 style="margin: var(--spacing-sm) 0;">Produto Novo</h4>
                                <Rating :model-value="3.5" :count="23" show-count readonly size="sm" allow-half />
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">R$
                                    149,90</div>
                                <Badge variant="info" size="sm">Lançamento</Badge>
                            </div>
                        </Card>
                    </GridContainer>
                </div>

                <div class="showcase-group">
                    <h4>Exemplo: Review de Cliente</h4>
                    <Card padding="md">
                        <div style="display: flex; gap: var(--spacing-md);">
                            <Avatar name="Maria Silva" size="md" />
                            <div style="flex: 1;">
                                <div
                                    style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-xs);">
                                    <div>
                                        <div style="font-weight: 600;">Maria Silva</div>
                                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Compra
                                            verificada</div>
                                    </div>
                                    <Rating :model-value="5" size="sm" readonly />
                                </div>
                                <p style="margin: var(--spacing-sm) 0; line-height: 1.6;">
                                    Produto excelente! Superou minhas expectativas. A qualidade é impecável e chegou
                                    muito rápido.
                                    Recomendo!
                                </p>
                                <div style="font-size: 0.875rem; color: var(--color-text-tertiary);">
                                    Avaliado em 15 de fevereiro de 2026
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Estados: Desabilitado</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: center;">
                        <Rating :model-value="4" disabled />
                        <Rating :model-value="3" disabled size="lg" />
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Read-only (exibição) -->
<Rating :model-value='4.5' readonly />

<!-- Com contador -->
<Rating 
  :model-value='4.8' 
  :count='1523' 
  show-count 
  readonly 
/>

<!-- Half stars -->
<Rating 
  :model-value='4.5' 
  allow-half 
  readonly 
/>

<!-- Interativo (v-model) -->
<Rating v-model='userRating' />

<!-- Interativo com half stars -->
<Rating 
  v-model='rating' 
  allow-half 
  size='lg' 
/>

<!-- Ícones customizados -->
<Rating v-model='likes' icon='❤️' color='#ef4444' />
<Rating v-model='approval' icon='👍' color='#3b82f6' />
<Rating :model-value='5' icon='🔥' color='#f97316' readonly />

<!-- Sizes -->
<Rating :model-value='4' size='sm' />
<Rating :model-value='4' size='xl' />

<!-- Desabilitado -->
<Rating :model-value='4' disabled />

<!-- Exemplo: Produto -->
<Card>
  <h4>Produto Premium</h4>
  <Rating 
    :model-value='4.8' 
    :count='245' 
    show-count 
    readonly 
    size='sm' 
  />
  <div>R$ 299,90</div>
</Card>" />
            </template>
        </ComponentShowcase>

        <!-- PADRÕES E BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 Boas Práticas de Rating</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Read-only vs Interativo</strong>: Use readonly para exibir avaliações existentes, interativo
                    apenas
                    quando o usuário pode avaliar</li>
                <li><strong>Half Stars</strong>: Útil para médias de avaliações (4.5 estrelas) - use allow-half</li>
                <li><strong>Contador</strong>: Sempre mostre o número de avaliações com show-count para dar contexto
                    (245
                    avaliações é mais confiável que 2)</li>
                <li><strong>Ícones Customizados</strong>: Use ícones alternativos (❤️, 👍, 🔥) para contextos
                    específicos
                    (likes, aprovação, popularidade)</li>
                <li><strong>Tamanhos</strong>: sm para cards compactos, md (padrão) para maioria, lg/xl para destaque
                </li>
                <li><strong>Feedback Visual</strong>: Em componentes interativos, mostre confirmação após avaliação</li>
            </ul>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.rating-view {
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
