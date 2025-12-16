<template>
    <div class="message_all">
        <div 
    class="message_one"
    style=" max-width:250px;"
    >
{{ parsedMessage}}
    </div>
    <div class="message_bottom">
        <div class="collate">
            <el-icon><Star /></el-icon>
        </div>
        <div class="copy">
            <el-icon><CopyDocument /></el-icon>
        </div>
    </div>
    </div>
</template>

<script setup>
import {useStore} from '../store/store'
import {computed} from'vue'
const store =useStore()
const props = defineProps({
  msgItem: {
    type: [Object, String], // 兼容对象/JSON字符串
    required: true
  }
})
const parsedMessage = computed(() => {
  if (!props.msgItem) return ''
  const item = props.msgItem
  try {
    // 解析JSON（仅当是字符串且是合法JSON时）
    const parsedData = typeof item === 'string' ? JSON.parse(item) : item
    // 适配：如果是对象取message，是字符串直接返回
    return typeof parsedData === 'object' ? parsedData?.message || '' : parsedData
  } catch (error) {
    console.warn('解析消息失败：', error)
    // 解析失败时返回原文本（避免消息消失）
    return item
  }
})
</script>

<style lang="css" scoped>
.message_one{
    background-color: rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
    padding: 7px;
    align-self: center;
    border-radius: 10px;
    /* 允许文本自动换行（核心：移除单行限制） */
  white-space: normal; 
  /* 长单词/长文本强制换行（避免溢出容器） */
  word-wrap: break-word; 
  /* （可选）中英文混合时更强制的换行规则 */
  word-break: break-all; 
}
.message_bottom{
    display: flex;
    margin-top: 7px;
    width: 16px;
    height: 30px;
    visibility: hidden;
}
.collate{
    margin-right:7px ;
    width: 20px;
    height: 26px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.copy{
    width: 20px;
    height: 26px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.collate:hover{
    background-color: rgba(0, 0, 0, 0.15);
}
.copy:hover{
    background-color: rgba(0, 0, 0, 0.15);
}
.message_all:hover .message_bottom{
visibility: visible;
}
.message_all{
margin-bottom: 10px;
}
</style>