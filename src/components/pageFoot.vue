<template>
    <div class="input-area">
        <div class="input-wrapper">
            <textarea
                class="input-textarea"
                placeholder="输入消息，按 Enter 发送"
                wrap="soft"
                v-model="textareavalue"
                @keydown.enter.prevent="handleEnterSend"
                :disabled="isSending"
            ></textarea>
            <div class="input-toolbar">
                <div class="toolbar-left">
                    <div class="tool-btn" title="语音输入" @click="startspeech">
                        <el-icon><Microphone /></el-icon>
                    </div>
                </div>
                <div class="toolbar-right">
                    <div class="tool-btn" title="清空" @click="clear">
                        <el-icon><Delete /></el-icon>
                    </div>
                    <div
                        class="send-btn"
                        :class="{ active: hastext }"
                        title="发送"
                        @click="sendmessage"
                    >
                        <el-icon style="font-size:18px;"><Top /></el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { useStore, messageinitial } from '../store/store'
import { ref, computed, onUnmounted, onMounted } from 'vue'

import { renderMarkdown } from '../utils/markdown'
messageinitial()

// 状态变量
const textareavalue = ref('')
const hastext = computed(() => textareavalue.value.trim() !== '')

// 发送锁
const isSending = ref(false)
// 取消请求控制器
let controller = null

const rawMarkdown = ref('')
const aiReply = ref('')

// SSE 连接
let currentEventSource = null
let aiMsgTempId = ''
const store = useStore()

//性能优化：批量刷新流（100ms 合并一次）
let isRenderScheduled = false

// 语音识别
let recognition = null

// 基础功能
function clear() {
    textareavalue.value = ''
}

// 回车发送
function handleEnterSend(e) {
    e.preventDefault()
    if (!hastext.value) return
    sendmessage()
}

// 语音识别
onMounted(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognition = new SpeechRecognition()
        recognition.lang = 'zh-CN'
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        recognition.continuous = false

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript
            textareavalue.value += text
        }
        recognition.onnomatch = () => ElMessage.warning('未识别到语音')
        recognition.onspeechend = () => {
            recognition.stop()
            ElMessage.success('语音识别结束')
        }
        recognition.onerror = (e) => {
            let msg = '语音错误：'
            switch (e.error) {
                case 'not-allowed': msg += '请开启麦克风权限'; break
                case 'no-speech': msg += '未检测到声音'; break
                default: msg += e.error
            }
            ElMessage.error(msg)
        }
    } else {
        ElMessage.error('浏览器不支持语音识别')
    }
})

function startspeech() {
    if (!recognition) return
    try {
        recognition.start()
        ElMessage.info('请说话...')
    } catch (err) {
        ElMessage.error('启动失败：' + err.message)
    }
}

// 分帧渲染：用 markdown-it 完整渲染累积的 markdown
function appendChunk(chunk) {
    rawMarkdown.value += chunk
    if (isRenderScheduled) return
    isRenderScheduled = true
    requestAnimationFrame(() => {
        aiReply.value = renderMarkdown(rawMarkdown.value)
        store.updateAiMsgInHistory(store.$state, aiReply.value, aiMsgTempId)
        isRenderScheduled = false
    })
}

// 发送消息
async function sendmessage() {
    if (isSending.value) return
    const content = textareavalue.value.trim()
    if (!content) return
     //关闭旧连接
        if (currentEventSource) {
            currentEventSource.close()
            currentEventSource = null
        }

    isSending.value = true
    rawMarkdown.value = ''

    //添加用户消息
    const userMsg = {
        message: content,
        sender: 1,
        id: Date.now() + Math.random().toString(36).slice(2, 10)
    }
    store.addhistory(store.$state, userMsg)
    textareavalue.value = ''

    //占位AI消息
    aiMsgTempId = Date.now() + Math.random().toString(36).slice(2, 10)
    store.addhistory(store.$state, {
        message: '<div style="color:#999">思考中...</div>',
        sender: 2,
        id: aiMsgTempId
    })
    aiReply.value = ''

    try {
        controller = new AbortController()
        
        //获取 sessionId
        const saveRes = await fetch('http://localhost:3001/api/save-input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput: userMsg }),
            signal: controller.signal
        })
        if (!saveRes.ok) throw new Error('会话创建失败')
        const { sessionId } = await saveRes.json()

       

        //创建 SSE
        const es = new EventSource(`http://localhost:3001/api/chat/sse?sessionId=${sessionId}`)
        currentEventSource = es

        es.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data)

                // 接收心跳
                if (data.type === 'heartbeat') return

                // 错误
                if (data.error) {
                    aiReply.value = `<div style="color:red;">${data.error}</div>`
                    store.updateAiMsgInHistory(store.$state, aiReply.value, aiMsgTempId)
                    es.close()
                    return
                }

                //批量追加片段
                if (data.replyChunk) {
                    appendChunk(data.replyChunk)
                }

                // 结束
                if (data.status === 'done') {
                    es.close()
                    currentEventSource = null
                }
            } catch (err) { }
        }

        es.onerror = (err) => {
            aiReply.value = '<div style="color:red;">连接失败，请重试</div>'
            store.updateAiMsgInHistory(store.$state, aiReply.value, aiMsgTempId)
            es.close()
            currentEventSource = null
        }

    } catch (err) {
        aiReply.value = `<div style="color:red;">请求失败：${err.message}</div>`
        store.updateAiMsgInHistory(store.$state, aiReply.value, aiMsgTempId)
    } finally {
        isSending.value = false
    }
}

// 销毁
onUnmounted(() => {
    if (currentEventSource) {
        currentEventSource.close()
        currentEventSource = null
    }
    if (recognition) {
        recognition.stop()
        recognition = null
    }
})
</script>
<style lang="css" scoped>
.input-area {
    width: 100%;
}

.input-wrapper {
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    transition: border-color 0.2s, box-shadow 0.2s;
    overflow: hidden;
}

.input-wrapper:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
}

.input-textarea {
    width: 100%;
    min-height: 56px;
    max-height: 160px;
    border: none;
    outline: none;
    resize: none;
    padding: 14px 16px 8px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-primary);
    background: transparent;
    font-family: inherit;
}

.input-textarea::placeholder {
    color: var(--text-muted);
}

.input-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 12px 8px;
}

.toolbar-left,
.toolbar-right {
    display: flex;
    align-items: center;
    gap: 4px;
}

.tool-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--text-muted);
    font-size: 16px;
    transition: all 0.15s;
}

.tool-btn:hover {
    background: var(--primary-bg);
    color: var(--primary);
}

.send-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    background: var(--border-light);
    transition: all 0.2s;
    font-size: 16px;
    margin-left: 4px;
}

.send-btn.active {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    box-shadow: 0 2px 8px rgba(79, 110, 247, 0.3);
}

.send-btn.active:hover {
    box-shadow: 0 4px 16px rgba(79, 110, 247, 0.4);
    transform: scale(1.05);
}

.send-btn.active:active {
    transform: scale(0.95);
}
</style>