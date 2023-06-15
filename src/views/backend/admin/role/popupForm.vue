<template>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialogVisible"
        :destroy-on-close="true"
        :close-on-click-modal="false"
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
                    <el-form-item label="权限组名称 :" prop="name">
                        <el-input v-model="store.name" placeholder="请输入权限组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用 :" prop="level">
                        <el-radio-group v-model="store.level">
                            <el-radio :label="0">启用</el-radio>
                            <el-radio :label="1">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="权限菜单 :">
                        <el-tree
                            prop="validator"
                            :data='store.treeList'
                            node-key="id"
                            :default-checked-keys="store.rules"
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
            <el-button v-if="auth('update')" @click="onSubmit(formRef)" type="primary">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {ElForm, ElTree, FormInstance} from 'element-plus'
import {reactive, ref,} from "vue";
import {roleConfig} from '/@/stores/admin/rolepupForm'
import {rulesUpdate} from "/@/api/backend/auth/admin/role";
import {auth} from "/@/utils/common";

const defaultProps = ref({
    children: 'children',
    label: 'title'
})
const formRef = ref<InstanceType<typeof ElForm>>();
const treeRef = ref<InstanceType<typeof ElTree>>()
const store = roleConfig()
const rules = reactive({
    name: [
        {required: true, message: '请填写权限组名称', trigger: 'blur'},
    ],
    level: [
        {required: true, message: '请选择是否启用', trigger: 'blur'},
    ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            rulesUpdate({
                id: store.id,
                title: store.name,
                status: store.level,
                rules: store.rules
            }).then(() => {
                store.flag = true
                store.dialogVisible = false
            })

        }
    })
}
const handleCheckChange = () => {
    store.rules = treeRef.value!.getCheckedKeys()
}
const handleClose = () => {
    store.name = ''
    store.id = 0
    store.level = 0
    store.rules = []
    store.flag = false
    store.dialogVisible = false
}
</script>
<style scoped lang="scss"></style>
