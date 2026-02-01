<script setup lang="ts">
import { ref } from 'vue'
import { Drawer } from '@/modules/Drawer'
import { Button, Input, Textarea, Card } from '@/shared/components'
import { useDisclosure } from '@/shared/composables'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'

// ============================================
// BASIC EXAMPLES - 4 Positions
// ============================================
const leftDrawer = ref(false)
const rightDrawer = ref(false)
const topDrawer = ref(false)
const bottomDrawer = ref(false)

// ============================================
// WITH HEADER/FOOTER
// ============================================
const drawerWithSlots = ref(false)

// ============================================
// WITH FORM
// ============================================
const formDrawer = ref(false)
const formData = ref({
    name: '',
    email: '',
    message: ''
})

const submitForm = () => {
    console.log('Form submitted:', formData.value)
    formDrawer.value = false
    // Reset form
    formData.value = { name: '', email: '', message: '' }
}

// ============================================
// PROGRAMMATIC (useDisclosure)
// ============================================
const { isOpen: programmaticOpen, open: openProgrammatic, close: closeProgrammatic } = useDisclosure()

// ============================================
// CUSTOM SIZES
// ============================================
const smallDrawer = ref(false)
const mediumDrawer = ref(false)
const largeDrawer = ref(false)
const fullHeightDrawer = ref(false)

// ============================================
// NO BACKDROP
// ============================================
const noBackdropDrawer = ref(false)

// ============================================
// NESTED DRAWERS
// ============================================
const outerDrawer = ref(false)
const innerDrawer = ref(false)

// ============================================
// CODE EXAMPLES
// ============================================
const basicCode = `<script setup>
import { ref } from 'vue'
import { Drawer, Button } from '@lugand/vue-ui-lib'

const isOpen = ref(false)
<\/script>

<template>
  <Button @click="isOpen = true">
    Open Drawer
  </Button>

  <Drawer v-model="isOpen" position="right">
    <h3>Drawer Content</h3>
    <p>This is a basic drawer example.</p>
  </Drawer>
</template>`

const withSlotsCode = `<template>
  <Drawer v-model="isOpen" position="right">
    <template #header>
      <h2>Drawer Title</h2>
    </template>

    <template #default>
      <p>Main content goes here...</p>
    </template>

    <template #footer>
      <Button @click="isOpen = false" variant="ghost">
        Cancel
      </Button>
      <Button @click="handleSubmit">
        Submit
      </Button>
    </template>
  </Drawer>
</template>`

const programmaticCode = `<script setup>
import { Drawer } from '@lugand/vue-ui-lib'
import { useDisclosure } from '@lugand/vue-ui-lib'

const { isOpen, open, close } = useDisclosure()
<\/script>

<template>
  <Button @click="open">Open Drawer</Button>

  <Drawer :model-value="isOpen" @update:model-value="isOpen = $event">
    <p>Drawer controlled by useDisclosure</p>
    <Button @click="close">Close</Button>
  </Drawer>
</template>`

const customSizeCode = `<template>
  <!-- Fixed width -->
  <Drawer v-model="isOpen" position="right" size="600px">
    <p>Wide drawer (600px)</p>
  </Drawer>

  <!-- Percentage -->
  <Drawer v-model="isOpen" position="left" size="30%">
    <p>30% of screen width</p>
  </Drawer>

  <!-- For top/bottom, size controls height -->
  <Drawer v-model="isOpen" position="bottom" size="50vh">
    <p>50% of viewport height</p>
  </Drawer>
</template>`
</script>

<template>
    <div class="drawers-view">
        <header class="view-header">
            <h1>Drawer Component</h1>
            <p class="subtitle">
                Slide-in panels para navegação, filtros, formulários e conteúdo lateral. Usa
                <code>useDisclosure</code> internamente.
            </p>
        </header>

        <!-- ============================================ -->
        <!-- BASIC - 4 POSITIONS -->
        <!-- ============================================ -->
        <ComponentShowcase title="Basic - 4 Positions">
            <template #description>
                Drawer pode ser posicionado em 4 direções: <code>left</code>, <code>right</code>,
                <code>top</code>, <code>bottom</code>.
            </template>

            <template #preview>
                <div class="example-grid">
                    <Button @click="leftDrawer = true" variant="outline">
                        ← Open Left
                    </Button>
                    <Button @click="rightDrawer = true" variant="outline">
                        Open Right →
                    </Button>
                    <Button @click="topDrawer = true" variant="outline">
                        ↑ Open Top
                    </Button>
                    <Button @click="bottomDrawer = true" variant="outline">
                        ↓ Open Bottom
                    </Button>
                </div>

                <!-- Drawers -->
                <Drawer v-model="leftDrawer" position="left">
                    <h3>Left Drawer</h3>
                    <p>This drawer slides in from the left side.</p>
                    <Button @click="leftDrawer = false" style="margin-top: 1rem;">
                        Close
                    </Button>
                </Drawer>

                <Drawer v-model="rightDrawer" position="right">
                    <h3>Right Drawer</h3>
                    <p>This drawer slides in from the right side.</p>
                    <Button @click="rightDrawer = false" style="margin-top: 1rem;">
                        Close
                    </Button>
                </Drawer>

                <Drawer v-model="topDrawer" position="top" size="300px">
                    <h3>Top Drawer</h3>
                    <p>This drawer slides in from the top.</p>
                    <Button @click="topDrawer = false" style="margin-top: 1rem;">
                        Close
                    </Button>
                </Drawer>

                <Drawer v-model="bottomDrawer" position="bottom" size="300px">
                    <h3>Bottom Drawer</h3>
                    <p>This drawer slides in from the bottom.</p>
                    <Button @click="bottomDrawer = false" style="margin-top: 1rem;">
                        Close
                    </Button>
                </Drawer>
            </template>

            <template #code>
                <CodeBlock :code="basicCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- WITH HEADER / FOOTER -->
        <!-- ============================================ -->
        <ComponentShowcase title="With Header & Footer">
            <template #description>
                Use os slots <code>header</code> e <code>footer</code> para criar drawers estruturados.
                O header inclui automaticamente um botão de fechar.
            </template>

            <template #preview>
                <Button @click="drawerWithSlots = true">
                    Open Drawer with Slots
                </Button>

                <Drawer v-model="drawerWithSlots" position="right">
                    <template #header>
                        <h2 style="margin: 0; font-size: 1.25rem;">Settings</h2>
                    </template>

                    <template #default>
                        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                            <div>
                                <h3 style="margin-bottom: 0.5rem;">Appearance</h3>
                                <p style="color: var(--color-text-secondary); margin: 0;">
                                    Customize how the app looks and feels.
                                </p>
                            </div>

                            <div>
                                <h3 style="margin-bottom: 0.5rem;">Notifications</h3>
                                <p style="color: var(--color-text-secondary); margin: 0;">
                                    Manage your notification preferences.
                                </p>
                            </div>

                            <div>
                                <h3 style="margin-bottom: 0.5rem;">Privacy</h3>
                                <p style="color: var(--color-text-secondary); margin: 0;">
                                    Control your privacy settings.
                                </p>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <Button @click="drawerWithSlots = false" variant="ghost">
                            Cancel
                        </Button>
                        <Button @click="drawerWithSlots = false">
                            Save Changes
                        </Button>
                    </template>
                </Drawer>
            </template>

            <template #code>
                <CodeBlock :code="withSlotsCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- WITH FORM -->
        <!-- ============================================ -->
        <ComponentShowcase title="With Form">
            <template #description>
                Drawer é perfeito para formulários laterais.
            </template>

            <template #preview>
                <Button @click="formDrawer = true">
                    Open Contact Form
                </Button>

                <Drawer v-model="formDrawer" position="right" size="500px">
                    <template #header>
                        <h2 style="margin: 0; font-size: 1.25rem;">Contact Us</h2>
                    </template>

                    <template #default>
                        <form @submit.prevent="submitForm" style="display: flex; flex-direction: column; gap: 1rem;">
                            <div>
                                <label for="drawer-name"
                                    style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                                    Name
                                </label>
                                <Input id="drawer-name" v-model="formData.name" placeholder="Enter your name"
                                    required />
                            </div>

                            <div>
                                <label for="drawer-email"
                                    style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                                    Email
                                </label>
                                <Input id="drawer-email" v-model="formData.email" type="email"
                                    placeholder="you@example.com" required />
                            </div>

                            <div>
                                <label for="drawer-message"
                                    style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
                                    Message
                                </label>
                                <Textarea id="drawer-message" v-model="formData.message" placeholder="Your message..."
                                    :rows="5" required />
                            </div>
                        </form>
                    </template>

                    <template #footer>
                        <Button @click="formDrawer = false" variant="ghost">
                            Cancel
                        </Button>
                        <Button @click="submitForm">
                            Send Message
                        </Button>
                    </template>
                </Drawer>
            </template>

            <template #code>
                <CodeBlock :code="basicCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- PROGRAMMATIC (useDisclosure) -->
        <!-- ============================================ -->
        <ComponentShowcase title="Programmatic Control">
            <template #description>
                Use o composable <code>useDisclosure</code> para controle programático avançado.
            </template>

            <template #preview>
                <div style="display: flex; gap: 0.5rem;">
                    <Button @click="openProgrammatic">
                        Open (useDisclosure)
                    </Button>
                    <Button @click="closeProgrammatic" variant="outline">
                        Close (useDisclosure)
                    </Button>
                </div>

                <Drawer :model-value="programmaticOpen" @update:model-value="programmaticOpen = $event"
                    position="right">
                    <template #header>
                        <h2 style="margin: 0; font-size: 1.25rem;">Controlled by useDisclosure</h2>
                    </template>

                    <p>Este drawer é controlado programaticamente usando o composable <code>useDisclosure</code>.</p>

                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                        <Button @click="closeProgrammatic">
                            Close via Composable
                        </Button>
                    </div>
                </Drawer>
            </template>

            <template #code>
                <CodeBlock :code="programmaticCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- CUSTOM SIZES -->
        <!-- ============================================ -->
        <ComponentShowcase title="Custom Sizes">
            <template #description>
                Customize o tamanho do drawer com <code>size</code> prop (aceita px, %, rem, vh, etc).
            </template>

            <template #preview>
                <div class="example-grid">
                    <Button @click="smallDrawer = true" variant="outline">
                        Small (250px)
                    </Button>
                    <Button @click="mediumDrawer = true" variant="outline">
                        Medium (400px - default)
                    </Button>
                    <Button @click="largeDrawer = true" variant="outline">
                        Large (600px)
                    </Button>
                    <Button @click="fullHeightDrawer = true" variant="outline">
                        Full Height (100vh)
                    </Button>
                </div>

                <Drawer v-model="smallDrawer" position="right" size="250px">
                    <h3>Small Drawer</h3>
                    <p>Width: 250px</p>
                </Drawer>

                <Drawer v-model="mediumDrawer" position="right" size="400px">
                    <h3>Medium Drawer</h3>
                    <p>Width: 400px (default)</p>
                </Drawer>

                <Drawer v-model="largeDrawer" position="right" size="600px">
                    <h3>Large Drawer</h3>
                    <p>Width: 600px</p>
                </Drawer>

                <Drawer v-model="fullHeightDrawer" position="bottom" size="100vh">
                    <h3>Full Height Drawer</h3>
                    <p>Height: 100vh (full screen)</p>
                    <Button @click="fullHeightDrawer = false" style="margin-top: 1rem;">
                        Close
                    </Button>
                </Drawer>
            </template>

            <template #code>
                <CodeBlock :code="customSizeCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- NO BACKDROP -->
        <!-- ============================================ -->
        <ComponentShowcase title="Without Backdrop">
            <template #description>
                Desabilite o backdrop para um drawer mais sutil.
            </template>

            <template #preview>
                <Button @click="noBackdropDrawer = true" variant="outline">
                    Open (No Backdrop)
                </Button>

                <Drawer v-model="noBackdropDrawer" position="right" :backdrop="false">
                    <template #header>
                        <h2 style="margin: 0; font-size: 1.25rem;">No Backdrop</h2>
                    </template>

                    <p>Este drawer não possui backdrop overlay.</p>
                    <p>Útil quando você quer que o usuário possa interagir com a página principal.</p>
                </Drawer>
            </template>

            <template #code>
                <CodeBlock :code="basicCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- NESTED DRAWERS -->
        <!-- ============================================ -->
        <ComponentShowcase title="Nested Drawers">
            <template #description>
                Drawers podem ser aninhados (z-index automático).
            </template>

            <template #preview>
                <Button @click="outerDrawer = true">
                    Open Outer Drawer
                </Button>

                <Drawer v-model="outerDrawer" position="right">
                    <template #header>
                        <h2 style="margin: 0; font-size: 1.25rem;">Outer Drawer</h2>
                    </template>

                    <p>Este é o drawer externo.</p>
                    <Button @click="innerDrawer = true" style="margin-top: 1rem;">
                        Open Inner Drawer
                    </Button>

                    <!-- Nested Drawer -->
                    <Drawer v-model="innerDrawer" position="right" :z-index="1100" size="350px">
                        <template #header>
                            <h2 style="margin: 0; font-size: 1.25rem;">Inner Drawer</h2>
                        </template>

                        <p>Este é o drawer interno (aninhado).</p>
                        <p>Note que ele possui um z-index maior.</p>

                        <Button @click="innerDrawer = false" style="margin-top: 1rem;">
                            Close Inner
                        </Button>
                    </Drawer>
                </Drawer>
            </template>

            <template #code>
                <CodeBlock :code="basicCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- API REFERENCE -->
        <!-- ============================================ -->
        <Card class="api-reference">
            <h2>API Reference</h2>

            <section>
                <h3>Props</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>modelValue</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Controla se o drawer está aberto (v-model)</td>
                        </tr>
                        <tr>
                            <td><code>position</code></td>
                            <td><code>'left' | 'right' | 'top' | 'bottom'</code></td>
                            <td><code>'right'</code></td>
                            <td>Posição do drawer</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td><code>string | number</code></td>
                            <td><code>'400px'</code></td>
                            <td>Tamanho do drawer (width para left/right, height para top/bottom)</td>
                        </tr>
                        <tr>
                            <td><code>backdrop</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Mostrar backdrop overlay</td>
                        </tr>
                        <tr>
                            <td><code>closeOnOverlay</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Fechar ao clicar no backdrop</td>
                        </tr>
                        <tr>
                            <td><code>closeOnEsc</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Fechar ao pressionar ESC</td>
                        </tr>
                        <tr>
                            <td><code>disableScrollLock</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Desabilitar scroll lock quando aberto</td>
                        </tr>
                        <tr>
                            <td><code>zIndex</code></td>
                            <td><code>number</code></td>
                            <td><code>1000</code></td>
                            <td>Z-index customizado (útil para drawers aninhados)</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h3>Events</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Payload</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>update:modelValue</code></td>
                            <td><code>boolean</code></td>
                            <td>Emitido quando o estado do drawer muda</td>
                        </tr>
                        <tr>
                            <td><code>open</code></td>
                            <td>-</td>
                            <td>Emitido quando o drawer abre</td>
                        </tr>
                        <tr>
                            <td><code>close</code></td>
                            <td>-</td>
                            <td>Emitido quando o drawer fecha</td>
                        </tr>
                        <tr>
                            <td><code>after-open</code></td>
                            <td>-</td>
                            <td>Emitido após a transição de abertura completar</td>
                        </tr>
                        <tr>
                            <td><code>after-close</code></td>
                            <td>-</td>
                            <td>Emitido após a transição de fechamento completar</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h3>Slots</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Slot</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>default</code></td>
                            <td>Conteúdo principal do drawer (body)</td>
                        </tr>
                        <tr>
                            <td><code>header</code></td>
                            <td>Header do drawer (inclui botão de fechar automaticamente)</td>
                        </tr>
                        <tr>
                            <td><code>footer</code></td>
                            <td>Footer do drawer (normalmente com ações/botões)</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </Card>
    </div>
</template>

<style scoped lang="scss">
.drawers-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    padding: var(--spacing-2xl);
}

.view-header {
    h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text-primary);
    }

    .subtitle {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        margin: 0;

        code {
            background: var(--color-bg-secondary);
            padding: 0.125rem 0.375rem;
            border-radius: var(--radius-sm);
            font-size: 0.9em;
            color: var(--color-primary);
        }
    }
}

.example-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
}

.api-reference {
    section {
        margin-bottom: var(--spacing-xl);

        &:last-child {
            margin-bottom: 0;
        }

        h3 {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-semibold);
            margin: 0 0 var(--spacing-md) 0;
            color: var(--color-text-primary);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: var(--font-size-sm);

            th,
            td {
                text-align: left;
                padding: var(--spacing-sm) var(--spacing-md);
                border-bottom: 1px solid var(--color-border-base);
            }

            th {
                font-weight: var(--font-weight-semibold);
                color: var(--color-text-secondary);
                background: var(--color-bg-secondary);
            }

            code {
                background: var(--color-bg-secondary);
                padding: 0.125rem 0.375rem;
                border-radius: var(--radius-sm);
                font-size: 0.9em;
                color: var(--color-primary);
                white-space: nowrap;
            }
        }
    }
}
</style>
