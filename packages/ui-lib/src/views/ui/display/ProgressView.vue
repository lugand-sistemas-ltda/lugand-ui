<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    ProgressBar,
    ProgressCircle,
    Card,
    Button,
    ComponentShowcase,
    CodeBlock,
    GridContainer
} from '@/shared/components'

// Estados para exemplos interativos
const uploadProgress = ref(0)
const downloadProgress = ref(0)
const isUploading = ref(false)
const isDownloading = ref(false)

// Simular upload
function startUpload() {
    isUploading.value = true
    uploadProgress.value = 0

    const interval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
            clearInterval(interval)
            setTimeout(() => {
                isUploading.value = false
                uploadProgress.value = 0
            }, 1000)
        }
    }, 300)
}

// Simular download
function startDownload() {
    isDownloading.value = true
    downloadProgress.value = 0

    const interval = setInterval(() => {
        downloadProgress.value += 5
        if (downloadProgress.value >= 100) {
            clearInterval(interval)
            setTimeout(() => {
                isDownloading.value = false
                downloadProgress.value = 0
            }, 1000)
        }
    }, 200)
}

// Progresso animado contínuo (demo)
const continuousProgress = ref(0)
onMounted(() => {
    setInterval(() => {
        continuousProgress.value = (continuousProgress.value + 1) % 101
    }, 100)
})
</script>

<template>
    <div class="progress-view">
        <div class="header">
            <h1>Progress Indicators</h1>
            <p class="lead">Componentes para exibir progresso e carregamento de forma visual.</p>
        </div>

        <!-- PROGRESSBAR -->
        <ComponentShowcase title="ProgressBar"
            description="Barra de progresso horizontal para indicar conclusão de tarefas, carregamento de arquivos, metas, etc.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Básico</h4>
                    <ProgressBar :value="75" />
                </div>

                <div class="showcase-group">
                    <h4>Com Label e Porcentagem</h4>
                    <ProgressBar :value="60" label="Carregando arquivos..." show-percentage />
                </div>

                <div class="showcase-group">
                    <h4>Variantes (Cores)</h4>
                    <div style="display: grid; gap: var(--spacing-md);">
                        <ProgressBar :value="100" variant="success" label="Completo" show-percentage />
                        <ProgressBar :value="75" variant="primary" label="Em progresso" show-percentage />
                        <ProgressBar :value="50" variant="info" label="Processando" show-percentage />
                        <ProgressBar :value="30" variant="warning" label="Atenção" show-percentage />
                        <ProgressBar :value="15" variant="danger" label="Crítico" show-percentage />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div style="display: grid; gap: var(--spacing-md);">
                        <ProgressBar :value="60" size="sm" label="Small" show-percentage />
                        <ProgressBar :value="60" size="md" label="Medium" show-percentage />
                        <ProgressBar :value="60" size="lg" label="Large" show-percentage />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Padrão Listrado (Striped)</h4>
                    <div style="display: grid; gap: var(--spacing-md);">
                        <ProgressBar :value="75" variant="primary" striped label="Striped estático" />
                        <ProgressBar :value="75" variant="success" striped animated label="Striped animado" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Exemplo Interativo - Upload</h4>
                    <Card padding="md">
                        <Button :disabled="isUploading" @click="startUpload">
                            {{ isUploading ? 'Enviando...' : 'Simular Upload' }}
                        </Button>
                        <div style="margin-top: var(--spacing-md);">
                            <ProgressBar :value="uploadProgress" variant="primary" label="Upload de arquivo"
                                show-percentage striped :animated="isUploading" />
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Exemplo: Metas de Vendas</h4>
                    <div style="display: grid; gap: var(--spacing-md);">
                        <ProgressBar :value="85" variant="success" label="Meta Mensal - R$ 85.000 / R$ 100.000"
                            show-percentage />
                        <ProgressBar :value="65" variant="primary" label="Meta Trimestral - 65%" show-percentage />
                        <ProgressBar :value="45" variant="warning" label="Meta Anual - 45%" show-percentage />
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Básico -->
<ProgressBar :value='75' />

<!-- Com label e porcentagem -->
<ProgressBar 
  :value='60' 
  label='Carregando arquivos...' 
  show-percentage 
/>

<!-- Variantes -->
<ProgressBar :value='100' variant='success' />
<ProgressBar :value='50' variant='warning' />
<ProgressBar :value='15' variant='danger' />

<!-- Sizes -->
<ProgressBar :value='60' size='sm' />
<ProgressBar :value='60' size='lg' />

<!-- Striped e animado -->
<ProgressBar :value='75' striped animated />

<!-- Exemplo interativo -->
<ProgressBar 
  :value='uploadProgress' 
  variant='primary' 
  label='Upload de arquivo'
  show-percentage
  striped
  :animated='isUploading'
/>" />
            </template>
        </ComponentShowcase>

        <!-- PROGRESSCIRCLE -->
        <ComponentShowcase title="ProgressCircle"
            description="Progresso circular para dashboards, KPIs e visualizações compactas.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Básico</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap;">
                        <ProgressCircle :value="25" />
                        <ProgressCircle :value="50" />
                        <ProgressCircle :value="75" />
                        <ProgressCircle :value="100" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Com Label</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap;">
                        <ProgressCircle :value="60" label="Completo" />
                        <ProgressCircle :value="80" label="Progresso" />
                        <ProgressCircle :value="100" label="Concluído" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Variantes (Cores)</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: flex-start;">
                        <ProgressCircle :value="100" variant="success" label="Success" />
                        <ProgressCircle :value="75" variant="primary" label="Primary" />
                        <ProgressCircle :value="60" variant="info" label="Info" />
                        <ProgressCircle :value="40" variant="warning" label="Warning" />
                        <ProgressCircle :value="20" variant="danger" label="Danger" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap; align-items: flex-end;">
                        <ProgressCircle :value="75" size="sm" label="Small" />
                        <ProgressCircle :value="75" size="md" label="Medium" />
                        <ProgressCircle :value="75" size="lg" label="Large" />
                        <ProgressCircle :value="75" size="xl" label="XLarge" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Espessura da Linha (Stroke Width)</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap;">
                        <ProgressCircle :value="75" :stroke-width="4" label="Thin (4px)" />
                        <ProgressCircle :value="75" :stroke-width="8" label="Normal (8px)" />
                        <ProgressCircle :value="75" :stroke-width="12" label="Thick (12px)" />
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Conteúdo Customizado (Slot)</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap;">
                        <ProgressCircle :value="75" size="lg">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700;">75</div>
                                <div style="font-size: 0.75rem; color: var(--color-text-secondary);">Tasks</div>
                            </div>
                        </ProgressCircle>
                        <ProgressCircle :value="60" variant="success" size="lg">
                            <div style="text-align: center;">
                                <div style="font-size: 1.25rem; font-weight: 700;">3/5</div>
                                <div style="font-size: 0.75rem; color: var(--color-text-secondary);">Days</div>
                            </div>
                        </ProgressCircle>
                        <ProgressCircle :value="85" variant="primary" size="lg">
                            <div style="text-align: center;">
                                <div style="font-size: 1rem;">🎯</div>
                                <div style="font-size: 0.875rem; font-weight: 700;">85%</div>
                            </div>
                        </ProgressCircle>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Exemplo Interativo - Download</h4>
                    <Card padding="md">
                        <div
                            style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-lg);">
                            <ProgressCircle :value="downloadProgress" variant="primary" size="xl" label="Download" />
                            <Button :disabled="isDownloading" @click="startDownload">
                                {{ isDownloading ? 'Baixando...' : 'Simular Download' }}
                            </Button>
                        </div>
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Dashboard KPIs</h4>
                    <GridContainer :cols="4" gap="md" style="max-width: 800px;">
                        <Card padding="md">
                            <div
                                style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm);">
                                <ProgressCircle :value="92" variant="success" size="lg" />
                                <div style="text-align: center;">
                                    <div style="font-weight: 600; color: var(--color-text-primary);">Customer
                                        Satisfaction</div>
                                    <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Excellent
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card padding="md">
                            <div
                                style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm);">
                                <ProgressCircle :value="78" variant="primary" size="lg" />
                                <div style="text-align: center;">
                                    <div style="font-weight: 600; color: var(--color-text-primary);">Goal Progress</div>
                                    <div style="font-size: 0.875rem; color: var(--color-text-secondary);">On Track</div>
                                </div>
                            </div>
                        </Card>
                        <Card padding="md">
                            <div
                                style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm);">
                                <ProgressCircle :value="45" variant="warning" size="lg" />
                                <div style="text-align: center;">
                                    <div style="font-weight: 600; color: var(--color-text-primary);">Storage Used</div>
                                    <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Moderate</div>
                                </div>
                            </div>
                        </Card>
                        <Card padding="md">
                            <div
                                style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm);">
                                <ProgressCircle :value="continuousProgress" variant="info" size="lg" />
                                <div style="text-align: center;">
                                    <div style="font-weight: 600; color: var(--color-text-primary);">Processing</div>
                                    <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Live Demo
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </GridContainer>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Básico -->
<ProgressCircle :value='75' />

<!-- Com label -->
<ProgressCircle :value='60' label='Completo' />

<!-- Variantes -->
<ProgressCircle :value='100' variant='success' />
<ProgressCircle :value='40' variant='warning' />

<!-- Sizes -->
<ProgressCircle :value='75' size='sm' />
<ProgressCircle :value='75' size='xl' />

<!-- Stroke width -->
<ProgressCircle :value='75' :stroke-width='12' />

<!-- Conteúdo customizado -->
<ProgressCircle :value='75' size='lg'>
  <div style='text-align: center'>
    <div style='font-size: 1.5rem; font-weight: 700'>75</div>
    <div style='font-size: 0.75rem'>Tasks</div>
  </div>
</ProgressCircle>

<!-- Exemplo Dashboard KPI -->
<Card>
  <ProgressCircle :value='92' variant='success' size='lg' />
  <div>Customer Satisfaction</div>
</Card>" />
            </template>
        </ComponentShowcase>

        <!-- PADRÕES E BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 Quando Usar Progress Indicators</h3>
            <div style="display: grid; gap: var(--spacing-md);">
                <div>
                    <strong>ProgressBar (Horizontal):</strong>
                    <ul style="margin-top: var(--spacing-xs); line-height: 1.8;">
                        <li>Upload/Download de arquivos</li>
                        <li>Processamento de dados em etapas</li>
                        <li>Metas e objetivos lineares</li>
                        <li>Formulários multi-step</li>
                        <li>Quando o espaço horizontal está disponível</li>
                    </ul>
                </div>
                <div>
                    <strong>ProgressCircle (Circular):</strong>
                    <ul style="margin-top: var(--spacing-xs); line-height: 1.8;">
                        <li>Dashboards e KPIs visuais</li>
                        <li>Estatísticas compactas em cards</li>
                        <li>Percentuais de conclusão</li>
                        <li>Métricas de performance</li>
                        <li>Quando o espaço é limitado</li>
                    </ul>
                </div>
            </div>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.progress-view {
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

.showcase-group {
    margin-bottom: var(--spacing-lg);

    &:last-child {
        margin-bottom: 0;
    }

    h4 {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
    }
}
</style>
