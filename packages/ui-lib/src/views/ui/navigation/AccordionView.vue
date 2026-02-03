<script setup lang="ts">
import { ref } from 'vue'
import { Accordion, AccordionItem } from '@/modules/Accordion'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'

// Estados para os showcases
const faqItems = ref<(string | number)[]>(['faq-1'])
const settingsItems = ref<(string | number)[]>([])
const productItems = ref<(string | number)[]>(['specs'])
</script>

<template>
    <div class="accordion-view">
        <h1>Accordion Component</h1>
        <p class="subtitle">Componente expansível para organizar conteúdo em seções colapsáveis.</p>

        <!-- SHOWCASE 1: FAQ -->
        <ComponentShowcase title="Exemplo 1: FAQ - Perguntas Frequentes"
            description="Accordion com múltiplos items expansíveis simultaneamente">
            <template #preview>
                <Accordion v-model="faqItems" variant="default" :multiple="true">
                    <AccordionItem id="faq-1" title="Como instalar a biblioteca?" icon="📦">
                        <p>Para instalar a biblioteca, use o npm ou yarn:</p>
                        <pre
                            style="background: var(--color-bg-secondary); padding: 1rem; border-radius: var(--radius-sm); margin-top: 0.5rem;">npm install @lugand/vue-ui-lib</pre>
                        <p style="margin-top: 0.5rem;">Depois importe os componentes que precisar no seu projeto Vue 3.
                        </p>
                    </AccordionItem>

                    <AccordionItem id="faq-2" title="Quais navegadores são suportados?" icon="🌐">
                        <p>A biblioteca suporta todos os navegadores modernos:</p>
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                            <li>Chrome 90+</li>
                            <li>Firefox 88+</li>
                            <li>Safari 14+</li>
                            <li>Edge 90+</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">Não há suporte para Internet Explorer.</p>
                    </AccordionItem>

                    <AccordionItem id="faq-3" title="A biblioteca é gratuita?" icon="💰">
                        <p>Sim! A biblioteca é 100% gratuita e open-source sob licença MIT.</p>
                        <p style="margin-top: 0.5rem;">Você pode usar em projetos pessoais e comerciais sem custo.</p>
                    </AccordionItem>

                    <AccordionItem id="faq-4" title="Preciso de conhecimento em TypeScript?" icon="📘">
                        <p>Não é obrigatório, mas recomendado! A biblioteca oferece:</p>
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                            <li>✅ Tipagem completa em TypeScript</li>
                            <li>✅ Intellisense no VS Code</li>
                            <li>✅ Autocomplete de props</li>
                            <li>✅ Validação de tipos em tempo de desenvolvimento</li>
                        </ul>
                        <p style="margin-top: 0.5rem;">Mas você pode usar com JavaScript puro também!</p>
                    </AccordionItem>

                    <AccordionItem id="faq-5" title="Como reportar bugs?" icon="🐛">
                        <p>Para reportar bugs, abra uma issue no GitHub:</p>
                        <ol style="margin-top: 0.5rem; padding-left: 1.5rem;">
                            <li>Acesse o repositório no GitHub</li>
                            <li>Clique em "Issues" → "New Issue"</li>
                            <li>Descreva o problema com detalhes</li>
                            <li>Inclua código de exemplo, se possível</li>
                        </ol>
                    </AccordionItem>
                </Accordion>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`<script setup>
import { ref } from 'vue'
import { Accordion, AccordionItem } from '@lugand/vue-ui-lib'

const activeItems = ref(['faq-1'])
&lt;/script&gt;

<template>
  <Accordion v-model=&quot;activeItems&quot; :multiple=&quot;true&quot;>
    <AccordionItem id=&quot;faq-1&quot; title=&quot;Como instalar?&quot; icon=&quot;📦&quot;>
      <p>Para instalar...</p>
    </AccordionItem>
    
    <AccordionItem id=&quot;faq-2&quot; title=&quot;Navegadores?&quot; icon=&quot;🌐&quot;>
      <p>Suporta navegadores modernos...</p>
    </AccordionItem>
  </Accordion>
</template>`" />
            </template>
        </ComponentShowcase>

        <!-- SHOWCASE 2: Configurações -->
        <ComponentShowcase title="Exemplo 2: Painel de Configurações"
            description="Accordion com modo single (apenas um aberto por vez) e variante bordered">
            <template #preview>
                <Accordion v-model="settingsItems" variant="bordered" :multiple="false" size="lg">
                    <AccordionItem id="profile" title="Perfil" icon="👤">
                        <form style="display: grid; gap: 1rem;">
                            <div>
                                <label>Nome Completo</label>
                                <input type="text" placeholder="João Silva" style="width: 100%;" />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" placeholder="joao@exemplo.com" style="width: 100%;" />
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div>
                                    <label>Telefone</label>
                                    <input type="tel" placeholder="(11) 98765-4321" style="width: 100%;" />
                                </div>
                                <div>
                                    <label>Data de Nascimento</label>
                                    <input type="date" style="width: 100%;" />
                                </div>
                            </div>
                        </form>
                    </AccordionItem>

                    <AccordionItem id="security" title="Segurança" icon="🔒">
                        <form style="display: grid; gap: 1rem;">
                            <div>
                                <label>Senha Atual</label>
                                <input type="password" placeholder="••••••••" style="width: 100%;" />
                            </div>
                            <div>
                                <label>Nova Senha</label>
                                <input type="password" placeholder="••••••••" style="width: 100%;" />
                            </div>
                            <div>
                                <label>Confirmar Nova Senha</label>
                                <input type="password" placeholder="••••••••" style="width: 100%;" />
                            </div>
                            <div style="margin-top: 0.5rem;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" />
                                    Ativar autenticação de dois fatores (2FA)
                                </label>
                            </div>
                        </form>
                    </AccordionItem>

                    <AccordionItem id="notifications" title="Notificações" icon="🔔">
                        <div style="display: grid; gap: 1rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" checked />
                                Notificações por email
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" checked />
                                Notificações push no navegador
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" />
                                Newsletter semanal
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" checked />
                                Alertas de segurança
                            </label>
                        </div>
                    </AccordionItem>

                    <AccordionItem id="privacy" title="Privacidade" icon="🛡️">
                        <div style="display: grid; gap: 1rem;">
                            <div>
                                <h4 style="margin-bottom: 0.5rem;">Visibilidade do Perfil</h4>
                                <select style="width: 100%;">
                                    <option>Público</option>
                                    <option selected>Apenas Amigos</option>
                                    <option>Privado</option>
                                </select>
                            </div>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" />
                                Permitir indexação por motores de busca
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" checked />
                                Ocultar meu status online
                            </label>
                        </div>
                    </AccordionItem>
                </Accordion>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`<Accordion 
  v-model=&quot;activeItems&quot; 
  variant=&quot;bordered&quot; 
  :multiple=&quot;false&quot;
  size=&quot;lg&quot;
>
  <AccordionItem id=&quot;profile&quot; title=&quot;Perfil&quot; icon=&quot;👤&quot;>
    <!-- Formulário -->
  </AccordionItem>
  
  <AccordionItem id=&quot;security&quot; title=&quot;Segurança&quot; icon=&quot;🔒&quot;>
    <!-- Configurações -->
  </AccordionItem>
</Accordion>`" />
            </template>
        </ComponentShowcase>

        <!-- SHOWCASE 3: Especificações -->
        <ComponentShowcase title="Exemplo 3: Especificações do Produto"
            description="Accordion com variante separated e conteúdo rico estruturado">
            <template #preview>
                <Accordion v-model="productItems" variant="separated" :multiple="true">
                    <AccordionItem id="specs" title="Especificações Técnicas" icon="⚡">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                <tr style="border-bottom: 1px solid var(--color-border-primary);">
                                    <td style="padding: 0.5rem; font-weight: 500;">Processador</td>
                                    <td style="padding: 0.5rem; color: var(--color-text-secondary);">Intel Core
                                        i7-12700H</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--color-border-primary);">
                                    <td style="padding: 0.5rem; font-weight: 500;">Memória RAM</td>
                                    <td style="padding: 0.5rem; color: var(--color-text-secondary);">32GB DDR5</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--color-border-primary);">
                                    <td style="padding: 0.5rem; font-weight: 500;">Armazenamento</td>
                                    <td style="padding: 0.5rem; color: var(--color-text-secondary);">1TB NVMe SSD</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--color-border-primary);">
                                    <td style="padding: 0.5rem; font-weight: 500;">Placa de Vídeo</td>
                                    <td style="padding: 0.5rem; color: var(--color-text-secondary);">NVIDIA RTX 4060
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; font-weight: 500;">Sistema</td>
                                    <td style="padding: 0.5rem; color: var(--color-text-secondary);">Windows 11 Pro</td>
                                </tr>
                            </tbody>
                        </table>
                    </AccordionItem>

                    <AccordionItem id="display" title="Tela e Conectividade" icon="🖥️">
                        <div style="display: grid; gap: 1rem;">
                            <div>
                                <h4 style="margin-bottom: 0.5rem;">Display</h4>
                                <ul style="padding-left: 1.5rem; color: var(--color-text-secondary);">
                                    <li>15.6" Full HD (1920x1080)</li>
                                    <li>IPS, 144Hz, antirreflexo</li>
                                    <li>100% sRGB, 300 nits</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style="margin-bottom: 0.5rem;">Conectividade</h4>
                                <ul style="padding-left: 1.5rem; color: var(--color-text-secondary);">
                                    <li>3x USB-A 3.2, 2x USB-C TB4</li>
                                    <li>HDMI 2.1, DisplayPort</li>
                                    <li>Wi-Fi 6E, Bluetooth 5.2</li>
                                </ul>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem id="dimensions" title="Dimensões e Peso" icon="📏">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div>
                                <h4 style="margin-bottom: 0.5rem;">Dimensões</h4>
                                <p style="color: var(--color-text-secondary);">
                                    <strong>Largura:</strong> 357 mm<br>
                                    <strong>Profundidade:</strong> 249 mm<br>
                                    <strong>Altura:</strong> 23.9 mm
                                </p>
                            </div>
                            <div>
                                <h4 style="margin-bottom: 0.5rem;">Peso</h4>
                                <p style="color: var(--color-text-secondary);">
                                    <strong>Peso líquido:</strong> 2.1 kg<br>
                                    <strong>Com carregador:</strong> 2.6 kg
                                </p>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem id="warranty" title="Garantia e Suporte" icon="🛠️">
                        <div
                            style="background: var(--color-success-light); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                            <strong style="color: var(--color-success-dark);">✅ Garantia de 2 anos</strong>
                        </div>
                        <p>Inclui:</p>
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: var(--color-text-secondary);">
                            <li>Suporte técnico 24/7</li>
                            <li>Troca em até 7 dias</li>
                            <li>Assistência técnica em todo Brasil</li>
                        </ul>
                    </AccordionItem>
                </Accordion>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`<Accordion 
  v-model=&quot;activeItems&quot; 
  variant=&quot;separated&quot;
  :multiple=&quot;true&quot;
>
  <AccordionItem id=&quot;specs&quot; title=&quot;Especificações&quot; icon=&quot;⚡&quot;>
    <table><!-- Conteúdo --></table>
  </AccordionItem>
</Accordion>`" />
            </template>
        </ComponentShowcase>

        <!-- SHOWCASE 4: Variantes -->
        <ComponentShowcase title="Exemplo 4: Variantes de Estilo" description="Diferentes estilos visuais do Accordion">
            <template #preview>
                <div style="display: grid; gap: 2rem;">
                    <div>
                        <h3 style="margin-bottom: 1rem;">Default</h3>
                        <Accordion variant="default">
                            <AccordionItem id="d1" title="Item 1">Conteúdo do item 1</AccordionItem>
                            <AccordionItem id="d2" title="Item 2">Conteúdo do item 2</AccordionItem>
                            <AccordionItem id="d3" title="Item 3">Conteúdo do item 3</AccordionItem>
                        </Accordion>
                    </div>

                    <div>
                        <h3 style="margin-bottom: 1rem;">Bordered</h3>
                        <Accordion variant="bordered">
                            <AccordionItem id="b1" title="Item 1">Conteúdo do item 1</AccordionItem>
                            <AccordionItem id="b2" title="Item 2">Conteúdo do item 2</AccordionItem>
                            <AccordionItem id="b3" title="Item 3">Conteúdo do item 3</AccordionItem>
                        </Accordion>
                    </div>

                    <div>
                        <h3 style="margin-bottom: 1rem;">Separated</h3>
                        <Accordion variant="separated">
                            <AccordionItem id="s1" title="Item 1">Conteúdo do item 1</AccordionItem>
                            <AccordionItem id="s2" title="Item 2">Conteúdo do item 2</AccordionItem>
                            <AccordionItem id="s3" title="Item 3">Conteúdo do item 3</AccordionItem>
                        </Accordion>
                    </div>

                    <div>
                        <h3 style="margin-bottom: 1rem;">Filled</h3>
                        <Accordion variant="filled">
                            <AccordionItem id="f1" title="Item 1">Conteúdo do item 1</AccordionItem>
                            <AccordionItem id="f2" title="Item 2">Conteúdo do item 2</AccordionItem>
                            <AccordionItem id="f3" title="Item 3">Conteúdo do item 3</AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`<!-- Default -->
<Accordion variant=&quot;default&quot;>...</Accordion>

<!-- Bordered -->
<Accordion variant=&quot;bordered&quot;>...</Accordion>

<!-- Separated -->
<Accordion variant=&quot;separated&quot;>...</Accordion>

<!-- Filled -->
<Accordion variant=&quot;filled&quot;>...</Accordion>`" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style scoped>
.accordion-view {
    h1 {
        font-size: var(--font-size-3xl);
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-sm);
    }

    .subtitle {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-2xl);
    }
}
</style>
