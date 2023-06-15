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
import {onMounted, reactive, ref} from "vue";
import {auth} from '/@/utils/common'
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import {kaleidoscopeTechLists, kaleidoscopeTechSave} from "/@/api/backend/kaleidoscope/tech";
import {ElMessageBox} from "element-plus";

const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const total = ref(0)
const categoryList = ref<Area[]>([])
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const add = () => {
    ElMessageBox.prompt('新增标签分类', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入标签分类名称',
    })
        .then(({value}) => {
            kaleidoscopeTechSave({id: '', name: value}).then(() => {
                getList()
            })
        })
}
const getList = () => {
    loading.value = true
    kaleidoscopeTechLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (id: number, name: string) => {
    ElMessageBox.prompt('编辑标签分类', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputValue: name,
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入标签分类名称',
    })
        .then(({value}) => {
            kaleidoscopeTechSave({id: id, name: value}).then(() => {
                getList()
            })
        })
}
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
