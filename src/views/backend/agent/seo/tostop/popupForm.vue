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
import '@wangeditor/editor/dist/css/style.css'
import {ElMessageBox} from 'element-plus'
import {agentSeoStopConfig} from "/@/stores/agent/seo/tostop";
import {agentSeoTostopCheck} from "/@/api/backend/agent/seo/tostop/tostop";

const store = agentSeoStopConfig()
const pass = () => {
    agentSeoTostopCheck({
        id: store.id,
        supplier_type: store.supplier_type,
        supplier_id: store.supplier_id,
        status: 'check',
        remark: ''
    }).then(() => {
        store.refreshPage = true
        store.dialogVisible = false
    })
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
            agentSeoTostopCheck({id, status: 'reject', remark: value}).then(() => {
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
    store.supplier_type = 1
}
</script>

<style lang="scss" scoped>
</style>
