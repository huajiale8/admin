<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="40%"
        v-model="store.dialogVisible"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                {{ store.operate }}
            </div>
        </template>
        <el-scrollbar max-height="60vh">
            <div class="ba-operate-form">
                <el-form
                    ref="formRef"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="store.name" placeholder="分类名称"/>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model="store.sort" placeholder="分类排序"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="auth('save')"
                :loading="submitLoading"
                @click="onSubmit(formRef)"
                type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import type {ElForm} from "element-plus";
import {FormInstance} from "element-plus";
import {auth} from "/@/utils/common";
import {kaleidoscopeTypeConfig} from "/@/stores/kaleidoscope/type";
import {kaleidoscopeTypeSave} from "/@/api/backend/kaleidoscope/type";

const submitLoading = ref(false)
const store = kaleidoscopeTypeConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    name: [
        {required: true, message: '请填写分类名称', trigger: 'blur'},
    ],
    sort: [
        {required: true, message: '请输入分类排序', trigger: 'blur'},
    ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            kaleidoscopeTypeSave({
                id: store.id,
                name: store.name,
                sort: store.sort,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.id = ''
    store.name = ''
    store.sort = ''
    store.refreshPage = false
    store.dialogVisible = false
}
</script>
<style lang="scss" scoped>
</style>
