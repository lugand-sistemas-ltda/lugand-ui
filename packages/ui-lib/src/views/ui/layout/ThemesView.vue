<script setup lang="ts">
/**
 * ThemingView - Showcase visual dos temas disponíveis
 * Permite testar e visualizar todos os temas da biblioteca
 */
import { useTheme } from '@/shared/composables'
import { themeList } from '@/core/config/themes.config'
import type { ThemeName } from '@/core/types/theme.types'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'

const { currentTheme, setTheme } = useTheme()
const themes = themeList

// Cores representativas de cada tema para preview
const themeColors: Record<ThemeName, { background: string; text: string; primary: string; border: string; accent: string }> = {
    light: {
        background: 'hsl(0, 0%, 98%)',
        text: 'hsl(0, 0%, 10%)',
        primary: 'hsl(217, 91%, 60%)',
        border: 'hsl(0, 0%, 88%)',
        accent: 'hsl(258, 90%, 63%)',
    },
    dark: {
        background: 'hsl(0, 0%, 5%)',
        text: 'hsl(0, 0%, 96%)',
        primary: 'hsl(213, 94%, 70%)',
        border: 'hsl(0, 0%, 15%)',
        accent: 'hsl(250, 95%, 72%)',
    },
    ocean: {
        background: 'hsl(195, 100%, 99%)',
        text: 'hsl(195, 60%, 15%)',
        primary: 'hsl(199, 89%, 55%)',
        border: 'hsl(195, 62%, 88%)',
        accent: 'hsl(180, 84%, 65%)',
    },
    forest: {
        background: 'hsl(138, 100%, 99%)',
        text: 'hsl(138, 55%, 15%)',
        primary: 'hsl(142, 76%, 55%)',
        border: 'hsl(138, 55%, 87%)',
        accent: 'hsl(158, 64%, 65%)',
    },
    dracula: {
        background: 'hsl(231, 15%, 18%)',
        text: 'hsl(60, 30%, 96%)',
        primary: 'hsl(265, 89%, 78%)',
        border: 'hsl(232, 14%, 31%)',
        accent: 'hsl(326, 100%, 74%)',
    },
    cyberpunk: {
        background: 'hsl(253, 16%, 10%)',
        text: 'hsl(60, 90%, 90%)',
        primary: 'hsl(58, 100%, 50%)',
        border: 'hsl(253, 30%, 30%)',
        accent: 'hsl(180, 100%, 50%)',
    },
    pcpr: {
        background: 'hsl(0, 0%, 100%)',
        text: 'hsl(210, 100%, 20%)',
        primary: 'hsl(210, 100%, 20%)',
        border: 'hsl(210, 10%, 85%)',
        accent: 'hsl(48, 100%, 50%)',
    },
    pretona: {
        background: 'hsl(0, 0%, 5%)',
        text: 'hsl(0, 0%, 100%)',
        primary: 'hsl(345, 100%, 45%)',
        border: 'hsl(210, 6%, 20%)',
        accent: 'hsl(220, 100%, 50%)',
    },
    bombeiros: {
        background: 'hsl(211, 100%, 30%)',
        text: 'hsl(0, 0%, 100%)',
        primary: 'hsl(48, 100%, 50%)',
        border: 'hsl(211, 50%, 40%)',
        accent: 'hsl(0, 100%, 45%)',
    },
}

const usageCode = `<script setup lang="ts">
import { useTheme } from '@lugand/vue-ui-lib'

const { currentTheme, setTheme } = useTheme()

// Trocar tema
setTheme('dark')
setTheme('ocean')
setTheme('cyberpunk')

// Tema atual
console.log(currentTheme.value) // 'dark'
<\/script>

<template>
  <button @click="setTheme('dark')">
    Modo Escuro
  </button>
</template>`
</script>

<template>
    <div class="theming-view">
        <div class="view-header">
            <h1>🎨 Theming</h1>
            <p class="view-description">
                Explore e teste todos os temas disponíveis na biblioteca. Clique em um tema para aplicá-lo em tempo real.
            </p>
        </div>

        <!-- ============================================ -->
        <!-- SHOWCASE: Temas Disponíveis -->
        <!-- ============================================ -->
        <ComponentShowcase 
            title="Temas Disponíveis"
            description="A biblioteca vem com 9 temas pré-configurados para diferentes contextos e preferências visuais"
        >
            <template #preview>
                <div class="themes-grid">
                    <div 
                        v-for="theme in themes" 
                        :key="theme.name"
                        class="theme-card"
                        :class="{ active: currentTheme === theme.name }"
                        @click="setTheme(theme.name)"
                        role="button"
                        tabindex="0"
                        :aria-label="`Aplicar tema ${theme.displayName}`"
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
                                title="Primary"
                            ></div>
                            <div 
                                class="color-sample" 
                                :style="{ backgroundColor: themeColors[theme.name].border }"
                                title="Border"
                            ></div>
                            <div 
                                class="color-sample" 
                                :style="{ backgroundColor: themeColors[theme.name].accent }"
                                title="Accent"
                            ></div>
                        </div>
                        <h4>{{ theme.displayName }}</h4>
                        <div v-if="currentTheme === theme.name" class="active-badge">✓ Ativo</div>
                    </div>
                </div>
                <p class="note">
                    <strong>💡 Dica:</strong> O tema selecionado é aplicado imediatamente em toda a interface.
                    Experimente navegar pelas outras páginas para ver como cada tema afeta os componentes.
                </p>
            </template>

            <template #code>
                <CodeBlock :code="usageCode" language="typescript" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style scoped lang="scss">
.theming-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.view-header {
    h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-sm) 0;
    }

    .view-description {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;
    }
}

.themes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.theme-card {
    padding: var(--spacing-md);
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    &.active {
        border-color: var(--color-primary);
        background: var(--color-primary-bg);
        box-shadow: var(--shadow-lg);

        .active-badge {
            display: block;
        }
    }

    h4 {
        margin: var(--spacing-sm) 0 0 0;
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        text-align: center;
    }
}

.theme-preview {
    display: flex;
    gap: 2px;
    height: 60px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: var(--spacing-xs);
}

.color-sample {
    flex: 1;
    transition: transform 0.2s ease;

    &:hover {
        transform: scaleY(1.1);
    }
}

.active-badge {
    display: none;
    position: absolute;
    top: var(--spacing-xs);
    right: var(--spacing-xs);
    padding: 0.25rem 0.5rem;
    background: var(--color-success);
    color: white;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
}

.note {
    padding: var(--spacing-md);
    background: var(--color-primary-bg);
    border-left: 4px solid var(--color-primary);
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    margin: 0;
    font-size: var(--font-size-sm);
    line-height: 1.6;

    strong {
        color: var(--color-primary);
    }
}

@media (max-width: 768px) {
    .themes-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--spacing-md);
    }

    .theme-preview {
        height: 50px;
    }
}
</style>
