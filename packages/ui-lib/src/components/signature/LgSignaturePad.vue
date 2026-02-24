<template>
  <div class="lg-signature-pad">
    <div class="signature-canvas-wrapper" :style="canvasWrapperStyle">
      <canvas ref="canvasRef" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
        @mouseleave="stopDrawing" @touchstart.prevent="startDrawing" @touchmove.prevent="draw"
        @touchend.prevent="stopDrawing" />

      <div v-if="isEmpty && placeholder" class="signature-placeholder">
        {{ placeholder }}
      </div>
    </div>

    <div v-if="showControls" class="signature-controls">
      <lg-button size="sm" variant="outline" @click="clear" :disabled="isEmpty">
        Limpar
      </lg-button>

      <lg-button v-if="showUndo" size="sm" variant="outline" @click="undo" :disabled="!canUndo">
        Desfazer
      </lg-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Button from '../../shared/components/primitives/Button.vue'

// Criar alias para evitar conflito de nomes
const LgButton = Button

interface Props {
  /** Largura do canvas em pixels */
  width?: number

  /** Altura do canvas em pixels */
  height?: number

  /** Cor da linha */
  penColor?: string

  /** Espessura da linha */
  penWidth?: number

  /** Texto placeholder quando vazio */
  placeholder?: string

  /** Mostrar controles (limpar, desfazer) */
  showControls?: boolean

  /** Mostrar botão de desfazer */
  showUndo?: boolean

  /** Cor de fundo do canvas */
  backgroundColor?: string

  /** Desabilitar edição */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200,
  penColor: '#000000',
  penWidth: 2,
  placeholder: 'Assine aqui',
  showControls: true,
  showUndo: true,
  backgroundColor: '#ffffff',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'start': []
  'end': []
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const isEmpty = ref(true)
const strokes = ref<Array<Array<{ x: number; y: number }>>>([])
const currentStroke = ref<Array<{ x: number; y: number }>>([])

const canvasWrapperStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`
}))

const canUndo = computed(() => strokes.value.length > 0)

let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const dpr = window.devicePixelRatio || 1

  // Set canvas size accounting for device pixel ratio
  canvas.width = props.width * dpr
  canvas.height = props.height * dpr

  // Scale context to match
  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Fill background
    ctx.fillStyle = props.backgroundColor
    ctx.fillRect(0, 0, props.width, props.height)
  }
})

// Watch pen properties and update
watch([() => props.penColor, () => props.penWidth], () => {
  if (ctx) {
    ctx.strokeStyle = props.penColor
    ctx.lineWidth = props.penWidth
  }
})

function getPosition(event: MouseEvent | TouchEvent): { x: number; y: number } | null {
  if (!canvasRef.value) return null

  const rect = canvasRef.value.getBoundingClientRect()

  if (event instanceof MouseEvent) {
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  } else if (event instanceof TouchEvent && event.touches.length > 0) {
    const touch = event.touches[0]
    if (!touch) return null

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }
  }

  return null
}

function startDrawing(event: MouseEvent | TouchEvent) {
  if (props.disabled) return

  const pos = getPosition(event)
  if (!pos || !ctx) return

  isDrawing.value = true
  currentStroke.value = [pos]

  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)

  emit('start')
}

function draw(event: MouseEvent | TouchEvent) {
  if (!isDrawing.value || props.disabled) return

  const pos = getPosition(event)
  if (!pos || !ctx) return

  currentStroke.value.push(pos)

  ctx.strokeStyle = props.penColor
  ctx.lineWidth = props.penWidth
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()

  isEmpty.value = false
}

function stopDrawing() {
  if (!isDrawing.value) return

  isDrawing.value = false

  if (currentStroke.value.length > 0) {
    strokes.value.push([...currentStroke.value])
    currentStroke.value = []
  }

  emitSignature()
  emit('end')
}

function clear() {
  if (!ctx || !canvasRef.value) return

  // Clear canvas
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, props.width, props.height)

  // Reset state
  strokes.value = []
  currentStroke.value = []
  isEmpty.value = true

  emitSignature()
}

function undo() {
  if (strokes.value.length === 0) return

  // Remove last stroke
  strokes.value.pop()

  // Redraw all remaining strokes
  redraw()

  if (strokes.value.length === 0) {
    isEmpty.value = true
  }

  emitSignature()
}

function redraw() {
  if (!ctx) return

  // Clear canvas
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, props.width, props.height)

  // Redraw all strokes
  ctx.strokeStyle = props.penColor
  ctx.lineWidth = props.penWidth

  strokes.value.forEach(stroke => {
    if (stroke.length === 0) return

    const firstPoint = stroke[0]
    if (!firstPoint) return

    ctx!.beginPath()
    ctx!.moveTo(firstPoint.x, firstPoint.y)

    stroke.forEach(point => {
      ctx!.lineTo(point.x, point.y)
    })

    ctx!.stroke()
  })
}

function emitSignature() {
  if (!canvasRef.value) return

  const dataUrl = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', dataUrl)
  emit('change', dataUrl)
}

/**
 * Get signature as data URL
 */
function toDataURL(type: string = 'image/png', quality: number = 0.92): string {
  return canvasRef.value?.toDataURL(type, quality) || ''
}

/**
 * Get signature as Blob
 */
async function toBlob(type: string = 'image/png', quality: number = 0.92): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvasRef.value?.toBlob((blob) => resolve(blob), type, quality)
  })
}

/**
 * Download signature as image
 */
function download(filename: string = 'assinatura.png') {
  const dataUrl = toDataURL()
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

/**
 * Load signature from data URL
 */
function fromDataURL(dataUrl: string) {
  if (!ctx) return

  const img = new Image()
  img.onload = () => {
    clear()
    ctx!.drawImage(img, 0, 0, props.width, props.height)
    isEmpty.value = false
  }
  img.src = dataUrl
}

// Expose methods
defineExpose({
  clear,
  undo,
  toDataURL,
  toBlob,
  download,
  fromDataURL,
  isEmpty: computed(() => isEmpty.value)
})
</script>

<style scoped lang="scss">
.lg-signature-pad {
  display: inline-flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  .signature-canvas-wrapper {
    position: relative;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--background);
    overflow: hidden;

    &:hover {
      border-color: var(--border-color-hover);
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
      cursor: crosshair;
      touch-action: none;
    }

    .signature-placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--text-secondary);
      font-size: 1rem;
      pointer-events: none;
      user-select: none;
    }
  }

  .signature-controls {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
  }
}
</style>
