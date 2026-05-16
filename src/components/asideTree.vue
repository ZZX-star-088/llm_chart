<template>
    <div class="aside">
        <div class="top-section">
            <div class="user-info">
                <img src="../../public/获取 Hello Kitty 头像.png" class="avatar" />
                <span class="username">Hello</span>
                <button class="collapse-btn">
                    <el-icon><Fold /></el-icon>
                </button>
            </div>
            <div class="menu-list">
                <div
                    v-for="(item, index) in menu"
                    :key="index"
                    class="menu-item"
                    :class="{ active: store.selectvalue === index }"
                    @click="handleselect(index)"
                >
                    <div class="menu-icon">
                        <component :is="item.name_icon" />
                    </div>
                    <span class="menu-label">{{ item.name }}</span>
                </div>
            </div>
        </div>
        <div class="history-section">
            <div class="history-header">
                <span>历史对话</span>
            </div>
            <div class="history-list">
                <virtualScroll :list="store.historyusemessage" :key="store.historymessage.length" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { EditPen, Edit, ElementPlus, CirclePlus, UploadFilled, Menu } from '@element-plus/icons-vue'
import { useStore } from '../store/store'
import virtualScroll from '../components/virtualScroll.vue'
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css'
import router from '../route/index'

const store = useStore()

function handleselect(index) {
    store.managestatus(index, store.$state)
    router.push('/chat')
}

const menu = [
    { name: '新对话', name_icon: EditPen },
    { name: '帮我写作', name_icon: Edit },
    { name: 'AI创作', name_icon: ElementPlus },
    { name: '应用生成', name_icon: CirclePlus },
    { name: '云盘', name_icon: UploadFilled },
    { name: '更多', name_icon: Menu },
]
</script>

<style lang="css" scoped>
.aside {
    width: 280px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-card);
    border-right: 1px solid var(--border-light);
}

.top-section {
    padding: 20px 16px 12px;
    border-bottom: 1px solid var(--border-light);
    flex-shrink: 0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding: 0 4px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    object-fit: cover;
    flex-shrink: 0;
}

.username {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
}

.collapse-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 18px;
    transition: all 0.2s;
}

.collapse-btn:hover {
    background: var(--primary-bg);
    color: var(--primary);
}

.menu-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-secondary);
    font-size: 14px;
}

.menu-item:hover {
    background: var(--primary-bg);
    color: var(--text-primary);
}

.menu-item.active {
    background: var(--primary-bg);
    color: var(--primary);
    font-weight: 500;
}

.menu-icon {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.menu-label {
    line-height: 1;
}

.history-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 12px 16px 8px;
}

.history-header {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 0 4px 8px;
    flex-shrink: 0;
}

.history-list {
    flex: 1;
    min-height: 0;
}
</style>