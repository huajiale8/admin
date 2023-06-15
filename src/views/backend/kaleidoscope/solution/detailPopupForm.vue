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
                <el-card style="margin-bottom: 10px" v-for="(item,index) in store.detailContent" :key="index">
                    <el-form-item label="PPT截图" prop="cover">
                        <img
                            v-if="store.detailContent[index].picture"
                            :src="store.detailContent[index].picture"
                            class="avatar" alt=""/>
                    </el-form-item>
                    <el-form-item label="案列链接" prop="name">
                        <div class="gradient-text">{{ store.detailContent[index].link }}</div>
                    </el-form-item>
                </el-card>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {kaleidoscopeSolutionConfig} from "/@/stores/kaleidoscope/solution";

const store = kaleidoscopeSolutionConfig()
const handleClose = () => {
    store.id = ''
    store.name = ''
    store.detailContent = [{
        link: '',
        picture: '',
    }]
    store.detailVisible = false
}
</script>

<style lang="scss" scoped>
.avatar {
    width: 100%;
    height: 300px;
}
</style>
