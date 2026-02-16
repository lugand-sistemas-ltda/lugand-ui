<script setup lang="ts">
/**
 * FileIcon - Ícone baseado em MIME type
 * Helper component para exibir ícone apropriado por tipo de arquivo
 */
export interface Props {
    /** MIME type do arquivo (ex: "image/png", "application/pdf") */
    mimeType: string
    /** Tamanho do ícone */
    size?: 'sm' | 'md' | 'lg'
    /** Nome do arquivo (usado como fallback se mimeType não definir) */
    fileName?: string
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md'
})

function getIcon(): string {
    const type = props.mimeType.toLowerCase()

    // Images
    if (type.startsWith('image/')) return '🖼️'

    // Documents
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('sheet') || type.includes('excel')) return '📊'
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️'

    // Archives
    if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar')) return '📦'

    // Media
    if (type.startsWith('video/')) return '🎥'
    if (type.startsWith('audio/')) return '🎵'

    // Code
    if (type.includes('json') || type.includes('xml')) return '📋'
    if (type.includes('javascript') || type.includes('typescript')) return '📜'
    if (type.includes('html') || type.includes('css')) return '🌐'

    // Text
    if (type.startsWith('text/')) return '📃'

    // Fallback: tentar pelo nome do arquivo
    if (props.fileName) {
        const ext = props.fileName.split('.').pop()?.toLowerCase()
        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'svg') return '🖼️'
        if (ext === 'pdf') return '📄'
        if (ext === 'doc' || ext === 'docx') return '📝'
        if (ext === 'xls' || ext === 'xlsx') return '📊'
        if (ext === 'ppt' || ext === 'pptx') return '📽️'
        if (ext === 'zip' || ext === 'rar') return '📦'
        if (ext === 'mp4' || ext === 'avi' || ext === 'mov') return '🎥'
        if (ext === 'mp3' || ext === 'wav') return '🎵'
    }

    // Default
    return '📎'
}
</script>

<template>
    <span :class="['file-icon', `file-icon--${size}`]">
        {{ getIcon() }}
    </span>
</template>

<style lang="scss" scoped>
.file-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &--sm {
        font-size: 1rem;
    }

    &--md {
        font-size: 1.5rem;
    }

    &--lg {
        font-size: 2rem;
    }
}
</style>
