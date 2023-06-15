<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnAdd v-if="auth('import')" @click="add"/>
                        <BtnDownloadTemplate :templateUrl="templateUrl"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="5" :offset="9" justify="space-between">
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
                <el-tab-pane label="默认" :name="0"></el-tab-pane>
                <el-tab-pane label="已拍摄" :name="1"></el-tab-pane>
                <el-tab-pane label="已修图" :name="2"></el-tab-pane>
                <el-tab-pane label="已封装" :name="3"></el-tab-pane>
                <el-tab-pane label="已上线" :name="4"></el-tab-pane>
            </el-tabs>
            <el-table v-loading="loading" :data="certList"  border>
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
                    v-if="activeName === 0"
                    prop="created_at"
                    align="center"
                    label="报名时间"
                    min-width="200"
                   :show-overflow-tooltip="true"/>
                <el-table-column
                    v-if="activeName === 1"
                    prop="take_time"
                    align="center"
                    label="拍摄时间"
                    min-width="200"
                   :show-overflow-tooltip="true"/>
                <el-table-column
                    v-if="activeName === 2"
                    prop="photo_time"
                    align="center"
                    label="修图时间"
                    min-width="200"
                   :show-overflow-tooltip="true"/>
                <el-table-column
                    v-if="activeName === 3"
                    prop="package_time"
                    align="center"
                    label="封装时间"
                    min-width="200"
                   :show-overflow-tooltip="true"/>
                <el-table-column
                    v-if="activeName === 4"
                    prop="online_time"
                    align="center"
                    label="上线时间"
                    min-width="200"
                   :show-overflow-tooltip="true"/>
                <el-table-column
                    v-if="activeName!== 4"
                    fixed="right"
                    label="操作"
                    width="55"
                    prop="created_at"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <el-tooltip v-if="auth('take') && activeName === 0" content="拍摄" placement="top">
                                <el-button
                                    type="primary"
                                    size="small"
                                    class="btn_shadow"
                                    @click="hotelAction(scope.row.id,'take')">
                                    <el-icon size="14">
                                        <CameraFilled/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="auth('photo') && activeName === 1" content="修图" placement="top">
                                <el-button
                                    type="primary"
                                    size="small"
                                    class="btn_shadow"
                                    @click="hotelAction(scope.row.id,'photo')">
                                    <el-icon size="14">
                                        <PictureFilled/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="auth('package') && activeName === 2" content="封装" placement="top">
                                <el-button
                                    type="primary"
                                    size="small"
                                    class="btn_shadow"
                                    @click="hotelAction(scope.row.id,'package')">
                                    <el-icon size="14">
                                        <Box/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip v-if="auth('online') && activeName === 3" content="上线" placement="top">
                                <el-button
                                    type="primary"
                                    size="small"
                                    class="btn_shadow"
                                    @click="hotelAction(scope.row.id,'online')">
                                    <el-icon size="14">
                                        <Sort/>
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
            <popup-form/>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import PopupForm from "/@/views/backend/activity/meituan/hotel/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {meiTuanHotel, meiTuanHotelLists} from "/@/api/backend/activity/meituan/hotel/hotel";
import {meiTuanHotelConfig} from "/@/stores/activity/meituan/hotel/hotel";
import {ElMessageBox} from "element-plus";
import {auth} from "/@/utils/common";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnDownloadTemplate from "/@/components/buttons/BtnDownloadTemplate.vue";
import getAssetsUrl from "/@/utils/getAssetsUrl";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";

const templateUrl = getAssetsUrl("templates/meituan/hotels/hotel_file.xlsx");
const activeName = ref(0)
const store = meiTuanHotelConfig()
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
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const add = () => {
    store.operate = '导入酒店信息'
    store.dialogVisible = true
}
const hotelAction = (id: number, method: string) => {
    const hotelMethods: { [key: string]: string } = {
        take: '拍摄',
        package: '封装',
        online: '上线',
        photo: '修图',
    }
    ElMessageBox.confirm(
        `是否确认${hotelMethods[method]}此内容?`,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        meiTuanHotel({id}, method).then(() => {
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
    meiTuanHotelLists(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const getDialog = computed(() => {
    return store.refreshPage
})
onMounted(() => {
    getList()
});
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});
</script>
<style lang="scss" scoped>
</style>
