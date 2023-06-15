<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import {importLogList} from "/@/api/backend/order/log";

type Query = {
    page: number,
    pageSize: number,
    name?: string,
    total?: number,
}
const log_list = ref([]);
const tableLoading = ref(false);
const queryInfo = ref<Query>({page: 1, pageSize: 10});

const refreshList = (query?: Query) => {
    tableLoading.value = true;
    importLogList(query || queryInfo.value).then(res => {
        log_list.value = res.data.content.data;
        queryInfo.value.total = res.data.content.total;
        tableLoading.value = false;
    });
};

const onSearch = () => {
    refreshList();
};
const refresh = () => {
    queryInfo.value.page = 1
    refreshList()
}
const init = () => {
    refreshList();
};

onMounted(() => {
    init();
});
</script>

<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="tableLoading"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="19">
                                <el-input v-model="queryInfo.name" placeholder="请输入文件名" clearable/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="onSearch"/>
            </div>
            <el-table v-loading="tableLoading" :data="log_list" border fit>
                <el-table-column
                    label="文件名称" prop="name" :show-overflow-tooltip="true"
                    min-width="200"
                    fixed align="center"/>
                <el-table-column label="类型" prop="type" width="150" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 1">销售订单</el-tag>
                        <el-tag v-else type="info">外包商订单</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="导入数量" prop="num" align="center" width="150"/>
                <el-table-column label="状态" prop="status" align="center" width="170">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 0">未执行</el-tag>
                        <el-tag v-if="scope.row.status === 1" type="success">已完成</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="warning">执行中</el-tag>
                        <el-tag v-if="scope.row.status === 3" type="danger">执行出错</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间" prop="created_at"
                    :show-overflow-tooltip="true" width="250" align="center"/>
                <el-table-column
                    label="更新时间" prop="updated_at" width="250"
                    :show-overflow-tooltip="true" align="center"/>
                <el-table-column label="出错原因" prop="reason" fixed="right" align="center" width="120">
                    <template #default="scope">
                        <el-popover
                            v-if="scope.row.reason"
                            placement="top-start"
                            title="出错原因"
                            width="400"
                            trigger="hover"
                            :content="scope.row.reason">
                            <template #reference>
                                <el-button type="primary" link>详情</el-button>
                            </template>
                        </el-popover>
                        <el-button v-else type="info" link>-</el-button>
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
