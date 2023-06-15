<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import {capitalList} from "/@/api/backend/open/capital";

type Query = {
    page: number,
    pageSize: number,
    email?: string,
    type?: number,
    enterprise_name?: string
    total?: number,
}
const capital_list = ref([]);
const tableLoading = ref(false);
const queryInfo = ref<Query>({page: 1, pageSize: 10});

const refreshList = (query?: Query) => {
    tableLoading.value = true;
    capitalList(query || queryInfo.value).then(res => {
        capital_list.value = res.data.content.data;
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
        <el-card >
            <div class="m-b-10">
                <el-row style="flex: 1" >
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="tableLoading"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="9">
                                <el-input v-model="queryInfo.enterprise_name" placeholder="请输入企业名称" clearable/>
                            </el-col>
                            <el-col :span="5">
                                <el-input v-model="queryInfo.email" placeholder="请输入用户邮箱地址" clearable/>
                            </el-col>
                            <el-col :span="5">
                                <el-select
                                    v-model="queryInfo.type"
                                    placeholder="请选择流水类型"
                                    clearable
                                    style="width: 100%;">
                                    <el-option label="入账" :value="1"/>
                                    <el-option label="出账" :value="2"/>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="onSearch"/>
            </div>
            <el-table v-loading="tableLoading" :data="capital_list" border fit>
                <el-table-column
                    label="企业名称"
                    prop="enterprise_name"
                    :show-overflow-tooltip="true"
                    min-width="200"
                    fixed align="center"/>
                <el-table-column
                    label="开发者账户"
                    prop="email"
                    min-width="200"
                    align="center"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    label="流水类型"
                    width="100"
                    align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 1">入账</el-tag>
                        <el-tag v-else type="info">出账</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="业务类型"
                    prop="desc"
                    align="center"
                    width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column label="变动金额" prop="quota" align="center" width="170"/>
                <el-table-column label="结余金额" prop="amount" align="center" width="170"/>
                <el-table-column
                    label="操作时间" prop="created_at"
                    :show-overflow-tooltip="true" width="200" align="center"/>
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
