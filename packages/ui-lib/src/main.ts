import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importa todos os estilos globais
import '@/styles/main.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
