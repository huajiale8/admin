<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex:1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnExport @click="derive"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="8" :offset="16" justify="space-between">
                                <CustomDatePicker @change="addDate"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    :fixed="true"
                    prop="company_name"
                    align="center"
                    label="公司名称"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="contact_name"
                    align="center"
                    label="联系人"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="contact_phone"
                    align="center"
                    label="联系电话"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="添加时间"
                    min-width="200"
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
import {merchantConfirmExport, merchantConfirmLists} from "/@/api/backend/activity/ar/merchant";
import {ElMessage} from "element-plus";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnExport from "/@/components/buttons/BtnExport.vue";
import CustomDatePicker from "/src/components/custom/CustomDatePicker.vue";

const loading = ref(false);
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    start_time: "",
    end_time: "",
    type: "",
});
const total = ref(0);
const certList = ref<Area[]>([]);

const addDate = (obj: string) => {
    if (obj === null) {
        ElMessage({
            type: "error",
            message: "请选择时间日期",
        });
        pageInfo.start_time = "";
        pageInfo.end_time = "";
    } else {
        pageInfo.start_time = obj[0]
        pageInfo.end_time = obj[1]
    }
};
const getList = () => {
    loading.value = true;
    merchantConfirmLists(pageInfo).then(res => {
        certList.value = res.data.content.data;
        total.value = res.data.content.total;
        loading.value = false;
    });
};
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const derive = () => {
    if (!pageInfo.start_time || !pageInfo.end_time) return ElMessage.error("请选择时间段");
    pageInfo.type = 'query'
    merchantConfirmLists(pageInfo).then(res => {
        let arr = res.data.content.data;
        if (arr.length > 0) {
            pageInfo.type = "export";
            merchantConfirmExport(pageInfo).then(res => {
                let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
                let fileUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.setAttribute("href", fileUrl);
                a.setAttribute("download", "example.xlsx");
                a.click();
                pageInfo.type = "";
            });
        } else {
            ElMessage({
                type: 'error',
                message: '没有数据',
            })
            return false
        }
    });
};
onMounted(() => {
    getList();
});
</script>
<style lang="scss" scoped>
</style>
