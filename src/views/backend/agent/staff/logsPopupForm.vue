<template>
    <el-dialog
        v-model="dialogVisible"
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        >
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                数据比较
            </div>
        </template>
        <el-scrollbar max-height="60vh">
            <code-diff
                :new-string="newList"
                :old-string="oldList"
                file-name="数据差异对比"
                :context="10000"
                :isShowNoChange="true"
                output-format="side-by-side"/>
        </el-scrollbar>
    </el-dialog>
</template>
<script setup lang="ts">
import {computed,} from "vue";

const props = defineProps({
    dialogVisible: Boolean,
    newList: String,
    oldList: String,
})
const emit = defineEmits(['update:dialogVisible'])
const dialogVisible = computed({
    get() {
        return props.dialogVisible
    },
    set(value) {
        emit('update:dialogVisible', value)
    }
})
</script>
<style lang="scss" scoped>
</style>
