<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    fixed="true"
                    prop="id"
                    align="center"
                    label="序号"
                    width="150"/>
                <el-table-column
                    prop="title"
                    align="center"
                    label="权限组名称"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    label="状态"
                    align="center"
                    width="110">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            :activeValue="0"
                            :inActiveValue="1"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enable"
                            :disable="disable"/>
                        <el-tag v-else :type="scope.row.status===0?'success':'warning'">
                            {{ scope["row"].status === 0 ? "启用" : "禁用" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    align="center"
                    class="btn">
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
import {computed, onMounted, reactive, ref, watch,} from "vue";
import {auth} from '/@/utils/common'
import {roleConfig} from "/@/stores/admin/rolepupForm";
import PopupForm from "/@/views/backend/admin/role/popupForm.vue";
import {RoleLists, rulesDetail, rulesFlag, rulesTreeApi} from "/@/api/backend/auth/admin/role";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";

const store = roleConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const total = ref(0)
const categoryList = ref<Area[]>([])
const getList = () => {
    loading.value = true
    RoleLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const add = () => {
    rulesTree()
    store.operate = '新增权限组'
    store.dialogVisible = true
}
const rulesTree = () => {
    rulesTreeApi().then(res => {
        store.treeList = res.data.content
    })
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const editCate = (i: number) => {
    store.operate = '编辑权限组'
    rulesDetail({id: i}).then(res => {
        let obj = res.data.content
        let arr = res.data.content.rules.split(",")
        store.rules = arr.map(Number)
        store.id = obj.id
        store.name = obj.title
        store.level = obj.status
        store.dialogVisible = true
    })
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        rulesFlag({id}, 'enable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        rulesFlag({id}, 'disable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const getDialogVisible = computed(() => {
    return store.flag
})
watch(getDialogVisible, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});
onMounted(() => {
    getList()
    rulesTree()
});
</script>
<style lang="scss" scoped>
</style>
