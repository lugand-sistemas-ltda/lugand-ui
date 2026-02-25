/**
 * Doc Builder Blocks
 * 
 * Componentes de renderização de blocos de documento
 */

export { default as DocBlockText } from './DocBlockText.vue'
export { default as DocBlockHeading } from './DocBlockHeading.vue'
export { default as DocBlockVariable } from './DocBlockVariable.vue'
export { default as DocBlockQRCode } from './DocBlockQRCode.vue'
export { default as DocBlockImage } from './DocBlockImage.vue'

// Re-exportar tipos
export type {
  DocBlockTextProps
} from './DocBlockText.vue'

export type {
  DocBlockHeadingProps
} from './DocBlockHeading.vue'

export type {
  DocBlockVariableProps
} from './DocBlockVariable.vue'

export type {
  DocBlockQRCodeProps
} from './DocBlockQRCode.vue'

export type {
  DocBlockImageProps
} from './DocBlockImage.vue'
