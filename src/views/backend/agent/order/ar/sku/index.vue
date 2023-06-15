<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnExport @click="derive"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="8" :offset="11">
                                <CustomDatePicker @change="addDate"/>
                            </el-col>
                            <el-col :span="5">
                                <el-input
                                    clearable
                                    placeholder="商品sku"
                                    v-model="pageInfo.sku"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="refresh"/>
            </div>
            <el-table v-loading="loading" :data="certList" style="width: 100%" border>
                <el-table-column
                    fixed="left"
                    prop="name"
                    align="center"
                    label="商品名称"
                    min-width="250"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="sku"
                    align="center"
                    label="商品SKU"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="商品图片"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-image
                            :preview-teleported="true"
                            :preview-src-list="[scope.row.pic]"
                            style="width: 30px; height: 30px"
                            :src="scope.row.thumb"
                            :initial-index="4"
                            fit="cover"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    align="center"
                    label="商品价格"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    prop="created_at"
                    align="center"
                    label="添加时间"
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
import {ElMessage} from "element-plus";
import {agentOrderArSkuExport, agentOrderArSkuList} from "/@/api/backend/agent/order/ar/sku/sku";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import CustomDatePicker from "/@/components/custom/CustomDatePicker.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnExport from "/@/components/buttons/BtnExport.vue";

const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    sku: '',
    start_time: '',
    end_time: '',
    type: 'query'
})
const total = ref(0)
const certList = ref<Area[]>([])
const addDate = (obj: string[]) => {
    if (obj === null) {
        pageInfo.start_time = ''
        pageInfo.end_time = ''
    }else {
        pageInfo.start_time = obj[0]
        pageInfo.end_time = obj[1]
    }
}
const derive = () => {
    if (!pageInfo.start_time || !pageInfo.end_time) return ElMessage({type: 'error', message: '请选择时间日期',})
    pageInfo.type = 'query'
    agentOrderArSkuList(pageInfo).then(res => {
        let arr = res.data.content.data
        if (arr.length > 0) {
            pageInfo.type = 'export'
            agentOrderArSkuExport(pageInfo).then(res => {
                let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
                let fileUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.setAttribute("href", fileUrl);
                a.setAttribute("download", `${pageInfo.start_time}商品sku信息.xlsx`);
                a.click();
                pageInfo.type = ''
            })
        } else {
            ElMessage({
                type: 'error',
                message: '没有数据',
            })
            return false
        }
    })

}
const refresh = () => {
    pageInfo.type = 'query'
    pageInfo.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    agentOrderArSkuList(pageInfo).then(res => {
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
