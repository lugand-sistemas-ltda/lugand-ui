<script setup lang="ts">
/**
 * ThemingView - Documentação sobre sistema de temas
 * Teoria, conceitos e guia de uso dos design tokens
 */
</script>

<template>
    <div class="view-container">
        <h1>📚 Theming - Documentation</h1>
        <p class="view-description">
            Sistema de temas e design tokens: conceitos, arquitetura e boas práticas
        </p>

        <section class="doc-section">
            <h2>Visão Geral</h2>
            <p>
                O sistema de temas da UI Lib é baseado em <strong>CSS Custom Properties (variáveis CSS)</strong>
                e utiliza o espaço de cores <strong>HSL</strong> para permitir variações dinâmicas e acessíveis.
            </p>
            <p>
                Cada tema define um conjunto de tokens de design que controlam cores, espaçamentos,
                tipografia, sombras e outros aspectos visuais da interface.
            </p>
        </section>

        <section class="doc-section">
            <h2>Design Tokens</h2>
            <p>Os principais tokens utilizados no sistema:</p>

            <h3>Cores</h3>
            <pre><code>// Cores principais
--color-primary
--color-secondary
--color-accent

// Cores de estado
--color-success
--color-warning
--color-danger
--color-info

// Cores de texto
--color-text
--color-text-secondary
--color-text-inverse

// Cores de fundo
--color-background
--color-surface
--color-border</code></pre>

            <h3>Espaçamentos</h3>
            <pre><code>--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 3rem</code></pre>

            <h3>Tipografia</h3>
            <pre><code>--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-md: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
--font-size-2xl: 1.5rem

--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-bold: 700</code></pre>

            <h3>Outros Tokens</h3>
            <pre><code>// Bordas
--radius-sm: 0.25rem
--radius-md: 0.5rem
--radius-lg: 1rem
--radius-full: 9999px

// Sombras
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15)</code></pre>
        </section>

        <section class="doc-section">
            <h2>Usando Temas</h2>
            <p>Você pode alterar o tema usando o composable <code>useTheme</code>:</p>
            <pre><code>&lt;script setup lang="ts"&gt;
import { useTheme } from '@lugand/ui-lib'

const { currentTheme, setTheme, themes } = useTheme()

// Alterar para tema dark
setTheme('dark')

// Alterar para tema cyberpunk
setTheme('cyberpunk')
&lt;/script&gt;</code></pre>
        </section>

        <section class="doc-section">
            <h2>Criando um Tema Customizado</h2>
            <p>Para criar seu próprio tema, defina as variáveis CSS em um arquivo SCSS:</p>
            <pre><code>// meu-tema.scss
[data-theme="meu-tema"] {
  // Cores principais
  --color-primary-h: 210;
  --color-primary-s: 80%;
  --color-primary-l: 50%;
  
  --color-secondary-h: 180;
  --color-secondary-s: 60%;
  --color-secondary-l: 45%;
  
  --color-accent-h: 330;
  --color-accent-s: 70%;
  --color-accent-l: 55%;
  
  // Continue com as demais variáveis...
}</code></pre>
            <p>Depois registre o tema na configuração:</p>
            <pre><code>// themes.config.ts
export const customTheme = {
  id: 'meu-tema',
  name: 'Meu Tema',
  description: 'Tema personalizado da minha marca'
}

export const themes = [
  // ... temas existentes
  customTheme
]</code></pre>
        </section>

        <section class="doc-section">
            <h2>Modo Escuro (Dark Mode)</h2>
            <p>
                Todos os temas suportam modo claro e escuro. O tema 'dark' é otimizado
                especificamente para ambientes com pouca luz, reduzindo o brilho da tela
                e melhorando o contraste.
            </p>
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

    .themes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--spacing-md);
        margin: var(--spacing-lg) 0;
    }

    .theme-card {
        cursor: pointer;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        transition: all 0.2s ease;

        &:hover {
            border-color: var(--color-primary);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        &.active {
            border-color: var(--color-primary);
            background: hsl(var(--color-primary-h), var(--color-primary-s), calc(var(--color-primary-l) + 45%));
        }

        h4 {
            margin-top: var(--spacing-sm);
            text-align: center;
            font-size: var(--font-size-sm);
        }
    }

    .theme-preview {
        display: flex;
        gap: 4px;
        height: 60px;
        border-radius: var(--radius-sm);
        overflow: hidden;
        margin-bottom: var(--spacing-sm);

        .color-sample {
            flex: 1;
            transition: transform 0.2s ease;

            &:hover {
                transform: scale(1.05);
            }
        }
    }
}
</style>
