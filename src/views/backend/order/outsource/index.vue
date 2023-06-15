<script lang="ts" setup>
import {auth} from "/@/utils/common";
import PopupForm from "/@/views/backend/order/outsource/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {onMounted, ref} from "vue";
import getAssetsUrl from "/@/utils/getAssetsUrl";
import {orderDelete, orderDetail, orderExport, orderImport, orderLists} from "/@/api/backend/order/outsource";
import _ from "lodash";
import {ElMessage} from "element-plus";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnImport from "/@/components/buttons/BtnImport.vue";
import BtnExport from "/@/components/buttons/BtnExport.vue";
import BtnDownloadTemplate from "/@/components/buttons/BtnDownloadTemplate.vue";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import {useOutsourceStore} from "/@/stores/order/outsource";

type Query = {
    page: number,
    pageSize: number,
    name?: string,
    distribution?: string,
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
const type_list = ref();
const store = useOutsourceStore();

const templateUrl = getAssetsUrl("templates/order/outsource/example.xlsx");
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
        type_list.value = res.data.content.types;
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

const onEdit = (id: number) => {
    orderDetail({id}).then(res => {
        store.order = res.data.content.order;
        store.status = "edit";
        dialogVisible.value = true;
    });
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
        <popup-form
            v-model="dialogVisible" :categories="categories_list" :type-list="type_list"
            @on-success="refreshList"/>
        <el-card >
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refreshList" :loading="tableLoading"/>
                        <BtnAdd @click="onAdd"/>
                        <BtnImport
                            file-path="admin/order"
                            file-size="2mb"
                            file-type=".xlsx"
                            @on-success="onUploadSuccess"/>
                        <BtnExport @click="onExport"/>
                        <BtnDownloadTemplate :templateUrl="templateUrl"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="4" :offset="5">
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
                <el-table-column
                    label="项目地址" prop="url" width="300" :show-overflow-tooltip="true" header-align="center"
                    align="center"/>
                <el-table-column label="所属类目" prop="category" align="center" min-width="100"/>
                <el-table-column label="服务类型" prop="type" align="center" min-width="90"/>
                <el-table-column label="经销商" prop="distribution" align="center" min-width="90"/>
                <el-table-column label="城市" prop="city" align="center"/>
                <el-table-column label="订单金额" prop="price" align="center" min-width="100"/>
                <el-table-column label="服务到期日" prop="server_end_time" min-width="110" align="center">
                    <template #default="scope">
                        {{ scope["row"]["server_end_time"] }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="110">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="onEdit(scope.row.id)"/>
                            <BtnDelete
                                :loading="btnDeleteLoading" v-if="auth('delete')"
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
.btn-group {
    display: flex;
    justify-content: space-around;
}
</style>
