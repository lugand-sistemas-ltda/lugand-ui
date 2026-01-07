import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar estilos da biblioteca (dist/style.css)
// Precisa buildar a lib antes: npm run build:lib
import '@lugand/vue-ui-lib/dist/style.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
