<template>
  <RecycleScroller
      class="scroller"
      :items="list"
      :item-size="44"
      key-field="id"
      v-slot="{ item, index }"
      style="height: 100%; width: 100%;"
      :buffer="20"
  >
    <div class="history-item" v-if="item.sender === 1">
      <div class="history-icon">
        <el-icon><ChatDotSquare /></el-icon>
      </div>
      <div class="history-text">{{ item.message.slice(0, 12) }}</div>
      <div class="history-delete" title="删除" @click.stop="deletemess(store.$state, index)">
        <el-icon><CloseBold /></el-icon>
      </div>
    </div>
  </RecycleScroller>
</template>

<script setup>
import { useStore } from '../store/store';

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const store = useStore()

function deletemess(state, index) {
  store.deletemessage(state, index)
}
</script>

<style lang="css" scoped>
.scroller {
  height: 100%;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 2px;
}

.history-item:hover {
  background: var(--primary-bg);
}

.history-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-muted);
  font-size: 16px;
}

.history-text {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-delete {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 12px;
  opacity: 0;
  transition: all 0.15s;
  flex-shrink: 0;
}

.history-item:hover .history-delete {
  opacity: 1;
}

.history-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

:deep(.vue-recycle-scroller.ready.direction-vertical.scroller) {
  overflow-y: auto !important;
  -ms-overflow-style: none !important;
  scrollbar-width: thin !important;
  padding-right: 4px !important;
}

:deep(.vue-recycle-scroller.ready.direction-vertical.scroller::-webkit-scrollbar) {
  width: 4px !important;
}

:deep(.vue-recycle-scroller.ready.direction-vertical.scroller::-webkit-scrollbar-thumb) {
  background: rgba(0, 0, 0, 0.1) !important;
  border-radius: 2px !important;
}
</style>