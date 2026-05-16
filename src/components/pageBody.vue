<template>
  <div class="message_container" ref="container">
    <transition-group name="msg" tag="div" class="message_list">
      <div
        v-for="(item, index) in reversedHistory"
        :key="item.id || index"
        class="message_row"
        :class="{ 'user-row': item.sender === 1, 'ai-row': item.sender === 2 }"
      >
        <div v-if="item.sender === 1" class="user-bubble-wrapper">
          <messageOne :msgItem="item.message" />
        </div>
        <div v-else class="ai-bubble-wrapper">
          <div class="ai-avatar">
            <el-icon><MagicStick /></el-icon>
          </div>
          <div class="ai-bubble" v-html="item.message"></div>
        </div>
      </div>
    </transition-group>
    <div v-if="reversedHistory.length === 0" class="empty-state">
      <div class="empty-icon">
        <el-icon style="font-size: 48px;"><ChatLineSquare /></el-icon>
      </div>
      <div class="empty-text">开始一段新对话</div>
      <div class="empty-hint">在下方输入您的问题，AI 将为您解答</div>
    </div>
  </div>
</template>

<script setup>
import messageOne from './messageOne.vue';
import { useStore } from '../store/store'
import { computed, nextTick, ref, watch } from 'vue'
import { MagicStick, ChatLineSquare } from '@element-plus/icons-vue'

const store = useStore()
const container = ref(null)

const scrollBottom = async () => {
  await nextTick()
  if (container.value) {
    container.value.scrollTo({
      top: container.value.scrollHeight,
      behavior: 'smooth'
    });
  }
}

const reversedHistory = computed(() => {
  return store.historymessage.slice().reverse();
});

watch(
  () => reversedHistory.value,
  () => { scrollBottom() },
  { deep: true }
)
</script>

<style lang="css" scoped>
.message_container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 0;
  scroll-behavior: smooth;
}

.message_list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message_row {
  display: flex;
  width: 100%;
  animation: fadeSlideIn 0.3s ease-out;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-row {
  justify-content: flex-end;
}

.ai-row {
  justify-content: flex-start;
}

.user-bubble-wrapper {
  max-width: 70%;
}

.ai-bubble-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 85%;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #4f6ef7, #6b83f5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 4px;
}

.ai-bubble {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  line-height: 1.7;
  font-size: 14px;
  color: var(--text-primary);
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.ai-bubble p {
  margin: 8px 0;
}

.ai-bubble p:first-child {
  margin-top: 0;
}

.ai-bubble p:last-child {
  margin-bottom: 0;
}

.ai-bubble :deep(pre) {
  background: #1e1e2e;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  margin: 10px 0;
  position: relative;
}

.ai-bubble :deep(code) {
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Fira Code', monospace;
  font-size: 13px;
  background: rgba(79, 110, 247, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--primary);
}

.ai-bubble :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
  color: inherit;
  font-size: inherit;
}

.ai-bubble :deep(.hljs-keyword) { color: #c792ea; }
.ai-bubble :deep(.hljs-string) { color: #c3e88d; }
.ai-bubble :deep(.hljs-number) { color: #f78c6c; }
.ai-bubble :deep(.hljs-comment) { color: #676e95; font-style: italic; }
.ai-bubble :deep(.hljs-function) { color: #82aaff; }
.ai-bubble :deep(.hljs-built_in) { color: #ffcb6b; }
.ai-bubble :deep(.hljs-title) { color: #82aaff; }
.ai-bubble :deep(.hljs-attr) { color: #f07178; }
.ai-bubble :deep(.hljs-params) { color: #ffcb6b; }
.ai-bubble :deep(.hljs-literal) { color: #ff5370; }
.ai-bubble :deep(.hljs-type) { color: #ffcb6b; }

/* markdown 排版 */
.ai-bubble :deep(h1) { font-size: 1.5em; font-weight: 600; margin: 16px 0 8px; }
.ai-bubble :deep(h2) { font-size: 1.3em; font-weight: 600; margin: 14px 0 8px; }
.ai-bubble :deep(h3) { font-size: 1.15em; font-weight: 600; margin: 12px 0 6px; }
.ai-bubble :deep(h4) { font-size: 1.05em; font-weight: 600; margin: 10px 0 6px; }
.ai-bubble :deep(h5), .ai-bubble :deep(h6) { font-size: 1em; font-weight: 600; margin: 8px 0 4px; }

.ai-bubble :deep(p) { margin: 8px 0; }
.ai-bubble :deep(p:first-child) { margin-top: 0; }
.ai-bubble :deep(p:last-child) { margin-bottom: 0; }

.ai-bubble :deep(ul), .ai-bubble :deep(ol) { margin: 6px 0; padding-left: 24px; }
.ai-bubble :deep(li) { margin: 3px 0; }
.ai-bubble :deep(li > p) { margin: 2px 0; }

.ai-bubble :deep(blockquote) {
  margin: 10px 0;
  padding: 6px 14px;
  border-left: 3px solid var(--primary);
  background: var(--primary-bg);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text-secondary);
}
.ai-bubble :deep(blockquote p) { margin: 4px 0; }

.ai-bubble :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 13px;
}
.ai-bubble :deep(th), .ai-bubble :deep(td) {
  border: 1px solid var(--border-light);
  padding: 6px 12px;
  text-align: left;
}
.ai-bubble :deep(th) {
  background: var(--primary-bg);
  font-weight: 600;
  color: var(--text-primary);
}
.ai-bubble :deep(tr:nth-child(even)) { background: var(--bg-page); }

.ai-bubble :deep(a) {
  color: var(--primary);
  text-decoration: none;
}
.ai-bubble :deep(a:hover) { text-decoration: underline; }

.ai-bubble :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-light);
  margin: 16px 0;
}

.ai-bubble :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
  margin: 8px 0;
}

.ai-bubble :deep(input[type="checkbox"]) {
  margin-right: 6px;
  accent-color: var(--primary);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: 8px;
}

.empty-icon {
  color: var(--border-light);
  margin-bottom: 4px;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .user-bubble-wrapper {
    max-width: 85%;
  }
  .ai-bubble-wrapper {
    max-width: 95%;
  }
}
</style>