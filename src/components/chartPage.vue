<template>
    <div class="chat1">
<div class="chart2">
<aside-tree></aside-tree>
</div>
<div class="chart3">
    <div class="page_top">
<page-header></page-header>
    </div>
    <div class="page_body">
<paga-body></paga-body>
    </div>
    <div class="page_foot">
<page-foot></page-foot>
    </div>
</div>
    </div>
</template>

<script setup>
import asideTree from './asideTree.vue'
import pageHeader from './pageHeader.vue'
import pageFoot from './pageFoot.vue';
import pagaBody from './pageBody.vue';
</script>

<style lang="css" scoped>
.chat1{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}
.chart2{
    height: 100%;
}
.chart3{
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}
.page_body{
    flex: 1;
    margin: 7px 220px 7px 220px;
    background-color: rgba(0, 0, 0, 0.01);
    height: 100%;
    /* overflow-y: hidden;  */
}

.paga_foot{
    position: sticky;
}

</style>
