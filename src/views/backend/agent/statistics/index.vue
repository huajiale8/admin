<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
            <el-row style="flex:1">
                <el-col :span="6">
                    <BtnRefresh @click="getList" :loading="loading"/>
                </el-col>
                <el-col :span="18">
                    <el-row :gutter="10">
                        <el-col :span="5" :offset="19">
                            <el-input
                                clearable
                                placeholder="请输入代理商/员工名称"
                                v-model="pageInfo.name"
                                autocomplete="off"/>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <BtnSearch @click="getList"/>
            </div>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="总代理商" :name="0"/>
                <el-tab-pane label="代理商员工" :name="1"/>
            </el-tabs>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="name"
                    align="center"
                    label="代理商/员工姓名"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="customs"
                    align="center"
                    label="意向客户数"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    prop="orders"
                    align="center"
                    label="全景订单数量"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
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
import {agentStatisticsList} from "/@/api/backend/agent/statistics/statistics";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";

const activeName = ref(0)
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: '',
    role: 'agent'
})
const total = ref(0)
const certList = ref<Area[]>([])

const handleClick = () => {
    pageInfo.page = 1
    pageInfo.name = ''
    if (activeName.value === 0) {
        pageInfo.role = 'agent'
        getList()
    } else {
        pageInfo.role = 'staff'
        getList()
    }
}
const getList = () => {
    loading.value = true
    agentStatisticsList(pageInfo).then(res => {
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
