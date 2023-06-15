<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        v-model="store.authorityAreaDialog"
        width="40%"
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
                    label-width="auto">
                    <el-form-item label="当前代理商：">
                        <span>{{ store.name }}</span>
                    </el-form-item>
                    <el-form-item label="联系方式：">
                        <span>{{ store.phone }}</span>
                    </el-form-item>
                    <el-form-item label="权限菜单：">
                        <el-tree
                            prop="validator"
                            :data='store.treeList'
                            node-key="id"
                            :default-checked-keys="store.checked_keys"
                            ref="treeRef"
                            show-checkbox
                            :props="defaultProps"
                            :expand-on-click-node="true"
                            :check-strictly="true"
                            @check-change="handleCheckChange">
                        </el-tree>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="auth('area')"
                :loading="submitLoading"
                @click="onSubmit(formRef)"
                type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {ref,} from "vue";
import type {ElForm} from "element-plus";
import {ElTree, FormInstance} from 'element-plus'
import {agentAccountConfig} from "/@/stores/agent/account/account";
import {accountManagementAreaPost} from "/@/api/backend/agent/account/account";
import {auth} from "/@/utils/common";

const submitLoading = ref(false)
const store = agentAccountConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = ref({
    children: 'children',
    label: 'name'
})
const handleCheckChange = () => {
    store.checked_keys = treeRef.value!.getCheckedKeys()
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            accountManagementAreaPost({
                id: store.id,
                areas: store.checked_keys,
            }).then(() => {
                store.refreshPage = true
                store.authorityAreaDialog = false
            })
        }
    })
}
const handleClose = () => {
    store.id = 0
    store.phone = ''
    store.name = ''
    store.refreshPage = false
    store.authorityAreaDialog = false
    store.treeList = []
    store.checked_keys = []
    store.dialogVisible = false
}
</script>

<style lang="scss" scoped>
</style>
