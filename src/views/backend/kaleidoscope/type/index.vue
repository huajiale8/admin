<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column :fixed="true" prop="name" align="center" label="分类名称" min-width="150"/>
                <el-table-column
                    prop="sort"
                    align="center"
                    label="分类排序"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="updated_at"
                    align="center"
                    label="更新时间"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="120"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit
                                v-if="auth('edit')"
                                @click="editCate(scope.row.id)"/>
                            <BtnDelete
                                v-if="auth('delete')"
                                :loading="btnDeleteLoading"
                                @click="deleteCate(scope.row.id)"/>
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
import PopupForm from "/@/views/backend/kaleidoscope/type/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import {kaleidoscopeTypeDelete, kaleidoscopeTypeDetail, kaleidoscopeTypeLists} from "/@/api/backend/kaleidoscope/type";
import {kaleidoscopeTypeConfig} from "/@/stores/kaleidoscope/type";

const btnDeleteLoading = ref(false);
const store = kaleidoscopeTypeConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const total = ref(0)
const categoryList = ref<Area[]>([])
const add = () => {
    store.operate = '新增分类'
    store.dialogVisible = true
}
const deleteCate = (id: number) => {
    btnDeleteLoading.value = true;
    kaleidoscopeTypeDelete({id}).then(() => {
        getList()
    }).finally(() => {
        btnDeleteLoading.value = false;
    });
}
const getList = () => {
    loading.value = true
    kaleidoscopeTypeLists(pageInfo).then(res => {
        categoryList.value = res.data.content.lists.data
        total.value = res.data.content.lists.total
        loading.value = false
    })
}
const editCate = (id: number) => {
    kaleidoscopeTypeDetail({id}).then(res => {
        store.operate = '编辑分类'
        let obj = res.data.content
        store.id = obj.id
        store.name = obj.name
        store.sort = obj.sort
        store.dialogVisible = true
    })
}
const getDialog = computed(() => {
    return store.refreshPage
})
onMounted(() => {
    getList()
});
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});
</script>
<style lang="scss" scoped>
</style>
