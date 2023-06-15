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
                    prop="name"
                    align="center"
                    label="姓名"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="手机号码"
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
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnArea v-if="scope.row.id>0 && auth('group') " @click="allocation(scope.row.id)"/>
                            <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:page-size="query.pageSize"
                v-model:page="query.page"
                :total="pageTotal"
                @render="getList">
            </paging-module>
        </el-card>
        <popup-form/>
        <permission-popup-form/>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch,} from "vue";
import {auth} from '/@/utils/common'
import {userDetail, userFlag, userGroup, userLists} from "/@/api/backend/auth/admin/user";
import {userConfig} from "/@/stores/admin/userpupForm";
import PopupForm from "/@/views/backend/admin/user/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import PermissionPopupForm from "/@/views/backend/admin/user/permissionPopupForm.vue";
import BtnArea from "/@/components/buttons/BtnArea.vue";

const pageTotal = ref(0)
const query = reactive({
    name: '',
    page: 1,
    pageSize: 10,
});
const store = userConfig()
const loading = ref(false)
const categoryList = ref<Area[]>([])
const getList = () => {
    loading.value = true
    userLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const refresh = () => {
    query.page = 1
    getList()
}
const add = () => {
    store.operate = '新增管理员'
    store.dialogVisible = true
}
const editCate = (i: number) => {
    store.operate = '编辑管理员'
    userDetail({id: i}).then(res => {
        let obj = res.data.content
        store.password = obj.password
        store.name = obj.name
        store.id = obj.id
        store.level = obj.status
        store.phone = obj.phone
        store.dialogVisible = true
    })
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        userFlag({id}, 'enable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        userFlag({id}, 'disable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const allocation = (i: number) => {
    userGroup({id: i}).then(res => {
        store.id = i
        store.accesses = res.data.content.accesses
        store.name = res.data.content.info.name
        store.phone = res.data.content.info.phone
        store.type = res.data.content.groups
        store.dialog = true
    })
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
