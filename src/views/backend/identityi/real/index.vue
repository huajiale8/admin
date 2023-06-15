<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    fixed
                    prop="id"
                    align="center"
                    label="会员ID"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="real_name"
                    align="center"
                    label="姓名"
                    min-width="180"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="card_number"
                    align="center"
                    label="证件号"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="手机"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    min-width="180"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-popover
                            v-if="scope.row.status===2"
                            placement="top-start"
                            title="驳回原因"
                            :width="200"
                            trigger="hover"
                            :content="scope.row.reason">
                            <template #reference>
                                <el-tag type="warning" plain>审核驳回</el-tag>
                            </template>
                        </el-popover>
                        <el-tag v-if="scope.row.status===0" type="info" plain>未验证</el-tag>
                        <el-tag v-if="scope.row.status===1" type="success" plain>审核通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnView v-if="scope.row.status !== 0" @click="editCate(scope.row.id)"/>
                            <BtnEdit v-if="auth('check') && scope.row.states === 0" @click="editCate(scope.row.id)"/>
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
        <popup-form/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch,} from "vue";
import {realConfig} from "/@/stores/identity/realpupForm";
import PopupForm from "/@/views/backend/identityi/real/popupForm.vue";
import {realDetail, realLists} from "/@/api/backend/auth/identityi/real";
import {auth} from "/@/utils/common";
import BtnView from "/@/components/buttons/BtnView.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";

const pageTotal = ref(0)
const query = reactive({
    page: 1,
    pageSize: 10,
});
const store = realConfig()
const loading = ref(false)
const categoryList = ref<Area[]>([])
const refresh = () => {
    query.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    realLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (i: number) => {
    realDetail({id: i}).then(res => {
        store.bankList = res.data.content
        store.status = res.data.content.status
        store.id = res.data.content.id
        store.operate = store.status === 0 ? '实名认证信息审核' : '实名认证信息详情';
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
