<template>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialogVisible"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        width="40%"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                审核资料
            </div>
        </template>
        <el-scrollbar max-height="60vh">
            <div class="ba-operate-form">
                <el-descriptions
                    :column="2"
                    size="large"
                    border>
                    <el-descriptions-item label="客户" :span="2">
                        {{ store.company_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="联系人">
                        {{ store.contact_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="关键词">
                        {{ store.keyword }}
                    </el-descriptions-item>
                    <el-descriptions-item label="网址" :span="2">
                        {{ store.website }}
                    </el-descriptions-item>
                    <el-descriptions-item label="搜索引擎">
                        {{ store.engine }}
                    </el-descriptions-item>
                    <el-descriptions-item label="单价">
                        {{ store.price }}
                    </el-descriptions-item>
                </el-descriptions>
                <el-form
                    style="margin-top: 10px"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="数据交互类型 :" prop="supplier_type">
                        <el-select
                            @change="select"
                            v-model="store.supplier_type"
                            placeholder="请选择数据交互类型">
                            <el-option label="主动拉取" :key="1" value="1"></el-option>
                            <el-option label="主动推送" :key="2" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="store.supplier_type === '1' || store.supplier_type === '2'" label="供应商">
                        <el-select v-model="store.supplier_id">
                            <el-option
                                v-for="item in store.suppliers"
                                :label="item.name"
                                :key="item.id"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button v-if="auth('reject')" @click="reject" type="danger">驳回</el-button>
            <el-button v-if="auth('pass')" @click="pass" type="primary">通过</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {auth} from '/@/utils/common'
import {reactive} from "vue";
import '@wangeditor/editor/dist/css/style.css'
import type {ElForm} from "element-plus";
import {ElMessageBox} from 'element-plus'
import {agentSeoChecklistConfig} from "/@/stores/agent/seo/checklist";
import {agentSeoKeywordCheck, agentSupplierList} from "/@/api/backend/agent/seo/checklist/checklist";

const store = agentSeoChecklistConfig()
const rules = reactive({
    supplier_type: [
        {required: true, message: '请选择数据交互类型', trigger: 'blur'}
    ],
    supplier_id: [
        {required: true, message: '请选择供应商', trigger: 'blur'}
    ],
})
const pass = () => {
    agentSeoKeywordCheck({
        id: store.id,
        supplier_type: Number(store.supplier_type),
        supplier_id: store.supplier_id,
        status: 'check',
        remark: ''
    }).then(() => {
        store.refreshPage = true
        store.dialogVisible = false
    })
}
const select = () => {
    store.suppliers = []
    store.supplier_id = ''
    if (store.supplier_type === '1') {
        agentSupplierList({type: 1}).then(res => {
            store.suppliers = res.data.content
        })
    } else {
        agentSupplierList({type: 2}).then(res => {
            store.suppliers = res.data.content
        })
    }
}
const reject = () => {
    let id = store.id
    ElMessageBox.prompt('请输入驳回理由', '驳回', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: "textarea",
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入驳回理由',
    })
        .then(({value}) => {
            agentSeoKeywordCheck({id, status: 'reject', remark: value}).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        })
}
const handleClose = () => {
    store.refreshPage = false
    store.dialogVisible = false
    store.company_name = ''
    store.website = ''
    store.supplier_id = ''
    store.id = ''
    store.keyword = ''
    store.engine = ''
    store.price = ''
    store.supplier_type = ''
}
</script>

<style lang="scss" scoped>
</style>
