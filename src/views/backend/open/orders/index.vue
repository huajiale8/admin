<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import {auth} from "/@/utils/common";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import {
    disableOpenOrdersUrl,
    enableOpenOrdersUrl,
    getOpenOrdersUrlDetail,
    getOpenOrdersUrlList,
} from "/@/api/backend/open/orders";
import {useOpenOrderStore} from "/@/stores/open/orders";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import PopupForm from "/@/views/backend/open/orders/popupForm.vue";

type Query = {
    page: number,
    pageSize: number,
    name?: string,
    total?: number,
}

const store = useOpenOrderStore();
const dialogVisible = ref(false);
const order_list = ref([]);
const tableLoading = ref(false);
const queryInfo = ref<Query>({page: 1, pageSize: 10});

const refreshList = (params?: { query?: Query, loading?: boolean }) => {
    params = params || {};
    (params.loading === undefined || params.loading === true) && (tableLoading.value = true);
    getOpenOrdersUrlList(params.query || queryInfo.value).then(res => {
        order_list.value = res.data.content.data;
        queryInfo.value.total = res.data.content.total;
        (params.loading === undefined || params.loading === true) && (tableLoading.value = false);
    });
};

const onSearch = () => {
    refreshList();
};

const onAdd = () => {
    store.status = "add";
    dialogVisible.value = true;
};

const edit = (id: number) => {
    getOpenOrdersUrlDetail({id}).then(res => {
        store.status = "edit";
        store.order = res.data.content;
        dialogVisible.value = true;
    });
};

const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        disableOpenOrdersUrl({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enableOpenOrdersUrl({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};

const init = () => {
    refreshList({});
};

onMounted(() => {
    init();
});
</script>

<template>
    <div class="default-main ba-table-box">
        <PopupForm v-model="dialogVisible" @on-success="refreshList({loading:false})"/>
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refreshList" :loading="tableLoading"/>
                        <BtnAdd @click="onAdd" v-if="auth('save')"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="19">
                                <el-input v-model="queryInfo.name" placeholder="请输入订单名称" clearable/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="onSearch"/>
            </div>
            <el-table v-loading="tableLoading" :data="order_list" border fit>
                <el-table-column
                    label="订单名称" prop="name" min-width="200" align="center" :show-overflow-tooltip="true"
                    fixed/>
                <el-table-column label="订单描述" prop="desc" align="center" min-width="150"/>
                <el-table-column label="截止日期" prop="expire_time" align="center" min-width="150"/>
                <el-table-column label="创建时间" prop="created_at" align="center" min-width="150"/>
                <el-table-column label="状态" prop="status" align="center" width="120">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enable"
                            :disable="disable"
                            :active-value="0"
                            :in-active-value="1"
                        />
                        <el-tag v-else :type="scope.row.status===0?'success':'warning'">
                            {{ scope["row"].status === 0 ? "启用" : "禁用" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="100">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit
                                type="primary" @click="edit(scope.row.id)"
                                v-if="auth('save')"
                            />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:pagesize="queryInfo.pageSize"
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
