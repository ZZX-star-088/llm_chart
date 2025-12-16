<template>
    <div class="header">
<div class="left">
<div class="left_top">
{{ top_message }}
</div>
<div class="left-bottom">
内容由AI生成
</div>
</div>
<div class="right">
<div class="icon">
    <el-icon><UserFilled /></el-icon>
</div>  
</div>
    </div>
</template>

<script setup>
import {useStore} from '../store/store'
import {computed} from 'vue'
const store=useStore()
let top_message=computed(()=>
store.headmessage
)
</script>

<style lang="css" scoped>
.header{
    height: 55px;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: space-between;
}
.left{
    margin-left: 10px;
    height: 100%;
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.left-bottom{
    color: rgba(0, 0, 0, 0.4);
    font-size: 12px;
}
.right{
    height: 100%;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon{
    float: right;
    height: 30px;
    width: 30px;
    border-radius:50px;
    background-color: rgba(22, 38, 144, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
}
.icon :deep(.el-icon){
    font-size: 20px;
}
</style>