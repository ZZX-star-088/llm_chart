<template>
    <div class="message_all">
        <div class="message_bubble">
            {{ parsedMessage }}
        </div>
        <div class="message_actions">
            <div class="action_btn" title="收藏">
                <el-icon><Star /></el-icon>
            </div>
            <div class="action_btn" title="复制">
                <el-icon><CopyDocument /></el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from '../store/store'
import { computed } from 'vue'

const store = useStore()
const props = defineProps({
    msgItem: {
        type: [Object, String],
        required: true
    }
})

const parsedMessage = computed(() => {
    if (!props.msgItem) return ''
    const item = props.msgItem
    try {
        const parsedData = typeof item === 'string' ? JSON.parse(item) : item
        return typeof parsedData === 'object' ? parsedData?.message || '' : parsedData
    } catch (error) {
        return item
    }
})
</script>

<style lang="css" scoped>
.message_all {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.message_bubble {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: #fff;
    padding: 10px 16px;
    border-radius: 18px 18px 4px 18px;
    font-size: 14px;
    line-height: 1.6;
    word-wrap: break-word;
    word-break: break-word;
    box-shadow: 0 2px 8px rgba(79, 110, 247, 0.2);
    max-width: 100%;
}

.message_actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.2s;
    padding-right: 4px;
}

.message_all:hover .message_actions {
    opacity: 1;
}

.action_btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 14px;
    transition: all 0.15s;
}

.action_btn:hover {
    background: var(--primary-bg);
    color: var(--primary);
}
</style>