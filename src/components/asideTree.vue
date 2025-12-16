<template>
    <div class="aside">
<div class="top">
<div class="img">
    <div class="user">
<img src="../../public/获取 Hello Kitty 头像.png"></img>
<div class="name">Hello</div>
    </div>

    <div class="icon_collapse">
<el-icon><Fold /></el-icon>
    </div>
</div>
    <div class="menu" >

    <template v-for="(item,index) in menu" :key="index">
    <div 
    class="menu_only"
    :class="{ active :store.selectvalue===index}"
    @click="handleselect(index)"
    >
        <div class="menu_icon">
            <component :is="item.name_icon" class="name_icon"></component>
        </div>
        <span class="menu_name">{{ item.name }}</span>
    </div>
    </template>
    </div>
</div>
<div class="record">
    <div class="wenzi">
        <span>历史对话</span>
    </div>
    <div class="virtual">
        <virtualScroll :list="store.historyusemessage"  :key="store.historymessage.length"></virtualScroll>
    </div>
    
</div>
    </div>
</template>

<script setup>
import {EditPen,Edit,ElementPlus,CirclePlus,UploadFilled,Menu} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {useStore} from '../store/store'
import virtualScroll from '../components/virtualScroll.vue'
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css'
import router from '../route/index'
const store = useStore()
function handleselect(index){
   store.managestatus(index,store.$state)
   router.push('/chat')
}
const menu=[
    {
        name:'新对话',
        name_icon:EditPen
    },
    {
        name:'帮我写作',
        name_icon:Edit
    },
    {
        name:'AI创作',
        name_icon:ElementPlus
    },
    {
        name:'应用生成',
        name_icon:CirclePlus
    },{
        name:'云盘',
        name_icon:UploadFilled
    },
    {
        name:'更多',
        name_icon:Menu 
    }
]

</script>

<style lang="css" scoped>
.aside{
    width: 280px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(0,0,0,0.08);
    
}

.top{
    height: 50%;
    margin: 0 20px 0 20px;
    padding-top: 15px;
    border-bottom: 1px solid;
    border-color: rgba(15, 13, 13, 0.2);
}
.img{
    height: 40px;
    width: 240px;
    display: flex;
    justify-content: space-between;
}
.user{
    display: flex;
    justify-content: center;
    width: 85px;
}
img{
   display: inline-block;
   height: 40px;
   width: 40px;
   border-radius: 10px;
   margin-right: 10px;
}
.name{
    font-size: 20px;
    color: rgba(42, 116, 220, 0.862);
    text-align: center;
    line-height: 40px;
}
.icon_collapse{
    width: 40px;
    padding-right: 5px;
    display: flex;
}
.icon_collapse :deep(.el-icon){
    color: rgba(0,0,0,0.2);
    font-size: 25px;
    margin: 10px;
}
.menu{
    flex: 1;
    height: 300px;
    padding-top: 7px;
}
.menu_only{
    height: 40px;
    display: flex;
    justify-content: start;
    margin: 7px;
    border: 0px;
    border-radius: 15px;
}
.menu_only:hover{
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
}
.active{
    border: 2px solid rgba(27, 78, 189, 0.804);
    border-radius: 15px;
    color: rgba(41, 103, 249, 0.862)!important;
}
.menu_icon{
    height: 30px;
    width: 30px;
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
}
.menu_icon :deep(.name_icon){
    display: block;
    font-size: 20px;
}
.menu_name{
    margin-left: 10px;
    text-align: center;
    line-height: 40px;
}
.record{
    height: 50%;
    padding-left: 10px;
    padding-top: 5px;
    padding-right: 7px;
    font-size: 15px;
    color:rgba(0,0,0,0.3) ;
    display: flex;
    flex-direction: column;
    justify-content: start;
}
.virtual{
    flex: 1;
}
/* .onemessage{
    margin-top: 10px;
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: start;
    box-sizing: border-box;
}
.onemessage:hover{
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(72, 120, 226, 0.74);
    border-radius: 20px;
    cursor: pointer;
}
.message{
    padding-left: 7px;
    line-height: 30px;
    font-size: 20px;
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
.delete :deep(.el-icon){
    padding-right: 7px;
} */
</style>