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
                                    placeholder="请输入服务分类"
                                    v-model="ruleForm.searchName"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="search"/>
            </div>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column fixed prop="id" align="center" label="编号" width="150"/>
                <el-table-column prop="name" align="center" label="分类名称" :show-overflow-tooltip="true"/>
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
import {ElMessageBox} from "element-plus";
import {auth} from '/@/utils/common'
import {categoryEnable, categoryForbidden, categoryLists, categorySave} from "/@/api/backend/auth/quote/category";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";

const total = ref(0)
const loading = ref(false)
const categoryList = ref([])
const ruleForm = reactive({
    name: '',
    id: 0,
    searchName: ''
})
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const refresh = () => {
    pageInfo.page = 1
    pageInfo.name = ''
    getList()
}
const getList = () => {
    loading.value = true
    categoryLists(pageInfo).then(res => {
        total.value = res.data.content.total
        categoryList.value = res.data.content.data
        loading.value = false
    })
}
const editCate = (i: number, name: string) => {
    ElMessageBox.prompt('编辑服务分类', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputValue: name,
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入分类名称',
    }).then(({value}) => {
        categorySave({id: i, name: value}).then(() => {
            getList()
        })
    })
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        categoryEnable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        categoryForbidden({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const search = () => {
    pageInfo.name = ruleForm.searchName
    getList()
}
const add = () => {
    ElMessageBox.prompt('新增服务分类', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /^.+$| /,
        inputErrorMessage: '请输入分类名称',
    }).then(({value}) => {
        categorySave({id: '', name: value}).then(() => {
            getList()
        })
    })
}
onMounted(() => {
    getList()
});
</script>
<style scoped lang="scss">
</style>
