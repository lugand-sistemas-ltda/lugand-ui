<script setup lang="ts">
/**
 * FileViewer - Visualizador universal de arquivos
 * 
 * Componente profissional para visualizar diferentes tipos de arquivos:
 * - Imagens: viewer com zoom/pan
 * - PDFs: iframe nativo do browser
 * - Vídeos: player HTML5 nativo
 * - Áudio: player HTML5 nativo
 * - Texto/Code: preview com syntax highlight básico
 * - Outros: fallback com botão de download
 * 
 * Zero dependências externas - usa apenas browser APIs nativas
 * Modal-based para experiência fullscreen
 */
import { ref, computed, watch, onMounted } from 'vue'
import { Modal } from '../../../modules/modal'
import Button from '../primitives/Button.vue'

export interface FileViewerFile {
  url: string
  name: string
  type: string // MIME type
  size?: number
}

export interface Props {
  /** Visibilidade do viewer */
  visible: boolean
  /** Arquivo para visualizar */
  file: FileViewerFile | null
  /** Título customizado (usa file.name se não especificado) */
  title?: string
  /** Permite fullscreen (browser native) */
  allowFullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowFullscreen: true
})

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'close'): void
  (e: 'download'): void
}

const emit = defineEmits<Emits>()

// State
const internalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const imageZoom = ref(1)
const imagePosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const isFullscreen = ref(false)
const viewerContainer = ref<HTMLElement>()

// Computed
const viewerTitle = computed(() => props.title || props.file?.name || 'Visualizar Arquivo')

const fileType = computed(() => {
  if (!props.file) return 'unknown'

  const type = props.file.type.toLowerCase()

  if (type.startsWith('image/')) return 'image'
  if (type.includes('pdf')) return 'pdf'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type.startsWith('text/') || type.includes('json') || type.includes('javascript') || type.includes('xml')) return 'text'

  return 'unknown'
})

const fileIcon = computed(() => {
  switch (fileType.value) {
    case 'image': return '🖼️'
    case 'pdf': return '📄'
    case 'video': return '🎥'
    case 'audio': return '🎵'
    case 'text': return '📝'
    default: return '📎'
  }
})

// Methods
function handleClose() {
  emit('update:visible', false)
  emit('close')
  resetImageViewer()
}

function handleDownload() {
  emit('download')

  // Fallback: tentar download direto se tiver URL
  if (props.file?.url) {
    const a = document.createElement('a')
    a.href = props.file.url
    a.download = props.file.name
    a.click()
  }
}

function resetImageViewer() {
  imageZoom.value = 1
  imagePosition.value = { x: 0, y: 0 }
  isDragging.value = false
}

// Image viewer - Zoom
function handleImageWheel(e: WheelEvent) {
  e.preventDefault()

  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newZoom = Math.max(0.5, Math.min(5, imageZoom.value + delta))

  imageZoom.value = newZoom
}

function zoomIn() {
  imageZoom.value = Math.min(5, imageZoom.value + 0.25)
}

function zoomOut() {
  imageZoom.value = Math.max(0.5, imageZoom.value - 0.25)
}

function resetZoom() {
  imageZoom.value = 1
  imagePosition.value = { x: 0, y: 0 }
}

// Image viewer - Pan (drag)
function handleImageMouseDown(e: MouseEvent) {
  if (imageZoom.value <= 1) return

  isDragging.value = true
  dragStart.value = {
    x: e.clientX - imagePosition.value.x,
    y: e.clientY - imagePosition.value.y
  }

  e.preventDefault()
}

function handleImageMouseMove(e: MouseEvent) {
  if (!isDragging.value) return

  imagePosition.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

function handleImageMouseUp() {
  isDragging.value = false
}

// Fullscreen
function toggleFullscreen() {
  if (!viewerContainer.value) return

  if (!document.fullscreenElement) {
    viewerContainer.value.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// Watch for fullscreen changes
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetImageViewer()
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }
})

// Cleanup on unmount
onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})
</script>

<template>
  <Modal v-model="internalVisible" size="full" :title="viewerTitle" class="file-viewer-modal" @close="handleClose">
    <template #header-actions>
      <!-- Fullscreen Toggle -->
      <Button v-if="allowFullscreen" variant="ghost" size="sm"
        :title="isFullscreen ? 'Sair do Fullscreen' : 'Fullscreen'" @click="toggleFullscreen">
        {{ isFullscreen ? '⤓' : '⤢' }}
      </Button>

      <!-- Download -->
      <Button variant="ghost" size="sm" title="Download" @click="handleDownload">
        ⬇️
      </Button>
    </template>

    <div ref="viewerContainer" :class="[
      'file-viewer',
      `file-viewer--${fileType}`,
      { 'file-viewer--fullscreen': isFullscreen }
    ]">
      <!-- IMAGE VIEWER -->
      <div v-if="fileType === 'image' && file" class="file-viewer__image-container" @wheel="handleImageWheel"
        @mousedown="handleImageMouseDown" @mousemove="handleImageMouseMove" @mouseup="handleImageMouseUp"
        @mouseleave="handleImageMouseUp">
        <img :src="file.url" :alt="file.name" class="file-viewer__image" :style="{
          transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
          cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }" draggable="false" />

        <!-- Image Controls -->
        <div class="file-viewer__image-controls">
          <Button variant="outline" size="sm" @click="zoomOut" title="Zoom Out">
            ➖
          </Button>
          <span class="file-viewer__zoom-level">{{ Math.round(imageZoom * 100) }}%</span>
          <Button variant="outline" size="sm" @click="zoomIn" title="Zoom In">
            ➕
          </Button>
          <Button variant="outline" size="sm" @click="resetZoom" title="Reset">
            🔄
          </Button>
        </div>
      </div>

      <!-- PDF VIEWER -->
      <div v-else-if="fileType === 'pdf' && file" class="file-viewer__pdf-container">
        <iframe :src="file.url" class="file-viewer__iframe" title="PDF Viewer" frameborder="0" />
        <p class="file-viewer__hint">
          💡 Use os controles do navegador para navegar entre páginas, zoom e impressão
        </p>
      </div>

      <!-- VIDEO VIEWER -->
      <div v-else-if="fileType === 'video' && file" class="file-viewer__video-container">
        <video :src="file.url" class="file-viewer__video" controls preload="metadata">
          Seu navegador não suporta reprodução de vídeo.
        </video>
      </div>

      <!-- AUDIO VIEWER -->
      <div v-else-if="fileType === 'audio' && file" class="file-viewer__audio-container">
        <div class="file-viewer__audio-icon">🎵</div>
        <h3>{{ file.name }}</h3>
        <audio :src="file.url" class="file-viewer__audio" controls preload="metadata">
          Seu navegador não suporta reprodução de áudio.
        </audio>
      </div>

      <!-- TEXT VIEWER -->
      <div v-else-if="fileType === 'text' && file" class="file-viewer__text-container">
        <iframe :src="file.url" class="file-viewer__iframe" title="Text Viewer" frameborder="0" />
      </div>

      <!-- UNKNOWN / FALLBACK -->
      <div v-else class="file-viewer__fallback">
        <div class="file-viewer__fallback-icon">{{ fileIcon }}</div>
        <h3>{{ file?.name || 'Arquivo' }}</h3>
        <p class="file-viewer__fallback-message">
          Visualização não disponível para este tipo de arquivo
        </p>
        <Button variant="primary" @click="handleDownload">
          ⬇️ Baixar Arquivo
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.file-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
  overflow: hidden;

  &--fullscreen {
    height: 100vh;
    min-height: 100vh;
  }

  // IMAGE VIEWER
  &__image-container {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #000;
    user-select: none;
  }

  &__image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.1s ease-out;
  }

  &__image-controls {
    position: absolute;
    bottom: var(--spacing-lg);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: rgba(0, 0, 0, 0.8);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
  }

  &__zoom-level {
    min-width: 60px;
    text-align: center;
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: #fff;
  }

  // PDF VIEWER
  &__pdf-container {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__iframe {
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: 600px;
    border: none;
  }

  &__hint {
    padding: var(--spacing-sm);
    text-align: center;
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    background: var(--color-bg-tertiary);
    margin: 0;
  }

  // VIDEO VIEWER
  &__video-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    padding: var(--spacing-lg);
  }

  &__video {
    max-width: 100%;
    max-height: 100%;
    border-radius: var(--radius-md);
  }

  // AUDIO VIEWER
  &__audio-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    text-align: center;

    h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      color: var(--color-text-primary);
      word-break: break-word;
    }
  }

  &__audio-icon {
    font-size: 5rem;
    opacity: 0.8;
  }

  &__audio {
    width: 100%;
    max-width: 500px;
  }

  // TEXT VIEWER
  &__text-container {
    flex: 1;
    display: flex;
  }

  // FALLBACK
  &__fallback {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    text-align: center;

    h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      color: var(--color-text-primary);
      word-break: break-word;
    }
  }

  &__fallback-icon {
    font-size: 5rem;
    opacity: 0.5;
  }

  &__fallback-message {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
  }
}

// File Viewer Modal - Ocupa quase toda a tela
.file-viewer-modal {
  :deep(.modal-overlay) {
    padding: 16px; // Margem de 16px em todos os lados
  }

  :deep(.modal) {
    max-width: calc(100vw - 32px) !important; // 100% - (16px * 2)
    max-height: calc(100vh - 32px) !important; // 100% - (16px * 2)
    width: 100%;
    height: calc(100vh - 32px);
  }
}

// Override modal styles for better viewer experience
:deep(.modal__content) {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  overflow: hidden;
}

:deep(.modal__header) {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-base);
  flex-shrink: 0;
}

:deep(.modal__body) {
  flex: 1;
  padding: 0 !important;
  overflow: hidden;
  display: flex;
}
</style>
