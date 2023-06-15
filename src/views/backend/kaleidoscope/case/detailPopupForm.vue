<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        v-model="store.detailVisible"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                详情
            </div>
        </template>
        <el-scrollbar max-height="60vh">
            <div class="ba-operate-form">
                <div class="demo-image__preview" v-if="store.detailType===2">
                    <el-image
                        style="width: 300px; height: 300px"
                        :src="store.content"
                        :zoom-rate="1.2"
                        :preview-src-list="[store.content]"
                        :initial-index="4"
                        fit="cover"
                    />
                </div>
                <video v-if="store.detailType===3" controls class="videoValue" :src="store.content"/>
                <div v-if="store.detailType===1">
                    案列内容地址： {{ store.content }}
                </div>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {kaleidoscopeCaseConfig} from "/@/stores/kaleidoscope/case";

const store = kaleidoscopeCaseConfig()
const handleClose = () => {
    store.id = ''
    store.name = ''
    store.detailType = 0
    store.content = ''
    store.detailVisible = false
}
</script>
<style lang="scss" scoped>
.demo-image__error .el-image {
    width: 100%;
    height: 200px;
}
.demo-image__preview {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
}
.videoValue {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 400px;
}
</style>
