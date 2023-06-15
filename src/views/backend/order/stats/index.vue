<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {orderDelete, orderExport, orderImport, orderLists} from "/@/api/backend/order/stats";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import {auth} from "/@/utils/common";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnImport from "/@/components/buttons/BtnImport.vue";
import BtnExport from "/@/components/buttons/BtnExport.vue";
import BtnDownloadTemplate from "/@/components/buttons/BtnDownloadTemplate.vue";
import getAssetsUrl from "/@/utils/getAssetsUrl";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import _ from "lodash";
import {ElMessage} from "element-plus";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import PopupForm from "/@/views/backend/order/stats/popupForm.vue";

type Query = {
    page: number,
    pageSize: number,
    name?: string,
    distribution?: string,
    source?: string,
    province_id?: number,
    city_id?: number,
    county_id?: number,
    start_time?: string,
    end_time?: string,
    total?: number,
}
const order_list = ref([]);
const tableLoading = ref(false);
const btnDeleteLoading = ref(false);
const dialogVisible = ref(false);
const queryInfo = ref<Query>({page: 1, pageSize: 10});
const dateRange = ref<string[]>([]);
const areaArr = ref<number[]>([]);
const categories_list = ref();
const platforms_list = ref();

const source_list = [{value: 1, label: "平台"}, {value: 2, label: "分销"}, {value: 3, label: "直客"}];
const templateUrl = getAssetsUrl("templates/order/stats/example.xlsx");
const shortcuts = [{
    text: "最近一周",
    value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
    },
}, {
    text: "最近一个月",
    value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
    },
}, {
    text: "最近三个月",
    value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
    },
}];

const onDateChange = () => {
    queryInfo.value.start_time = null;
    queryInfo.value.end_time = null;
    if (dateRange.value) {
        queryInfo.value.start_time = dateRange.value[0];
        queryInfo.value.end_time = dateRange.value[1];
    }
};

const onAreaChange = () => {
    queryInfo.value.province_id = null;
    queryInfo.value.city_id = null;
    queryInfo.value.county_id = null;
    if (areaArr.value) {
        queryInfo.value.province_id = areaArr.value[0] || null;
        queryInfo.value.city_id = areaArr.value[1] || null;
        queryInfo.value.county_id = areaArr.value[2] || null;
    }
};

const refreshList = (query?: Query, loading?: boolean) => {
    (loading === undefined || loading === true) && (tableLoading.value = true);
    orderLists(query || queryInfo.value).then(res => {
        order_list.value = res.data.content.lists.data;
        queryInfo.value.total = res.data.content.lists.total;
        categories_list.value = res.data.content.categories;
        platforms_list.value = res.data.content.platforms;
        (loading === undefined || loading === true) && (tableLoading.value = false);
    });
};

const onUploadSuccess = (fileInfo: { file: string, name: string }) => {
    orderImport(fileInfo);
};

const onSearch = () => {
    refreshList();
};

const onAdd = () => {
    dialogVisible.value = true;
};

const onExport = () => {
    const query = _.cloneDeep(queryInfo.value);
    delete query["page"];
    delete query["pageSize"];
    if (!query.start_time || !query.end_time) return ElMessage.error("请选择时间段");
    orderExport(query);
};

const init = () => {
    refreshList();
};

const onDeleteOrder = (id: number) => {
    btnDeleteLoading.value = true;
    orderDelete({id}).then(() => {
        refreshList(undefined, false);
    }).finally(() => {
        btnDeleteLoading.value = false;
    });
};

onMounted(() => {
    init();
});
</script>

<template>
    <div class="default-main ba-table-box">
        <popup-form v-model="dialogVisible" :categories="categories_list" :platforms="platforms_list"
                    @on-success="refreshList"/>
        <el-card>
            <div class="m-b-10">
                <el-row style="flex:1">
                    <el-col :span="6">
                        <BtnRefresh @click="refreshList" :loading="tableLoading"/>
                        <BtnAdd @click="onAdd"/>
                        <BtnImport file-path="admin/order" file-size="2mb" file-type=".xlsx"
                                   @on-success="onUploadSuccess"/>
                        <BtnExport @click="onExport"/>
                        <BtnDownloadTemplate :templateUrl="templateUrl"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="4">
                                <el-select v-model="queryInfo.source" clearable placeholder="请选择渠道">
                                    <el-option
                                        v-for="item in source_list"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.label"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="4">
                                <AreaCascader v-model="areaArr" @change="onAreaChange"/>
                            </el-col>
                            <el-col :span="8">
                                <el-date-picker
                                    v-model="dateRange"
                                    type="daterange"
                                    clearable
                                    range-separator="至"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    value-format="YYYY-MM-DD"
                                    :shortcuts="shortcuts"
                                    @change="onDateChange"
                                    style="width: 100%"
                                />
                            </el-col>
                            <el-col :span="3">
                                <el-input v-model="queryInfo.name" placeholder="请输入客户名称" clearable/>
                            </el-col>
                            <el-col :span="3">
                                <el-input v-model="queryInfo.distribution" placeholder="请输入经销商名称" clearable/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="onSearch"/>
            </div>
            <el-table v-loading="tableLoading" :data="order_list" border fit>
                <el-table-column
                    label="客户名称" prop="name" min-width="150" :show-overflow-tooltip="true"
                    align="center"
                    fixed></el-table-column>
                <el-table-column label="联系人" prop="contacts" header-align="center"/>
                <el-table-column label="联系方式" prop="number" width="120" header-align="center"/>
                <el-table-column
                    label="项目地址" prop="url" width="300" :show-overflow-tooltip="true" header-align="center"
                    align="center"/>
                <el-table-column label="所属类目" prop="category" align="center" min-width="100"/>
                <el-table-column label="来源渠道" prop="source" align="center" min-width="90"/>
                <el-table-column label="经销商" prop="distribution" align="center" min-width="90"/>
                <el-table-column
                    label="推广平台" prop="platform" width="100" :show-overflow-tooltip="true"
                    align="center"/>
                <el-table-column label="省份" prop="province" align="center"/>
                <el-table-column label="城市" prop="city" align="center"/>
                <el-table-column label="区域" prop="county" align="center"/>
                <el-table-column
                    label="详细地址" prop="address" width="200" header-align="center"
                    :show-overflow-tooltip="true"/>
                <el-table-column label="订单金额" prop="price" align="center" min-width="100"/>
                <el-table-column label="订单时间" prop="order_date_time" min-width="100" align="center"/>
                <el-table-column label="服务到期日" prop="server_end_time" min-width="110" align="center">
                    <template #default="scope">
                        {{ scope["row"]["server_end_time"] }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnDelete
                                :loading="btnDeleteLoading"
                                v-if="auth('delete')"
                                @click="onDeleteOrder(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:page-size="queryInfo.pageSize"
                v-model:page="queryInfo.page"
                :total="queryInfo.total"
                @render="refreshList">
            </paging-module>
        </el-card>
    </div>
</template>

<script lang="ts">
export default {
    name: "index",
};
</script>

<style lang="scss" scoped>

</style>
