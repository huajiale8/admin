<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="getList" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="pageTicket" border>
                <el-table-column
                    fixed
                    prop="file"
                    align="center"
                    label="日志文件"
                    width="500"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="date"
                    label="创建日期"
                    align="center"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    width="100">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnView v-if="auth('detail')" @click="editCate(scope.row.file)"/>
                            <BtnDelete v-if="auth('delete')" @click="deleteLog(scope.row.file)"/>
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
        <popup-form/>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {logConfig} from "/@/stores/maintenance/log";
import PopupForm from "/@/views/backend/maintenance/log/popupForm.vue";
import {maintenanceLogDelete, maintenanceLogDetail, maintenanceLogLists} from "/@/api/backend/maintenance/log";
import BtnView from "/@/components/buttons/BtnView.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import {auth} from "/@/utils/common";

const pageSize = ref(10)
const currentPage = ref(1)
const store = logConfig()
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
    maintenanceLogLists().then(res => {
        logList.value = res.data.content
        total.value = res.data.content.length
        getPageInfo()
        loading.value = false
    })
}
const editCate = (i: string) => {
    maintenanceLogDetail({file_name: i}).then(res => {
        store.logList = res.data.content
        store.dialogVisible = true
    })
}
const deleteLog = (i: string) => {
    maintenanceLogDelete({file_name: i}).then(() => {
        getList();
    })
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
