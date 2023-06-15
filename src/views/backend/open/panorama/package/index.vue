<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="8">
                    <BtnRefresh @click="refresh" :loading="loading"/>
                    <BtnAdd v-if="auth('add')" @click="add"/>
                </el-col>
            </el-row>
            <el-table v-loading="loading" :data="certList" row-key="id" border>
                <el-table-column
                    :fixed="true"
                    prop="name"
                    label="套餐名称"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="custom_account_price"
                    align="center"
                    label="客户充值金额"
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
                    header-align="center"
                    fixed="right"
                    label="操作"
                    width="140">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="edit(scope.row.id)"/>
                            <BtnDelete
                                :loading="loading"
                                v-if="auth('del') && scope.row.status === 0"
                                @click="haltSales(scope.row.id)"/>
                            <el-tooltip
                                content="授权代理商"
                                placement="top"
                                v-if="auth('area') && scope.row.pid === 0 && scope.row.status !== 1">
                                <el-button
                                    class="btn"
                                    type="warning"
                                    size="small"
                                    @click="area(scope.row.id)">
                                    <el-icon size="14" v-if="!loading">
                                        <Lock/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="right">
                <el-pagination
                    v-model:current-page="pageInfo.page"
                    v-model:page-size="pageInfo.pageSize"
                    :page-sizes="[5, 10, 15, 20]"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"/>
            </div>
            <popup-form/>
            <auth-popup-form/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import PopupForm from "/@/views/backend/open/panorama/package/popupForm.vue";
import {auth} from '/@/utils/common'
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import {openPackageConfig} from "/@/stores/open/panorama/package";
import {
    getPackageDelete,
    getPackageDetail,
    getPackageDistribution,
    getPackageList,
    getPackageParents
} from "/@/api/backend/open/panorama/package";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import AuthPopupForm from "/@/views/backend/open/panorama/package/authPopupForm.vue";

const store = openPackageConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
})
const total = ref(0)
const certList = ref<Area[]>([])
const logList = ref([])
const getList = () => {
    loading.value = true
    getPackageList(pageInfo).then(res => {
        logList.value = res.data.content
        total.value = res.data.content.length
        getPageInfo()
        loading.value = false
    })
}
const getParents = () => {
    getPackageParents().then(res => {
        store.parents = res.data.content
    })
}
const edit = (id: number) => {
    getPackageDetail({id}).then(res => {
        store.operate = '编辑商品套餐'
        let obj = res.data.content
        store.can = obj.can
        store.content = obj.desc
        store.id = obj.id
        store.pid = obj.pid
        store.price = obj.price
        store.term = obj.term
        store.name = obj.name
        store.type = obj.pid > 0 ? 2 : 1
        store.custom_account_price = obj.custom_account_price
        store.checkAll = store.checked_agents.length === store.agent_ids.length
        store.dialogVisible = true
    })
}
const haltSales = (id: number) => {
    loading.value = true;
    getPackageDelete({id}).then(() => {
        getList();
    }).finally(() => {
        loading.value = false;
    });
}
const area = (id: number) => {
    getPackageDistribution({id}).then(res => {
        store.checked_agents = res.data.content.checked_agents
        store.agent_ids = res.data.content.agent_ids
        store.agents = res.data.content.agents
        store.name = res.data.content.package.name
        store.id = res.data.content.package.id
        store.price = res.data.content.package.price
        store.dialog = true
    })
}
const add = () => {
    store.operate = '新增商品套餐'
    store.dialogVisible = true
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const handleSizeChange = (val: number) => {
    pageInfo.pageSize = val
    getPageInfo()
}
const handleCurrentChange = (val: number) => {
    pageInfo.page = val
    getPageInfo()
}
const getPageInfo = () => {
    certList.value = []
    for (let i = (pageInfo.page - 1) * pageInfo.pageSize; i < total.value; i++) {
        certList.value.push(logList.value[i])
        if (certList.value.length === pageInfo.pageSize) break;
    }
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
    getParents()
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
