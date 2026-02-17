<script setup lang="ts">
import { ref } from 'vue'
import {
    Carousel,
    CarouselSlide,
    Card,
    Button,
    Badge,
    Rating,
    Avatar,
    ComponentShowcase,
    CodeBlock
} from '@/shared/components'
import {
    mockCarouselImages,
    mockCarouselProducts,
    mockCarouselTestimonials,
    mockCarouselHeroBanners
} from '@/mocks/carousel'

// Estado
const currentSlide = ref(0)
const isAutoPlayEnabled = ref(true)

// Mocks
const images = mockCarouselImages
const products = mockCarouselProducts
const testimonials = mockCarouselTestimonials
const heroBanners = mockCarouselHeroBanners


// Code examples para evitar problemas com template strings
const codeExample1 = `<template>
  <Carousel auto-play :interval="4000" loop>
    <CarouselSlide v-for="img in images" :key="img.id">
      <img :src="img.url" :alt="img.alt" />
    </CarouselSlide>
  </Carousel>
</template>

<script setup>
import { Carousel, CarouselSlide } from '@lugand-sistemas-ltda/vue-ui-lib'

const images = [
  { id: 1, url: 'image1.jpg', alt: 'Imagem 1' },
  { id: 2, url: 'image2.jpg', alt: 'Imagem 2' },
  // ...
]
<\/script>`

const codeExample2 = `<template>
  <Carousel v-model="currentSlide">
    <CarouselSlide v-for="product in products" :key="product.id">
      <Card>
        <img :src="product.image" />
        <h3>{{ product.name }}</h3>
        <Badge variant="success">{{ product.discount }}% OFF</Badge>
        <Rating :model-value="product.rating" readonly />
        <Button variant="primary">Adicionar ao Carrinho</Button>
      </Card>
    </CarouselSlide>

    <!-- Navegação customizada -->
    <template #navigation="{ prev, next }">
      <Button @click="prev">←</Button>
      <Button @click="next">→</Button>
    </template>
  </Carousel>
</template>`

const codeExample3 = `<template>
  <Carousel auto-play :interval="5000" pause-on-hover>
    <CarouselSlide v-for="review in testimonials" :key="review.id">
      <Card>
        <Avatar :name="review.name" size="lg" />
        <Rating :model-value="review.rating" readonly />
        <p>"{{ review.text }}"</p>
        <strong>— {{ review.name }}</strong>
      </Card>
    </CarouselSlide>

    <!-- Indicators customizados -->
    <template #indicators="{ goTo, current, total }">
      <Badge 
        v-for="i in total" 
        :variant="current === i - 1 ? 'primary' : 'secondary'"
        @click="goTo(i - 1)"
      >
        {{ i }}
      </Badge>
    </template>
  </Carousel>
</template>`

const codeExample4 = `<template>
  <Carousel auto-play :interval="6000" loop effect="slide">
    <CarouselSlide v-for="banner in heroBanners" :key="banner.id">
      <div class="hero-slide" :style="{ backgroundImage: \`url(\${banner.bg})\` }">
        <h1>{{ banner.title }}</h1>
        <p>{{ banner.subtitle }}</p>
        <Button variant="primary" size="lg">{{ banner.cta }}</Button>
      </div>
    </CarouselSlide>
  </Carousel>
</template>`

const codeExample5 = `<template>
  <Carousel v-model="currentSlide" :auto-play="autoPlayEnabled">
    <CarouselSlide v-for="i in 3" :key="i">
      <h2>Slide {{ i }}</h2>
    </CarouselSlide>

    <template #navigation="{ prev, next, isPlaying, play, pause }">
      <Button @click="prev">← Anterior</Button>
      <Button @click="isPlaying ? pause() : play()">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </Button>
      <Button @click="next">Próximo →</Button>
    </template>
  </Carousel>

  <!-- Controle externo -->
  <Button @click="currentSlide = 0">Ir para Slide 1</Button>
  <Button @click="autoPlayEnabled = !autoPlayEnabled">Toggle Auto-play</Button>
</template>

<script setup>
const currentSlide = ref(0)
const autoPlayEnabled = ref(true)
<\/script>`

const codeExampleProps = `interface CarouselProps {
  modelValue?: number           // v-model para índice atual (default: 0)
  autoPlay?: boolean            // Auto-play habilitado (default: false)
  interval?: number             // Intervalo do auto-play em ms (default: 3000)
  loop?: boolean                // Loop infinito (default: true)
  swipeable?: boolean           // Habilita swipe/touch (default: true)
  pauseOnHover?: boolean        // Pausa auto-play no hover (default: true)
  direction?: 'horizontal' | 'vertical'  // Direção (default: 'horizontal')
  effect?: 'slide' | 'fade'     // Efeito de transição (default: 'slide')
  transitionDuration?: number   // Duração da transição em ms (default: 300)
}

// Events:
@update:modelValue   // Atualiza índice (v-model)
@change              // Emitido quando slide muda (index, previousIndex)
@afterChange         // Emitido após transição completar (index)`

const codeExampleSlots = `// Slot Props disponíveis em #navigation e #indicators
{
  current: number      // Índice atual
  total: number        // Total de slides
  prev: () => void     // Vai para slide anterior
  next: () => void     // Vai para próximo slide
  goTo: (index) => void  // Vai para slide específico
  isPlaying: boolean   // Se auto-play está ativo
  play: () => void     // Inicia auto-play
  pause: () => void    // Para auto-play
}`
</script>

<template>
    <div class="carousel-view">
        <div class="header">
            <h1>Carousel</h1>
            <p class="lead">Componente de slides/carrossel com auto-play, swipe, keyboard navigation e slots
                customizáveis.</p>
        </div>

        <!-- EXEMPLO 1: Galeria de Imagens Simples -->
        <ComponentShowcase title="Galeria de Imagens Simples"
            description="Carousel básico com auto-play e loop infinito. Use setas do teclado (←/→) para navegar.">
            <template #preview>
                <Carousel auto-play :interval="4000" loop>
                    <CarouselSlide v-for="img in images" :key="img.id">
                        <div class="image-slide">
                            <img :src="img.url" :alt="img.alt" />
                            <div class="image-caption">
                                <h3>{{ img.title }}</h3>
                            </div>
                        </div>
                    </CarouselSlide>
                </Carousel>
            </template>

            <template #code>
                <CodeBlock :code="codeExample1" />
            </template>
        </ComponentShowcase>

        <!-- EXEMPLO 2: Carousel de Produtos (E-commerce) -->
        <ComponentShowcase title="Carousel de Produtos"
            description="Usa componentes da lib (Card, Badge, Rating, Button) dentro dos slides. Navegação customizada.">
            <template #preview>
                <Carousel v-model="currentSlide">
                    <CarouselSlide v-for="product in products" :key="product.id">
                        <Card padding="lg" style="max-width: 400px; margin: 0 auto;">
                            <div class="product-card">
                                <img :src="product.image" :alt="product.name" />
                                <h3>{{ product.name }}</h3>
                                <div class="product-meta">
                                    <Badge variant="success">{{ product.discount }}% OFF</Badge>
                                    <Rating :model-value="product.rating" readonly />
                                </div>
                                <div class="product-price">
                                    <span class="old-price">R$ {{ (product.price / (1 - product.discount /
                                        100)).toFixed(2)
                                        }}</span>
                                    <span class="new-price">R$ {{ product.price.toFixed(2) }}</span>
                                </div>
                                <Button variant="primary" full-width>Adicionar ao Carrinho</Button>
                            </div>
                        </Card>
                    </CarouselSlide>

                    <!-- Navegação customizada -->
                    <template #navigation="{ prev, next }">
                        <div class="custom-navigation">
                            <Button @click="prev" variant="primary" size="lg">
                                ←
                            </Button>
                            <Button @click="next" variant="primary" size="lg">
                                →
                            </Button>
                        </div>
                    </template>
                </Carousel>

                <div style="margin-top: var(--spacing-md); text-align: center;">
                    <p style="color: var(--color-text-secondary);">
                        Slide atual: <strong>{{ currentSlide + 1 }} / {{ products.length }}</strong>
                    </p>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeExample2" />
            </template>
        </ComponentShowcase>

        <!-- EXEMPLO 3: Depoimentos (Testimonials) -->
        <ComponentShowcase title="Carousel de Depoimentos"
            description="Pause on hover habilitado. Indicators customizados com Badge.">
            <template #preview>
                <Carousel auto-play :interval="5000" pause-on-hover loop>
                    <CarouselSlide v-for="review in testimonials" :key="review.id">
                        <Card padding="lg" style="max-width: 600px; margin: 0 auto; text-align: center;">
                            <div class="testimonial">
                                <Avatar :name="review.name" size="lg" style="margin-bottom: var(--spacing-md);" />
                                <Rating :model-value="review.rating" readonly
                                    style="margin-bottom: var(--spacing-md);" />
                                <p class="testimonial-text">"{{ review.text }}"</p>
                                <strong class="testimonial-author">— {{ review.name }}</strong>
                            </div>
                        </Card>
                    </CarouselSlide>

                    <!-- Indicators customizados -->
                    <template #indicators="{ goTo, current, total }">
                        <div class="custom-indicators">
                            <Badge v-for="i in total" :key="i" :variant="current === i - 1 ? 'primary' : 'secondary'"
                                clickable @click="goTo(i - 1)" style="cursor: pointer;">
                                {{ i }}
                            </Badge>
                        </div>
                    </template>
                </Carousel>
            </template>

            <template #code>
                <CodeBlock :code="codeExample3" />
            </template>
        </ComponentShowcase>

        <!-- EXEMPLO 4: Hero Banners -->
        <ComponentShowcase title="Hero Banners"
            description="Carousel fullwidth com backgrounds e CTAs. Efeito fade opcional.">
            <template #preview>
                <Carousel auto-play :interval="6000" loop effect="slide" class="hero-carousel">
                    <CarouselSlide v-for="banner in heroBanners" :key="banner.id">
                        <div class="hero-slide" :style="{ backgroundImage: `url(${banner.bg})` }">
                            <div class="hero-content">
                                <h1>{{ banner.title }}</h1>
                                <p>{{ banner.subtitle }}</p>
                                <Button variant="primary" size="lg">{{ banner.cta }}</Button>
                            </div>
                        </div>
                    </CarouselSlide>
                </Carousel>
            </template>

            <template #code>
                <CodeBlock :code="codeExample4" />
            </template>
        </ComponentShowcase>

        <!-- EXEMPLO 5: Controle Programático -->
        <ComponentShowcase title="Controle Programático"
            description="Controle total via v-model e métodos expostos via scoped slots.">
            <template #preview>
                <Card>
                    <div style="margin-bottom: var(--spacing-lg);">
                        <div style="display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-md);">
                            <Button variant="primary" @click="currentSlide = 0">Ir para Slide 1</Button>
                            <Button variant="primary" @click="currentSlide = 1">Ir para Slide 2</Button>
                            <Button variant="primary" @click="currentSlide = 2">Ir para Slide 3</Button>
                        </div>
                        <div style="display: flex; gap: var(--spacing-sm); align-items: center;">
                            <Button :variant="isAutoPlayEnabled ? 'primary' : 'secondary'"
                                @click="isAutoPlayEnabled = !isAutoPlayEnabled">
                                {{ isAutoPlayEnabled ? '⏸️ Pausar' : '▶️ Play' }}
                            </Button>
                            <span style="color: var(--color-text-secondary);">
                                Auto-play: {{ isAutoPlayEnabled ? 'Ativo' : 'Pausado' }}
                            </span>
                        </div>
                    </div>

                    <Carousel v-model="currentSlide" :auto-play="isAutoPlayEnabled" :interval="3000" loop>
                        <CarouselSlide v-for="i in 3" :key="i">
                            <div class="numbered-slide">
                                <h2>Slide {{ i }}</h2>
                                <p>v-model: {{ currentSlide + 1 }}</p>
                            </div>
                        </CarouselSlide>

                        <template #navigation="{ prev, next, isPlaying, play, pause }">
                            <div class="custom-navigation">
                                <Button @click="prev" variant="ghost">◀ Anterior</Button>
                                <Button @click="isPlaying ? pause() : play()" variant="ghost">
                                    {{ isPlaying ? '⏸️' : '▶️' }}
                                </Button>
                                <Button @click="next" variant="ghost">Próximo ▶</Button>
                            </div>
                        </template>
                    </Carousel>
                </Card>
            </template>

            <template #code>
                <CodeBlock :code="codeExample5" />
            </template>
        </ComponentShowcase>

        <!-- PROPS & TYPES -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">📋 Props & API</h3>

            <h4>Carousel Props:</h4>
            <CodeBlock :code="codeExampleProps" />

            <h4 style="margin-top: var(--spacing-lg);">Scoped Slots:</h4>
            <CodeBlock :code="codeExampleSlots" />
        </Card>

        <!-- BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 Carousel - Boas Práticas</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Composição Flexível</strong>: Use slots para customizar navegação e indicators</li>
                <li><strong>Reutilize Componentes</strong>: Combine com Card, Badge, Button, Rating, etc</li>
                <li><strong>v-model</strong>: Controle programático do índice atual</li>
                <li><strong>Keyboard Navigation</strong>: Setas ←/→ para navegar (automático)</li>
                <li><strong>Touch Support</strong>: Swipe funciona em mobile (habilitado por padrão)</li>
                <li><strong>Acessibilidade</strong>: ARIA roles, keyboard support, focus management</li>
                <li><strong>Performance</strong>: CSS transitions, will-change, sem libs externas</li>
                <li><strong>Pause on Hover</strong>: Melhora UX quando usuário está lendo conteúdo</li>
                <li><strong>Loop Infinito</strong>: Melhor para carousels contínuos (hero banners)</li>
                <li><strong>Composable useCarousel</strong>: Crie carousels customizados com lógica reutilizável</li>
            </ul>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.carousel-view {
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

// Image Slide
.image-slide {
    position: relative;
    width: 100%;
    height: 400px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: var(--spacing-lg);
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        color: white;

        h3 {
            margin: 0;
            font-size: 1.5rem;
        }
    }
}

// Product Card
.product-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;

    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--radius-md);
    }

    h3 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--color-text-primary);
    }

    .product-meta {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md);
    }

    .product-price {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-sm);

        .old-price {
            text-decoration: line-through;
            color: var(--color-text-secondary);
            font-size: var(--font-size-sm);
        }

        .new-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-success);
        }
    }
}

// Testimonial
.testimonial {
    display: flex;
    flex-direction: column;
    align-items: center;

    .testimonial-text {
        font-size: 1.125rem;
        font-style: italic;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
        line-height: 1.8;
    }

    .testimonial-author {
        color: var(--color-text-primary);
        font-size: var(--font-size-base);
    }
}

// Hero Slide
.hero-carousel {
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.hero-slide {
    position: relative;
    width: 100%;
    height: 500px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
    }

    .hero-content {
        position: relative;
        z-index: 1;
        text-align: center;
        color: white;
        max-width: 600px;
        padding: var(--spacing-xl);

        h1 {
            font-size: 3rem;
            margin: 0 0 var(--spacing-md) 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        p {
            font-size: 1.25rem;
            margin: 0 0 var(--spacing-lg) 0;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
    }
}

// Numbered Slide
.numbered-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    background: linear-gradient(135deg, var(--color-primary-lighter), var(--color-primary));
    color: white;
    border-radius: var(--radius-lg);

    h2 {
        font-size: 3rem;
        margin: 0 0 var(--spacing-md) 0;
    }

    p {
        font-size: 1.25rem;
        margin: 0;
        opacity: 0.9;
    }
}

// Custom Navigation
.custom-navigation {
    position: absolute;
    bottom: var(--spacing-lg);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--spacing-sm);
    z-index: 10;
}

// Custom Indicators
.custom-indicators {
    position: absolute;
    bottom: var(--spacing-md);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--spacing-xs);
    z-index: 10;
}
</style>
