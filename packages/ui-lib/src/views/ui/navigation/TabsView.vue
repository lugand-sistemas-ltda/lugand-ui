<script setup lang="ts">
/**
 * ============================================
 * TABS VIEW - Showcase com Exemplos Práticos
 * ============================================
 */

import { ref, computed } from 'vue'
import { Tabs, TabPanel } from '@/modules/Tabs'
import { Button, Card } from '@/shared/components'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'

// ============================================
// EXEMPLO 1: FAKE CHECKOUT (E-commerce)
// ============================================
const checkoutTab = ref<string>('cart')

const cartItems = ref([
    { id: 1, name: 'Notebook Dell Inspiron 15', price: 3500.00, qty: 1 },
    { id: 2, name: 'Mouse Logitech MX Master 3', price: 450.00, qty: 1 },
    { id: 3, name: 'Teclado Mecânico Keychron K2', price: 650.00, qty: 1 }
])

const shippingForm = ref({
    fullName: 'João da Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cep: '01310-100',
    address: 'Av. Paulista, 1578',
    city: 'São Paulo',
    state: 'SP'
})

const paymentForm = ref({
    cardNumber: '**** **** **** 1234',
    cardName: 'JOAO DA SILVA',
    expiry: '12/26',
    cvv: '***'
})

const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
})

const removeItem = (id: number) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
}

// ============================================
// EXEMPLO 2: CADASTRO DE FORNECEDOR
// ============================================
const supplierTab = ref<string>('basic-info')

const supplier = ref({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    inscricaoEstadual: '',
    email: '',
    telefone: '',
    website: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: 'corrente'
})

// ============================================
// EXEMPLO 3: DOCUMENTAÇÃO COM TEXTOS E EMOJIS
// ============================================
const docsTab = ref<string>('intro')

// ============================================
// EXEMPLO 4: DASHBOARD COM DADOS (BÁSICO)
// ============================================
const dashboardTab = ref<string>('overview')
</script>

<template>
    <div class="tabs-view">
        <h1>Tabs Component</h1>
        <p class="subtitle">Componente de abas para organizar conteúdo em seções navegáveis.</p>

        <!-- ============================================ -->
        <!-- EXEMPLO 1: FAKE CHECKOUT -->
        <!-- ============================================ -->
        <ComponentShowcase title="Exemplo 1: Checkout (E-commerce)"
            description="Simulação de fluxo de compra com carrinho, entrega e pagamento.">
            <template #preview>
                <Tabs v-model="checkoutTab" variant="line" size="lg">
                    <TabPanel id="cart" label="Carrinho" icon="🛒" :badge="cartItems.length">
                        <Card>
                            <h3>Seu Carrinho</h3>
                            <div v-if="cartItems.length === 0"
                                style="padding: 2rem; text-align: center; color: var(--color-text-secondary);">
                                <p>🛒 Carrinho vazio</p>
                            </div>
                            <div v-else>
                                <div v-for="item in cartItems" :key="item.id"
                                    style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--color-border-primary);">
                                    <div>
                                        <strong>{{ item.name }}</strong>
                                        <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                                            Qtd: {{ item.qty }} × R$ {{ item.price.toFixed(2) }}
                                        </p>
                                    </div>
                                    <div style="display: flex; gap: 1rem; align-items: center;">
                                        <strong style="color: var(--color-primary);">
                                            R$ {{ (item.price * item.qty).toFixed(2) }}
                                        </strong>
                                        <Button size="sm" variant="ghost" @click="removeItem(item.id)">🗑️</Button>
                                    </div>
                                </div>

                                <div
                                    style="margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid var(--color-border-primary);">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <h3>Total:</h3>
                                        <h2 style="color: var(--color-primary);">R$ {{ cartTotal.toFixed(2) }}</h2>
                                    </div>
                                    <Button variant="primary" full-width style="margin-top: 1rem;"
                                        @click="checkoutTab = 'shipping'">
                                        Continuar para Entrega →
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </TabPanel>

                    <TabPanel id="shipping" label="Entrega" icon="📦" :disabled="cartItems.length === 0">
                        <Card>
                            <h3>Informações de Entrega</h3>
                            <form style="display: grid; gap: 1rem; margin-top: 1.5rem;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Nome Completo</label>
                                        <input v-model="shippingForm.fullName" type="text" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input v-model="shippingForm.email" type="email" style="width: 100%;" />
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Telefone</label>
                                        <input v-model="shippingForm.phone" type="tel" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>CEP</label>
                                        <input v-model="shippingForm.cep" type="text" style="width: 100%;" />
                                    </div>
                                </div>

                                <div>
                                    <label>Endereço</label>
                                    <input v-model="shippingForm.address" type="text" style="width: 100%;" />
                                </div>

                                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Cidade</label>
                                        <input v-model="shippingForm.city" type="text" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Estado</label>
                                        <input v-model="shippingForm.state" type="text" style="width: 100%;" />
                                    </div>
                                </div>

                                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                    <Button variant="outline" @click="checkoutTab = 'cart'">← Voltar para
                                        Carrinho</Button>
                                    <Button variant="primary" style="flex: 1;" @click="checkoutTab = 'payment'">
                                        Continuar para Pagamento →
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </TabPanel>

                    <TabPanel id="payment" label="Pagamento" icon="💳" :disabled="cartItems.length === 0">
                        <Card>
                            <h3>Informações de Pagamento</h3>
                            <form style="display: grid; gap: 1.5rem; margin-top: 1.5rem;">
                                <div>
                                    <label>Número do Cartão</label>
                                    <input v-model="paymentForm.cardNumber" type="text"
                                        placeholder="1234 5678 9012 3456" style="width: 100%;" />
                                </div>

                                <div>
                                    <label>Nome no Cartão</label>
                                    <input v-model="paymentForm.cardName" type="text" placeholder="JOÃO DA SILVA"
                                        style="width: 100%; text-transform: uppercase;" />
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Validade</label>
                                        <input v-model="paymentForm.expiry" type="text" placeholder="MM/AA"
                                            style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>CVV</label>
                                        <input v-model="paymentForm.cvv" type="text" placeholder="123" maxlength="3"
                                            style="width: 100%;" />
                                    </div>
                                </div>

                                <div
                                    style="background: var(--color-bg-secondary); padding: 1.5rem; border-radius: var(--radius-md);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <span>Subtotal:</span>
                                        <strong>R$ {{ cartTotal.toFixed(2) }}</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <span>Frete:</span>
                                        <strong>R$ 25.00</strong>
                                    </div>
                                    <div
                                        style="display: flex; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--color-border-primary);">
                                        <strong>Total:</strong>
                                        <strong style="color: var(--color-primary); font-size: 1.25rem;">
                                            R$ {{ (cartTotal + 25).toFixed(2) }}
                                        </strong>
                                    </div>
                                </div>

                                <div style="display: flex; gap: 1rem;">
                                    <Button variant="outline" @click="checkoutTab = 'shipping'">← Voltar para
                                        Entrega</Button>
                                    <Button variant="primary" style="flex: 1;">Finalizar Compra 🎉</Button>
                                </div>
                            </form>
                        </Card>
                    </TabPanel>
                </Tabs>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`<Tabs v-model=&quot;checkoutTab&quot; variant=&quot;line&quot; size=&quot;lg&quot;>
  <TabPanel id=&quot;cart&quot; label=&quot;Carrinho&quot; icon=&quot;🛒&quot; :badge=&quot;cartItems.length&quot;>
    <!-- Lista de produtos -->
  </TabPanel>
  
  <TabPanel id=&quot;shipping&quot; label=&quot;Entrega&quot; icon=&quot;📦&quot; :disabled=&quot;cartItems.length === 0&quot;>
    <!-- Formulário de entrega -->
  </TabPanel>
  
  <TabPanel id=&quot;payment&quot; label=&quot;Pagamento&quot; icon=&quot;💳&quot; :disabled=&quot;cartItems.length === 0&quot;>
    <!-- Formulário de pagamento -->
  </TabPanel>
</Tabs>`" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- EXEMPLO 2: CADASTRO DE FORNECEDOR -->
        <!-- ============================================ -->
        <ComponentShowcase title="Exemplo 2: Cadastro de Fornecedor"
            description="Formulário multi-etapas para cadastro de fornecedores.">
            <template #preview>
                <Tabs v-model="supplierTab" variant="enclosed">
                    <TabPanel id="basic-info" label="Dados Básicos" icon="🏢">
                        <Card>
                            <h3>Informações da Empresa</h3>
                            <form style="display: grid; gap: 1rem; margin-top: 1rem;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>CNPJ *</label>
                                        <input v-model="supplier.cnpj" type="text" placeholder="00.000.000/0000-00"
                                            style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Inscrição Estadual</label>
                                        <input v-model="supplier.inscricaoEstadual" type="text" style="width: 100%;" />
                                    </div>
                                </div>

                                <div>
                                    <label>Razão Social *</label>
                                    <input v-model="supplier.razaoSocial" type="text" style="width: 100%;" />
                                </div>

                                <div>
                                    <label>Nome Fantasia</label>
                                    <input v-model="supplier.nomeFantasia" type="text" style="width: 100%;" />
                                </div>

                                <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
                                    <Button variant="primary" @click="supplierTab = 'contact'">
                                        Continuar para Contato →
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </TabPanel>

                    <TabPanel id="contact" label="Contato" icon="📞">
                        <Card>
                            <h3>Informações de Contato</h3>
                            <form style="display: grid; gap: 1rem; margin-top: 1rem;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Email *</label>
                                        <input v-model="supplier.email" type="email" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Telefone *</label>
                                        <input v-model="supplier.telefone" type="tel" style="width: 100%;" />
                                    </div>
                                </div>

                                <div>
                                    <label>Website</label>
                                    <input v-model="supplier.website" type="url" placeholder="https://exemplo.com.br"
                                        style="width: 100%;" />
                                </div>

                                <div
                                    style="display: flex; gap: 1rem; justify-content: space-between; margin-top: 1rem;">
                                    <Button variant="outline" @click="supplierTab = 'basic-info'">← Voltar para Dados
                                        Básicos</Button>
                                    <Button variant="primary" @click="supplierTab = 'address'">Continuar para Endereço
                                        →</Button>
                                </div>
                            </form>
                        </Card>
                    </TabPanel>

                    <TabPanel id="address" label="Endereço" icon="📍">
                        <Card>
                            <h3>Endereço do Fornecedor</h3>
                            <form style="display: grid; gap: 1rem; margin-top: 1rem;">
                                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                                    <div>
                                        <label>CEP *</label>
                                        <input v-model="supplier.cep" type="text" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Endereço *</label>
                                        <input v-model="supplier.endereco" type="text" style="width: 100%;" />
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: 100px 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Número *</label>
                                        <input v-model="supplier.numero" type="text" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Complemento</label>
                                        <input v-model="supplier.complemento" type="text" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Bairro *</label>
                                        <input v-model="supplier.bairro" type="text" style="width: 100%;" />
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
                                    <div>
                                        <label>Cidade *</label>
                                        <input v-model="supplier.cidade" type="text" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Estado *</label>
                                        <select v-model="supplier.estado" style="width: 100%;">
                                            <option value="">Selecione...</option>
                                            <option value="SP">SP</option>
                                            <option value="RJ">RJ</option>
                                            <option value="MG">MG</option>
                                        </select>
                                    </div>
                                </div>

                                <div
                                    style="display: flex; gap: 1rem; justify-content: space-between; margin-top: 1rem;">
                                    <Button variant="outline" @click="supplierTab = 'contact'">← Voltar para
                                        Contato</Button>
                                    <Button variant="primary" @click="supplierTab = 'banking'">Continuar para Dados
                                        Bancários →</Button>
                                </div>
                            </form>
                        </Card>
                    </TabPanel>

                    <TabPanel id="banking" label="Dados Bancários" icon="🏦">
                        <Card>
                            <h3>Informações Bancárias</h3>
                            <form style="display: grid; gap: 1rem; margin-top: 1rem;">
                                <div>
                                    <label>Banco</label>
                                    <select v-model="supplier.banco" style="width: 100%;">
                                        <option value="">Selecione...</option>
                                        <option value="001">001 - Banco do Brasil</option>
                                        <option value="237">237 - Bradesco</option>
                                        <option value="341">341 - Itaú</option>
                                        <option value="104">104 - Caixa Econômica</option>
                                    </select>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                                    <div>
                                        <label>Agência</label>
                                        <input v-model="supplier.agencia" type="text" style="width: 100%;" />
                                    </div>
                                    <div>
                                        <label>Conta</label>
                                        <input v-model="supplier.conta" type="text" style="width: 100%;" />
                                    </div>
                                </div>

                                <div>
                                    <label>Tipo de Conta</label>
                                    <div style="display: flex; gap: 2rem; margin-top: 0.5rem;">
                                        <label
                                            style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                            <input v-model="supplier.tipoConta" type="radio" value="corrente" />
                                            Conta Corrente
                                        </label>
                                        <label
                                            style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                            <input v-model="supplier.tipoConta" type="radio" value="poupanca" />
                                            Poupança
                                        </label>
                                    </div>
                                </div>

                                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                    <Button variant="outline" @click="supplierTab = 'address'">← Voltar para
                                        Endereço</Button>
                                    <Button variant="primary" style="flex: 1;">Salvar Fornecedor 💾</Button>
                                </div>
                            </form>
                        </Card>
                    </TabPanel>
                </Tabs>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`<Tabs v-model=&quot;supplierTab&quot; variant=&quot;enclosed&quot;>
  <TabPanel id=&quot;basic-info&quot; label=&quot;Dados Básicos&quot; icon=&quot;🏢&quot;>
    <!-- CNPJ, Razão Social, etc -->
  </TabPanel>
  
  <TabPanel id=&quot;contact&quot; label=&quot;Contato&quot; icon=&quot;📞&quot;>
    <!-- Email, Telefone, Website -->
  </TabPanel>
  
  <TabPanel id=&quot;address&quot; label=&quot;Endereço&quot; icon=&quot;📍&quot;>
    <!-- CEP, Endereço, Cidade, Estado -->
  </TabPanel>
  
  <TabPanel id=&quot;banking&quot; label=&quot;Dados Bancários&quot; icon=&quot;🏦&quot;>
    <!-- Banco, Agência, Conta -->
  </TabPanel>
</Tabs>`" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- EXEMPLO 3: DOCUMENTAÇÃO COM TEXTOS E EMOJIS -->
        <!-- ============================================ -->
        <ComponentShowcase title="Exemplo 3: Documentação com Textos e Emojis"
            description="Exemplo de documentação/conteúdo rico com formatação.">
            <template #preview>
                <Tabs v-model="docsTab" variant="pills" centered>
                    <TabPanel id="intro" label="Introdução" icon="📚">
                        <Card>
                            <h2>👋 Bem-vindo à Documentação!</h2>
                            <p style="margin-top: 1rem; line-height: 1.8;">
                                Esta é uma biblioteca de componentes Vue 3 moderna e completa, projetada para
                                acelerar o desenvolvimento de aplicações web empresariais.
                            </p>

                            <h3 style="margin-top: 2rem;">✨ Principais Características:</h3>
                            <ul style="margin-top: 1rem; line-height: 2; padding-left: 1.5rem;">
                                <li>🎨 <strong>Temas Customizáveis</strong> - Mais de 10 temas prontos</li>
                                <li>♿ <strong>Acessibilidade</strong> - Suporte completo a leitores de tela</li>
                                <li>📱 <strong>Responsivo</strong> - Funciona em todos os dispositivos</li>
                                <li>⚡ <strong>Performance</strong> - Otimizado com lazy loading</li>
                                <li>🔧 <strong>TypeScript</strong> - Tipagem completa</li>
                            </ul>

                            <div
                                style="margin-top: 2rem; padding: 1rem; background: var(--color-bg-secondary); border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
                                <strong>💡 Dica:</strong> Explore as outras abas para ver exemplos práticos de uso!
                            </div>

                            <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                                <Button variant="primary" @click="docsTab = 'components'">
                                    Ver Componentes →
                                </Button>
                            </div>
                        </Card>
                    </TabPanel>

                    <TabPanel id="components" label="Componentes" icon="🧩">
                        <Card>
                            <h2>🧩 Componentes Disponíveis</h2>

                            <div style="margin-top: 1.5rem;">
                                <h3>📋 Formulários</h3>
                                <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                    Input, Select, Checkbox, Radio, DatePicker, CurrencyInput, MaskInput...
                                </p>
                            </div>

                            <div style="margin-top: 1.5rem;">
                                <h3>🗂️ Navegação</h3>
                                <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                    Tabs, Breadcrumb, Pagination, Menu, Sidebar...
                                </p>
                            </div>

                            <div style="margin-top: 1.5rem;">
                                <h3>💬 Feedback</h3>
                                <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                    Alert, Toast, Modal, Spinner, ProgressBar...
                                </p>
                            </div>

                            <div style="margin-top: 1.5rem;">
                                <h3>📊 Visualização</h3>
                                <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                    DataTable, Charts (Line, Bar, Area, Pie), Card, Badge...
                                </p>
                            </div>

                            <div
                                style="margin-top: 2rem; padding: 1rem; background: var(--color-success-light); color: var(--color-success-dark); border-radius: var(--radius-md);">
                                ✅ <strong>50+ componentes</strong> prontos para uso
                            </div>

                            <div style="display: flex; gap: 1rem; justify-content: space-between; margin-top: 1.5rem;">
                                <Button variant="outline" @click="docsTab = 'intro'">← Voltar para Introdução</Button>
                                <Button variant="primary" @click="docsTab = 'getting-started'">Como Começar →</Button>
                            </div>
                        </Card>
                    </TabPanel>

                    <TabPanel id="getting-started" label="Começando" icon="🚀">
                        <Card>
                            <h2>🚀 Como Começar</h2>

                            <h3 style="margin-top: 1.5rem;">1️⃣ Instalação</h3>
                            <div
                                style="margin-top: 0.5rem; padding: 1rem; background: #1e1e1e; color: #d4d4d4; border-radius: var(--radius-md); font-family: monospace;">
                                npm install @lugand/vue-ui-lib
                            </div>

                            <h3 style="margin-top: 1.5rem;">2️⃣ Importar no seu projeto</h3>
                            <div
                                style="margin-top: 0.5rem; padding: 1rem; background: #1e1e1e; color: #d4d4d4; border-radius: var(--radius-md); font-family: monospace; white-space: pre;">
                                import { Button, Input, Card } from '@lugand/vue-ui-lib'
                                import '@lugand/vue-ui-lib/style.css'</div>

                            <h3 style="margin-top: 1.5rem;">3️⃣ Usar componentes</h3>
                            <div
                                style="margin-top: 0.5rem; padding: 1rem; background: #1e1e1e; color: #d4d4d4; border-radius: var(--radius-md); font-family: monospace; white-space: pre;">
                                &lt;template&gt;
                                &lt;Card&gt;
                                &lt;h2&gt;Olá Mundo!&lt;/h2&gt;
                                &lt;Button variant="primary"&gt;Clique aqui&lt;/Button&gt;
                                &lt;/Card&gt;
                                &lt;/template&gt;</div>

                            <div
                                style="margin-top: 2rem; padding: 1rem; background: var(--color-info-light); color: var(--color-info-dark); border-radius: var(--radius-md);">
                                ℹ️ <strong>Documentação completa</strong> disponível em cada componente
                            </div>

                            <div style="display: flex; gap: 1rem; justify-content: space-between; margin-top: 1.5rem;">
                                <Button variant="outline" @click="docsTab = 'components'">← Voltar para
                                    Componentes</Button>
                                <Button variant="primary" @click="docsTab = 'support'">Ver Suporte →</Button>
                            </div>
                        </Card>
                    </TabPanel>

                    <TabPanel id="support" label="Suporte" icon="❓">
                        <Card>
                            <h2>❓ Precisa de Ajuda?</h2>

                            <div style="margin-top: 1.5rem;">
                                <h3>📖 Recursos</h3>
                                <ul style="margin-top: 0.5rem; line-height: 2; padding-left: 1.5rem;">
                                    <li>Documentação completa online</li>
                                    <li>Exemplos interativos de cada componente</li>
                                    <li>Guias de boas práticas</li>
                                    <li>FAQ com dúvidas comuns</li>
                                </ul>
                            </div>

                            <div style="margin-top: 1.5rem;">
                                <h3>💬 Comunidade</h3>
                                <ul style="margin-top: 0.5rem; line-height: 2; padding-left: 1.5rem;">
                                    <li>GitHub Issues - Reporte bugs</li>
                                    <li>GitHub Discussions - Tire dúvidas</li>
                                    <li>Discord - Chat em tempo real</li>
                                    <li>Stack Overflow - Perguntas técnicas</li>
                                </ul>
                            </div>

                            <div
                                style="margin-top: 2rem; padding: 1.5rem; background: var(--color-bg-secondary); border-radius: var(--radius-md); text-align: center;">
                                <h3>📧 Contato Direto</h3>
                                <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                    suporte@lugand.com.br
                                </p>
                                <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--color-text-secondary);">
                                    Respondemos em até 24 horas úteis
                                </p>
                            </div>

                            <div style="display: flex; justify-content: flex-start; margin-top: 1.5rem;">
                                <Button variant="outline" @click="docsTab = 'getting-started'">← Voltar para Como
                                    Começar</Button>
                            </div>
                        </Card>
                    </TabPanel>
                </Tabs>
            </template>

            <template #code>
                <CodeBlock language="vue" :code="`<Tabs v-model=&quot;docsTab&quot; variant=&quot;pills&quot; centered>
  <TabPanel id=&quot;intro&quot; label=&quot;Introdução&quot; icon=&quot;📚&quot;>
    <!-- Conteúdo rico com emojis e formatação -->
  </TabPanel>
  
  <TabPanel id=&quot;components&quot; label=&quot;Componentes&quot; icon=&quot;🧩&quot;>
    <!-- Lista de componentes -->
  </TabPanel>
  
  <TabPanel id=&quot;getting-started&quot; label=&quot;Começando&quot; icon=&quot;🚀&quot;>
    <!-- Guia de instalação -->
  </TabPanel>
  
  <TabPanel id=&quot;support&quot; label=&quot;Suporte&quot; icon=&quot;❓&quot;>
    <!-- Canais de suporte -->
  </TabPanel>
</Tabs>`" />
            </template>
        </ComponentShowcase>

        <!-- CONTINUA... Dashboard exemplo será adicionado em outro bloco devido ao tamanho -->
    </div>
</template>

<style scoped lang="scss">
.tabs-view {
    padding: var(--spacing-xl);
    max-width: 1400px;
    margin: 0 auto;

    h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
        color: var(--color-text-primary);
    }

    .subtitle {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-2xl);
    }
}
</style>
