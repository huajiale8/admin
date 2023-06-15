<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col
                                :span="5"
                                :offset="9"
                                justify="space-between">
                                <AreaCascader v-model="areaOptions"/>
                            </el-col>
                            <el-col :span="5" justify="space-between">
                                <el-input
                                    clearable
                                    placeholder="请输入酒店名称"
                                    v-model="pageInfo.hotel_name"
                                    autocomplete="off"/>
                            </el-col>
                            <el-col :span="5" justify="space-between">
                                <el-input
                                    clearable
                                    placeholder="请输入详细地址"
                                    v-model="pageInfo.hotel_address"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="待处理" :name="0"></el-tab-pane>
                <el-tab-pane label="已收款" :name="1"></el-tab-pane>
                <el-tab-pane label="已派单" :name="2"></el-tab-pane>
                <el-tab-pane label="已完成" :name="3"></el-tab-pane>
            </el-tabs>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    :fixed="true"
                    prop="hotel_name"
                    align="center"
                    label="酒店名称"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="hotel_contacts"
                    align="center"
                    label="联系人"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="hotel_phone"
                    align="center"
                    label="联系电话"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
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
                    prop="hotel_address"
                    align="center"
                    label="详细地址"
                    min-width="250"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="下单时间"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="updated_at"
                    align="center"
                    label="变更时间"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="60"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                        <el-tooltip v-if="auth('pay') && activeName === 0" content="收款" placement="top">
                            <el-button
                                type="primary"
                                size="small"
                                class="btn_shadow"
                                @click="hotelAction(scope.row.id,'pay')">
                                <el-icon size="14">
                                    <MessageBox/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip v-if="auth('processing') && activeName === 1" content="派单" placement="top">
                            <el-button
                                type="primary"
                                size="small"
                                class="btn_shadow"
                                @click="hotelAction(scope.row.id,'processing')">
                                <el-icon size="14">
                                    <List/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip v-if="auth('over') && activeName === 2" content="完成订单" placement="top">
                            <el-button
                                type="primary"
                                size="small"
                                class="btn_shadow"
                                @click="hotelAction(scope.row.id,'over')">
                                <el-icon size="14">
                                    <SuccessFilled/>
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
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {ElMessageBox} from "element-plus";
import {orderLists, orderOperation} from "/@/api/backend/activity/hotel/order/order";
import {auth} from "/@/utils/common";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import AreaCascader from "/@/components/custom/AreaCascader.vue";

const activeName = ref(0)
const loading = ref(false)
const areaOptions = ref([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    status: 0,
    province_id: 0,
    city_id: 0,
    county_id: 0,
    hotel_name: '',
    hotel_address: ''
})
const total = ref(0)
const certList = ref<Area[]>([])

const refresh = () => {
    pageInfo.page = 1
    getList()
}
const handleClick = () => {
    pageInfo.status = activeName.value
    pageInfo.province_id = 0
    pageInfo.city_id = 0
    pageInfo.county_id = 0
    pageInfo.hotel_name = ''
    pageInfo.hotel_address = ''
    areaOptions.value = []
    getList()
}
const hotelAction = (id: number, method: string) => {
    const hotelMethods: { [key: string]: string } = {
        pay: '已经完成收款',
        processing: '已经完成派单',
        over: '已经完成',
    }
    ElMessageBox.confirm(
        `是否确认${hotelMethods[method]}?`,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        orderOperation({id}, method).then(() => {
            getList();
        })
    })
}
const getList = () => {
    loading.value = true
    pageInfo.province_id = 0
    pageInfo.city_id = 0
    pageInfo.county_id = 0
    if (areaOptions.value) {
        pageInfo.province_id = areaOptions.value[0]
        pageInfo.city_id = areaOptions.value[1]
        pageInfo.county_id = areaOptions.value[2]
    }
    orderLists(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>

</style>
