<script setup lang="ts">
/**
 * ThemeSelector - Seletor de temas usando dropdown
 * Mais compacto que o ThemeSwitcher baseado em botões
 */
import { computed } from 'vue'
import { useTheme } from '@/shared/composables'
import { themeList } from '@/core/config/themes.config'
import { Select } from '@/shared/components'

const { currentTheme, setTheme } = useTheme()

// Mapeia a lista de temas para o formato esperado pelo Select
const themeOptions = computed(() => {
    return themeList.map((t: any) => {
        // Simple icon mapping since it's not in the config yet
        const icons: Record<string, string> = {
            light: '☀️',
            dark: '🌙',
            ocean: '🌊',
            forest: '🌲',
            dracula: '🧛',
            cyberpunk: '🤖',
            pcpr: '🚓',
            pretona: '🚔',
            bombeiros: '🚒'
        }
        const icon = icons[t.name] || '🎨'

        return {
            label: `${t.displayName} ${icon}`,
            value: t.name
        }
    })
})

// Wrapper para o v-model lidar com a store de tema
const selectedTheme = computed({
    get: () => currentTheme.value,
    set: (val) => setTheme(val as any)
})
</script>

<template>
    <div class="theme-selector">
        <Select v-model="selectedTheme" :options="themeOptions" placeholder="Select Theme" class="theme-select" />
    </div>
</template>

<style lang="scss" scoped>
.theme-selector {
    min-width: 140px;
}
</style>
