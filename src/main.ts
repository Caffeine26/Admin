/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import { Icon } from '@iconify/vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Styles
import VueApexCharts from 'vue3-apexcharts'
import 'unfonts.css'

const app = createApp(App)
const pinia = createPinia()

registerPlugins(app)
app.component('Icon', Icon)
app.component('ApexChart', VueApexCharts)
app.use(pinia) 
app.mount('#app')

