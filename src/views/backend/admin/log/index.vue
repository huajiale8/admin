<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    fixed="true"
                    prop="name"
                    align="center"
                    label="管理员"
                    width="150"/>
                <el-table-column
                    prop="ip"
                    align="center"
                    label="客户端IP"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="url"
                    align="center"
                    label="URL地址"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="content"
                    align="center"
                    label="内容"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    prop="updated_at"
                    align="center"
                    label="操作时间"
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
import {onMounted, reactive, ref,} from "vue";
import {logLists} from "/@/api/backend/auth/admin/log";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";

const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const total = ref(0)
const categoryList = ref<Area[]>([])
const getList = () => {
    loading.value = true
    logLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
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
