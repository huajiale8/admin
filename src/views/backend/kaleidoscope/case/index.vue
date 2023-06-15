<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    :fixed="true"
                    prop="name"
                    align="center"
                    label="分类名称"
                    :show-overflow-tooltip="true"
                    min-width="150"/>
                <el-table-column
                    align="center"
                    label="案例类型"
                    min-width="150"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <span>{{ searchEngine[scope.row.type] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="label_names"
                    align="center"
                    label="行业分类"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="type_names"
                    align="center"
                    label="首页分类"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="tech_names"
                    align="center"
                    label="技术标签"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    align="center"
                    label="推荐首页"
                    min-width="150"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <el-tag v-if="scope.row.recommend === 1" type="success">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="案例内容"
                    min-width="150"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <el-tag class="hove" @click="showContent(scope.row)">详情</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="200"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="updated_at"
                    align="center"
                    label="更新时间"
                    min-width="200"
                    show-overflow-tooltip/>
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
                                @click="deleteCate(scope.row.id)"
                                :loading="btnDeleteLoading"/>
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
            <detail-popup-form/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {auth} from '/@/utils/common'
import PopupForm from "/@/views/backend/kaleidoscope/case/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import {kaleidoscopeCaseDelete, kaleidoscopeCaseDetail, kaleidoscopeCaseLists} from "/@/api/backend/kaleidoscope/case";
import {kaleidoscopeCaseConfig} from "/@/stores/kaleidoscope/case";
import DetailPopupForm from "/@/views/backend/kaleidoscope/case/detailPopupForm.vue";

const store = kaleidoscopeCaseConfig()
const loading = ref(false)
const btnDeleteLoading = ref(false)
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
const searchEngine = ref<Area[]>([])
const add = () => {
    store.operate = '新增案列'
    store.dialogVisible = true
}
const showContent = (row: any) => {
    store.detailVisible = true
    store.detailType = row.type
    store.content = row.content
}
const deleteCate = (id: number) => {
    btnDeleteLoading.value = true;
    kaleidoscopeCaseDelete({id}).then(() => {
        getList()
    }).finally(() => {
        btnDeleteLoading.value = false;
    });
}
const getList = () => {
    loading.value = true
    kaleidoscopeCaseLists(pageInfo).then(res => {
        categoryList.value = res.data.content.lists.data
        searchEngine.value = res.data.content.case_type
        store.labels = res.data.content.labels
        store.techs = res.data.content.techs
        store.types = res.data.content.types
        total.value = res.data.content.lists.total
        loading.value = false
    })
}
const editCate = (id: number) => {
    kaleidoscopeCaseDetail({id}).then(res => {
        store.operate = '编辑案列'
        let obj = res.data.content
        store.id = obj.id
        store.name = obj.name
        store.label_ids = obj.label_ids
        store.type = obj.type
        store.type_ids = obj.type_ids
        store.tech_ids = obj.tech_ids
        store.cover = obj.poster
        store.recommend = obj.recommend
        if (store.type === 1) {
            store.url = obj.content
        } else if (store.type === 2) {
            store.cover_mobile = obj.content
        } else if (store.type === 3) {
            store.video = obj.content
        }
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
