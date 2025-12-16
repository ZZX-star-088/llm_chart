<template>
  <RecycleScroller
      class="scroller"
      :items="list"
      :item-size="40"
      key-field="id"
      v-slot="{ item ,index}"
      style="height: 330px; width: 100%;"
       :scroller-enabled="true"  
       :buffer="0"   
      >
    <!-- 这里就是自己要渲染的每一项的内容-->
    <div 
    class="onemessage"
    v-if="item.sender===1"
    >
        <div class="icon"> 
            <el-icon><ChatDotSquare /></el-icon>
        </div>
        <div class="message">{{item.message.slice(0,10)}}</div>
        <div class="delete">
          <div class="icon_delete" title="删除" @click="deletemess(store.$state,index)">
             <el-icon><CloseBold /></el-icon>
          </div>
           
        </div>
    </div>
  </RecycleScroller>
</template>
<script setup>
import { useStore } from '../store/store';
const props = defineProps({
  list: {
    type: Array,
    default: () => [] // 加默认空数组，避免未传值时为 undefined
  }
})
const store=useStore()
//删除历史消息
function deletemess(state,index){
  console.log('state',state)
  console.log('index',index)
    store.deletemessage(state,index)
    
}
</script>
<style lang="css" scoped>
.scroller {
  height: 100%;
}
.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.onemessage{
    margin-top: 10px;
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: start;
    box-sizing: border-box;
}
.onemessage:hover{
    background-color: rgba(0, 0, 0, 0.2);
    border: 0px solid rgba(72, 120, 226, 0.74);
    border-radius: 20px;
    cursor: pointer;
}
.message{
    padding-left: 7px;
    line-height: 30px;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.8);
}
.icon{
    height: 100%;
    width: 30px;
    display: flex;
    justify-content:center;
    align-items: center;
}
.icon :deep(.el-icon){
    font-size: 18px;
}
.delete{
    float: right;
    height: 100%;
    width: 20px;
    flex: 1;
    display: flex;
    justify-content: end;
    align-items: center;
}
.icon_delete{
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.delete :deep(.el-icon){
    padding-right: 7px;
}
:deep(.vue-recycle-scroller.ready.direction-vertical.scroller) {
  overflow-y: auto !important; /* 保留滚动 */
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
  padding-right: 8px !important; /* 抵消原滚动条的宽度占位 */
}

:deep(.vue-recycle-scroller.ready.direction-vertical.scroller::-webkit-scrollbar) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
</style>