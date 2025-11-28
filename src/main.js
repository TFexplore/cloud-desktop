import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueGridLayout from 'vue-grid-layout-v3'


const app = createApp(App)
            .component("vue-grid-layout", VueGridLayout)

app.use(createPinia())
app.use(router)

app.mount('#app')
