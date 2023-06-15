<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column :fixed="true" prop="id" align="center" label="序号" width="150"/>
                <el-table-column prop="key" align="center" label="配置键" show-overflow-tooltip/>
                <el-table-column prop="created_at" align="center" label="配置日期" show-overflow-tooltip/>
                <el-table-column label="状态" align="center" width="180">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enable"
                            :active-value="0"
                            :inActiveValue="1"
                            :disable="disable"/>
                        <el-tag v-else :type="scope.row.status===0?'success':'warning'">
                            {{ scope["row"].status === 0 ? "启用" : "禁用" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <div class="operate_btn">
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
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch,} from "vue";
import {auth} from '/@/utils/common'
import {generalConfig} from "/@/stores/category/common";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {general, generalDetail, generalLists, generalUpdate,} from "/@/api/backend/auth/attributes/common";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import {ElMessageBox} from "element-plus";

const pageTotal = ref(0)
const query = reactive({
    name: '',
    page: 1,
    pageSize: 10,
});
const store = generalConfig()
const loading = ref(false)
const categoryList = ref<Area[]>([])
const refresh = () => {
    query.page = 1
    getList()
}
const add = () => {
    ElMessageBox.prompt("新增通用配置", "新增", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入配置内容";
        },
    }).then(({value}) => {
        generalUpdate({
            id: 0,
            key: value,
            status: 0,
        }).then(() => {
            getList()
        })
    });
}
const getList = () => {
    loading.value = true
    store.id = 0
    store.level = 0
    store.name = ''
    generalLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (i: number) => {
    generalDetail({id: i}).then(res => {
        let obj = res.data.content
        ElMessageBox.prompt("编辑通用配置", "编辑", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            inputValue: obj.key,
            inputValidator: (value) => {
                if (!value || value.length < 1) return "请输入配置内容";
            },
        }).then(({value}) => {
            generalUpdate({
                id: obj.id,
                key: value,
                status: obj.status,
            }).then(() => {
                getList()
            })
        });
    })
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        general({id}, 'enable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        general({id}, 'disable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
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
