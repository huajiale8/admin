<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="table-header" v-if="activeName==='first'">
                <el-row style="width: 100%;">
                    <el-col :span="6">
                        <BtnRefresh @click="handleClick"/>
                        <BtnAdd v-if="auth('add')" @click="add"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="19">
                                <el-input
                                    clearable
                                    placeholder="请输入报价员名称"
                                    v-model="store.searchName"
                                    autocomplete="off"/>
                            </el-col>
                            <el-col :span="1">
                                <BtnSearch @click="search"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <div class="table-header" v-if="activeName==='second'">
                <el-row style="width: 100%;">
                    <el-col :span="6">
                        <BtnRefresh @click="searchLog"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="19">
                                <el-input
                                    clearable
                                    placeholder="请输入客户名称"
                                    v-model="store.listPageName"
                                    autocomplete="off"/>
                            </el-col>
                            <el-col :span="1">
                                <BtnSearch @click="search"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <el-tabs
                v-model="activeName"
                @tab-change="handleClick">
                <el-tab-pane label="报价员列表" name="first">
                    <el-table v-loading="loading" :data="dataList" border>
                        <el-table-column
                            fixed
                            prop="name"
                            align="center"
                            label="用户名"
                            width="150"/>
                        <el-table-column
                            prop="contact_name"
                            align="center"
                            label="姓名"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="contact_phone"
                            align="center"
                            label="联系电话"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="created_at"
                            align="center"
                            label="创建时间"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="status"
                            label="状态"
                            align="center"
                            width="110">
                            <template #default="scope">
                                <CustomSwitch
                                    v-if="auth('enable')"
                                    v-model="scope.row.status"
                                    :id="scope.row.id"
                                    :enable="enable"
                                    :disable="disable"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                            class="operation"
                            width="110">
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
                </el-tab-pane>
                <el-tab-pane label="报价员操作日志" name="second">
                    <el-table v-loading="loading" :data="logsList" border>
                        <el-table-column
                            fixed
                            prop="name"
                            align="center"
                            label="客户"
                            width="150"/>
                        <el-table-column
                            prop="ip"
                            align="center"
                            label="客户端IP"
                            show-overflow-tooltip/>
                        <el-table-column
                            prop="url"
                            align="center"
                            label="URL地址"
                            show-overflow-tooltip/>
                        <el-table-column
                            prop="desc"
                            align="center"
                            label="内容"
                            show-overflow-tooltip/>
                        <el-table-column
                            prop="created_at"
                            align="center"
                            label="时间"
                            show-overflow-tooltip/>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="120"
                            align="center">
                            <template #default="scope">
                                <div class="operate_btn">
                                    <BtnView v-if="auth('logs/diff')" @click="diff(scope.row.id)"/>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfos.pageSize"
                        v-model:page="pageInfos.page"
                        :total="totals"
                        @render="accountLogsList">
                    </paging-module>
                </el-tab-pane>
            </el-tabs>
            <popup-form/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {auth} from '/@/utils/common'
import {
    accountDetail,
    accountDisable,
    accountEnable,
    accountLists,
    logsDiffLists,
    logsLists
} from "/@/api/backend/auth/quote/account";
import {accountConfig} from '/@/stores/quote/accountpupFrom'
import PopupForm from "/@/views/backend/quote/account/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnView from "/@/components/buttons/BtnView.vue";

const pageInfos = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const store = accountConfig()
const total = ref(0)
const totals = ref(0)
const loading = ref(false)
const dataList = ref([])
const logsList = ref([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const diff = (i: number) => {
    logsDiffLists({id: i}).then(res => {
        store.newList = res.data.content.new
        store.oldList = res.data.content.old
        store.dialog = true
    })
}
const activeName = ref('first')
const getList = () => {
    loading.value = true
    accountLists(pageInfo).then(res => {
        total.value = res.data.content.total
        dataList.value = res.data.content.data
        loading.value = false
    })
}
const handleClick = () => {
    store.searchName = ''
    store.listPageName = ''
    pageInfos.page = 1
    pageInfo.page = 1
    if (activeName.value === 'second') {
        accountLogsList()
        store.logsFlag = true
    } else {
        store.logsFlag = false
        pageInfo.page = 1
        pageInfo.pageSize = 10
        getList()
    }
}
const accountLogsList = () => {
    loading.value = true
    logsLists(pageInfos).then(res => {
        totals.value = res.data.content.total
        logsList.value = res.data.content.data
        loading.value = false
    })
}
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        accountDisable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        accountEnable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const editCate = (i: number) => {
    store.operate = '编辑报价员'
    accountDetail({id: i}).then(res => {
        let obj = res.data.content
        store.name = obj.contact_name
        store.id = obj.id
        store.accountName = obj.name
        store.phone = obj.contact_phone
        store.dialogVisible = true
    })
}
const search = () => {
    if (activeName.value === 'first') {
        pageInfo.name = store.searchName
        getList()
    } else {
        pageInfos.name = store.listPageName
        accountLogsList()
    }
}
const searchLog = () => {
    accountLogsList()
}
const add = () => {
    store.operate = '新增报价员'
    store.dialogVisible = true
}
onMounted(() => {
    getList()
});
const getDialog = computed(() => {
    return store.refreshPage
})
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});
</script>
<style scoped lang="scss">
</style>
