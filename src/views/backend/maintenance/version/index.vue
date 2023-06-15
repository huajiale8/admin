<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="getList" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="pageTicket" border>
                <el-table-column
                    fixed
                    prop="id"
                    align="center"
                    label="序号"
                    width="150"/>
                <el-table-column
                    prop="name"
                    align="center"
                    label="版本号"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    label="创建日期"
                    align="center"
                    :show-overflow-tooltip="true"/>
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
import {onMounted, ref,} from "vue";
import {auth} from '/@/utils/common'
import {maintenanceLogLists, maintenanceLogSave} from "/@/api/backend/maintenance/version";
import {ElMessageBox} from "element-plus";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";

const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const total = ref(0)
const logList = ref<Area[]>([])
const pageTicket = ref<Area[]>([])

const handleSizeChange = (val: number) => {
    pageSize.value = val
    getPageInfo()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getPageInfo()
}

const add = () => {
    ElMessageBox.prompt("", "新增版本号", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
        inputErrorMessage: "版本号格式不正确(如:1.01.11)",
    })
        .then(({value}) => {
            maintenanceLogSave({name: value}).then(() => {
                getList()
            });
        });
}
const getList = () => {
    loading.value = true
    maintenanceLogLists().then(res => {
        logList.value = res.data.content.data
        total.value = res.data.content.data.length
        getPageInfo()
        loading.value = false
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
