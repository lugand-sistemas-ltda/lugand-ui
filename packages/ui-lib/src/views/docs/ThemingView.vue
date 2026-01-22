<script setup lang="ts">
/**
 * ThemingView - Documentação sobre sistema de temas
 */
import { useTheme } from '@/shared/composables'
import { themeList } from '@/core/config/themes.config'
import type { ThemeName } from '@/core/types/theme.types'

const { currentTheme, setTheme } = useTheme()
const themes = themeList

// Cores representativas de cada tema para preview
// Ordem: Background → Text → Primary (títulos/links) → Border → Accent
const themeColors: Record<ThemeName, { background: string; text: string; primary: string; border: string; accent: string }> = {
    light: {
        background: 'hsl(0, 0%, 98%)', // neutral-50
        text: 'hsl(0, 0%, 10%)', // neutral-900
        primary: 'hsl(217, 91%, 60%)', // azul primario
        border: 'hsl(0, 0%, 88%)', // neutral-300
        accent: 'hsl(258, 90%, 63%)', // roxo secondary
    },
    dark: {
        background: 'hsl(0, 0%, 5%)', // neutral-50 dark
        text: 'hsl(0, 0%, 96%)', // neutral-900 dark
        primary: 'hsl(213, 94%, 70%)', // azul mais claro
        border: 'hsl(0, 0%, 15%)', // neutral-300 dark
        accent: 'hsl(250, 95%, 72%)', // roxo mais claro
    },
    ocean: {
        background: 'hsl(195, 100%, 99%)', // neutral-50 azulado
        text: 'hsl(195, 60%, 15%)', // neutral-900 azulado
        primary: 'hsl(199, 89%, 55%)', // cyan oceano
        border: 'hsl(195, 62%, 88%)', // neutral-300
        accent: 'hsl(180, 84%, 65%)', // teal
    },
    forest: {
        background: 'hsl(138, 100%, 99%)', // neutral-50 esverdeado
        text: 'hsl(138, 55%, 15%)', // neutral-900 esverdeado
        primary: 'hsl(142, 76%, 55%)', // verde floresta
        border: 'hsl(138, 55%, 87%)', // neutral-300
        accent: 'hsl(158, 64%, 65%)', // verde esmeralda
    },
    dracula: {
        background: 'hsl(231, 15%, 18%)', // dracula bg
        text: 'hsl(60, 30%, 96%)', // dracula fg
        primary: 'hsl(265, 89%, 78%)', // roxo dracula
        border: 'hsl(232, 14%, 31%)', // current line
        accent: 'hsl(326, 100%, 74%)', // pink dracula
    },
    cyberpunk: {
        background: 'hsl(253, 16%, 10%)', // roxo escuro
        text: 'hsl(60, 90%, 90%)', // amarelo pálido
        primary: 'hsl(58, 100%, 50%)', // amarelo neon
        border: 'hsl(253, 30%, 30%)', // roxo border
        accent: 'hsl(180, 100%, 50%)', // ciano neon
    },
    pcpr: {
        background: 'hsl(0, 0%, 100%)', // branco
        text: 'hsl(210, 100%, 20%)', // azul escuro institucional
        primary: 'hsl(210, 100%, 20%)', // azul PCPR
        border: 'hsl(210, 10%, 85%)', // cinza azulado
        accent: 'hsl(48, 100%, 50%)', // amarelo ouro
    },
    pretona: {
        background: 'hsl(0, 0%, 5%)', // preto fosco
        text: 'hsl(0, 0%, 100%)', // branco puro
        primary: 'hsl(345, 100%, 45%)', // vermelho carmim
        border: 'hsl(210, 6%, 20%)', // grafite
        accent: 'hsl(220, 100%, 50%)', // azul sirene
    },
    bombeiros: {
        background: 'hsl(211, 100%, 30%)', // azul institucional
        text: 'hsl(0, 0%, 100%)', // branco
        primary: 'hsl(48, 100%, 50%)', // amarelo alerta
        border: 'hsl(211, 50%, 40%)', // azul border
        accent: 'hsl(0, 100%, 45%)', // vermelho emergência
    },
}
</script>

<template>
    <div class="view-container">
        <h1>Theming</h1>
        <p class="view-description">Sistema de temas e design tokens da UI Lib</p>

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
            <h2>Temas Disponíveis</h2>
            <p>A biblioteca vem com {{ themes.length }} temas pré-configurados:</p>
            <div class="themes-grid">
                <div 
                    v-for="theme in themes" 
                    :key="theme.name"
                    class="theme-card"
                    :class="{ active: currentTheme === theme.name }"
                    @click="setTheme(theme.name)"
                >
                    <div class="theme-preview">
                        <div 
                            class="color-sample" 
                            :style="{ backgroundColor: themeColors[theme.name].background }"
                            title="Background"
                        ></div>
                        <div 
                            class="color-sample" 
                            :style="{ backgroundColor: themeColors[theme.name].text }"
                            title="Text"
                        ></div>
                        <div 
                            class="color-sample" 
                            :style="{ backgroundColor: themeColors[theme.name].primary }"
                            title="Primary (Links/Títulos)"
                        ></div>
                        <div 
                            class="color-sample" 
                            :style="{ backgroundColor: themeColors[theme.name].border }"
                            title="Border/Surface"
                        ></div>
                        <div 
                            class="color-sample" 
                            :style="{ backgroundColor: themeColors[theme.name].accent }"
                            title="Accent"
                        ></div>
                    </div>
                    <h4>{{ theme.displayName }}</h4>
                </div>
            </div>
            <p class="note">Clique em um tema para aplicá-lo em tempo real.</p>
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

        ul, ol {
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
