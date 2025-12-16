<template>
  <!-- <div class="page_body"
  :key="store.historymessage.length"> -->
  <div class="message_container" ref="container">
    <div 
  class="row"
  v-for="(item, index) in reversedHistory" 
  :key="index" 
  :class="{ 'user-msg': item.sender === 1, 'ai-msg': item.sender === 2 }"
  >
<messageOne 
v-if="item.sender===1"
:msgItem="item.message">
</messageOne>

<responseAi 
v-else="item.sender===2"
:resItem="item.message"></responseAi>
  </div>
  </div>
  
  <!-- </div> -->
</template>

<script setup>
import messageOne from './messageOne.vue';
import {useStore} from '../store/store'
import responseAi from './responseAi.vue'
import {computed,nextTick,ref,watch} from 'vue'
const store=useStore()
const container=ref(null)
//滚动到底部的方法
const scrollBottom=async()=>{
await nextTick()
if(container.value){
   const scrollContainer = container.value;
   scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth'
    });
}
}
const reversedHistory = computed(() => {
  // slice() 生成原数组的副本，再reverse()倒序，避免修改原数组
  return store.historymessage.slice().reverse();
});
const reverseResponse=computed(()=>{
  return store.response.slice().reverse();
})
watch(
  ()=>reversedHistory.value,
  ()=>{
    scrollBottom()
  },
   { immediate: true, 
    deep:true
   }
)

</script>

<style lang="css" scoped>
.row{
  width: 100%;
  box-sizing: border-box;
  padding-right: 7px;
}
.message_container {
  width: 100%;
  height: calc(100vh - 225px); 
  overflow-y: hidden;
  overflow-x: hidden;
  box-sizing: border-box;
}
.message_container:hover{
  overflow-y: visible;
}
.user-msg{
display: flex;
justify-content: end;
}
.ai-msg{
display: flex;
justify-content: start;
}
</style>