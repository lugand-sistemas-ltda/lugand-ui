<script setup lang="ts">
import { ref } from 'vue'
import { Card, MediaCard, Btn, ComponentShowcase, CodeBlock } from '@/shared/components'

// Mock Data para Produtos
const products = [
    {
        id: 1,
        title: 'Câmera Profissional 4K',
        subtitle: 'Eletrônicos • Fotografia',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        price: 'R$ 4.599,00',
        badge: 'Oferta',
        badgeColor: 'danger'
    },
    {
        id: 2,
        title: 'Headphone Noise Cancelling',
        subtitle: 'Áudio • Conforto',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        price: 'R$ 899,00',
        badge: 'Novo',
        badgeColor: 'success'
    },
    {
        id: 3,
        title: 'Smart Watch Series 5',
        subtitle: 'Wearables • Fitness',
        image: '', // Teste sem imagem
        price: 'R$ 1.299,00',
        badge: 'Esgotado',
        badgeColor: 'warning'
    }
]

const codeBasic = `<Card padding="lg">
  <h3>Conteúdo</h3>
</Card>

<Card variant="outline" hoverable clickable>
  <h3>Interativo</h3>
</Card>`

const codeMedia = `<MediaCard
  title="Câmera 4K"
  subtitle="Eletrônicos"
  image-src="/cam.jpg"
  badge="Oferta"
  badge-color="danger"
>
  <!-- Slot Content -->
  <div class="price">R$ 4.599,00</div>

  <!-- Slot Actions -->
  <template #actions>
    <Btn variant="primary">Comprar</Btn>
  </template>
</MediaCard>`

const handleBuy = (product: any) => {
    console.log('Comprar:', product.title)
}
</script>

<template>
    <div class="cards-view">
        <h1>Cards & Display</h1>
        <p class="lead">Container flexível para exibição de conteúdo e mídia.</p>

        <!-- 1. Card Primitivo -->
        <ComponentShowcase title="Card Básico (Primitivo)"
            description="Componente base 'Card' que serve de container e wrapper com estilos padronizados.">
            <template #preview>
                <div class="grid-showcase">
                    <Card padding="lg">
                        <h3>Card Default</h3>
                        <p>Conteúdo básico com sombra padrão.</p>
                    </Card>

                    <Card variant="outline" padding="lg">
                        <h3>Card Outline</h3>
                        <p>Apenas borda, fundo transparente.</p>
                    </Card>

                    <Card variant="ghost" padding="lg">
                        <h3>Card Ghost</h3>
                        <p>Sem borda e fundo, apenas padding.</p>
                    </Card>

                    <Card variant="flat" padding="lg">
                        <h3>Card Flat</h3>
                        <p>Fundo sutil, sem borda.</p>
                    </Card>

                    <Card hoverable clickable padding="lg">
                        <h3>Interativo</h3>
                        <p>Passe o mouse (hover) e clique.</p>
                    </Card>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeBasic" />
            </template>
        </ComponentShowcase>

        <!-- 2. Media Card (Produto) -->
        <ComponentShowcase title="Media Card (Produto Especialista)"
            description="Componente 'MediaCard' focado em exibir itens ricos como produtos, notícias ou perfis.">
            <template #preview>
                <div class="grid-products">
                    <MediaCard v-for="prod in products" :key="prod.id" :title="prod.title" :subtitle="prod.subtitle"
                        :image-src="prod.image" :badge="prod.badge" :badge-color="prod.badgeColor as any"
                        class="product-card">
                        <template #default>
                            <div class="product-price">{{ prod.price }}</div>
                            <p class="product-desc">Frete grátis para todo Brasil.</p>
                        </template>

                        <template #actions>
                            <Btn variant="ghost" size="sm">Detalhes</Btn>
                            <Btn variant="primary" size="sm" @click="handleBuy(prod)">
                                Comprar
                            </Btn>
                        </template>
                    </MediaCard>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeMedia" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.cards-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.grid-showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
}

.grid-products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
}

.product-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
}

.product-desc {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
}
</style>
