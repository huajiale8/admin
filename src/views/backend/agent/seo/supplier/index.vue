<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="8">
                    <BtnRefresh @click="refresh" :loading="loading"/>
                    <BtnAdd v-if="auth('add')" @click="add"/>
                </el-col>
            </el-row>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="name"
                    align="center"
                    label="供应商名称"
                    min-width="250"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="url"
                    align="center"
                    label="推送地址"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="access_id"
                    align="center"
                    label="key"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="access_key"
                    align="center"
                    label="secret"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                        <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:page-size="pageInfo.pageSize"
                v-model:page="pageInfo.page"
                :total="total"
                @render="getList">
            </paging-module>
        </el-card>
        <popup-form/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {agentSeoSupplierDetail, agentSeoSupplierList} from "/@/api/backend/agent/seo/supplier/supplier";
import {agentSeoSupplierConfig} from "/@/stores/seo/supplier/supplier";
import {auth} from '/@/utils/common'
import PopupForm from "/@/views/backend/agent/seo/supplier/popupForm.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";

const store = agentSeoSupplierConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
})
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const add = () => {
    store.operate = '新增供应商'
    store.dialogVisible = true
}
const total = ref(0)
const certList = ref<Area[]>([])
const editCate = (id: number) => {
    agentSeoSupplierDetail({id}).then(res => {
        let obj = res.data.content
        store.operate = '编辑供应商'
        store.id = obj.id
        store.name = obj.name
        store.type = obj.type
        store.url = obj.url
        store.access_id = obj.access_id
        store.access_key = obj.access_key
        store.dialogVisible = true
    })
}
const getList = () => {
    loading.value = true
    agentSeoSupplierList(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const getDialog = computed(() => {
    return store.refreshPage
})
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true})
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
