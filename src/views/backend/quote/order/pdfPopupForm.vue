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
        <el-scrollbar height="60vh">
            <div class="ba-operate-form">
                <el-row :gutter="10" style="display: flex; justify-content: center; align-items: center;">
                    <el-col :span="8"><span style="font-weight: bold;font-size: 24px">新看点VR服务报价</span>
                    </el-col>
                    <el-col :span="5"><img src="/@/assets/images/logo-version.png" alt=""></el-col>
                    <el-col :span="11" style="font-size: 12px;">
                        <el-row :gutter="10">
                            <el-col :span="24">苏州新看点信息技术有限公司</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">苏州市工业园区金鸡湖大道88号人工智能产业园G1-803</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">电话：4006622360</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">网址：www.xkdphoto.com</el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;">
                    <el-col :span="24" style="text-align: right">报价有效期 {{
                            store.pdfList.validate_date
                        }}
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin: 10px 0 10px 0;">
                    <el-col :span="24" style="font-size: 20px;font-weight: bold;">主体信息</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12" style="line-height: 24px;">
                        <el-row :gutter="10">
                            <el-col :span="10">甲方名称：</el-col>
                            <el-col :span="14">{{ store.pdfList.custom_name }}</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10">甲方联系人：</el-col>
                            <el-col :span="14">{{ store.pdfList.custom_contact }}</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10">甲方联系方式：</el-col>
                            <el-col :span="14">{{ store.pdfList.custom_phone }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12" style="line-height: 24px;">
                        <el-row :gutter="10">
                            <el-col :span="10">乙方客户经理：</el-col>
                            <el-col :span="14">{{ store.pdfList.bidder_name }}</el-col>
                        </el-row>
                        <el-row :gutter="10" style="min-height:24px;">
                            <el-col :span="10"></el-col>
                            <el-col :span="14"></el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10">联系方式：</el-col>
                            <el-col :span="14">{{ store.pdfList.bidder_phone }}</el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;">
                    <el-col :span="10">项目工期：</el-col>
                    <el-col :span="14">{{ store.pdfList.duration }}个工作日</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="10">项目起讫时间：</el-col>
                    <el-col :span="14">{{ store.pdfList.start_time }} - {{ store.pdfList.end_time }}</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="10">项目地点：</el-col>
                    <el-col :span="14"></el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;font-weight: bold">
                    <el-col :span="8">服务名称</el-col>
                    <el-col :span="4">单价</el-col>
                    <el-col :span="4">单位</el-col>
                    <el-col :span="4">数量</el-col>
                    <el-col :span="4">总价</el-col>
                </el-row>
                <div :gutter="10" :key="index" v-for="(item, index) in store.pdfList.services">
                    <el-row :gutter="10" style="margin-top: 5px;">
                        <el-col :span="24">{{ item.name }}</el-col>
                    </el-row>
                    <el-row :gutter="10" :key="j" v-for="(datum, j) in item.children" style="margin-top: 5px;">
                        <el-col :span="2" style="min-height: 1px;"></el-col>
                        <el-col :span="6">{{ datum.name }}</el-col>
                        <el-col :span="4">{{ datum.price }}</el-col>
                        <el-col :span="4">{{ datum.unit }}</el-col>
                        <el-col :span="4">{{ datum.num }}</el-col>
                        <el-col :span="4">{{ datum.total }}</el-col>
                    </el-row>
                </div>
                <el-row :gutter="10" style="margin-top: 10px;">
                    <el-col :span="8">以上价格小计</el-col>
                    <el-col :span="8">¥{{ store.pdfList.itemPrice }}</el-col>
                    <el-col :span="8"></el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;font-weight: bold;">
                    <el-col :span="24">活动</el-col>
                </el-row>
                <el-row :gutter="10" :key="index" v-for="(item, index) in store.pdfList.activities"
                        style="margin-top: 5px;">
                    <el-col :span="2" style="min-height: 1px;"></el-col>
                    <el-col :span="12">{{ item.name }}</el-col>
                    <el-col :span="10">-{{ item.amount }}</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;font-weight: bold;">
                    <el-col :span="24">折扣</el-col>
                </el-row>
                <el-row :gutter="10" :key="index" v-for="(item, index) in store.pdfList.services"
                        style="margin-top: 5px;">
                    <el-col :span="2" style="min-height: 1px;"></el-col>
                    <el-col :span="12">{{ item.name }}</el-col>
                    <el-col :span="10">-{{ item.discount }}%</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="12">整体折扣</el-col>
                    <el-col :span="12">-{{ store.pdfList.discount }}%</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="24">税金6%</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="4" style="min-height: 1px;"></el-col>
                    <el-col :span="6">以上价格</el-col>
                    <el-col :span="6">¥{{ store.pdfList.total_price }}</el-col>
                    <el-col :span="8">{{ store.pdfList.RMB }}</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">备注</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="2" style="min-height: 1px;"></el-col>
                    <el-col :span="20">{{ store.pdfList.remark }}</el-col>
                </el-row>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="dialog-footer" style="text-align: right;">
                <el-button @click="handleClose">关闭</el-button>
                <el-button
                    v-if="store.pdfList.status >= 3"
                    type="primary"
                    @click="download(store.pdfList.id)">
                    导出
                </el-button>
                <el-button
                    v-if="[3, 4].includes(store.pdfList.status) && auth('close')"
                    type="warning"
                    @click="closeOrder(store.pdfList.id)">
                    关闭订单
                </el-button>
                <el-button
                    v-if="store.toCheck && auth('reject')"
                    type="danger"
                    @click="refuse(store.pdfList.id)">
                    拒绝
                </el-button>
                <el-button
                    v-if="store.toCheck && auth('pass')"
                    type="success"
                    @click="consent(store.pdfList.id)">同意
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import {orderConfig} from '/@/stores/quote/orderPopupForm'
import {onMounted} from "vue";
import {apiExport, orderClose, orderPass, orderReject} from "/@/api/backend/auth/quote/order";
import {ElMessageBox} from "element-plus";
import {auth} from "/@/utils/common";

const store = orderConfig()

const emit = defineEmits(['getList'])

const handleClose = () => {
    store.toCheck = false
    store.dialogToReject = false
    store.refreshPage = false
    store.rejectReason.id = 0
    store.rejectReason.reason = ''
    store.dialogVisible = false
}
const consent = (i: number) => {
    orderPass({id: i}).then(() => {
        emit('getList')
        store.dialogVisible = false
    })
}
const refuse = (i: number) => {
    ElMessageBox.prompt("请输入拒绝理由", "拒绝", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入拒绝理由";
        },
    })
        .then(({value}) => {
            orderReject({id: i, reason: value}).then(() => {
                emit("getList");
                store.dialogVisible = false
            }).finally(() => {
            });
        });
}
const closeOrder = (i: number) => {
    ElMessageBox.confirm(
        '确认关闭该订单？',
        'Warning',
        {
            confirmButtonText: '确定 ',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            orderClose({id: i}).then(() => {
                emit("getList");
                store.dialogVisible = false
            })

        })
}
const download = (i: number) => {
    apiExport({id: i, type: 'export', name: store.pdfList.code}).then(() => {
        store.dialogVisible = false
    })
}
onMounted(() => {

});
</script>

<style scoped lang="scss">

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.felx {
    display: flex;
    justify-content: space-around;
}

.box-card {
    width: 49%;

    .card-header {
        text-align: center !important;
        width: 100%;
        align-items: center;
    }

}
</style>
