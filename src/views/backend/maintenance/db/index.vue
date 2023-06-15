<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="getList" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="pageTicket" border>
                <el-table-column prop="table" align="center" label="表名"/>
                <el-table-column label="操作" align="center" width="110">
                    <template #default="scope">
                        <div class="operate_btn">
                            <CBtnExport v-if="auth('export')" @click="editCate(scope.row.table)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="right">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 15, 20]"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {maintenanceLogExport, maintenanceTablesLists} from "/@/api/backend/maintenance/db";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import CBtnExport from "/@/components/buttons/CBtnExport.vue";
import {auth} from "/@/utils/common";

const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const total = ref(0)

const handleSizeChange = (val: number) => {
    pageSize.value = val
    getPageInfo()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getPageInfo()
}
const logList = ref([])
const pageTicket = ref<Area[]>([])
const getList = () => {
    loading.value = true
    maintenanceTablesLists().then(res => {
        logList.value = res.data.content
        total.value = res.data.content.length
        getPageInfo()
        loading.value = false
    })
}
const editCate = (i: string) => {
    maintenanceLogExport({table: i})
}
const getPageInfo = () => {
    pageTicket.value = []
    for (let i = (currentPage.value - 1) * pageSize.value; i < total.value; i++) {
        pageTicket.value.push(logList.value[i])
        if (pageTicket.value.length === pageSize.value) break;
    }
}

onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
.right {
    .el-pagination {
        display: flex;
        justify-content: end;
        padding-top: 20px;
    }
}
</style>
