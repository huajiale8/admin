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
        <el-scrollbar>
            <div class="ba-operate-form">
                <el-descriptions
                    :column="2"
                    size="large"
                    border
                >
                    <el-descriptions-item label="真实姓名" label-align="center" :span="2">
                        {{ store.bankList.real_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码" label-align="center">
                        {{ store.bankList.phone }}
                    </el-descriptions-item>
                    <el-descriptions-item label="身份证号码" min-width="120px" label-align="center">
                        {{ store.bankList.card_number }}
                    </el-descriptions-item>
                    <el-descriptions-item label="身份证照片" min-width="120px" label-align="center">
                        <div class="photo-wrapper">
                            <el-image
                                class="images"
                                :src="store.bankList.card_backend"
                                :zoom-rate="1.2"
                                :preview-src-list="[store.bankList.card_backend,store.bankList.card_front]"
                                :initial-index="4"
                                fit="cover"
                            />
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="反面" label-align="center">
                        <div class="photo-wrapper">
                            <el-image
                                class="images"
                                :src="store.bankList.card_front"
                                :zoom-rate="1.2"
                                :preview-src-list="[store.bankList.card_front,store.bankList.card_backend]"
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
            <el-button v-if="store.status === 0 && auth('reject')" type="danger" @click="reject">驳回</el-button>
            <el-button v-if="store.status === 0  && auth('pass')" type="primary" @click="success">通过</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {ElMessageBox} from "element-plus";
import {realConfig} from "/@/stores/identity/realpupForm";
import {realPass, realReject} from "/@/api/backend/auth/identityi/real";
import {auth} from "/@/utils/common";

const store = realConfig()
const reject = () => {
    ElMessageBox.prompt("请输入驳回理由", "驳回", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入驳回理由";
        },
    }).then(({value}) => {
        realReject({id: store.id, reason: value}).then(() => {
            store.dialogVisible = false
            store.refreshPage = true
            store.bankList = {}
            store.id = ''
        })
    });
}
const success = () => {
    realPass({id: store.id}).then(() => {
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
.images {
    width: 100%;
    height: 150px;
}
</style>
