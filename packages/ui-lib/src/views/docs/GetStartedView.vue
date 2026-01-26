<script setup lang="ts">
/**
 * GetStartedView - Guia de início rápido
 */
</script>

<template>
    <div class="view-container">
        <h1>Get Started</h1>
        <p class="view-description">Guia de instalação e configuração inicial da UI Lib</p>

        <section class="doc-section">
            <h2>Visão Geral</h2>
            <p>
                Lugand UI é uma biblioteca de componentes Vue 3 moderna, construída com TypeScript e focada em
                fornecer uma experiência de desenvolvimento excepcional (DX) e uma interface de usuário consistente
                (UX).
            </p>
            <p>
                A biblioteca utiliza Composition API, design tokens para tematização e padrões arquiteturais
                bem definidos para garantir escalabilidade e manutenibilidade.
            </p>
        </section>

        <section class="doc-section">
            <h2>Instalação</h2>
            <pre><code>npm install @lugand/ui-lib</code></pre>
            <p class="note">Ou use yarn/pnpm de acordo com sua preferência.</p>
        </section>

        <section class="doc-section">
            <h2>Configuração Inicial</h2>
            <p>Importe a biblioteca e os estilos no seu arquivo principal:</p>
            <pre><code>// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// Importe os estilos da biblioteca
import '@lugand/ui-lib/dist/styles.css'

// Importe os componentes
import { Button, Input, Modal } from '@lugand/ui-lib'

const app = createApp(App)

// Registre componentes globalmente (opcional)
app.component('LugButton', Button)
app.component('LugInput', Input)
app.component('LugModal', Modal)

app.mount('#app')</code></pre>
        </section>

        <section class="doc-section">
            <h2>Uso Básico</h2>
            <p>Você pode usar os componentes diretamente ou importá-los sob demanda:</p>
            <pre><code>&lt;script setup lang="ts"&gt;
import { Button, Input } from '@lugand/ui-lib'
import { ref } from 'vue'

const name = ref('')
&lt;/script&gt;

&lt;template&gt;
  &lt;div&gt;
    &lt;Input v-model="name" placeholder="Digite seu nome" /&gt;
    &lt;Button variant="primary" @click="sayHello"&gt;
      Olá \{\{ name \}\}!
    &lt;/Button&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
        </section>

        <section class="doc-section">
            <h2>Próximos Passos</h2>
            <ul>
                <li><router-link to="/docs/theming">Explore o sistema de temas</router-link></li>
                <li><router-link to="/docs/components">Veja todos os componentes disponíveis</router-link></li>
                <li><router-link to="/ui/simple/buttons">Comece com componentes simples como Buttons</router-link></li>
                <li><router-link to="/ui/complex/forms">Aprenda sobre componentes complexos como Forms</router-link>
                </li>
            </ul>
        </section>

        <section class="doc-section">
            <h2>Requisitos</h2>
            <ul>
                <li><strong>Vue:</strong> 3.4+</li>
                <li><strong>Node.js:</strong> 20.19+ (recomendado: 24.12 LTS)</li>
                <li><strong>TypeScript:</strong> 5.0+ (opcional, mas recomendado)</li>
            </ul>
        </section>
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
        margin-bottom: var(--spacing-2xl);
    }

    .doc-section {
        margin-bottom: var(--spacing-2xl);

        h2 {
            color: var(--color-primary);
            margin-bottom: var(--spacing-md);
            padding-bottom: var(--spacing-sm);
            border-bottom: 2px solid var(--color-border);
        }

        h3 {
            margin-top: var(--spacing-xl);
            margin-bottom: var(--spacing-md);
            color: var(--color-text);
        }

        p {
            line-height: 1.6;
            margin-bottom: var(--spacing-md);
        }

        ul,
        ol {
            margin-left: var(--spacing-lg);
            margin-bottom: var(--spacing-md);

            li {
                margin-bottom: var(--spacing-sm);
                line-height: 1.6;
            }
        }

        pre {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            overflow-x: auto;
            margin-bottom: var(--spacing-md);

            code {
                font-family: 'Courier New', monospace;
                font-size: var(--font-size-sm);
                line-height: 1.5;
                color: var(--color-text);
            }
        }

        code {
            background: var(--color-surface);
            padding: 0.2em 0.4em;
            border-radius: var(--radius-sm);
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        .note {
            background: hsl(var(--color-info-h), var(--color-info-s), calc(var(--color-info-l) + 40%));
            border-left: 4px solid var(--color-info);
            padding: var(--spacing-md);
            border-radius: var(--radius-sm);
            margin-top: var(--spacing-md);
            font-size: var(--font-size-sm);
        }
    }

    a {
        color: var(--color-primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
