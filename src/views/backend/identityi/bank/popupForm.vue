<template>
    <el-dialog
        :close-on-click-modal="false"
        :destroy-on-close="true"
        class="ba-operate-dialog"
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
                <el-descriptions :column="2" size="large" border>
                    <el-descriptions-item label="真实姓名" label-align="center" :span="2">
                        {{ store.bankList.real_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="银行名称" label-align="center">
                        {{ store.bankList.bank_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="开户行名称" min-width="105px"  label-align="center">
                        {{ store.bankList.opening_bank }}
                    </el-descriptions-item>
                    <el-descriptions-item label="银行卡号" :span="2" label-align="center">
                        {{ store.bankList.card_number }}
                    </el-descriptions-item>
                    <el-descriptions-item label="银行卡照片" min-width="105px" label-align="center">
                        <div class="photo-wrapper">
                            <el-image
                                class="images"
                                :src="store.bankList.bank_front"
                                :zoom-rate="1.2"
                                :preview-src-list="[store.bankList.bank_front,store.bankList.bank_backend]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="反面" label-align="center">
                        <div class="photo-wrapper">
                            <el-image
                                class="images"
                                :src="store.bankList.bank_backend"
                                :zoom-rate="1.2"
                                :preview-src-list="[store.bankList.bank_backend,store.bankList.bank_front]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button v-if=" auth('reject') && store.status === 0" type="danger" @click="reject">驳回</el-button>
            <el-button v-if="auth('pass') &&  store.status === 0" type="primary" @click="success">通过</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {ElMessageBox} from "element-plus";
import {bankConfig} from "/@/stores/identity/bankpupForm";
import {passLists, rejectLists} from "/@/api/backend/auth/identityi/bank";
import {auth} from "/@/utils/common";

const store = bankConfig()
const reject = () => {
    ElMessageBox.prompt("请输入驳回理由", "驳回", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入驳回理由";
        },
    })
        .then(({value}) => {
            rejectLists({id: store.id, reason: value}).then(() => {
                store.dialogVisible = false
                store.refreshPage = true
                store.bankList = {}
                store.id = ''
            })
        });
}

const success = () => {
    passLists({id: store.id}).then(() => {
        store.dialogVisible = false
        store.refreshPage = true
        store.bankList = {}
        store.id = ''
    })
}
const handleClose = () => {
    store.id = ''
    store.bankList = {}
    store.refreshPage = false
    store.dialogVisible = false
}
</script>

<style scoped lang="scss">
:deep(.el-input__prefix) {
    position: absolute !important;
    right: 0 !important;
    top: -4px !important;
}

.images {
    width: 100%;
    height: 150px;
}
</style>
