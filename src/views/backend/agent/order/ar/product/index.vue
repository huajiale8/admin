<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="8">
                    <BtnRefresh @click="handleClick" :loading="loading"/>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="全部订单" :name="0"/>
                <el-tab-pane label="待报价" :name="2"/>
                <el-tab-pane label="报价确认" :name="3"/>
                <el-tab-pane label="制作中" :name="5"/>
                <el-tab-pane label="模型确认" :name="7"/>
                <el-tab-pane label="完成订单" :name="6"/>
                <el-tab-pane label="关闭订单" :name="4"/>
            </el-tabs>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="name"
                    align="center"
                    label="客户名称"
                    min-width="250"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="contact_name"
                    align="center"
                    label="联系人姓名"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="contact_info"
                    align="center"
                    label="联系方式"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="aName"
                    align="center"
                    label="代理商名称"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="sName"
                    align="center"
                    label="员工名称"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="price"
                    align="center"
                    label="总价格"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="status"
                    align="center"
                    label="状态"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 1">正在审核</el-tag>
                        <el-tag v-if="scope.row.status === 2">正在报价</el-tag>
                        <el-tag v-if="scope.row.status === 3">正在报价</el-tag>
                        <el-tag v-if="scope.row.status === 5" type="danger">正在制作</el-tag>
                        <el-tag v-if="scope.row.status === 6" type="success">订单完成</el-tag>
                        <el-tag v-if="scope.row.status === 4" type="info">订单关闭</el-tag>
                        <el-tag v-if="scope.row.status === 7" type="warning">等待验收</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="60">
                    <template #default="scope">
                        <div class="operate_btn">
                        <BtnView
                            v-if="activeName === 5"
                            @click="modelValidation(scope.row.id)"/>
                        <BtnView
                            v-if="activeName === 7 || activeName === 6"
                            @click="modelValidations(scope.row.id)"/>
                        <BtnView
                            v-if="activeName === 0 || activeName === 3"
                            @click="particulars(scope.row.id)"/>
                        <BtnView
                            v-if="activeName === 2"
                            @click="priceDetail(scope.row.id)"/>
                        <BtnView
                            v-if="activeName === 4"
                            @click="closeOrder(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:page-size="pageInfo.pageSize"
                v-model:page="pageInfo.page"
                :total="total"
                @render="getList">
            </paging-module>
        </el-card>
        <popup-form/>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import PopupForm from "/@/views/backend/agent/order/ar/product/popupForm.vue";
import {
    agentOrderArProductCustomDetail,
    agentOrderArProductCustomList
} from "/@/api/backend/agent/order/ar/panorama/panorama";
import {agentOrderArProductConfig} from "/@/stores/agent/order/ar/product/product";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnView from "/@/components/buttons/BtnView.vue";

const store = agentOrderArProductConfig()
const activeName = ref(0)
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    status: 0
})
const total = ref(0)
const certList = ref<Area[]>([])

const handleClick = () => {
    pageInfo.page = 1
    pageInfo.status = activeName.value
    getList()
}

const priceDetail = (id: number) => {
    store.operate = '订单详情'
    store.priceFlag = true
    agentOrderArProductCustomDetail({id}).then(res => {
        let obj = res.data.content
        switch (obj.status) {
            case 2:
                store.status = 1
                break
            case 5:
                store.status = 2
                break
            case 7:
                store.status = 3
                break
            case 6:
                store.status = 4
                break
            default:
                break
        }
        store.id = obj.id
        store.custom_name = obj.custom_name
        store.contract_info = obj.contract_info
        store.price = obj.price
        store.skus = obj.skus
        store.dialogVisible = true
    })
}
const modelValidation = (id: number) => {
    store.operate = '订单详情'
    agentOrderArProductCustomDetail({id}).then(res => {
        let obj = res.data.content
        switch (obj.status) {
            case 3:
                store.status = 1
                break
            case 5:
                store.status = 2
                break
            case 7:
                store.status = 3
                break
            case 6:
                store.status = 4
                break
            default:
                break
        }
        store.id = obj.id
        store.custom_name = obj.custom_name
        store.modelFlag = true
        store.contract_info = obj.contract_info
        store.price = obj.price
        store.skus = obj.skus
        store.dialogVisible = true
    })
}
const modelValidations = (id: number) => {
    store.operate = '订单详情'
    agentOrderArProductCustomDetail({id}).then(res => {
        let obj = res.data.content
        switch (obj.status) {
            case 3:
                store.status = 1
                break
            case 5:
                store.status = 2
                break
            case 7:
                store.status = 3
                break
            case 6:
                store.status = 4
                break
            default:
                break
        }
        store.id = obj.id
        store.custom_name = obj.custom_name
        store.contract_info = obj.contract_info
        store.price = obj.price
        store.skus = obj.skus
        store.dialogVisible = true
    })
}
const particulars = (id: number) => {
    store.operate = '订单详情'
    agentOrderArProductCustomDetail({id}).then(res => {
        let obj = res.data.content
        switch (obj.status) {
            case 3:
                store.status = 1
                break
            case 5:
                store.status = 2
                break
            case 4:
                store.status = 5
                break
            case 7:
                store.status = 3
                break
            case 6:
                store.status = 4
                break
            default:
                break
        }
        store.custom_name = obj.custom_name
        store.contract_info = obj.contract_info
        store.price = obj.price
        store.skus = obj.skus
        store.dialogVisible = true
    })
}
const closeOrder = (id: number) => {
    store.operate = '订单详情'
    agentOrderArProductCustomDetail({id}).then(res => {
        let obj = res.data.content
        store.status = 5
        store.id = obj.id
        store.custom_name = obj.custom_name
        store.contract_info = obj.contract_info
        store.price = obj.price
        store.skus = obj.skus
        store.dialogVisible = true
    })
}
const getList = () => {
    loading.value = true
    agentOrderArProductCustomList(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const getDialogVisible = computed(() => {
    return store.refreshPage
})
watch(getDialogVisible, (newValue) => {
    if (newValue) {
        pageInfo.status = activeName.value
        getList()
    }
}, {immediate: true, deep: true});
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
