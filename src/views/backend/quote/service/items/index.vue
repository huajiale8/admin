<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh"/>
                        <BtnAdd v-if="auth('add')" @click="add"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="20">
                                <el-input
                                    clearable
                                    placeholder="请输入服务项目"
                                    v-model="state.searchName"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="search"/>
            </div>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column fixed prop="id" align="center" label="编号" width="150"/>
                <el-table-column prop="cname" align="center" label="分类名称" :show-overflow-tooltip="true"/>
                <el-table-column prop="name" align="center" label="项目名称" :show-overflow-tooltip="true"/>
                <el-table-column prop="price" align="center" label="价格" :show-overflow-tooltip="true"/>
                <el-table-column prop="unit" align="center" label="单位" :show-overflow-tooltip="true"/>
                <el-table-column prop="created_at" align="center" label="创建时间" :show-overflow-tooltip="true"/>
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
                            <BtnEdit v-if="auth('edit') && scope.row.id>0 " @click="editCate(scope.row.id)"/>
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
import {computed, onMounted, reactive, ref, watch} from "vue";
import {auth} from '/@/utils/common'
import {itemsDetail, itemsEnable, itemsForbidden, itemsLists} from "/@/api/backend/auth/quote/items";
import {itemsConfig} from "/@/stores/quote/itemsPopupForm";
import PopupForm from "/@/views/backend/quote/service/items/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";

const state = itemsConfig()
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
    itemsLists(pageInfo).then(res => {
        total.value = res.data.content.lists.total
        state.categories = res.data.content.categories
        categoryList.value = res.data.content.lists.data
        loading.value = false
    })
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        itemsEnable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        itemsForbidden({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const editCate = (i: number) => {
    state.operate = '编辑服务项目'
    itemsDetail({id: i}).then(res => {
        const obj = res.data.content
        state.id = obj.id
        state.cid = obj.cid
        state.name = obj.name
        state.unit = obj.unit
        state.price = obj.price
        state.dialogVisible = true
    })
}
const search = () => {
    pageInfo.name = state.searchName
    getList()
}
const add = () => {
    state.operate = '新增服务项目'
    state.dialogVisible = true
}
const getDialog = computed(() => {
    return state.refreshPage
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
