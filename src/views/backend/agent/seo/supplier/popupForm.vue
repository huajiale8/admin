<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        v-model="store.dialogVisible"
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
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="供应商名称" prop="name">
                        <el-input v-model="store.name" placeholder="请输入标题"/>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="store.type">
                            <el-option :key="1" :value="1" label="主动拉取"></el-option>
                            <el-option :key="2" :value="2" label="主动推送"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="URL地址">
                        <el-input v-model="store.url" placeholder="URL地址"></el-input>
                    </el-form-item>
                    <el-form-item label="权限校验key">
                        <el-row>
                            <el-col :span="23">
                                <el-input
                                    name="access_id"
                                    v-model="store.access_id"
                                    placeholder="权限校验key">
                                </el-input>
                            </el-col>
                            <el-col :span="1">
                                <el-button
                                    type="primary"
                                    style="margin-left: 20px;"
                                    @click="random('access_id')">
                                    生成
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="权限校验secret">
                        <el-row>
                            <el-col :span="23">
                                <el-input
                                    name="access_key"
                                    v-model="store.access_key"
                                    placeholder="权限校验secret">
                                </el-input>
                            </el-col>
                            <el-col :span="1">
                                <el-button type="primary" style="margin-left: 20px;" @click="randoms('access_key')">
                                    生成
                                </el-button>
                            </el-col>
                        </el-row>
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
import {reactive, ref} from "vue";
import '@wangeditor/editor/dist/css/style.css'
import type {ElForm} from "element-plus";
import {FormInstance} from 'element-plus'
import {agentSeoSupplierConfig} from "/@/stores/seo/supplier/supplier";
import md5 from "js-md5";
import {agentSeoSupplierSave} from "/@/api/backend/agent/seo/supplier/supplier";
import {auth} from '/@/utils/common'

const submitLoading = ref(false)
const store = agentSeoSupplierConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    name: [
        {required: true, message: '请选择标题内容', trigger: 'blur'},
    ],
    type: [
        {required: true, message: '请选择类型', trigger: 'blur'},
    ],
})
const random = (key: any) => {
    let num = ''
    for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10)
    }
    let time = new Date().getTime();
    let md5Str = time + num + key
    store.access_id = md5(md5Str).toUpperCase();
}
const randoms = (key: any) => {
    let num = ''
    for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10)
    }
    let time = new Date().getTime();
    let md5Str = time + num + key
    store.access_key = md5(md5Str).toUpperCase();
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            agentSeoSupplierSave({
                id: store.id,
                name: store.name,
                type: store.type,
                url: store.url,
                access_id: store.access_id,
                access_key: store.access_key
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.refreshPage = false
    store.dialogVisible = false
    store.id = 0
    store.type = 2
    store.name = ''
    store.url = ''
    store.access_id = ''
    store.access_key = ''
}
</script>
<style lang="scss" scoped>
</style>
