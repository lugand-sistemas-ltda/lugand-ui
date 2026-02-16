<script setup lang="ts">
/**
 * FileUpload - Componente de upload de arquivos com drag & drop
 * 
 * Features:
 * - Drag & drop zone com feedback visual
 * - Click para selecionar arquivos
 * - Validação client-side (tipo, tamanho, quantidade)
 * - Preview de imagens automático
 * - Múltiplos arquivos ou único
 * - Estados: idle, dragover, uploading, error
 * 
 * UI-only: Não faz upload real, apenas emite eventos com arquivos selecionados
 * App cliente deve implementar o upload real (axios, FormData, etc)
 */
import { ref, computed } from 'vue'

export interface Props {
    /** Tipos de arquivo aceitos (ex: "image/*", ".pdf,.doc", etc) */
    accept?: string
    /** Permite múltiplos arquivos */
    multiple?: boolean
    /** Tamanho máximo por arquivo em bytes (ex: 5242880 = 5MB) */
    maxSize?: number
    /** Número máximo de arquivos permitidos */
    maxFiles?: number
    /** Desabilita o upload */
    disabled?: boolean
    /** Mostra preview de imagens */
    showPreview?: boolean
    /** Label customizado */
    label?: string
    /** Hint/descrição */
    hint?: string
}

const props = withDefaults(defineProps<Props>(), {
    accept: '*',
    multiple: false,
    maxSize: 10485760, // 10MB padrão
    maxFiles: 10,
    disabled: false,
    showPreview: true,
    label: 'Enviar arquivos',
    hint: 'Arraste arquivos aqui ou clique para selecionar'
})

interface Emits {
    (e: 'change', files: File[]): void
    (e: 'error', error: { type: 'size' | 'type' | 'count', message: string, file?: File }): void
}

const emit = defineEmits<Emits>()

// State
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const previews = ref<Map<string, string>>(new Map())

// Computed
const acceptedTypes = computed(() => {
    if (props.accept === '*') return []
    return props.accept.split(',').map(t => t.trim())
})

const formattedMaxSize = computed(() => {
    const mb = props.maxSize / 1024 / 1024
    return mb >= 1 ? `${mb.toFixed(0)}MB` : `${(props.maxSize / 1024).toFixed(0)}KB`
})

// Methods
function handleClick() {
    if (props.disabled) return
    fileInput.value?.click()
}

function handleDragEnter(e: DragEvent) {
    e.preventDefault()
    if (props.disabled) return
    isDragging.value = true
}

function handleDragOver(e: DragEvent) {
    e.preventDefault()
    if (props.disabled) return
    isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    // Só remove dragging se saiu da drop zone completamente
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    if (
        e.clientX <= rect.left ||
        e.clientX >= rect.right ||
        e.clientY <= rect.top ||
        e.clientY >= rect.bottom
    ) {
        isDragging.value = false
    }
}

function handleDrop(e: DragEvent) {
    e.preventDefault()
    isDragging.value = false

    if (props.disabled) return

    const files = Array.from(e.dataTransfer?.files || [])
    processFiles(files)
}

function handleFileInput(e: Event) {
    const files = Array.from((e.target as HTMLInputElement).files || [])
    processFiles(files)
}

function processFiles(files: File[]) {
    // Validação: quantidade
    if (files.length > props.maxFiles) {
        emit('error', {
            type: 'count',
            message: `Máximo de ${props.maxFiles} arquivo(s) permitido(s)`
        })
        return
    }

    // Se não é múltiplo, aceita apenas 1
    if (!props.multiple && files.length > 1) {
        emit('error', {
            type: 'count',
            message: 'Apenas 1 arquivo permitido'
        })
        return
    }

    // Validação: tipo e tamanho
    const validFiles: File[] = []

    for (const file of files) {
        // Validar tipo
        if (acceptedTypes.value.length > 0) {
            const isValid = acceptedTypes.value.some(type => {
                if (type.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(type.toLowerCase())
                }
                if (type.includes('*')) {
                    const [category] = type.split('/')
                    return file.type.startsWith(category)
                }
                return file.type === type
            })

            if (!isValid) {
                emit('error', {
                    type: 'type',
                    message: `Tipo de arquivo não permitido: ${file.name}`,
                    file
                })
                continue
            }
        }

        // Validar tamanho
        if (file.size > props.maxSize) {
            emit('error', {
                type: 'size',
                message: `Arquivo muito grande: ${file.name} (máx: ${formattedMaxSize.value})`,
                file
            })
            continue
        }

        validFiles.push(file)
    }

    if (validFiles.length > 0) {
        selectedFiles.value = validFiles

        // Gerar previews de imagens
        if (props.showPreview) {
            generatePreviews(validFiles)
        }

        emit('change', validFiles)
    }

    // Limpa input para permitir reselect do mesmo arquivo
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

function generatePreviews(files: File[]) {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result as string
                previews.value.set(file.name, result)
            }
            reader.readAsDataURL(file)
        }
    })
}

function removeFile(index: number) {
    selectedFiles.value.splice(index, 1)
    emit('change', selectedFiles.value)
}

function clearFiles() {
    selectedFiles.value = []
    previews.value.clear()
    emit('change', [])
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Expõe métodos para controle externo
defineExpose({
    clearFiles,
    selectedFiles
})
</script>

<template>
    <div class="file-upload">
        <!-- Label -->
        <label v-if="label" class="file-upload__label">
            {{ label }}
            <span v-if="!multiple" class="file-upload__label-badge">Único arquivo</span>
            <span v-else class="file-upload__label-badge">Até {{ maxFiles }} arquivos</span>
        </label>

        <!-- Drop Zone -->
        <div :class="[
            'file-upload__zone',
            {
                'file-upload__zone--dragging': isDragging,
                'file-upload__zone--disabled': disabled,
                'file-upload__zone--has-files': selectedFiles.length > 0
            }
        ]" @click="handleClick" @dragenter="handleDragEnter" @dragover="handleDragOver" @dragleave="handleDragLeave"
            @drop="handleDrop">
            <!-- Icon -->
            <div class="file-upload__icon">
                <span v-if="!isDragging">📁</span>
                <span v-else>⬇️</span>
            </div>

            <!-- Content -->
            <div class="file-upload__content">
                <p class="file-upload__hint">
                    {{ isDragging ? 'Solte os arquivos aqui' : hint }}
                </p>
                <p class="file-upload__details">
                    <span v-if="accept !== '*'">{{ accept }}</span>
                    <span v-if="accept !== '*' && maxSize"> • </span>
                    <span>Máx: {{ formattedMaxSize }}</span>
                </p>
            </div>

            <!-- Hidden Input -->
            <input ref="fileInput" type="file" :accept="accept" :multiple="multiple" :disabled="disabled"
                class="file-upload__input" @change="handleFileInput" />
        </div>

        <!-- Selected Files Preview -->
        <div v-if="selectedFiles.length > 0" class="file-upload__preview">
            <div class="file-upload__preview-header">
                <h4>{{ selectedFiles.length }} arquivo(s) selecionado(s)</h4>
                <button type="button" class="file-upload__clear-btn" @click="clearFiles">
                    Limpar
                </button>
            </div>

            <div class="file-upload__files">
                <div v-for="(file, index) in selectedFiles" :key="file.name + index" class="file-upload__file">
                    <!-- Image Preview -->
                    <div v-if="showPreview && previews.has(file.name)" class="file-upload__file-preview">
                        <img :src="previews.get(file.name)" :alt="file.name" />
                    </div>

                    <!-- File Icon (fallback) -->
                    <div v-else class="file-upload__file-icon">
                        <span v-if="file.type.startsWith('image/')">🖼️</span>
                        <span v-else-if="file.type.includes('pdf')">📄</span>
                        <span v-else-if="file.type.includes('sheet') || file.type.includes('excel')">📊</span>
                        <span v-else-if="file.type.includes('document') || file.type.includes('word')">📝</span>
                        <span v-else-if="file.type.includes('zip') || file.type.includes('rar')">📦</span>
                        <span v-else>📎</span>
                    </div>

                    <!-- File Info -->
                    <div class="file-upload__file-info">
                        <p class="file-upload__file-name">{{ file.name }}</p>
                        <p class="file-upload__file-size">{{ formatFileSize(file.size) }}</p>
                    </div>

                    <!-- Remove Button -->
                    <button type="button" class="file-upload__file-remove" @click="removeFile(index)"
                        title="Remover arquivo">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.file-upload {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);

    &__label {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-primary);
    }

    &__label-badge {
        display: inline-flex;
        align-items: center;
        padding: var(--spacing-3xs) var(--spacing-xs);
        font-size: var(--font-size-xs);
        font-weight: 500;
        color: var(--color-text-secondary);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-sm);
    }

    &__zone {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        padding: var(--spacing-xl);
        border: 2px dashed var(--color-border-base);
        border-radius: var(--radius-lg);
        background: var(--color-bg-secondary);
        cursor: pointer;
        transition: all var(--transition-base);

        &:hover:not(&--disabled) {
            border-color: var(--color-primary);
            background: var(--color-bg-primary);
        }

        &--dragging {
            border-color: var(--color-primary);
            background: var(--color-primary-bg);
            transform: scale(1.02);
        }

        &--disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        &--has-files {
            border-style: solid;
            border-color: var(--color-success);
        }
    }

    &__icon {
        font-size: 3rem;
        opacity: 0.6;
        transition: transform var(--transition-base);

        .file-upload__zone:hover & {
            transform: scale(1.1);
        }

        .file-upload__zone--dragging & {
            transform: scale(1.2);
            animation: bounce 0.5s ease infinite;
        }
    }

    &__content {
        text-align: center;
    }

    &__hint {
        margin: 0 0 var(--spacing-xs) 0;
        font-size: var(--font-size-base);
        font-weight: 500;
        color: var(--color-text-primary);
    }

    &__details {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    &__input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        pointer-events: none;
    }

    &__preview {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    &__preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
            margin: 0;
            font-size: var(--font-size-sm);
            font-weight: 600;
            color: var(--color-text-primary);
        }
    }

    &__clear-btn {
        padding: var(--spacing-2xs) var(--spacing-sm);
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-danger);
        background: transparent;
        border: 1px solid var(--color-danger);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-base);

        &:hover {
            color: var(--color-bg-primary);
            background: var(--color-danger);
        }
    }

    &__files {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    &__file {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border-base);
        border-radius: var(--radius-md);
        transition: all var(--transition-base);

        &:hover {
            border-color: var(--color-primary);
            background: var(--color-bg-primary);
        }
    }

    &__file-preview {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: var(--radius-sm);
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__file-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        font-size: 1.5rem;
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-sm);
    }

    &__file-info {
        flex: 1;
        min-width: 0;
    }

    &__file-name {
        margin: 0 0 var(--spacing-3xs) 0;
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__file-size {
        margin: 0;
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
    }

    &__file-remove {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-base);

        &:hover {
            color: var(--color-danger);
            background: var(--color-danger-bg);
        }
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}
</style>
