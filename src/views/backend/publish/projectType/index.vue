<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="typeList" border>
                <el-table-column
                    :fixed="true"
                    prop="id"
                    align="center"
                    label="编号"
                    min-width="200px"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="project_type"
                    align="center"
                    label="项目类型"
                    min-width="300px"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit @click="editCate(scope.row.id,scope.row.project_type)" v-if="auth('edit')"/>
                            <BtnDelete @click="deleteMenu(scope.row.id)" v-if="auth('del')"/>
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
import {onMounted, reactive, ref,} from "vue";
import {auth} from '/@/utils/common'
import {ElMessageBox,} from "element-plus";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {typeDelete, typeLists, typeUpdate} from "/@/api/backend/publish/projectType";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";

const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const total = ref(0)
const typeList = ref<Area[]>([])
const deleteMenu = (id: number) => {
    typeDelete({id}).then(() => {
        getList();
    })
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const add = () => {
    ElMessageBox.prompt("", "新增项目类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.+$/,
        inputErrorMessage: "输入内容不能为空",
    })
        .then(({value}) => {
            typeUpdate({id: '', project_type: value}).then(() => {
                getList()
            });
        });
}
const getList = () => {
    loading.value = true
    typeLists(pageInfo).then(res => {
        typeList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (id: number, name: string) => {
    ElMessageBox.prompt("", "编辑项目类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.+$/,
        inputValue: name,
        inputErrorMessage: "输入内容不能为空",
    })
        .then(({value}) => {
            typeUpdate({id: id, project_type: value}).then(() => {
                getList()
            });
        });
}
onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
</style>
