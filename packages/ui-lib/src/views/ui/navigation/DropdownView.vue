<script setup lang="ts">
import { ref } from 'vue'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'
import { Dropdown, DropdownItem, type DropdownPlacement } from '@/modules/Dropdown'

// Para o showcase de controle manual
const manualDropdownOpen = ref(false)

// Navegação entre showcases
const currentShowcase = ref(1)
const showcaseNames = [
    'Menu do Usuário',
    'Menu de Ações',
    'Posicionamentos',
    'Modos de Ativação',
    'Conteúdo Customizado',
    'Variantes'
]

const previousShowcase = () => {
    if (currentShowcase.value > 1) currentShowcase.value--
}

const nextShowcase = () => {
    if (currentShowcase.value < 6) currentShowcase.value++
}

// Handlers de exemplo
const handleProfile = () => { /* Ver perfil */ }
const handleSettings = () => { /* Configurações */ }
const handleLogout = () => { /* Sair */ }

const handleEdit = () => { /* Editar */ }
const handleDuplicate = () => { /* Duplicar */ }
const handleDelete = () => { /* Deletar */ }

// Dados para o showcase de notificações
const notifications = [
    { id: 1, text: 'Nova mensagem de João', time: '2 min atrás' },
    { id: 2, text: 'Seu relatório foi aprovado', time: '1 hora atrás' },
    { id: 3, text: 'Atualização do sistema disponível', time: '3 horas atrás' }
]
</script>

<template>
    <div class="dropdown-view">
        <!-- Showcase 1: Menu do Usuário -->
        <ComponentShowcase v-show="currentShowcase === 1" title="Menu do Usuário"
            description="Dropdown típico de menu de usuário com ícones e ações comuns">
            <template #preview>
                <div style="padding: 2rem; display: flex; justify-content: center;">
                    <Dropdown placement="bottom-end">
                        <template #trigger>
                            <button class="demo-button">
                                👤 Minha Conta
                            </button>
                        </template>

                        <DropdownItem icon="👤" label="Ver Perfil" @click="handleProfile" />
                        <DropdownItem icon="⚙️" label="Configurações" @click="handleSettings" />
                        <DropdownItem divider />
                        <DropdownItem icon="🚪" label="Sair" danger @click="handleLogout" />
                    </Dropdown>
                </div>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`&lt;Dropdown placement=&quot;bottom-end&quot;&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;👤 Minha Conta&lt;/button&gt;
  &lt;/template&gt;

  &lt;DropdownItem icon=&quot;👤&quot; label=&quot;Ver Perfil&quot; @click=&quot;handleProfile&quot; /&gt;
  &lt;DropdownItem icon=&quot;⚙️&quot; label=&quot;Configurações&quot; @click=&quot;handleSettings&quot; /&gt;
  &lt;DropdownItem divider /&gt;
  &lt;DropdownItem icon=&quot;🚪&quot; label=&quot;Sair&quot; danger @click=&quot;handleLogout&quot; /&gt;
&lt;/Dropdown&gt;`" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 2: Menu de Ações -->
        <ComponentShowcase v-show="currentShowcase === 2" title="Menu de Ações"
            description="Dropdown de ações contextuais com item de perigo">
            <template #preview>
                <div style="padding: 2rem; display: flex; justify-content: center;">
                    <Dropdown placement="bottom-start">
                        <template #trigger>
                            <button class="demo-button">
                                ⋮ Ações
                            </button>
                        </template>

                        <DropdownItem icon="✏️" label="Editar" @click="handleEdit" />
                        <DropdownItem icon="📋" label="Duplicar" @click="handleDuplicate" />
                        <DropdownItem icon="📥" label="Exportar" />
                        <DropdownItem divider />
                        <DropdownItem icon="🗑️" label="Deletar" danger @click="handleDelete" />
                    </Dropdown>
                </div>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`&lt;Dropdown placement=&quot;bottom-start&quot;&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;⋮ Ações&lt;/button&gt;
  &lt;/template&gt;

  &lt;DropdownItem icon=&quot;✏️&quot; label=&quot;Editar&quot; @click=&quot;handleEdit&quot; /&gt;
  &lt;DropdownItem icon=&quot;📋&quot; label=&quot;Duplicar&quot; @click=&quot;handleDuplicate&quot; /&gt;
  &lt;DropdownItem icon=&quot;📥&quot; label=&quot;Exportar&quot; /&gt;
  &lt;DropdownItem divider /&gt;
  &lt;DropdownItem icon=&quot;🗑️&quot; label=&quot;Deletar&quot; danger @click=&quot;handleDelete&quot; /&gt;
&lt;/Dropdown&gt;`" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 3: Posicionamentos -->
        <ComponentShowcase v-show="currentShowcase === 3" title="Posicionamentos"
            description="Todas as 12 posições disponíveis para o dropdown">
            <template #preview>
                <div style="padding: 3rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
                    <div v-for="placement in ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end', 'left-start', 'left', 'left-end', 'right-start', 'right', 'right-end'] as DropdownPlacement[]"
                        :key="placement" style="display: flex; justify-content: center;">
                        <Dropdown :placement="placement">
                            <template #trigger>
                                <button class="demo-button-small">
                                    {{ placement }}
                                </button>
                            </template>
                            <DropdownItem :label="`Dropdown ${placement}`" />
                            <DropdownItem label="Item 2" />
                            <DropdownItem label="Item 3" />
                        </Dropdown>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`&lt;!-- 12 posicionamentos disponíveis --&gt;
&lt;Dropdown placement=&quot;top-start&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;top&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;top-end&quot;&gt;...&lt;/Dropdown&gt;

&lt;Dropdown placement=&quot;bottom-start&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;bottom&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;bottom-end&quot;&gt;...&lt;/Dropdown&gt;

&lt;Dropdown placement=&quot;left-start&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;left&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;left-end&quot;&gt;...&lt;/Dropdown&gt;

&lt;Dropdown placement=&quot;right-start&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;right&quot;&gt;...&lt;/Dropdown&gt;
&lt;Dropdown placement=&quot;right-end&quot;&gt;...&lt;/Dropdown&gt;`" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 4: Modos de Ativação -->
        <ComponentShowcase v-show="currentShowcase === 4" title="Modos de Ativação"
            description="Click, hover e controle manual">
            <template #preview>
                <div style="padding: 2rem; display: flex; gap: 2rem; justify-content: center;">
                    <!-- Click -->
                    <Dropdown trigger="click">
                        <template #trigger>
                            <button class="demo-button">
                                🖱️ Click
                            </button>
                        </template>
                        <DropdownItem label="Abre ao clicar" />
                        <DropdownItem label="Fecha ao clicar fora" />
                    </Dropdown>

                    <!-- Hover -->
                    <Dropdown trigger="hover">
                        <template #trigger>
                            <button class="demo-button">
                                ✋ Hover
                            </button>
                        </template>
                        <DropdownItem label="Abre ao passar o mouse" />
                        <DropdownItem label="Fecha ao sair" />
                    </Dropdown>

                    <!-- Manual -->
                    <Dropdown trigger="manual" v-model="manualDropdownOpen">
                        <template #trigger>
                            <button class="demo-button" @click="manualDropdownOpen = !manualDropdownOpen">
                                ⚙️ Manual
                            </button>
                        </template>
                        <DropdownItem label="Controlado por v-model" />
                        <DropdownItem label="Você controla quando abre/fecha" />
                    </Dropdown>
                </div>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`&lt;!-- Modo Click (padrão) --&gt;
&lt;Dropdown trigger=&quot;click&quot;&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;Click&lt;/button&gt;
  &lt;/template&gt;
  &lt;DropdownItem label=&quot;Abre ao clicar&quot; /&gt;
&lt;/Dropdown&gt;

&lt;!-- Modo Hover --&gt;
&lt;Dropdown trigger=&quot;hover&quot;&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;Hover&lt;/button&gt;
  &lt;/template&gt;
  &lt;DropdownItem label=&quot;Abre ao passar o mouse&quot; /&gt;
&lt;/Dropdown&gt;

&lt;!-- Modo Manual --&gt;
&lt;Dropdown trigger=&quot;manual&quot; v-model=&quot;isOpen&quot;&gt;
  &lt;template #trigger&gt;
    &lt;button @click=&quot;isOpen = !isOpen&quot;&gt;Manual&lt;/button&gt;
  &lt;/template&gt;
  &lt;DropdownItem label=&quot;Controlado por v-model&quot; /&gt;
&lt;/Dropdown&gt;`" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 5: Conteúdo Customizado -->
        <ComponentShowcase v-show="currentShowcase === 5" title="Conteúdo Customizado"
            description="Slots flexíveis permitem qualquer tipo de conteúdo">
            <template #preview>
                <div style="padding: 2rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
                    <!-- Notificações -->
                    <Dropdown placement="bottom-end" :max-width="'350px'">
                        <template #trigger>
                            <button class="demo-button">
                                🔔 Notificações (3)
                            </button>
                        </template>
                        <div style="padding: 0.5rem;">
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">
                                Notificações Recentes
                            </h4>
                            <div v-for="notif in notifications" :key="notif.id"
                                style="padding: 0.5rem; border-radius: 4px; margin-bottom: 0.5rem; background: var(--color-bg-secondary);">
                                <p style="margin: 0; font-size: 0.875rem; font-weight: 500;">
                                    {{ notif.text }}
                                </p>
                                <p style="margin: 0.25rem 0 0; font-size: 0.75rem; opacity: 0.7;">
                                    {{ notif.time }}
                                </p>
                            </div>
                        </div>
                    </Dropdown>

                    <!-- Perfil com Imagem -->
                    <Dropdown placement="bottom-start" variant="card">
                        <template #trigger>
                            <button class="demo-button">
                                👨‍💼 Ver Perfil
                            </button>
                        </template>
                        <div style="text-align: center; padding: 0.5rem;">
                            <div
                                style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto 0.5rem;">
                            </div>
                            <h3 style="margin: 0; font-size: 1rem; font-weight: 600;">João Silva</h3>
                            <p style="margin: 0.25rem 0 0; font-size: 0.875rem; opacity: 0.7;">joao@exemplo.com</p>
                        </div>
                    </Dropdown>

                    <!-- Form Rápido -->
                    <Dropdown placement="bottom" variant="card" :max-width="'300px'" trigger="manual"
                        v-model="manualDropdownOpen">
                        <template #trigger>
                            <button class="demo-button" @click="manualDropdownOpen = !manualDropdownOpen">
                                ✉️ Enviar Email
                            </button>
                        </template>
                        <div style="padding: 0.5rem;">
                            <input type="email" placeholder="email@exemplo.com"
                                style="width: 100%; margin-bottom: 0.5rem;" />
                            <textarea placeholder="Sua mensagem..." rows="3"
                                style="width: 100%; margin-bottom: 0.5rem;"></textarea>
                            <button class="demo-button" style="width: 100%;" @click="manualDropdownOpen = false">
                                Enviar
                            </button>
                        </div>
                    </Dropdown>
                </div>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`&lt;!-- Qualquer conteúdo via slot padrão --&gt;
&lt;Dropdown&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;🔔 Notificações&lt;/button&gt;
  &lt;/template&gt;
  
  &lt;!-- Conteúdo customizado --&gt;
  &lt;div style=&quot;padding: 0.5rem;&quot;&gt;
    &lt;h4&gt;Notificações Recentes&lt;/h4&gt;
    &lt;div&gt;Lista de notificações&lt;/div&gt;
  &lt;/div&gt;
&lt;/Dropdown&gt;`" />
            </template>
        </ComponentShowcase>

        <!-- Showcase 6: Variantes -->
        <ComponentShowcase v-show="currentShowcase === 6" title="Variantes Visuais"
            description="4 estilos diferentes para diferentes contextos">
            <template #preview>
                <div style="padding: 2rem; display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
                    <div style="text-align: center;">
                        <p style="margin-bottom: 1rem; font-weight: 600;">Default</p>
                        <Dropdown variant="default">
                            <template #trigger>
                                <button class="demo-button">Default</button>
                            </template>
                            <DropdownItem label="Padding normal" />
                            <DropdownItem label="Estilo padrão" />
                        </Dropdown>
                    </div>

                    <div style="text-align: center;">
                        <p style="margin-bottom: 1rem; font-weight: 600;">Menu</p>
                        <Dropdown variant="menu">
                            <template #trigger>
                                <button class="demo-button">Menu</button>
                            </template>
                            <DropdownItem label="Padding compacto" />
                            <DropdownItem label="Para menus" />
                        </Dropdown>
                    </div>

                    <div style="text-align: center;">
                        <p style="margin-bottom: 1rem; font-weight: 600;">Card</p>
                        <Dropdown variant="card">
                            <template #trigger>
                                <button class="demo-button">Card</button>
                            </template>
                            <DropdownItem label="Padding generoso" />
                            <DropdownItem label="Para conteúdo rico" />
                        </Dropdown>
                    </div>

                    <div style="text-align: center;">
                        <p style="margin-bottom: 1rem; font-weight: 600;">Minimal</p>
                        <Dropdown variant="minimal">
                            <template #trigger>
                                <button class="demo-button">Minimal</button>
                            </template>
                            <DropdownItem label="Sem padding extra" />
                            <DropdownItem label="Conteúdo customizado" />
                        </Dropdown>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`&lt;!-- Variante Default (padrão) --&gt;
&lt;Dropdown variant=&quot;default&quot;&gt;...&lt;/Dropdown&gt;

&lt;!-- Variante Menu (compacta) --&gt;
&lt;Dropdown variant=&quot;menu&quot;&gt;...&lt;/Dropdown&gt;

&lt;!-- Variante Card (espaçosa) --&gt;
&lt;Dropdown variant=&quot;card&quot;&gt;...&lt;/Dropdown&gt;

&lt;!-- Variante Minimal (sem padding) --&gt;
&lt;Dropdown variant=&quot;minimal&quot;&gt;...&lt;/Dropdown&gt;`" />
            </template>
        </ComponentShowcase>

        <!-- Navegação entre showcases -->
        <div class="showcase-navigation">
            <button @click="previousShowcase" :disabled="currentShowcase === 1" class="nav-button">
                ← Voltar
            </button>
            <span class="showcase-indicator">
                {{ currentShowcase }} de {{ showcaseNames.length }} - {{ showcaseNames[currentShowcase - 1] }}
            </span>
            <button @click="nextShowcase" :disabled="currentShowcase === 6" class="nav-button">
                Continuar para {{ showcaseNames[currentShowcase] || 'Fim' }} →
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dropdown-view {
    padding: var(--spacing-lg);
}

.showcase-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
}

.nav-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-fast);

    &:hover:not(:disabled) {
        background: var(--color-primary-dark);
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.showcase-indicator {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
}

.demo-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-sm);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
        background: var(--color-bg-secondary);
        border-color: var(--color-primary);
    }
}

.demo-button-small {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-sm);
    color: var(--color-text-primary);
    font-size: var(--font-size-xs);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
        background: var(--color-bg-secondary);
        border-color: var(--color-primary);
    }
}
</style>
