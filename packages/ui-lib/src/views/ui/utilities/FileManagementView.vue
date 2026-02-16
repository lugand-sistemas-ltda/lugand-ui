<script setup lang="ts">
import { ref } from 'vue'
import {
    FileUpload,
    FileList,
    Card,
    Button,
    ComponentShowcase,
    CodeBlock,
    type FileItem
} from '@/shared/components'
import { useToast } from '@/modules/toast'

const toast = useToast()

// State
const uploadedFiles = ref<FileItem[]>([])
const singleFile = ref<FileItem[]>([])
const imageFiles = ref<FileItem[]>([])
const documentFiles = ref<FileItem[]>([])

// File ID counter
let fileIdCounter = 1

// Handlers
function handleFileUpload(files: File[]) {
    toast.info(`⏳ Enviando ${files.length} arquivo(s)...`)

    // Mock upload com setTimeout (simula API call)
    files.forEach((file, index) => {
        setTimeout(() => {
            const fileItem: FileItem = {
                id: fileIdCounter++,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadedAt: new Date(),
                url: URL.createObjectURL(file), // URL local para preview/download
                loading: false
            }

            uploadedFiles.value.push(fileItem)
            toast.success(`✅ ${file.name} enviado com sucesso!`)
        }, 1000 + (index * 500)) // Stagger uploads
    })
}

function handleSingleFileUpload(files: File[]) {
    if (files.length === 0) return

    toast.info('⏳ Processando arquivo...')

    setTimeout(() => {
        const file = files[0]
        const fileItem: FileItem = {
            id: fileIdCounter++,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
            url: URL.createObjectURL(file),
            loading: false
        }

        singleFile.value = [fileItem]
        toast.success(`✅ Arquivo ${file.name} carregado!`)
    }, 1200)
}

function handleImageUpload(files: File[]) {
    toast.info(`⏳ Enviando ${files.length} imagem(ns)...`)

    files.forEach((file, index) => {
        setTimeout(() => {
            const fileItem: FileItem = {
                id: fileIdCounter++,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadedAt: new Date(),
                url: URL.createObjectURL(file),
                loading: false
            }

            imageFiles.value.push(fileItem)
            toast.success(`✅ Imagem ${file.name} enviada!`)
        }, 800 + (index * 400))
    })
}

function handleDocumentUpload(files: File[]) {
    toast.info(`⏳ Enviando ${files.length} documento(s)...`)

    files.forEach((file, index) => {
        setTimeout(() => {
            const fileItem: FileItem = {
                id: fileIdCounter++,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadedAt: new Date(),
                url: URL.createObjectURL(file),
                loading: false
            }

            documentFiles.value.push(fileItem)
            toast.success(`✅ Documento ${file.name} enviado!`)
        }, 1000 + (index * 500))
    })
}

function handleUploadError(error: { type: string, message: string, file?: File }) {
    toast.error(`❌ ${error.message}`)
    console.error('Upload error:', error)
}

function handleFileDownload(file: FileItem) {
    toast.info(`⬇️ Baixando ${file.name}...`)

    // Mock download: criar link temporário
    if (file.url) {
        const a = document.createElement('a')
        a.href = file.url
        a.download = file.name
        a.click()
        toast.success(`✅ Download iniciado!`)
    }
}

function handleFileDelete(file: FileItem, list: 'uploaded' | 'single' | 'images' | 'documents') {
    toast.warning(`🗑️ Excluindo ${file.name}...`)

    setTimeout(() => {
        let targetList: FileItem[]

        switch (list) {
            case 'uploaded':
                targetList = uploadedFiles.value
                break
            case 'single':
                targetList = singleFile.value
                break
            case 'images':
                targetList = imageFiles.value
                break
            case 'documents':
                targetList = documentFiles.value
                break
        }

        const index = targetList.findIndex(f => f.id === file.id)
        if (index !== -1) {
            targetList.splice(index, 1)
            toast.success(`✅ ${file.name} excluído!`)

            // Revogar URL blob
            if (file.url) {
                URL.revokeObjectURL(file.url)
            }
        }
    }, 500)
}

function handleFilePreview(file: FileItem) {
    if (!file.url) {
        toast.error('❌ URL de preview não disponível')
        return
    }

    // Abrir preview em nova aba
    window.open(file.url, '_blank')
    toast.info(`👁️ Abrindo preview de ${file.name}`)
}

function clearAll(list: 'uploaded' | 'single' | 'images' | 'documents') {
    let targetList: FileItem[]
    let listName: string

    switch (list) {
        case 'uploaded':
            targetList = uploadedFiles.value
            listName = 'todos os arquivos'
            break
        case 'single':
            targetList = singleFile.value
            listName = 'arquivo único'
            break
        case 'images':
            targetList = imageFiles.value
            listName = 'imagens'
            break
        case 'documents':
            targetList = documentFiles.value
            listName = 'documentos'
            break
    }

    // Revogar todas as URLs
    targetList.forEach(file => {
        if (file.url) {
            URL.revokeObjectURL(file.url)
        }
    })

    targetList.splice(0, targetList.length)
    toast.success(`✅ ${listName} limpo(s)!`)
}
</script>

<template>
    <div class="file-management-view">
        <div class="header">
            <h1>File Management</h1>
            <p class="lead">Componentes para upload, visualização e gerenciamento de arquivos.</p>
        </div>

        <!-- FILEUPLOAD -->
        <ComponentShowcase title="FileUpload"
            description="Componente de upload com drag & drop, validação client-side, e preview de imagens.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Upload Múltiplo (até 5 arquivos, 10MB cada)</h4>
                    <FileUpload :multiple="true" :max-files="5" :max-size="10485760" accept="*"
                        label="Enviar Múltiplos Arquivos" hint="Arraste arquivos aqui ou clique para selecionar"
                        @change="handleFileUpload" @error="handleUploadError" />
                </div>

                <div class="showcase-group">
                    <h4>Upload Único (1 arquivo apenas)</h4>
                    <FileUpload :multiple="false" :max-size="5242880" accept="*" label="Enviar Arquivo Único"
                        hint="Clique para selecionar 1 arquivo (máx: 5MB)" @change="handleSingleFileUpload"
                        @error="handleUploadError" />
                </div>

                <div class="showcase-group">
                    <h4>Upload de Imagens (jpg, png, gif - até 3 imagens)</h4>
                    <FileUpload :multiple="true" :max-files="3" :max-size="5242880"
                        accept="image/jpeg,image/png,image/gif" label="Enviar Imagens" hint="Apenas JPG, PNG, GIF"
                        :show-preview="true" @change="handleImageUpload" @error="handleUploadError" />
                </div>

                <div class="showcase-group">
                    <h4>Upload de Documentos (pdf, doc, xls - até 5 arquivos)</h4>
                    <FileUpload :multiple="true" :max-files="5" :max-size="10485760" accept=".pdf,.doc,.docx,.xls,.xlsx"
                        label="Enviar Documentos" hint="PDF, Word, Excel permitidos" :show-preview="false"
                        @change="handleDocumentUpload" @error="handleUploadError" />
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- Upload Múltiplo -->
<FileUpload
  :multiple='true'
  :max-files='5'
  :max-size='10485760'
  accept='*'
  label='Enviar Múltiplos Arquivos'
  @change='handleFileUpload'
  @error='handleUploadError'
/>

<!-- Upload Único -->
<FileUpload
  :multiple='false'
  :max-size='5242880'
  label='Enviar Arquivo Único'
  @change='handleSingleFileUpload'
/>

<!-- Upload de Imagens com Preview -->
<FileUpload
  :multiple='true'
  :max-files='3'
  accept='image/jpeg,image/png,image/gif'
  :show-preview='true'
  @change='handleImageUpload'
/>

<!-- Upload de Documentos -->
<FileUpload
  accept='.pdf,.doc,.docx,.xls,.xlsx'
  label='Enviar Documentos'
  @change='handleDocumentUpload'
/>

<!-- Handler -->
<script setup>
function handleFileUpload(files: File[]) {
  // Simular upload (setTimeout mock)
  files.forEach(file => {
    // Criar FormData para upload real
    const formData = new FormData()
    formData.append('file', file)
    
    // axios.post('/api/upload', formData)
  })
}
</script>" />
            </template>
        </ComponentShowcase>

        <!-- FILELIST -->
        <ComponentShowcase title="FileList" description="Lista de arquivos com ações (download, delete, preview).">
            <template #preview>
                <div class="showcase-group">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <h4 style="margin: 0;">Arquivos Enviados ({{ uploadedFiles.length }})</h4>
                        <Button v-if="uploadedFiles.length > 0" variant="danger" size="sm"
                            @click="clearAll('uploaded')">
                            Limpar Todos
                        </Button>
                    </div>
                    <FileList :files="uploadedFiles" :show-actions="true" :compact="false"
                        empty-message="Nenhum arquivo enviado ainda. Use o upload acima."
                        @download="(file) => handleFileDownload(file)"
                        @delete="(file) => handleFileDelete(file, 'uploaded')"
                        @preview="(file) => handleFilePreview(file)" />
                </div>

                <div class="showcase-group">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <h4 style="margin: 0;">Arquivo Único</h4>
                        <Button v-if="singleFile.length > 0" variant="danger" size="sm" @click="clearAll('single')">
                            Limpar
                        </Button>
                    </div>
                    <FileList :files="singleFile" :show-actions="true" @download="(file) => handleFileDownload(file)"
                        @delete="(file) => handleFileDelete(file, 'single')"
                        @preview="(file) => handleFilePreview(file)" />
                </div>

                <div class="showcase-group">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <h4 style="margin: 0;">Imagens ({{ imageFiles.length }})</h4>
                        <Button v-if="imageFiles.length > 0" variant="danger" size="sm" @click="clearAll('images')">
                            Limpar Imagens
                        </Button>
                    </div>
                    <FileList :files="imageFiles" :show-actions="true" @download="(file) => handleFileDownload(file)"
                        @delete="(file) => handleFileDelete(file, 'images')"
                        @preview="(file) => handleFilePreview(file)" />
                </div>

                <div class="showcase-group">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <h4 style="margin: 0;">Documentos ({{ documentFiles.length }})</h4>
                        <Button v-if="documentFiles.length > 0" variant="danger" size="sm"
                            @click="clearAll('documents')">
                            Limpar Documentos
                        </Button>
                    </div>
                    <FileList :files="documentFiles" :show-actions="true" :compact="false"
                        @download="(file) => handleFileDownload(file)"
                        @delete="(file) => handleFileDelete(file, 'documents')"
                        @preview="(file) => handleFilePreview(file)" />
                </div>

                <div class="showcase-group">
                    <h4>Modo Compacto</h4>
                    <FileList :files="uploadedFiles.slice(0, 3)" :show-actions="true" :compact="true"
                        @download="(file) => handleFileDownload(file)"
                        @delete="(file) => handleFileDelete(file, 'uploaded')" />
                </div>
            </template>

            <template #code>
                <CodeBlock code="<!-- FileList Completo -->
<FileList
  :files='uploadedFiles'
  :show-actions='true'
  :compact='false'
  @download='handleFileDownload'
  @delete='handleFileDelete'
  @preview='handleFilePreview'
/>

<!-- Modo Compacto -->
<FileList
  :files='files'
  :compact='true'
/>

<!-- Tipos -->
<script setup>
interface FileItem {
  id: string | number
  name: string
  size: number
  type: string // MIME type
  url?: string
  uploadedAt?: Date | string
  loading?: boolean
}

function handleFileDownload(file: FileItem) {
  // Implementar download real
  const a = document.createElement('a')
  a.href = file.url!
  a.download = file.name
  a.click()
}

function handleFileDelete(file: FileItem) {
  // Deletar do backend
  // await axios.delete(`/api/files/${file.id}`)
  
  // Remover da lista
  const index = files.value.findIndex(f => f.id === file.id)
  files.value.splice(index, 1)
}
</script>" />
            </template>
        </ComponentShowcase>

        <!-- BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 File Management - Boas Práticas</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Validação Client-Side</strong>: FileUpload valida tipo, tamanho, quantidade antes de emitir
                    @change</li>
                <li><strong>Preview Automático</strong>: Imagens geram preview com FileReader + URL.createObjectURL()
                </li>
                <li><strong>UI-only Pattern</strong>: Componentes emitem eventos, app cliente faz upload real (FormData
                    +
                    axios)</li>
                <li><strong>Feedback Visual</strong>: Toasts para sucesso/erro, estados de loading, drag feedback</li>
                <li><strong>Ícones Inteligentes</strong>: FileIcon detecta tipo por MIME type e extensão (fallback)</li>
                <li><strong>Múltiplas Listas</strong>: Pode ter várias FileList independentes (imagens, docs, pdfs)</li>
                <li><strong>Memory Management</strong>: Revogar URLs blob com URL.revokeObjectURL() ao deletar</li>
                <li><strong>Mocks em Showcases</strong>: setTimeout simula API, URL.createObjectURL para preview local
                </li>
            </ul>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.file-management-view {
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
