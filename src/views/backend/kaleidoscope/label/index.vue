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
                    min-width="150"/>
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
                            <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.id,scope.row.name)"/>
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
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {auth} from '/@/utils/common'
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import {kaleidoscopeLabelLists, kaleidoscopeLabelSave} from "/@/api/backend/kaleidoscope/label";
import {kaleidoscopeLabelConfig} from "/@/stores/kaleidoscope/label";
import {ElMessageBox} from "element-plus";

const store = kaleidoscopeLabelConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const total = ref(0)
const categoryList = ref<Area[]>([])
const add = () => {
    ElMessageBox.prompt('新增行业分类', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入行业分类名称',
    })
        .then(({value}) => {
            kaleidoscopeLabelSave({id: '', name: value}).then(() => {
                getList()
            })
        })
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    kaleidoscopeLabelLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (id: number, name: string) => {
    ElMessageBox.prompt('编辑行业分类', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputValue: name,
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入行业分类名称',
    })
        .then(({value}) => {
            kaleidoscopeLabelSave({id: id, name: value}).then(() => {
                getList()
            })
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
