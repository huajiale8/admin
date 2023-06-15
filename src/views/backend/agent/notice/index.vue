<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="8">
                    <BtnRefresh @click="refresh" :loading="loading"/>
                    <BtnAdd v-if="auth('add')" @click="add"/>
                </el-col>
            </el-row>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    :fixed="true"
                    prop="title"
                    align="center"
                    label="标题"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="发布时间"
                    min-width="230"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="70"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                        <BtnEdit v-if="auth('edit')" @click="edit(scope.row.id)"/>
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
import PopupForm from "/@/views/backend/agent/notice/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {agentNoticeDetail, agentNoticeList} from "/@/api/backend/agent/notice/notice";
import {auth} from '/@/utils/common'
import {agentNoticeConfig} from "/@/stores/agent/notice/notice";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";

const store = agentNoticeConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
})
const total = ref(0)
const certList = ref<Area[]>([])

const add = () => {
    store.operate = '新增通知'
    store.dialogVisible = true
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const edit = (id: number) => {
    store.operate = '编辑通知'
    agentNoticeDetail({id}).then(res => {
        store.id = res.data.content.id
        store.content = res.data.content.content
        store.title = res.data.content.title
        store.backups = res.data.content.attaches
        store.files = res.data.content.files
        store.dialogVisible = true
    })
}
const getList = () => {
    loading.value = true
    agentNoticeList(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
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
