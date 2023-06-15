<template>
        <el-dialog
            class="ba-operate-dialog"
            v-model="store.dialogVisible"
            :destroy-on-close="false"
            :close-on-click-modal="false"
            width="50%"
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
                    <el-descriptions
                        :column="2"
                        size="large"
                        border>
                        <el-descriptions-item label="客户/订单名称" min-width="150px" :span="2">
                            {{ store.name }}
                        </el-descriptions-item>
                        <el-descriptions-item label="联系人" min-width="100px">
                            {{ store.contact_name }}
                        </el-descriptions-item>
                        <el-descriptions-item min-width="100px" label="联系方式">
                            {{ store.contact_information }}
                        </el-descriptions-item>
                        <el-descriptions-item label="上门地址" :span="2">
                            {{ store.address }}
                        </el-descriptions-item>
                        <el-descriptions-item label="业务员" min-width="150px">
                            {{ store.salesman }}
                        </el-descriptions-item>
                        <el-descriptions-item label="全景套餐" min-width="200px">
                            {{ store.package }}
                        </el-descriptions-item>
                        <el-descriptions-item label="套餐年限">
                            {{ store.years }}
                        </el-descriptions-item>
                        <el-descriptions-item label="总价格">
                            {{ store.price }}
                        </el-descriptions-item>
                        <el-descriptions-item label="其他需求" :span="2">
                            {{ store.remarks }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-form
                        style="margin-top: 10px"
                        :model="store"
                        label-width="auto">
                        <el-form-item v-if="store.changeFlag" label="订单流程状态 :">
                            <el-select
                                v-model="store.flow_status"
                                placeholder="请选择订单流程状态">
                                <el-option label="请选择订单流程状态" :value="0"></el-option>
                                <el-option label="待实施" :value="1"></el-option>
                                <el-option label="实施中" :value="2"></el-option>
                                <el-option label="已完成" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="store.changeFlag" label="预约拍摄日期 :">
                            <el-date-picker
                                v-model="store.date"
                                type="date"
                                placeholder="请输入约定拍摄日期:如(2021-05-20)">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="store.changeFlag" label="成品URL链接 :">
                            <el-input placeholder="请输入最终交付URL地址" v-model="store.url"></el-input>
                        </el-form-item>
                        <el-form-item v-if="store.deadlineFlag" label="设置截止日期 :">
                            <el-date-picker
                                clearable
                                v-model="store.dateValueTow"
                                type="date"
                                placeholder="请输入截止日期如：(2021-05-20)">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <el-button @click="handleClose">取消</el-button>

                <el-button
                    v-if="store.editFlag && auth('reject')"
                    @click="overrule" type="danger">
                    驳回
                </el-button>
                <el-button
                    v-if="store.chargebackFlag && auth('chargeback')"
                    @click="go('chargeback')" type="danger">
                    退单处理
                </el-button>
                <el-button
                    v-if="store.changeFlag && auth('audit')"
                    @click="go('save')" type="primary">
                    保存
                </el-button>
                <el-button
                    v-if="store.deadlineFlag && auth('deadline')"
                    @click="deadline" type="primary">
                    保存
                </el-button>
                <el-button
                    v-if="store.editFlag && auth('audit')"
                    @click="go('pass')" type="primary">
                    通过
                </el-button>
            </template>
        </el-dialog>
</template>

<script setup lang="ts">
import {ElForm, ElMessage, ElMessageBox} from 'element-plus'
import {ref} from "vue";
import {agentOrderDashboardConfig} from "/@/stores/agent/order/dashboard/dashboard";
import {auth} from '/@/utils/common'
import {
    agentPanoramaAuditList,
    agentPanoramaChangeList,
    agentPanoramaChargebackList,
    agentPanoramaDeadlineList,
    agentPanoramaRejectList
} from "/@/api/backend/agent/order/panorama/panorama";

const store = agentOrderDashboardConfig()
const textarea = ref('')

const overrule = () => {
    let id = store.id
    ElMessageBox.prompt('请输入驳回理由', '驳回', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: "textarea",
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入驳回理由',
    })
        .then(({value}) => {
            agentPanoramaRejectList({id, reason: value}).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        })
}
const go = (status: string) => {
    let id = store.id
    if (status === 'pass') {
        ElMessageBox.confirm(
            '确定通过该订单?',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                agentPanoramaAuditList({id}).then(() => {
                    store.refreshPage = true
                    store.dialogVisible = false
                })
            })
    } else if (status === 'chargeback') {
        ElMessageBox.confirm(
            '确定退单处理?',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                agentPanoramaChargebackList({id}).then(() => {
                    store.refreshPage = true
                    store.dialogVisible = false
                })
            })
    } else if (status === 'save') {
        ElMessageBox.confirm(
            '确定修改该订单状态?',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                if (store.flow_status === 0) {
                    ElMessage({
                        type: 'warning',
                        message: '请选择订单流程状态',
                    })
                    return
                }
                agentPanoramaChangeList({
                    id: store.id,
                    flow_status: store.flow_status,
                    date: store.date,
                    url: store.url
                }).then(() => {
                    store.refreshPage = true
                    store.dialogVisible = false
                })
            })
    }
}
const deadline = () => {
    if (store.dateValueTow === '' || store.dateValueTow === null) {
        ElMessage({
            type: 'warning',
            message: '请设置截止日期！',
        })
        return
    } else {
        agentPanoramaDeadlineList({id: store.id, validate_date: infoData(store.dateValueTow)}).then(() => {
            store.refreshPage = true
            store.dialogVisible = false
        })
    }
}
const infoData = (data: any) => {
    let date = new Date(data);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1 as number;
    MM = MM < 10 ? ('0' + MM) as unknown as number : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) as unknown as number : d;
    return y + '-' + MM + '-' + d
}
const handleClose = () => {
    store.name = ''
    store.id = 0
    store.editFlag = false
    textarea.value = ''
    store.flow_status = 0
    store.date = ''
    store.url = ''
    store.dialogVisible = false
    store.refreshPage = false
    store.changeFlag = false
    store.chargebackFlag = false
    store.deadlineFlag = false
    store.contact_name = ''
    store.contact_information = ''
    store.address = ''
    store.salesman = ''
    store.package = ''
    store.dateValueTow = null
    store.years = ''
    store.price = ''
    store.remarks = ''
}
</script>

<style scoped lang="scss">
</style>
