<script setup lang="ts">
import { ref } from 'vue'
import {
    FileViewer,
    type FileViewerFile,
    Card,
    Button,
    ComponentShowcase,
    CodeBlock
} from '@/shared/components'
import { useToast } from '@/modules/toast'

const toast = useToast()

// State
const viewerVisible = ref(false)
const currentFile = ref<FileViewerFile | null>(null)

// Mock files - URLs públicas para teste
const sampleFiles = {
    image: {
        url: 'https://picsum.photos/1920/1080',
        name: 'sample-image.jpg',
        type: 'image/jpeg',
        size: 245000
    },
    pdf: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        name: 'sample-document.pdf',
        type: 'application/pdf',
        size: 13264
    },
    video: {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        name: 'sample-video.mp4',
        type: 'video/mp4',
        size: 5510872
    },
    audio: {
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        name: 'sample-audio.mp3',
        type: 'audio/mpeg',
        size: 7100000
    },
    text: {
        url: 'https://www.gutenberg.org/files/1342/1342-0.txt',
        name: 'pride-and-prejudice.txt',
        type: 'text/plain',
        size: 717696
    },
    unsupported: {
        url: 'https://example.com/document.zip',
        name: 'archive.zip',
        type: 'application/zip',
        size: 1024000
    }
}

// Local image example (from FileUpload)
const localImageFile = ref<FileViewerFile | null>(null)

// Methods
function openViewer(file: FileViewerFile) {
    currentFile.value = file
    viewerVisible.value = true
    toast.info(`📂 Abrindo ${file.name}...`)
}

function closeViewer() {
    viewerVisible.value = false
    toast.success('✅ Viewer fechado')
}

function handleDownload() {
    if (!currentFile.value) return
    toast.success(`⬇️ Download iniciado: ${currentFile.value.name}`)
}

function handleLocalImageUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    // Criar URL blob local
    const url = URL.createObjectURL(file)

    localImageFile.value = {
        url,
        name: file.name,
        type: file.type,
        size: file.size
    }

    toast.success(`✅ Imagem carregada: ${file.name}`)
}
</script>

<template>
    <div class="file-viewer-view">
        <div class="header">
            <h1>File Viewer</h1>
            <p class="lead">Visualizador universal de arquivos com suporte a imagens, PDFs, vídeos, áudio e texto.</p>
        </div>

        <!-- FILEVIEWER COMPONENT -->
        <ComponentShowcase title="FileViewer"
            description="Modal-based viewer com zoom para imagens, iframe nativo para PDFs, players HTML5 para mídia.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Tipos de Arquivo Suportados</h4>
                    <div class="file-grid">
                        <!-- Image -->
                        <Card padding="md">
                            <div class="file-card">
                                <div class="file-card__icon">🖼️</div>
                                <h4>Imagem</h4>
                                <p>JPEG, PNG, GIF, SVG</p>
                                <Button variant="primary" size="sm" @click="openViewer(sampleFiles.image)">
                                    Visualizar Imagem
                                </Button>
                            </div>
                        </Card>

                        <!-- PDF -->
                        <Card padding="md">
                            <div class="file-card">
                                <div class="file-card__icon">📄</div>
                                <h4>PDF</h4>
                                <p>Documentos PDF</p>
                                <Button variant="primary" size="sm" @click="openViewer(sampleFiles.pdf)">
                                    Visualizar PDF
                                </Button>
                            </div>
                        </Card>

                        <!-- Video -->
                        <Card padding="md">
                            <div class="file-card">
                                <div class="file-card__icon">🎥</div>
                                <h4>Vídeo</h4>
                                <p>MP4, WebM, OGG</p>
                                <Button variant="primary" size="sm" @click="openViewer(sampleFiles.video)">
                                    Visualizar Vídeo
                                </Button>
                            </div>
                        </Card>

                        <!-- Audio -->
                        <Card padding="md">
                            <div class="file-card">
                                <div class="file-card__icon">🎵</div>
                                <h4>Áudio</h4>
                                <p>MP3, WAV, OGG</p>
                                <Button variant="primary" size="sm" @click="openViewer(sampleFiles.audio)">
                                    Visualizar Áudio
                                </Button>
                            </div>
                        </Card>

                        <!-- Text -->
                        <Card padding="md">
                            <div class="file-card">
                                <div class="file-card__icon">📝</div>
                                <h4>Texto</h4>
                                <p>TXT, JSON, XML, Code</p>
                                <Button variant="primary" size="sm" @click="openViewer(sampleFiles.text)">
                                    Visualizar Texto
                                </Button>
                            </div>
                        </Card>

                        <!-- Unsupported -->
                        <Card padding="md">
                            <div class="file-card">
                                <div class="file-card__icon">📦</div>
                                <h4>Não Suportado</h4>
                                <p>ZIP, RAR, etc</p>
                                <Button variant="outline" size="sm" @click="openViewer(sampleFiles.unsupported)">
                                    Ver Fallback
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Upload e Visualizar Imagem Local</h4>
                    <Card padding="md" style="max-width: 500px;">
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                            <p style="margin: 0; color: var(--color-text-secondary);">
                                Selecione uma imagem do seu computador para visualizar
                            </p>
                            <input type="file" accept="image/*" @change="handleLocalImageUpload"
                                style="padding: var(--spacing-sm); border: 1px solid var(--color-border-base); border-radius: var(--radius-md);" />
                            <Button v-if="localImageFile" variant="primary" @click="openViewer(localImageFile)">
                                🖼️ Visualizar Imagem Carregada
                            </Button>
                        </div>
                    </Card>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<template>
  <!-- Botão para abrir viewer -->
  <Button @click='openViewer'>
    Visualizar Arquivo
  </Button>

  <!-- FileViewer Modal -->
  <FileViewer
    v-model:visible='viewerVisible'
    :file='currentFile'
    :allow-fullscreen='true'
    @close='handleClose'
    @download='handleDownload'
  />
</template>

<script setup>
import { ref } from 'vue'
import { FileViewer } from '@lugand-sistemas-ltda/vue-ui-lib'

const viewerVisible = ref(false)
const currentFile = ref(null)

function openViewer() {
  currentFile.value = {
    url: 'https://example.com/document.pdf',
    name: 'document.pdf',
    type: 'application/pdf',
    size: 1024000
  }
  viewerVisible.value = true
}

function handleClose() {
  viewerVisible.value = false
}

function handleDownload() {
  // Implementar download real
  const a = document.createElement('a')
  a.href = currentFile.value.url
  a.download = currentFile.value.name
  a.click()
}
</script>" />
            </template>
        </ComponentShowcase>

        <!-- FEATURES -->
        <ComponentShowcase title="Features & Controles"
            description="Funcionalidades avançadas do FileViewer para cada tipo de arquivo.">
            <template #preview>
                <div class="showcase-group">
                    <Card padding="lg">
                        <h3 style="margin-top: 0;">🖼️ Imagens</h3>
                        <ul style="line-height: 1.8;">
                            <li><strong>Zoom com Mouse Wheel</strong>: Role o mouse para zoom in/out (0.5x - 5x)</li>
                            <li><strong>Pan/Drag</strong>: Quando zoomed, arraste a imagem com o mouse</li>
                            <li><strong>Controles Visuais</strong>: Botões ➖/➕ para zoom, 🔄 para reset</li>
                            <li><strong>Zoom Level Indicator</strong>: Mostra % atual do zoom</li>
                            <li><strong>Fundo Preto</strong>: Melhor contraste para visualização</li>
                        </ul>
                    </Card>
                </div>

                <div class="showcase-group">
                    <Card padding="lg">
                        <h3 style="margin-top: 0;">📄 PDFs</h3>
                        <ul style="line-height: 1.8;">
                            <li><strong>Iframe Nativo</strong>: Usa plugin PDF do browser (Chrome, Firefox, Edge)</li>
                            <li><strong>Controles do Browser</strong>: Navegação de páginas, zoom, impressão, busca</li>
                            <li><strong>Zero Dependências</strong>: Não precisa de PDF.js ou bibliotecas externas</li>
                            <li><strong>Hint Visual</strong>: Instrui usuário a usar controles nativos</li>
                            <li><strong>Performance</strong>: Leve e rápido, sem bundle overhead</li>
                        </ul>
                    </Card>
                </div>

                <div class="showcase-group">
                    <Card padding="lg">
                        <h3 style="margin-top: 0;">🎥 Vídeos & 🎵 Áudio</h3>
                        <ul style="line-height: 1.8;">
                            <li><strong>HTML5 Players</strong>: Controles nativos (play, pause, volume, fullscreen)</li>
                            <li><strong>Preload Metadata</strong>: Carrega info do arquivo (duração, thumbnails)</li>
                            <li><strong>Suporte Universal</strong>: MP4, WebM, MP3, WAV, OGG</li>
                            <li><strong>Fallback Message</strong>: Informa se browser não suporta codec</li>
                            <li><strong>Responsive</strong>: Adapta ao tamanho do modal</li>
                        </ul>
                    </Card>
                </div>

                <div class="showcase-group">
                    <Card padding="lg">
                        <h3 style="margin-top: 0;">📝 Texto</h3>
                        <ul style="line-height: 1.8;">
                            <li><strong>Iframe Viewer</strong>: Renderiza texto, JSON, XML, código</li>
                            <li><strong>Scroll Nativo</strong>: Para arquivos grandes</li>
                            <li><strong>Monospace Font</strong>: Ideal para código e JSON</li>
                            <li><strong>Future</strong>: Syntax highlight pode ser adicionado (opcional)</li>
                        </ul>
                    </Card>
                </div>

                <div class="showcase-group">
                    <Card padding="lg">
                        <h3 style="margin-top: 0;">⚙️ Controles Globais</h3>
                        <ul style="line-height: 1.8;">
                            <li><strong>Fullscreen Toggle</strong>: Botão ⤢ no header (browser native fullscreen API)
                            </li>
                            <li><strong>Download Button</strong>: ⬇️ para baixar arquivo</li>
                            <li><strong>Close (ESC)</strong>: Fecha modal (herda de Modal component)</li>
                            <li><strong>Responsive</strong>: Funciona em mobile/tablet/desktop</li>
                            <li><strong>Keyboard Accessible</strong>: Suporte a navegação por teclado</li>
                        </ul>
                    </Card>
                </div>
            </template>

            <template #code>
                <CodeBlock code="// Tipos de Arquivo Suportados

interface FileViewerFile {
  url: string       // URL do arquivo (http://, blob:, data:)
  name: string      // Nome para display
  type: string      // MIME type (image/jpeg, application/pdf, etc)
  size?: number     // Tamanho em bytes (opcional)
}

// Detecção Automática por MIME Type:
// - image/* → Image viewer (zoom/pan)
// - application/pdf → PDF iframe
// - video/* → Video player
// - audio/* → Audio player
// - text/*, application/json, etc → Text viewer
// - outros → Fallback (download button)

// Props do FileViewer:
{
  visible: boolean              // v-model:visible
  file: FileViewerFile | null   // Arquivo para visualizar
  title?: string                // Título custom (default: file.name)
  allowFullscreen?: boolean     // Habilita fullscreen (default: true)
}

// Events:
@update:visible  // Sincroniza estado do modal
@close           // Quando fecha (ESC, X, backdrop)
@download        // Quando clica em download" />
            </template>
        </ComponentShowcase>

        <!-- BOAS PRÁTICAS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 FileViewer - Boas Práticas</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Zero External Dependencies</strong>: Usa apenas browser APIs nativas (canvas, iframe, video,
                    audio)
                </li>
                <li><strong>Modal-Based</strong>: Overlay fullscreen para foco total no arquivo</li>
                <li><strong>Universal URLs</strong>: Suporta http://, https://, blob:, data: URIs</li>
                <li><strong>Type Detection</strong>: MIME type → viewer automático (imagem, pdf, vídeo, etc)</li>
                <li><strong>Graceful Fallback</strong>: Arquivos não suportados mostram botão de download</li>
                <li><strong>Memory Management</strong>: Revogue blob URLs após uso (URL.revokeObjectURL)</li>
                <li><strong>Accessibility</strong>: Keyboard navigation, screen reader friendly</li>
                <li><strong>Responsive</strong>: Funciona em todos devices (mobile, tablet, desktop)</li>
                <li><strong>Performance</strong>: Lazy loading de conteúdo, preload metadata apenas</li>
                <li><strong>Integration</strong>: Funciona perfeitamente com FileList @preview event</li>
            </ul>
        </Card>

        <!-- FileViewer Modal Instance -->
        <FileViewer v-model:visible="viewerVisible" :file="currentFile" :allow-fullscreen="true" @close="closeViewer"
            @download="handleDownload" />
    </div>
</template>

<style lang="scss" scoped>
.file-viewer-view {
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

.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
}

.file-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    text-align: center;

    &__icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-xs);
    }

    h4 {
        margin: 0;
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-text-primary);
        text-transform: none;
        letter-spacing: normal;
    }

    p {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }
}
</style>
