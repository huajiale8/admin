<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column fixed prop="id" width="90" align="center" label="序号"/>
                <el-table-column prop="project" align="center" label="项目名称" :show-overflow-tooltip="true"/>
                <el-table-column prop="user" align="center" label="会员名称/昵称"/>
                <el-table-column fixed="right" prop="created_at" align="center" label="点赞日期" width="170"/>
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
import {praiseLists} from "/@/api/backend/portal/data/praise";
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
    praiseLists(query).then(res => {
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
