<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    fixed
                    prop="user_name"
                    align="center"
                    label="姓名"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="company"
                    align="center"
                    label="公司"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="position"
                    align="center"
                    label="职位"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="联系电话"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="email"
                    align="center"
                    label="联系邮箱"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="type"
                    align="center"
                    label="业务类型"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="sector"
                    align="center"
                    label="业务模块"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="relation"
                    align="center"
                    label="客户关系"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="message"
                    align="center"
                    label="留言"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-popover
                            v-if="scope.row.message"
                            placement="top-start"
                            title="留言信息"
                            width="400"
                            trigger="hover"
                            :content="scope.row.message">
                            <template #reference>
                                <el-button type="primary" link>详情</el-button>
                            </template>
                        </el-popover>
                        <el-button v-else type="info" link>-</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    prop="created_at"
                    align="center"
                    label="添加时间"
                    min-width="200"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span>{{ infoData(scope.row.created_at) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:pageSize="pageInfo.pageSize"
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
import {infoCollectLists} from "/@/api/backend/portal/info/info";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";

const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const total = ref(0)
const categoryList = ref<Area[]>([])

const refresh = () => {
    pageInfo.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    infoCollectLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const infoData = (data: any) => {
    let date = new Date(data);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1 as number;
    MM = MM < 10 ? ('0' + MM) as unknown as number : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) as unknown as number : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) as unknown as number : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) as unknown as number : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) as unknown as number : s;
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
}

onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
</style>
