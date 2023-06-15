<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" style="width: 100%" border>
                <el-table-column :fixed="true" prop="id" align="center" label="编号" width="150"/>
                <el-table-column prop="name" align="center" label="位置" show-overflow-tooltip/>
                <el-table-column fixed="right" label="操作" width="70" align="center">
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
import {onMounted, reactive, ref,} from "vue";
import {auth} from '/@/utils/common'
import {ElMessageBox,} from "element-plus";
import {placeLists, placeUpdate} from "/@/api/backend/auth/attributes/place";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";

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
    ElMessageBox.prompt("新增位置配置", "新增", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.+$/,
        inputErrorMessage: "输入内容不能为空",
    }).then(({value}) => {
        placeUpdate({id: '', name: value}).then(() => {
            getList()
        });
    });
}
const getList = () => {
    loading.value = true
    placeLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (i: number, name: string) => {
    ElMessageBox.prompt("编辑位置配置", "编辑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.+$/,
        inputErrorMessage: "输入内容不能为空",
        inputValue: name,
    }).then(({value}) => {
        placeUpdate({id: i, name: value}).then(() => {
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
