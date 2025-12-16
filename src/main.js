import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '../src/route/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css'

import { RecycleScroller } from 'vue3-virtual-scroller'



const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.mount('#app')
// main.ts
app.component('RecycleScroller', RecycleScroller)

// 如果您正在使用CDN引入，请删除下面一行。
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}