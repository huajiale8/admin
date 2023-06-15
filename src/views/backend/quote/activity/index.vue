<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnAdd v-if="auth('add')" @click="add"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="20">
                                <el-input
                                    clearable
                                    placeholder="请输入活动名称"
                                    v-model="pageInfo.name"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column fixed prop="id" align="center" label="编号" width="150"/>
                <el-table-column prop="name" align="center" label="活动名称" :show-overflow-tooltip="true"/>
                <el-table-column prop="amount" align="center" label="优惠金额" :show-overflow-tooltip="true"/>
                <el-table-column prop="created_at" align="center" label="创建时间" width="200"/>
                <el-table-column prop="status" label="状态" align="center" width="110">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enable"
                            :disable="disable"
                            :active-value=1
                            :inactive-value=0
                        />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="110" align="center">
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
            <popup-form/>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {auth} from '/@/utils/common'
import {activityDetail, activityEnable, activityForbidden, activityLists} from "/@/api/backend/auth/quote/activity";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import PopupForm from "/@/views/backend/quote/activity/popupForm.vue";
import {orderActivity} from "/@/stores/order/activity";

const store = orderActivity()
const total = ref(0)
const loading = ref(false)
const categoryList = ref([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const getList = () => {
    loading.value = true
    activityLists(pageInfo).then(res => {
        total.value = res.data.content.total
        categoryList.value = res.data.content.data
        loading.value = false
    })
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const editCate = (i: number) => {
    store.operate = '编辑优惠活动'
    activityDetail({id: i}).then(res => {
        const obj = res.data.content
        store.id = obj.id
        store.name = obj.name
        store.price = obj.amount
        store.dialogVisible = true
    })
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        activityEnable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        activityForbidden({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const add = () => {
    store.operate = '新增优惠活动'
    store.dialogVisible = true
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
<style scoped lang="scss">
</style>
