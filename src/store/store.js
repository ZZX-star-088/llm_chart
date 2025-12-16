import { defineStore } from "pinia";
import { watch } from 'vue'
const STORE_KEY = 'history_chat'
const STORE_AI = 'ai_response'
export const useStore = defineStore('chatHisory', {
    state: () => ({
        history: [],
        selectvalue: -1
    }),
    persist: {
        enabled: true, // 开启持久化
        strategies: [
            {
                key: 'chat_store', // 本地存储的key（自定义）
                storage: localStorage, // 用localStorage（默认sessionStorage，刷新会丢）
                paths: ['selectvalue'], // 只持久化selectvalue（按需配置）
            },
        ],
    },
    getters: {
        headmessage: (state) => {
            if (!state.history[0]) {
                return '...'
            }
            else {
                return state.history[0].message.trim().slice(0, 4)
            }
        },
        historymessage: (state) => {
            return state.history
        },
        historyusemessage: (state) => {
            return state.history.filter((item) => item.sender === 1)
        }
    },
    actions: {
        //修改状态
        managestatus: (index, state) => {
            state.selectvalue = index
        },
        //添加消息
        addhistory: (state, messageItem) => {
            const itemWithId = { ...messageItem, id: messageItem || Date.now() + Math.random().toString(36).slice(2) }
            state.history.unshift(itemWithId)
            localStorage.setItem('STORE_KEY', JSON.stringify(state.history))
        },
        //删除历史消息
        deletemessage(state, index) {
            const long = state.history.length - 1
            state.history.splice(index * 2, 2)
            console.log('index', index)
            console.log('delete', index * 2 + 1)
            console.log('long-index', long - index)
            console.log('history', state.history)
            localStorage.setItem('STORE_KEY', JSON.stringify(state.history))
        },
        //添加ai回复消息
        addllmhistory: (state, messageItem) => {
            const itemWithId = { ...messageItem, id: messageItem.id || Date.now() + Math.random().toString(36).slice(2) }
            state.llmhistory.unshift(itemWithId)
            localStorage.setItem('STORE_KEY', JSON.stringify(state.llmhistory))
        },
        //更新回复
        updateAiMsgInHistory: (state, messageItem) => {
            console.log('meici', messageItem)
            if (!state.history[0]) return;
            // 过滤与最后一段内容重复的片段
            const lastContent = state.history[0].message.slice(-messageItem.length);
            if (lastContent !== messageItem) {
                state.history[0].message = messageItem;
            }
        }
    }
}
)
//加载历史消息重新赋值给history
export function messageinitial() {
    const store = useStore()
    try {
        const historyStore = localStorage.getItem('STORE_KEY')
        console.log('获取历史消息', historyStore)
        if (historyStore) {
            const storeHistory = JSON.parse(historyStore)
            if (Array.isArray(storeHistory)) {
                store.history = storeHistory
                console.log('获取历史消息成功', store.history)
            }
        }

    } catch (e) {
        console.log('获取历史消息失败', e)
        store.history = []

    }
    watch(
        () => store.history,
        (newhistory) => {
            localStorage.setItem('STORE_KEY', JSON.stringify(newhistory))
        },
        { deep: true, immediate: false }
    )
}