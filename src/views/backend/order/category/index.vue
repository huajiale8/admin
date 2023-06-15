<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import {disableCategory, enableCategory, getCategoryList, saveCategory} from "/@/api/backend/order/category";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import {auth} from "/@/utils/common";
import {ElMessageBox} from "element-plus";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";

type Query = {
    page: number,
    pageSize: number,
    total?: number,
}
const refresh = () => {
    queryInfo.value.page = 1
    refreshList()
}
const category_list = ref([]);
const tableLoading = ref(false);
const queryInfo = ref<Query>({page: 1, pageSize: 10});

const refreshList = (params?: { query?: Query, loading?: boolean }) => {
    params = params || {};
    (params.loading === undefined || params.loading === true) && (tableLoading.value = true);
    getCategoryList(params.query || queryInfo.value).then(res => {
        category_list.value = res.data.content.data;
        queryInfo.value.total = res.data.content.total;
        (params.loading === undefined || params.loading === true) && (tableLoading.value = false);
    });
};

const onAdd = () => {
    ElMessageBox.prompt("", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.+$/,
        inputErrorMessage: "输入内容不能为空",
    })
        .then(({value}) => {
            saveCategory({name: value}).then(() => {
                refreshList({loading: false});
            });
        });
};

const edit = (id: number) => {
    ElMessageBox.prompt("请修改分类名称", "编辑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.+$/,
        inputErrorMessage: "输入内容不能为空",
        inputValue: category_list.value.find(i => i.id === id)!.name,
    })
        .then(({value}) => {
            saveCategory({id, name: value}).then(() => {
                refreshList({loading: false});
            });
        });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        disableCategory({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enableCategory({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};

const init = () => {
    refreshList({});
};

onMounted(() => {
    init();
});
</script>

<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="6">
                    <BtnRefresh @click="refresh" :loading="tableLoading"/>
                    <BtnAdd @click="onAdd" v-if="auth('save')"/>
                </el-col>
            </el-row>
            <el-table v-loading="tableLoading" :data="category_list" border fit>
                <el-table-column
                    label="分类名称" prop="name" min-width="200" align="center" :show-overflow-tooltip="true"
                    fixed/>
                <el-table-column label="创建时间" prop="created_at" align="center" min-width="150"/>
                <el-table-column label="更新时间" prop="updated_at" align="center" min-width="150"/>
                <el-table-column label="状态"  align="center" min-width="130">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enable"
                            :disable="disable"
                        />
                        <el-tag v-else :type="scope.row.status===0?'success':'warning'">
                            {{ scope["row"].status === 0 ? "启用" : "禁用" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="160">
                    <template #default="scope">
                        <div class="operate_btn">
                        <BtnEdit
                            type="primary" @click="edit(scope.row.id)"
                            v-if="auth('save')"
                        />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:page-size="queryInfo.pageSize"
                v-model:page="queryInfo.page"
                :total="queryInfo.total"
                @render="refreshList">
            </paging-module>
        </el-card>
    </div>
</template>

<script lang="ts">
export default {
    name: "index",
};
</script>

<style lang="scss" scoped>

</style>
