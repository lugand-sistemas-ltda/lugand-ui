<template>
  <div class="lg-qrcode" :style="containerStyle">
    <canvas ref="canvasRef" :style="canvasStyle"></canvas>

    <div v-if="label" class="qrcode-label">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

export interface LgQRCodeProps {
  /**
   * Data to encode in the QR Code
   */
  value: string

  /**
   * Size of the QR Code in pixels
   * @default 128
   */
  size?: number

  /**
   * Optional label below QR Code
   */
  label?: string

  /**
   * Error correction level
   * @default 'M'
   */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'

  /**
   * Foreground color (dark modules)
   * @default '#000000'
   */
  color?: string

  /**
   * Background color (light modules)
   * @default '#ffffff'
   */
  backgroundColor?: string

  /**
   * Margin around QR Code in modules
   * @default 4
   */
  margin?: number
}

const props = withDefaults(defineProps<LgQRCodeProps>(), {
  size: 128,
  errorCorrectionLevel: 'M',
  color: '#000000',
  backgroundColor: '#ffffff',
  margin: 4
})

const canvasRef = ref<HTMLCanvasElement>()

const containerStyle = computed<Record<string, string>>(() => ({
  width: `${props.size}px`,
  display: 'inline-flex',
  'flex-direction': 'column',
  'align-items': 'center',
  gap: '8px'
}))

const canvasStyle = computed<Record<string, string>>(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  border: '1px solid var(--border-color)',
  'border-radius': 'var(--radius-sm)'
}))

async function generateQRCode() {
  if (!canvasRef.value || !props.value) return

  try {
    await QRCode.toCanvas(canvasRef.value, props.value, {
      width: props.size,
      margin: props.margin,
      errorCorrectionLevel: props.errorCorrectionLevel,
      color: {
        dark: props.color,
        light: props.backgroundColor
      }
    })
  } catch (error) {
    console.error('Error generating QR Code:', error)
  }
}

// Generate on mount
onMounted(() => {
  generateQRCode()
})

// Regenerate when props change
watch(
  () => [props.value, props.size, props.color, props.backgroundColor, props.margin, props.errorCorrectionLevel],
  () => {
    generateQRCode()
  }
)
</script>

<style scoped lang="scss">
.lg-qrcode {
  .qrcode-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-align: center;
  }
}
</style>
