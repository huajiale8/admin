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
                    label="编号"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="name"
                    align="center"
                    label="姓名"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="手机号码"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="email"
                    align="center"
                    label="联系邮箱"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    prop="ip"
                    align="center"
                    label="IP"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
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
import {contactLists} from "/@/api/backend/portal/contact/contact";
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
    contactLists(pageInfo).then(res => {
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
