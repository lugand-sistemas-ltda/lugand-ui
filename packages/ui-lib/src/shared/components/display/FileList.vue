<script setup lang="ts">
/**
 * FileList - Lista de arquivos com ações
 * 
 * Exibe lista de arquivos com:
 * - Ícone por tipo (usando FileIcon)
 * - Nome, tamanho, data
 * - Botões de ação (download, delete, preview)
 * - Estados de loading por arquivo
 * - Modo compacto
 * 
 * UI-only: Emite eventos, app cliente trata download/delete/preview real
 */
import FileIcon from '../primitives/FileIcon.vue'

export interface FileItem {
    id: string | number
    name: string
    size: number
    type: string // MIME type
    url?: string // URL para download/preview
    uploadedAt?: Date | string
    loading?: boolean // Estado de loading individual
}

export interface Props {
    /** Array de arquivos para exibir */
    files: FileItem[]
    /** Mostra botões de ação */
    showActions?: boolean
    /** Modo compacto (menos informações) */
    compact?: boolean
    /** Loading global (todos os arquivos) */
    loading?: boolean
    /** Mensagem quando lista vazia */
    emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
    showActions: true,
    compact: false,
    loading: false,
    emptyMessage: 'Nenhum arquivo encontrado'
})

interface Emits {
    (e: 'download', file: FileItem): void
    (e: 'delete', file: FileItem): void
    (e: 'preview', file: FileItem): void
}

const emit = defineEmits<Emits>()

// Methods
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(date: Date | string | undefined): string {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
}

function canPreview(file: FileItem): boolean {
    return file.type.startsWith('image/') || file.type.includes('pdf')
}

function handleDownload(file: FileItem) {
    emit('download', file)
}

function handleDelete(file: FileItem) {
    emit('delete', file)
}

function handlePreview(file: FileItem) {
    if (canPreview(file)) {
        emit('preview', file)
    }
}
</script>

<template>
    <div :class="['file-list', { 'file-list--compact': compact }]">
        <!-- Loading State -->
        <div v-if="loading" class="file-list__loading">
            <div class="file-list__spinner"></div>
            <p>Carregando arquivos...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="files.length === 0" class="file-list__empty">
            <span class="file-list__empty-icon">📂</span>
            <p>{{ emptyMessage }}</p>
        </div>

        <!-- Files List -->
        <div v-else class="file-list__items">
            <div v-for="file in files" :key="file.id"
                :class="['file-list__item', { 'file-list__item--loading': file.loading }]">
                <!-- Icon -->
                <div class="file-list__item-icon">
                    <FileIcon :mime-type="file.type" :file-name="file.name" :size="compact ? 'sm' : 'md'" />
                </div>

                <!-- Info -->
                <div class="file-list__item-info">
                    <p class="file-list__item-name" :title="file.name">
                        {{ file.name }}
                    </p>
                    <div v-if="!compact" class="file-list__item-meta">
                        <span class="file-list__item-size">{{ formatFileSize(file.size) }}</span>
                        <span v-if="file.uploadedAt" class="file-list__item-date">
                            • {{ formatDate(file.uploadedAt) }}
                        </span>
                    </div>
                </div>

                <!-- Loading Spinner (individual) -->
                <div v-if="file.loading" class="file-list__item-spinner"></div>

                <!-- Actions -->
                <div v-else-if="showActions" class="file-list__item-actions">
                    <!-- Preview (só para imagens e PDFs) -->
                    <button v-if="canPreview(file)" type="button"
                        class="file-list__action-btn file-list__action-btn--preview" title="Visualizar"
                        @click="handlePreview(file)">
                        👁️
                    </button>

                    <!-- Download -->
                    <button type="button" class="file-list__action-btn file-list__action-btn--download" title="Download"
                        @click="handleDownload(file)">
                        ⬇️
                    </button>

                    <!-- Delete -->
                    <button type="button" class="file-list__action-btn file-list__action-btn--delete" title="Excluir"
                        @click="handleDelete(file)">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.file-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);

    &__loading,
    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        padding: var(--spacing-xl);
        text-align: center;
        color: var(--color-text-secondary);
        background: var(--color-bg-secondary);
        border: 1px dashed var(--color-border-base);
        border-radius: var(--radius-lg);

        p {
            margin: 0;
            font-size: var(--font-size-sm);
        }
    }

    &__spinner {
        width: 32px;
        height: 32px;
        border: 3px solid var(--color-border-base);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    &__empty-icon {
        font-size: 3rem;
        opacity: 0.5;
    }

    &__items {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    &__item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border-base);
        border-radius: var(--radius-md);
        transition: all var(--transition-base);

        &:hover:not(&--loading) {
            border-color: var(--color-primary);
            background: var(--color-bg-primary);
        }

        &--loading {
            opacity: 0.6;
            pointer-events: none;
        }
    }

    &__item-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-sm);
    }

    &__item-info {
        flex: 1;
        min-width: 0;
    }

    &__item-name {
        margin: 0 0 var(--spacing-3xs) 0;
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__item-meta {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
    }

    &__item-spinner {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border: 2px solid var(--color-border-base);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    &__item-actions {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: var(--spacing-2xs);
    }

    &__action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: var(--font-size-base);
        background: transparent;
        border: 1px solid var(--color-border-base);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-base);

        &:hover {
            border-color: var(--color-primary);
            background: var(--color-bg-tertiary);
            transform: scale(1.05);
        }

        &--preview:hover {
            border-color: var(--color-info);
            background: var(--color-info-bg);
        }

        &--download:hover {
            border-color: var(--color-success);
            background: var(--color-success-bg);
        }

        &--delete:hover {
            border-color: var(--color-danger);
            background: var(--color-danger-bg);
        }
    }

    // Modo compacto
    &--compact {
        .file-list__item {
            padding: var(--spacing-xs);
        }

        .file-list__item-icon {
            width: 32px;
            height: 32px;
        }

        .file-list__item-name {
            font-size: var(--font-size-xs);
        }

        .file-list__action-btn {
            width: 28px;
            height: 28px;
            font-size: var(--font-size-sm);
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
