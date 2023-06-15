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
        <el-scrollbar>
            <div class="ba-operate-form">
                <el-row class="m-b-10">
                    <el-col :span="3" class="col-left">
                        订单状态
                    </el-col>
                    <el-col :span="20" class="col-left">
                        <el-steps :active="store.status">
                            <el-step title="正在审核"></el-step>
                            <el-step title="正在报价"></el-step>
                            <el-step title="正在制作"></el-step>
                            <el-step title="等待验收"></el-step>
                            <el-step title="订单完成"></el-step>
                            <el-step title="订单关闭"></el-step>
                        </el-steps>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 30px">
                    <el-col :span="3">
                        订单信息
                    </el-col>
                    <el-col :span="20" class="disClient">
                        <p>客户: {{ store.custom_name }}</p>
                        <p>联系方式：{{ store.contract_info }}</p>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 50px">
                    <el-col :span="3">
                        商品信息
                    </el-col>
                    <el-col :span="21" class="disClient">
                        <el-table :data="store.skus" border>
                            <el-table-column
                                prop="name"
                                label="商品名称"
                                min-width="150"
                                :show-overflow-tooltip="true"/>
                            <el-table-column
                                prop="sku"
                                label="SKU"
                                min-width="100"
                                :show-overflow-tooltip="true"/>
                            <el-table-column
                                prop="pic"
                                label="图片"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template #default="scope">
                                    <el-image
                                        style="width: 60px; height: 60px"
                                        :src="scope.row.pic"
                                        :zoom-rate="1.2"
                                        :preview-src-list="[scope.row.pic]"
                                        :initial-index="4"
                                        fit="cover"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="price"
                                label="价格"
                                min-width="180"
                                :show-overflow-tooltip="true">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.price"
                                        :disabled="!store.priceFlag"
                                        @change="syncOrderPrice">
                                        <template #prepend>￥</template>
                                    </el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row class="price">
                    <el-col :span="3">
                        报价：
                    </el-col>
                    <el-col :span="20" class="disClient">
                        ￥{{ store.price }}
                    </el-col>
                </el-row>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="store.priceFlag"
                @click="overFrom" type="danger">结束订单
            </el-button>
            <el-button
                v-if="store.modelFlag && auth('finish')"
                @click="modelYes" type="primary">模型确认
            </el-button>
            <el-button
                v-if="store.priceFlag && auth('quote')"
                @click="quote" type="primary">完成报价
            </el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus'
import {auth} from '/@/utils/common'
import {agentOrderArProductConfig} from "/@/stores/agent/order/ar/product/product";
import {
    agentOrderArProductCustomClose,
    agentOrderArProductCustomFinish,
    agentOrderArProductCustomQuote
} from "/@/api/backend/agent/order/ar/panorama/panorama";

const store = agentOrderArProductConfig()

const syncOrderPrice = () => {
    let skus = store.skus
    store.price = 0
    for (let i = 0; i < skus.length; i++) {
        store.price += parseInt(skus[i].price)
    }
}
const quote = () => {
    let id = store.id
    let price = store.price
    let skus = store.skus
    ElMessageBox.confirm(
        '确定完成该报价?',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            if (store.price <= 0 || Number.isNaN(store.price)) {
                ElMessage({
                    type: 'warning',
                    message: '请填写价格！',
                })
                return
            } else {
                agentOrderArProductCustomQuote({id, price, skus}).then(() => {
                    store.refreshPage = true
                    store.dialogVisible = false
                })
            }
        })
}
const overFrom = () => {
    let id = store.id
    ElMessageBox.confirm(
        '确认结束订单?',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            agentOrderArProductCustomClose({id}).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        })
}
const modelYes = () => {
    let id = store.id
    ElMessageBox.confirm(
        '确定该订单?',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            agentOrderArProductCustomFinish({id}).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        })

}
const handleClose = () => {
    store.custom_name = ''
    store.id = 0
    store.contract_info = ''
    store.status = 0
    store.skus = []
    store.price = 0
    store.priceFlag = false
    store.url = ''
    store.refreshPage = false
    store.dialogVisible = false
    store.modelFlag = false
    store.address = ''
    store.dateValueTow = null
}
</script>

<style scoped lang="scss">
.disClient {
    display: flex;
    justify-content: space-between;
}

.price {
    margin-top: 20px;
    margin-bottom: 20px
}
</style>
