<template>
    <div class="message_all">
        <div 
    class="message_one"
    style=" max-width:450px"
     >
{{ responseMess}}
    </div>
    </div>
</template>

<script setup>
import {computed} from'vue'
const props=defineProps({
    resItem:{
        type:[Object,String],
        required:true}})

const responseMess = computed(() => {
  if (!props.resItem) return ''
  const item = props.resItem
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
.message_all{
margin-bottom: 20px;
}

</style>