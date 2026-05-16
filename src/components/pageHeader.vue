<template>
    <div class="header">
        <div class="header-left">
            <div class="header-title">{{ top_message }}</div>
            <div class="header-subtitle">内容由AI生成，请核实</div>
        </div>
        <div class="header-right">
            <div class="avatar-icon">
                <el-icon><UserFilled /></el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from '../store/store'
import { computed } from 'vue'
const store = useStore()
const top_message = computed(() => store.headmessage)
</script>

<style lang="css" scoped>
.header {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: var(--bg-card);
}

.header-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
}

.header-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.2;
}

.header-right {
    display: flex;
    align-items: center;
}

.avatar-icon {
    width: 34px;
    height: 34px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--primary-bg), #e8edff);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
}

.avatar-icon:hover {
    box-shadow: 0 0 0 3px var(--primary-bg);
}
</style>