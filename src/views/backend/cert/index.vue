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
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="20">
                                <el-form
                                    :model="store"
                                    status-icon
                                    class="demo-ruleForm">
                                    <el-form-item>
                                        <el-input
                                            clearable
                                            placeholder="请输入资源名称"
                                            v-model="pageInfo.name"
                                            autocomplete="off"/>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="name"
                    align="center"
                    label="客户名称"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="全景地址"
                    min-width="230"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-link
                            type="primary"
                            :underline="false"
                            target="_blank"
                            :href="scope.row.panorama_url">
                            {{ scope.row.panorama_url }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="expiry_date"
                    align="center"
                    label="到期时间"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="120"
                    align="center">
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
import {auth} from '/@/utils/common'
import {certConfig} from '/@/stores/cert/cert'
import PopupForm from "/@/views/backend/cert/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {certDetail, certLists} from "/@/api/backend/cert/cert";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import {classificationLists} from "/@/api/common";

const store = certConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const total = ref(0)
const certList = ref<Area[]>([])
const getList = () => {
    loading.value = true
    certLists(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
    classificationLists().then(res => {
        store.category = res.data.content
    })
}
const add = () => {
    store.operate = '新增资源素材'
    store.dialogVisible = true
}
const editCate = (i: number) => {
    certDetail({id: i}).then(res => {
        store.operate = '编辑资源素材'
        let obj = res.data.content
        store.category_id = obj.category_id
        store.id = obj.id
        store.fileList = obj.files
        store.previewImg = obj.photos
        store.name = obj.name
        store.certType_id = obj.cert_type
        store.panorama_url = obj.panorama_url
        store.dateValue = obj.expiry_date
        store.thumb_pc = obj.thumb
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
