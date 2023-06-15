<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row style="margin-bottom:10px">
                <BtnRefresh @click="refresh" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column :fixed="true" prop="id" align="center" label="序号" width="150"/>
                <el-table-column prop="name" align="center" label="名称" :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="amount"
                    align="center"
                    label="状态"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                    <template #default="scope">
                        <CustomSwitch
                            v-model="scope.row.is_hidden"
                            :id="scope.row.id"
                            :enable="EnablePic"
                            :disable="disablePic"
                            :active-value=0
                            :inactive-value=1
                        />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="60" align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.id)"/>
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
import {categoryDetail, categoryDisable, categoryEnable, categoryLists} from "/@/api/backend/auth/attributes/category";
import {auth} from '/@/utils/common'
import {cateConfig} from '/@/stores/category/category'
import PopupForm from "/@/views/backend/system/attributes/category/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";

const store = cateConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const total = ref(0)
const categoryList = ref<Area[]>([])

const add = () => {
    store.operate = '新增分类配置'
    store.dialogVisible = true
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const EnablePic = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        categoryEnable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disablePic = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        categoryDisable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const getList = () => {
    loading.value = true
    categoryLists(pageInfo).then(res => {
        categoryList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (i: number) => {
    categoryDetail({id: i}).then(res => {
        store.operate = '编辑分类详情'
        let obj = res.data.content
        store.id = obj.id
        store.name = obj.name
        store.cover = obj.cover
        store.icon = obj.icon
        store.cover_mobile = obj.cover_mobile
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
