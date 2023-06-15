<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    fixed
                    prop="id"
                    align="center"
                    width="80px"
                    label="序号"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="project"
                    align="center"
                    label="项目名称"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="user"
                    align="center"
                    min-width="150"
                    label="会员名称/昵称"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="ip"
                    align="center"
                    label="访问IP"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="content"
                    align="center"
                    label="日志内容"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    prop="created_at"
                    align="center"
                    label="创建日期"
                    min-width="170"/>
            </el-table>
            <paging-module
                v-model:pageSize="query.pageSize"
                v-model:page="query.page"
                :total="pageTotal"
                @render="getList">
            </paging-module>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref,} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {viewLists} from "/@/api/backend/portal/data/view";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";

const pageTotal = ref(0)
const query = reactive({
    name: '',
    page: 1,
    pageSize: 10,
});
const loading = ref(false)
const categoryList = ref<Area[]>([])

const refresh = () => {
    query.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    viewLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}

onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
</style>
