<script setup lang="ts">
/**
 * Icon Component
 * Componente centralizador para ícones (Emojis, SVGs, Fonts).
 * Começamos com suporte robusto a Emojis, expansível para SVGs no futuro.
 */
import { computed } from 'vue'
import { EMOJI_MAP, type EmojiName } from '@/core/constants/emojis'
import { BRANDS, type BrandName } from '@/core/constants/brands'
import { UI_ICONS, type UiIconName } from '@/core/constants/ui-icons'

interface Props {
    // Nome do ícone (chave do mapa de emojis ou nome do SVG futuro)
    name: string

    // Tipo do ícone (permite expansão futura)
    type?: 'emoji' | 'svg' | 'font' | 'brand' | 'ui'

    // Tamanho (controla font-size ou width/height)
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string

    // Label acessível (opcional, sobrescreve o padrão)
    label?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'emoji',
    size: 'md'
})

// === EMOJI LOGIC ===
const emojiData = computed(() => {
    if (props.type !== 'emoji') return null

    // Check if name exists in map
    if (props.name in EMOJI_MAP) {
        return EMOJI_MAP[props.name as EmojiName]
    }

    // Fallback: se passar o emoji direto (ex: "🚀")
    return { symbol: props.name, label: props.label || 'icon' }
})

// === BRAND LOGIC ===
const brandData = computed(() => {
    if (props.type !== 'brand') return null

    if (props.name in BRANDS) {
        return BRANDS[props.name as BrandName]
    }
    return null
})

// === UI ICON LOGIC ===
const uiIconData = computed(() => {
    if (props.type !== 'ui') return null

    if (props.name in UI_ICONS) {
        return UI_ICONS[props.name as UiIconName]
    }
    return null
})

// === SIZE LOGIC ===
const sizeClass = computed(() => {
    if (['sm', 'md', 'lg', 'xl', '2xl'].includes(props.size)) {
        return `icon--${props.size}`
    }
    return '' // Custom size handled by style binding if needed, or caller class
})

const customStyle = computed(() => {
    // If size is a custom CSS value (e.g. "24px", "2rem")
    if (!sizeClass.value && props.size) {
        return { fontSize: props.size }
    }
    return {}
})
</script>

<template>
    <!-- EMOJI RENDERER -->
    <span v-if="type === 'emoji' && emojiData" class="icon icon--emoji" :class="[sizeClass]" :style="customStyle"
        role="img" :aria-label="label || emojiData.label">
        {{ emojiData.symbol }}
    </span>

    <!-- BRAND RENDERER -->
    <svg v-else-if="type === 'brand' && brandData" class="icon icon--brand" :class="[sizeClass]" :style="customStyle"
        :viewBox="brandData.viewBox" role="img" :aria-label="label || brandData.label" fill="currentColor">
        <path :d="brandData.path" />
    </svg>

    <!-- UI ICON RENDERER (Uses same SVG structure as Brand but separate styles if needed) -->
    <svg v-else-if="type === 'ui' && uiIconData" class="icon icon--ui" :class="[sizeClass]" :style="customStyle"
        :viewBox="uiIconData.viewBox" role="img" :aria-label="label || uiIconData.label" fill="currentColor">
        <path :d="uiIconData.path" />
    </svg>

    <!-- SVG RENDERER (Placeholder for Future) -->
    <span v-else-if="type === 'svg'" class="icon icon--svg">
        <!-- Future Logic: Dynamic SVG Import -->
        ?
    </span>
</template>

<style lang="scss" scoped>
.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-style: normal;
    user-select: none;

    &--emoji {
        font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
    }

    &--brand {
        width: 1em;
        height: 1em;
        fill: currentColor;
    }

    &--ui {
        width: 1em;
        height: 1em;
        fill: currentColor;
    }

    // --- SIZES ---
    &--sm {
        font-size: 0.875rem;
    }

    // 14px
    &--md {
        font-size: 1rem;
    }

    // 16px (Base)
    &--lg {
        font-size: 1.25rem;
    }

    // 20px
    &--xl {
        font-size: 1.5rem;
    }

    // 24px
    &--2xl {
        font-size: 2rem;
    }

    // 32px
}
</style>