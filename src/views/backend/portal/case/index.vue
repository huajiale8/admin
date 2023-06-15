<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnAdd v-if="auth('add')" @click="add"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="19">
                                <el-input
                                    clearable
                                    placeholder="请输入全景标题关键字"
                                    v-model="pageInfo.name"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    fixed
                    prop="name"
                    align="center"
                    label="全景标题"
                    min-width="230"/>
                <el-table-column
                    align="center"
                    label="归属地"
                    min-width="230"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span v-if="scope.row.province">{{ scope.row.province }}</span>
                        <span v-if="scope.row.city">{{ '-' + scope.row.city }}</span>
                        <span v-if="scope.row.county">{{ '-' + scope.row.county }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="全景类型"
                    min-width="100">
                    <template #default="scope">
                        <div v-for="(i,item) in store.category" :key="item">
                            <span v-if="i.id === scope.row.category_id">{{ i.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="显示位置"
                    min-width="100">
                    <template #default="scope">
                        <div v-if="scope.row.place_id !== 0">
                            <div v-for="(i,item) in store.place" :key="item">
                                <span v-if="i.id === scope.row.place_id">{{ i.name }}</span>
                                <span v-if="scope.row.place_id === 0">全平台</span>
                            </div>
                        </div>
                        <div v-if="scope.row.place_id === 0">
                            <span>全平台</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="全景链接"
                    min-width="300"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-link :href="scope.row.pano_url" target="_blank" :underline="false">
                            {{ scope.row.pano_url }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.id)"/>
                            <BtnDelete v-if="auth('del')" @click="deleteCate(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:pageSize="pageInfo.pageSize"
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
import {auth} from '/@/utils/common'
import {caseConfig} from '/@/stores/portal/case'
import PopupForm from "/@/views/backend/portal/case/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {caseDeleteLists, caseLists, detailLists} from "/@/api/backend/portal/case/case";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
import {classificationLists} from "/@/api/common";

const store = caseConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const total = ref(0)
const categoryList = ref<Area[]>([])
const getList = () => {
    loading.value = true
    caseLists(pageInfo).then(res => {
        store.place = res.data.content.place
        categoryList.value = res.data.content.lists.data
        total.value = res.data.content.lists.total
        loading.value = false
    })
    classificationLists().then(res => {
        store.category = res.data.content
    })
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const add = () => {
    store.operate = '新增UCG内容'
    store.dialogVisible = true
}
const deleteCate = (i: number) => {
    caseDeleteLists({id: i}).then(() => {
        getList();
    })
}

const editCate = (i: number) => {
    detailLists({id: i}).then(res => {
        store.operate = '编辑UCG内容'
        let obj = res.data.content.project
        store.selectedOptions = [obj.province_id, obj.city_id, obj.county_id]
        store.id = obj.id
        store.name = obj.name
        store.category_id = obj.category_id
        store.place_id = obj.place_id
        store.panorama_url = obj.pano_url
        store.thumb_pc = obj.thumb_pc
        store.thumb_mobile = obj.thumb_mobile
        store.options = res.data.content.options
        store.dialogVisible = true
    })
}

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
