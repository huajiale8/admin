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
                    <el-descriptions-item label="摄影师姓名" :span="1" label-align="center">
                        {{ store.bankList.real_name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码" min-width="90px" :span="1" label-align="center">
                        {{ store.bankList.phone }}
                    </el-descriptions-item>
                    <el-descriptions-item label="摄影器材型号" min-width="120px" :span="2" label-align="center">
                        {{ store.bankList.equipment_type }}
                    </el-descriptions-item>
                    <el-descriptions-item
                        label="个人介绍"
                        :span="3"
                        label-align="center"
                        label-class-name="label_width">
                        <span class="size_none">  {{ store.bankList.intro }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="作品案列" label-align="center" :span="2">
                        <div class="photo-wrapper">
                            <el-image
                                class="images"
                                :src="store.bankList.works_one"
                                :zoom-rate="1.2"
                                :preview-src-list="[store.bankList.works_one,store.bankList.works_two]"
                                :initial-index="4"
                                fit="cover"
                            />
                            <el-image
                                class="images"
                                :src="store.bankList.works_two"
                                :zoom-rate="1.2"
                                :preview-src-list="[store.bankList.works_two,store.bankList.works_one]"
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
            <el-button v-if="auth('reject') && store.status===0" type="danger" @click="reject">驳回</el-button>
            <el-button v-if="auth('pass') && store.status===0" type="primary" @click="success">通过</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {ElMessageBox} from "element-plus";
import {planeConfig} from "/@/stores/identity/planepupForm";
import {planePass, planeReject} from "/@/api/backend/auth/identityi/plane";
import {auth} from "/@/utils/common";

const store = planeConfig()
const reject = () => {
    ElMessageBox.prompt("请输入驳回理由", "驳回", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入驳回理由";
        },
    })
        .then(({value}) => {
            planeReject({id: store.id, reason: value}).then(() => {
                store.dialogVisible = false
                store.refreshPage = true
                store.bankList = {}
                store.id = ''
            })
        });
}
const success = () => {
    planePass({id: store.id}).then(() => {
        store.dialogVisible = false
        store.refreshPage = true
        store.bankList = {}
        store.id = ''
    })
}
const handleClose = () => {
    store.status = 0
    store.bankList = {}
    store.id = ''
    store.refreshPage = false
    store.dialogVisible = false
}
</script>

<style scoped lang="scss">
.images {
    width: 150px;
    height: 150px;
    margin-left: 10px;
}

:deep(.label_width) {
    min-width: 110px;
    text-align: center;
    border: 1px solid red;
}
</style>
