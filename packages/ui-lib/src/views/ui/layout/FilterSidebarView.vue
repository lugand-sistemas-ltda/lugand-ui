<script setup lang="ts">
import { ref } from 'vue'
import { 
    FilterSidebar, 
    FilterSection, 
    Input, 
    Button, 
    Badge, 
    Checkbox,
    ComponentShowcase, 
    CodeBlock 
} from '@/shared/components'

// Mock data
const searchQuery = ref('')
const selectedCategory = ref<string>()
const priceMin = ref<number>()
const priceMax = ref<number>()
const inStock = ref(false)
const selectedTags = ref<string[]>([])

const categories = [
    { id: '1', name: '🖥️ Eletrônicos', icon: '🖥️' },
    { id: '2', name: '👕 Moda', icon: '👕' },
    { id: '3', name: '🏠 Casa', icon: '🏠' },
    { id: '4', name: '📚 Livros', icon: '📚' }
]

const tags = ['Promoção', 'Novo', 'Destaque', 'Frete Grátis']

const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = undefined
    priceMin.value = undefined
    priceMax.value = undefined
    inStock.value = false
    selectedTags.value = []
    console.log('Filtros limpos')
}

const codeBasic = `<FilterSidebar>
  <FilterSection title="Buscar">
    <Input v-model="search" placeholder="Digite..." />
  </FilterSection>
  
  <FilterSection title="Categorias">
    <div class="category-list">
      <!-- Categories -->
    </div>
  </FilterSection>
</FilterSidebar>`

const codeCollapsible = `<FilterSidebar title="Filtros" :collapsible="true">
  <FilterSection 
    title="Preço" 
    icon="💰"
    :collapsible="true"
    :default-expanded="true"
  >
    <Input v-model="minPrice" placeholder="Mín" />
    <Input v-model="maxPrice" placeholder="Máx" />
  </FilterSection>
  
  <template #actions>
    <Button variant="secondary" block @click="clear">
      Limpar Filtros
    </Button>
  </template>
</FilterSidebar>`

const codeComplete = `<script setup>
const filters = ref({
  search: '',
  category: null,
  minPrice: null,
  maxPrice: null,
  tags: []
})
<\/script>

<FilterSidebar 
  title="Filtros" 
  width="280px"
  :sticky="true"
  :collapsible="true"
>
  <FilterSection title="Buscar" icon="🔍">
    <Input v-model="filters.search" />
  </FilterSection>

  <FilterSection 
    title="Categorias" 
    icon="📁"
    :collapsible="true"
  >
    <!-- Category buttons -->
  </FilterSection>

  <FilterSection title="Preço" icon="💰">
    <Input v-model="filters.minPrice" />
    <Input v-model="filters.maxPrice" />
  </FilterSection>

  <template #actions>
    <Button variant="secondary" block>
      Limpar Filtros
    </Button>
  </template>
</FilterSidebar>`
</script>

<template>
    <div class="filter-sidebar-view">
        <h1>FilterSidebar & FilterSection</h1>
        <p class="lead">
            Componentes especializados para criar sidebars de filtros com seções colapsáveis,
            sticky scroll e suporte completo para mobile.
        </p>

        <!-- 1. Básico -->
        <ComponentShowcase
            title="FilterSidebar Básico"
            description="Sidebar simples com seções de filtro."
        >
            <template #preview>
                <div class="preview-container">
                    <FilterSidebar width="280px" :sticky="false">
                        <FilterSection title="Buscar" icon="🔍">
                            <Input v-model="searchQuery" placeholder="Digite para buscar..." type="search" />
                        </FilterSection>

                        <FilterSection title="Categorias" icon="📁">
                            <div class="category-list">
                                <button
                                    v-for="cat in categories"
                                    :key="cat.id"
                                    class="category-button"
                                    :class="{ active: selectedCategory === cat.id }"
                                    @click="selectedCategory = cat.id"
                                >
                                    <span>{{ cat.icon }}</span>
                                    <span>{{ cat.name }}</span>
                                </button>
                            </div>
                        </FilterSection>

                        <FilterSection title="Preço" icon="💰">
                            <div class="price-inputs">
                                <Input v-model.number="priceMin" type="number" placeholder="Mín" />
                                <span>até</span>
                                <Input v-model.number="priceMax" type="number" placeholder="Máx" />
                            </div>
                        </FilterSection>
                    </FilterSidebar>

                    <div class="preview-content">
                        <p><strong>Filtros ativos:</strong></p>
                        <ul>
                            <li>Busca: {{ searchQuery || 'Nenhuma' }}</li>
                            <li>Categoria: {{ selectedCategory || 'Nenhuma' }}</li>
                            <li>Preço: {{ priceMin || 0 }} - {{ priceMax || '∞' }}</li>
                        </ul>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeBasic" />
            </template>
        </ComponentShowcase>

        <!-- 2. Com Seções Colapsáveis -->
        <ComponentShowcase
            title="Seções Colapsáveis"
            description="FilterSection com suporte a collapse/expand."
        >
            <template #preview>
                <div class="preview-container">
                    <FilterSidebar width="280px" :sticky="false" title="Filtros">
                        <FilterSection 
                            title="Buscar" 
                            icon="🔍"
                            :collapsible="true"
                            :default-expanded="true"
                        >
                            <Input v-model="searchQuery" placeholder="Digite..." type="search" />
                        </FilterSection>

                        <FilterSection 
                            title="Preço" 
                            icon="💰"
                            :collapsible="true"
                            :default-expanded="false"
                        >
                            <div class="price-inputs">
                                <Input v-model.number="priceMin" type="number" placeholder="Mín" />
                                <span>até</span>
                                <Input v-model.number="priceMax" type="number" placeholder="Máx" />
                            </div>
                        </FilterSection>

                        <FilterSection 
                            title="Tags" 
                            icon="🏷️"
                            :collapsible="true"
                            :default-expanded="true"
                        >
                            <div class="tags-list">
                                <Badge
                                    v-for="tag in tags"
                                    :key="tag"
                                    :variant="selectedTags.includes(tag) ? 'primary' : 'secondary'"
                                    size="sm"
                                    style="cursor: pointer"
                                    @click="
                                        selectedTags.includes(tag)
                                            ? selectedTags = selectedTags.filter(t => t !== tag)
                                            : selectedTags.push(tag)
                                    "
                                >
                                    {{ tag }}
                                </Badge>
                            </div>
                        </FilterSection>

                        <template #actions>
                            <Button variant="secondary" block @click="clearFilters">
                                Limpar Filtros
                            </Button>
                        </template>
                    </FilterSidebar>

                    <div class="preview-content">
                        <p><strong>Tags selecionadas:</strong></p>
                        <p>{{ selectedTags.length > 0 ? selectedTags.join(', ') : 'Nenhuma' }}</p>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeCollapsible" />
            </template>
        </ComponentShowcase>

        <!-- 3. Com Actions Slot -->
        <ComponentShowcase
            title="Com Actions Slot"
            description="Use o slot 'actions' para adicionar botões fixos no rodapé."
        >
            <template #preview>
                <div class="preview-container">
                    <FilterSidebar width="280px" :sticky="false">
                        <FilterSection title="Estoque" icon="📦">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <Checkbox v-model="inStock" />
                                <span>Apenas em estoque</span>
                            </label>
                        </FilterSection>

                        <FilterSection title="Tags" icon="🏷️">
                            <div class="tags-list">
                                <Badge
                                    v-for="tag in tags"
                                    :key="tag"
                                    :variant="selectedTags.includes(tag) ? 'primary' : 'secondary'"
                                    size="sm"
                                    style="cursor: pointer"
                                    @click="
                                        selectedTags.includes(tag)
                                            ? selectedTags = selectedTags.filter(t => t !== tag)
                                            : selectedTags.push(tag)
                                    "
                                >
                                    {{ tag }}
                                </Badge>
                            </div>
                        </FilterSection>

                        <template #actions>
                            <Button variant="ghost" block size="sm">
                                📊 Exportar Filtros
                            </Button>
                            <Button variant="secondary" block @click="clearFilters">
                                🗑️ Limpar Tudo
                            </Button>
                        </template>
                    </FilterSidebar>

                    <div class="preview-content">
                        <p><strong>Estado:</strong></p>
                        <ul>
                            <li>Em estoque: {{ inStock ? 'Sim' : 'Não' }}</li>
                            <li>Tags: {{ selectedTags.join(', ') || 'Nenhuma' }}</li>
                        </ul>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeComplete" />
            </template>
        </ComponentShowcase>

        <!-- 4. Exemplo Completo (E-commerce) -->
        <ComponentShowcase
            title="Exemplo Completo - E-commerce"
            description="Implementação completa com todos os filtros típicos de um e-commerce."
        >
            <template #preview>
                <div class="preview-container">
                    <FilterSidebar 
                        width="300px" 
                        :sticky="false"
                        title="Filtros de Produto"
                        :collapsible="true"
                    >
                        <FilterSection title="Buscar" icon="🔍">
                            <Input 
                                v-model="searchQuery" 
                                placeholder="Nome, marca, descrição..." 
                                type="search" 
                            />
                        </FilterSection>

                        <FilterSection 
                            title="Categorias" 
                            icon="📁"
                            :collapsible="true"
                            :default-expanded="true"
                        >
                            <div class="category-list">
                                <button
                                    v-for="cat in categories"
                                    :key="cat.id"
                                    class="category-button"
                                    :class="{ active: selectedCategory === cat.id }"
                                    @click="selectedCategory = selectedCategory === cat.id ? undefined : cat.id"
                                >
                                    <span>{{ cat.icon }}</span>
                                    <span>{{ cat.name }}</span>
                                </button>
                            </div>
                        </FilterSection>

                        <FilterSection 
                            title="Faixa de Preço" 
                            icon="💰"
                            :collapsible="true"
                        >
                            <div class="price-inputs">
                                <Input 
                                    v-model.number="priceMin" 
                                    type="number" 
                                    placeholder="R$ Mín" 
                                    min="0"
                                />
                                <span style="color: var(--color-text-tertiary);">até</span>
                                <Input 
                                    v-model.number="priceMax" 
                                    type="number" 
                                    placeholder="R$ Máx" 
                                    min="0"
                                />
                            </div>
                        </FilterSection>

                        <FilterSection 
                            title="Etiquetas" 
                            icon="🏷️"
                            :collapsible="true"
                        >
                            <div class="tags-list">
                                <Badge
                                    v-for="tag in tags"
                                    :key="tag"
                                    :variant="selectedTags.includes(tag) ? 'primary' : 'secondary'"
                                    size="sm"
                                    style="cursor: pointer; user-select: none;"
                                    @click="
                                        selectedTags.includes(tag)
                                            ? selectedTags = selectedTags.filter(t => t !== tag)
                                            : selectedTags.push(tag)
                                    "
                                >
                                    {{ tag }}
                                </Badge>
                            </div>
                        </FilterSection>

                        <FilterSection title="Disponibilidade" icon="📦" :divider="false">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <Checkbox v-model="inStock" />
                                <span>Apenas produtos em estoque</span>
                            </label>
                        </FilterSection>

                        <template #actions>
                            <Button variant="secondary" block @click="clearFilters">
                                🗑️ Limpar Todos os Filtros
                            </Button>
                        </template>
                    </FilterSidebar>

                    <div class="preview-content">
                        <h3>Resumo dos Filtros</h3>
                        <dl>
                            <dt>Busca:</dt>
                            <dd>{{ searchQuery || 'Nenhuma' }}</dd>
                            
                            <dt>Categoria:</dt>
                            <dd>{{ categories.find(c => c.id === selectedCategory)?.name || 'Todas' }}</dd>
                            
                            <dt>Preço:</dt>
                            <dd>R$ {{ priceMin || 0 }} - R$ {{ priceMax || '∞' }}</dd>
                            
                            <dt>Tags:</dt>
                            <dd>{{ selectedTags.join(', ') || 'Nenhuma' }}</dd>
                            
                            <dt>Estoque:</dt>
                            <dd>{{ inStock ? 'Somente disponíveis' : 'Todos' }}</dd>
                        </dl>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="codeComplete" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.filter-sidebar-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.lead {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
}

.preview-container {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--spacing-xl);
    width: 100%;
    min-height: 400px;
    align-items: start;
}

.preview-content {
    padding: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);

    h3 {
        margin-top: 0;
        margin-bottom: var(--spacing-md);
        color: var(--color-text-primary);
    }

    p {
        margin: var(--spacing-sm) 0;
        color: var(--color-text-secondary);
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            padding: var(--spacing-xs) 0;
            color: var(--color-text-secondary);
        }
    }

    dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--spacing-sm) var(--spacing-md);
        margin: 0;

        dt {
            font-weight: var(--font-weight-semibold);
            color: var(--color-text-secondary);
        }

        dd {
            margin: 0;
            color: var(--color-text-primary);
        }
    }
}

.category-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.category-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    background: var(--color-bg-elevated);
    cursor: pointer;
    transition: all 0.2s;
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);

    &:hover {
        background: var(--primary-50);
        border-color: var(--primary-300);
        transform: translateX(2px);
    }

    &.active {
        background: var(--primary-500);
        color: white;
        border-color: var(--primary-600);
        box-shadow: 0 2px 8px var(--primary-200);
    }
}

.price-inputs {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--spacing-sm);

    span {
        text-align: center;
        font-size: var(--font-size-sm);
    }
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
}

@media (max-width: 768px) {
    .preview-container {
        grid-template-columns: 1fr;
    }
}
</style>
