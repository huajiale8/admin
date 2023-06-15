<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="handleClick" :loading="loading"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="5" :offset="14">
                                <AreaCascader v-model="areaOptions"/>
                            </el-col>
                            <el-col :span="5">
                                <el-input
                                    clearable
                                    placeholder="请输入客户名称"
                                    v-model="pageInfo.name"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="待审核订单" :name="1"/>
                <el-tab-pane label="驳回订单" :name="8"/>
                <el-tab-pane label="已通过订单" :name="2"/>
                <el-tab-pane label="已交付订单" :name="3"/>
                <el-tab-pane label="退单完成订单" :name="7"/>
            </el-tabs>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="name"
                    align="center"
                    label="客户/订单名称"
                    min-width="250"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="validate_date"
                    align="center"
                    label="服务截止日期"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="package"
                    align="center"
                    label="套餐"
                    min-width="250"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="套数"
                    min-width="60"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span>{{ scope.row.years + '套' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="总价格"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span>{{ '¥' + scope.row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="province"
                    align="center"
                    label="省份"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="city"
                    align="center"
                    label="城市"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="county"
                    align="center"
                    label="区域"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="address"
                    align="center"
                    label="详细地址"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="contact_name"
                    align="center"
                    label="联系人"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="contact_information"
                    align="center"
                    label="联系方式"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="salesman"
                    align="center"
                    label="业务员"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="其他需求"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-popover
                            v-if="scope.row.remarks"
                            placement="top-start"
                            title="其他需求"
                            width="400"
                            trigger="hover"
                            :content="scope.row.remarks">
                            <template #reference>
                                <el-button type="primary" link>详情</el-button>
                            </template>
                        </el-popover>
                        <el-button v-else type="info" link>-</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeName === 8"
                    align="center"
                    label="驳回理由"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-popover
                            v-if="scope.row.reject_reason"
                            placement="top-start"
                            title="驳回理由"
                            width="400"
                            trigger="hover"
                            :content="scope.row.reject_reason">
                            <template #reference>
                                <el-button type="primary" link>详情</el-button>
                            </template>
                        </el-popover>
                        <el-button v-else type="info" link>-</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeName=== 1 "
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnView v-if="auth('view')" @click="particulars(scope.row.id)"/>
                            <BtnAudit v-if="auth('audit')" @click="edit(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeName === 8 || activeName === 7"
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="60"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="operate_btn">
                        <BtnView v-if="auth('view')" @click="particulars(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeName === 2"
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="130"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnView v-if="auth('view')" @click="particulars(scope.row.id)"/>
                            <el-tooltip v-if="auth('change')" content="订单流程" placement="top">
                                <el-button
                                    class="btn_shadow"
                                    type="warning"
                                    size="small"
                                    @click="change(scope.row.id)">
                                    <el-icon size="14">
                                        <Checked/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="auth('audit')" content="退单处理" placement="top">
                                <el-button
                                    class="btn_shadow"
                                    type="danger"
                                    size="small"
                                    @click="chargeback(scope.row.id)">
                                    <el-icon size="14">
                                        <CircleClose/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeName === 3"
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="130"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnView v-if="auth('view')" @click="particulars(scope.row.id)"/>
                            <el-tooltip v-if="auth('deadline')" content="截止日期" placement="top">
                                <el-button
                                    class="btn_shadow"
                                    type="warning"
                                    size="small"
                                    @click="deadline(scope.row.id)">
                                    <el-icon size="14">
                                        <Watch/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="auth('audit')" content="退单处理" placement="top">
                                <el-button
                                    class="btn_shadow"
                                    type="danger"
                                    size="small"
                                    @click="chargeback(scope.row.id)">
                                    <el-icon size="14">
                                        <CircleClose/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
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
import {auth} from '/@/utils/common'
import {computed, onMounted, reactive, ref, watch} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {agentOrderPanoramaCustomList, agentPanoramaDetailList} from "/@/api/backend/agent/order/panorama/panorama";
import PopupForm from "/@/views/backend/agent/order/panorama/popupForm.vue";
import {agentOrderDashboardConfig} from "/@/stores/agent/order/dashboard/dashboard";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnAudit from "/@/components/buttons/BtnAudit.vue";
import BtnView from "/@/components/buttons/BtnView.vue";

const store = agentOrderDashboardConfig()
const activeName = ref(1)
const loading = ref(false)
const areaOptions = ref([])
const total = ref(0)
const certList = ref<Area[]>([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: '',
    province_id: 0,
    city_id: 0,
    county_id: 0,
    status: 1
})

const handleClick = () => {
    pageInfo.page = 1
    pageInfo.name = ''
    pageInfo.status = activeName.value
    getList()
}
const particulars = (id: number) => {
    store.operate = '订单详情'
    agentPanoramaDetailList({id}).then(res => {
        let obj = res.data.content
        store.id = obj.id
        store.name = obj.name
        store.contact_name = obj.contact_name
        store.contact_information = obj.contact_information
        store.address = obj.province + obj.city + obj.county + obj.address
        store.salesman = obj.salesman
        store.package = obj.package
        store.years = obj.years
        store.price = obj.price
        store.remarks = obj.remarks
        store.dialogVisible = true
    })
}
const edit = (id: number) => {
    store.editFlag = true
    store.operate = '审核全景订单'
    agentPanoramaDetailList({id}).then(res => {
        let obj = res.data.content
        store.name = obj.name
        store.id = obj.id
        store.contact_name = obj.contact_name
        store.contact_information = obj.contact_information
        store.address = obj.province + obj.city + obj.county + obj.address
        store.salesman = obj.salesman
        store.package = obj.package
        store.years = obj.years
        store.price = obj.price
        store.remarks = obj.remarks
        store.dialogVisible = true
    })
}
const change = (id: number) => {
    store.changeFlag = true
    store.operate = '变更订单流程状态'
    agentPanoramaDetailList({id}).then(res => {
        let obj = res.data.content
        store.name = obj.name
        store.date = obj.date
        store.url = obj.url
        store.flow_status = obj.flow_status
        store.id = obj.id
        store.contact_name = obj.contact_name
        store.contact_information = obj.contact_information
        store.address = obj.province + obj.city + obj.county + obj.address
        store.salesman = obj.salesman
        store.package = obj.package
        store.years = obj.years
        store.price = obj.price
        store.remarks = obj.remarks
        store.dialogVisible = true
    })
}
const deadline = (id: number) => {
    store.deadlineFlag = true
    store.operate = '设置截止日期'
    agentPanoramaDetailList({id}).then(res => {
        let obj = res.data.content
        store.name = obj.name
        store.date = obj.date
        store.url = obj.url
        store.flow_status = obj.flow_status
        store.id = obj.id
        store.contact_name = obj.contact_name
        store.contact_information = obj.contact_information
        store.address = obj.province + obj.city + obj.county + obj.address
        store.salesman = obj.salesman
        store.package = obj.package
        store.years = obj.years
        store.price = obj.price
        store.remarks = obj.remarks
        store.dateValueTow = obj.validate_date
        store.dialogVisible = true
    })
}
const chargeback = (id: number) => {
    store.chargebackFlag = true
    store.operate = '退单订单详情'
    agentPanoramaDetailList({id}).then(res => {
        let obj = res.data.content
        store.name = obj.name
        store.id = obj.id
        store.contact_name = obj.contact_name
        store.contact_information = obj.contact_information
        store.address = obj.province + obj.city + obj.county + obj.address
        store.salesman = obj.salesman
        store.package = obj.package
        store.years = obj.years
        store.price = obj.price
        store.remarks = obj.remarks
        store.dialogVisible = true
    })
}
const getList = () => {
    pageInfo.province_id = 0
    pageInfo.city_id = 0
    pageInfo.county_id = 0
    loading.value = true
    if (areaOptions.value) {
        pageInfo.province_id = areaOptions.value[0]
        pageInfo.city_id = areaOptions.value[1]
        pageInfo.county_id = areaOptions.value[2]
    }
    agentOrderPanoramaCustomList(pageInfo).then(res => {
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
