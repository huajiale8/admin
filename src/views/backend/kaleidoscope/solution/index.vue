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
                    label="解决方案名称"
                    min-width="150"/>
                <el-table-column
                    align="center"
                    label="解决方案Icon"
                    min-width="150">
                    <template #default="scope">
                        <div class="demo-image__preview">
                            <el-image
                                :preview-teleported="true"
                                :preview-src-list="[scope.row.icon]"
                                style="width: 30px; height: 30px"
                                :src="scope.row.icon"
                                :initial-index="4"
                                fit="cover"
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content"
                    align="center"
                    label="解决方案内容"
                    min-width="150"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <el-tag @click="showContent(scope.row)">详情</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="updated_at"
                    align="center"
                    label="更新时间"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="120"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                        <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.id)"/>
                        <BtnDelete v-if="auth('delete')" :loading="btnDeleteLoading" @click="deleteCate(scope.row.id)"/>
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
import PopupForm from "/@/views/backend/kaleidoscope/solution/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import {
    kaleidoscopeSolutionDelete,
    kaleidoscopeSolutionDetail,
    kaleidoscopeSolutionLists
} from "/@/api/backend/kaleidoscope/solution";
import {kaleidoscopeSolutionConfig} from "/@/stores/kaleidoscope/solution";
import DetailPopupForm from "/@/views/backend/kaleidoscope/solution/detailPopupForm.vue";

const store = kaleidoscopeSolutionConfig()
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
const add = () => {
    store.content = [{
        link: '',
        picture: '',
    }]
    store.operate = '新增解决方案'
    store.dialogVisible = true
    store.flag = false
}
const showContent = (row: any) => {
    store.detailVisible = true
    store.detailContent = row.content
}
const deleteCate = (id: number) => {
    btnDeleteLoading.value = true;
    kaleidoscopeSolutionDelete({id}).then(() => {
        getList()
    }).finally(() => {
        btnDeleteLoading.value = false;
    });
}
const getList = () => {
    loading.value = true
    kaleidoscopeSolutionLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (id: number) => {
    kaleidoscopeSolutionDetail({id}).then(res => {
        store.operate = '编辑案列'
        let obj = res.data.content
        store.id = obj.id
        store.name = obj.name
        store.icon = obj.icon
        store.content = obj.content
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
.demo-image__error .el-image {
    width: 100%;
    height: 200px;
}

.demo-image__preview {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
}

</style>
