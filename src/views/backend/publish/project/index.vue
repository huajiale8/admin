<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6" class="col-left">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnAdd v-if="auth('add')" @click="add"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="9">
                                <el-input
                                    clearable
                                    placeholder="请输入资源名称"
                                    v-model="project_name"
                                    autocomplete="off"/>
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="project_type" :clearable="true" placeholder="请选择项目类型">
                                    <el-option
                                        v-for="item in store.project_typeList"
                                        :key="item.project_type"
                                        :label="item.project_type"
                                        :value="item.project_type"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="order_type" :clearable="true" placeholder="请选择订单类型">
                                    <el-option
                                        v-for="item in store.order_typeList"
                                        :key="item.order_type"
                                        :label="item.order_type"
                                        :value="item.order_type"
                                    />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="search"/>
            </div>
            <el-table v-loading="loading" :data="projectList" style="width: 100%" border>
                <el-table-column
                    :fixed="'left'"
                    prop="project_name"
                    align="center"
                    label="项目名称"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="project_type"
                    align="center"
                    label="项目类型"
                    min-width="130"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="order_type"
                    align="center"
                    label="订单类型"
                    min-width="130"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="project_version"
                    align="center"
                    label="项目版本"
                    min-width="130"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="panorama_url"
                    align="center"
                    label="项目链接"
                    min-width="300"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-link
                            type="primary"
                            :underline="false"
                            target="_blank"
                            :href="scope.row.project_url">{{
                                scope.row.project_url
                            }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="datetime"
                    align="center"
                    label="上线时间"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column fixed="right" label="操作" width="100" align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.project_id)"/>
                            <BtnDelete v-if="auth('del')" @click="deleteMenu(scope.row.project_id)"/>
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
import {auth} from '/@/utils/common'
import {projectConfig} from '/@/stores/publish/project'
import PopupForm from "/@/views/backend/publish/project/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {projectMenuDelete, projectMenuDetail, projectMenuLists} from "/@/api/backend/publish/project";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";


const store = projectConfig()
const loading = ref(false)
const order_type = ref('')
const project_type = ref('')
const project_name = ref('')
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    project_name: '',
    project_type: '',
    order_type: ''
})
const total = ref(0)
const projectList = ref<Area[]>([])
const getList = () => {
    loading.value = true
    projectMenuLists(pageInfo).then(res => {
        store.project_typeList = res.data.content.project_type
        store.order_typeList = res.data.content.order_type
        projectList.value = res.data.content.lists.data
        total.value = res.data.content.lists.total
        loading.value = false
    })
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const add = () => {
    store.operate = '新增项目'
    store.dialogVisible = true
}
const deleteMenu = (id: string) => {
    projectMenuDelete({id}).then(() => {
        getList();
    })
}
const search = () => {
    pageInfo.project_name = project_name.value
    pageInfo.project_type = project_type.value
    pageInfo.order_type = order_type.value
    getList()
}
const editCate = (id: number) => {
    projectMenuDetail({id}).then(res => {
        store.operate = '编辑项目'
        let obj = res.data.content
        store.id = obj.project_id
        store.name = obj.project_name
        store.project_url = obj.project_url
        store.projectImg = obj.weixinimg
        store.project_type_id = obj.project_type
        store.order_type_id = obj.order_type
        store.dateValue = obj.datetime
        store.versions = obj.project_version
        store.wxShareContent = obj.weixincontent
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
