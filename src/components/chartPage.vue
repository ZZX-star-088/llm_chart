<template>
    <div class="chat-layout">
        <div class="chat-sidebar">
            <aside-tree></aside-tree>
        </div>
        <div class="chat-main">
            <div class="chat-header">
                <page-header></page-header>
            </div>
            <div class="chat-body">
                <paga-body></paga-body>
            </div>
            <div class="chat-footer">
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
.chat-layout {
    display: flex;
    height: 100%;
    background: var(--bg-page);
}

.chat-sidebar {
    height: 100%;
    flex-shrink: 0;
}

.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-width: 0;
    background: var(--bg-card);
    margin: 0;
    box-shadow: -1px 0 0 var(--border-light);
}

.chat-header {
    flex-shrink: 0;
    border-bottom: 1px solid var(--border-light);
    background: var(--bg-card);
}

.chat-body {
    flex: 1;
    min-height: 0;
    padding: 0 180px;
}

.chat-footer {
    flex-shrink: 0;
    padding: 12px 180px 20px;
    background: var(--bg-card);
    border-top: 1px solid var(--border-light);
}

@media (max-width: 1200px) {
    .chat-body {
        padding: 0 60px;
    }
    .chat-footer {
        padding: 12px 60px 20px;
    }
}

@media (max-width: 768px) {
    .chat-body {
        padding: 0 16px;
    }
    .chat-footer {
        padding: 12px 16px 20px;
    }
}
</style>
