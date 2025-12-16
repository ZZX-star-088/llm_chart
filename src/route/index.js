import { createRouter, createWebHashHistory } from "vue-router";
import chartPage from '../components/chartPage.vue'
const routes = [
    {
        path: '/',
        component: chartPage
    },
    {
        path: '/chat',
        component: chartPage
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})
export default router