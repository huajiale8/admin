<template>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="handleClose">
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
import {computed, ref, watch,} from "vue";
import {agentAccountConfig} from "/@/stores/agent/account/account";

const store = agentAccountConfig()
const newList = ref(store.newList)
const oldList = ref(store.oldList)
const handleClose = () => {
    store.newList = {}
    store.oldList = []
    store.dialog = false
}
const getDialog = computed(() => {
    return store.dialog
})
watch(getDialog, (newValue) => {
    if (newValue) {
        newList.value = JSON.stringify([store.newList], null, 2)
        oldList.value = JSON.stringify(store.oldList, null, 2)
    }
}, {immediate: true, deep: true});
</script>
<style lang="scss" scoped>
</style>
