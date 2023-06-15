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
                        {{ store.custom_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="消费类型">
                        <el-input v-model="store.consumeTypes[store.types]" disabled></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item label="关键词">
                        {{ store.keyword }}
                    </el-descriptions-item>
                    <el-descriptions-item label="当前排名" :span="2">
                        {{ store.current_ranking }}
                    </el-descriptions-item>
                    <el-descriptions-item label="消费金额">
                        {{ store.quota }}
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
            <el-button v-if="auth('save')" @click="pass" type="primary">通过</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {auth} from '/@/utils/common'
import '@wangeditor/editor/dist/css/style.css'
import {ElMessageBox} from 'element-plus'
import {agentSeoApiCorrectConfig} from "/@/stores/agent/seo/api/correct";
import {agentSeoApiCorrectCheck} from "/@/api/backend/agent/seo/api/correct/correct";

const store = agentSeoApiCorrectConfig()
const pass = () => {
    agentSeoApiCorrectCheck({
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
            agentSeoApiCorrectCheck({id, status: 'reject', remark: value}).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        })
}
const handleClose = () => {
    store.dialogVisible = false
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
