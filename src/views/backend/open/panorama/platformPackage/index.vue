<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="8">
                    <BtnRefresh @click="refresh"/>
                    <BtnAdd v-if="auth('add')" @click="add"/>
                </el-col>
            </el-row>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    prop="name"
                    align="center"
                    label="套餐名称"
                    min-width="130"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="price"
                    align="center"
                    label="套餐价格"
                    min-width="130"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="套餐状态"
                    min-width="130"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 0">在售</el-tag>
                        <el-tag v-if="scope.row.status === 1" type="danger">停售</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="发布时间"
                    min-width="130"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="edit(scope.row.id)"/>
                            <BtnDelete
                                :loading="loading"
                                v-if="auth('del') && scope.row.status === 0"
                                @click="haltSales(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:pagesize="pageInfo.pageSize"
                v-model:page="pageInfo.page"
                :total="total"
                @render="getList">
            </paging-module>
            <popup-form/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import PopupForm from "/@/views/backend/open/panorama/platformPackage/popupForm.vue";
import {auth} from '/@/utils/common'
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import {getPlanePackageDelete, getPlanePackageDetail, getPlanePackageList} from "/@/api/backend/open/panorama/platform";
import {openPlatformConfig} from "/@/stores/open/panorama/platform";

const total = ref(0)
const certList = ref<Area[]>([])
const store = openPlatformConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
})
const getList = () => {
    loading.value = true
    getPlanePackageList(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const edit = (id: number) => {
    getPlanePackageDetail({id}).then(res => {
        store.operate = '编辑平面套餐'
        let obj = res.data.content
        store.content = obj.desc
        store.id = obj.id
        store.price = obj.price
        store.name = obj.name
        store.dialogVisible = true
    })
}
const haltSales = (id: number) => {
    loading.value = true;
    getPlanePackageDelete({id}).then(() => {
        getList();
    }).finally(() => {
        loading.value = false;
    });
}
const add = () => {
    store.operate = '新增平面套餐'
    store.dialogVisible = true
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const getDialog = computed(() => {
    return store.refreshPage
})
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});

onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
</style>
