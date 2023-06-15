<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex:1">
                    <el-col :span="6">
                        <BtnRefresh @click="handleClick" :loading="loading"/>
                        <BtnAdd v-if="activeName === 0 && auth('add')" @click="add"/>
                    </el-col>
                    <el-col v-if="[0, 1].includes(activeName)" :span="18">
                        <el-row :gutter="10">
                            <el-col :span="5" :offset="14">
                                <el-select
                                    v-if="activeName === 0"
                                    v-model="AgentModel"
                                    placeholder="请选择代理商层级"
                                    clearable>
                                    <el-option :key="0" label="一级代理商" :value="0"></el-option>
                                    <el-option :key="1" label="二级代理商" :value="1"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-input
                                    clearable
                                    placeholder="请输入代理商名称"
                                    v-model="pageInfo.name"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="search"/>
            </div>

            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="代理商列表" :name="0">
                    <el-table v-loading="loading" :data="certList" border>
                        <el-table-column
                            :fixed="true"
                            prop="phone"
                            align="center"
                            label="登录手机"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="name"
                            align="center"
                            label="代理商名称"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            align="center"
                            label="代理商层级"
                            min-width="150"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag v-if="scope.row.superior_aid === 0" type="danger">
                                    一级代理商
                                </el-tag>
                                <el-tag v-else>
                                    二级代理商
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="email"
                            align="center"
                            label="邮箱地址"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="updated_at"
                            align="center"
                            label="最近登陆时间"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="last_login_ip"
                            align="center"
                            label="最近登录IP"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            align="center"
                            label="付费方式"
                            min-width="150"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag v-if="scope.row.pay_type === 0">
                                    预付费
                                </el-tag>
                                <el-tag v-else type="danger">
                                    后付费
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="option_type"
                            align="center"
                            label="账户操作类型"
                            min-width="150"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag v-if="scope.row.option_type === 0">
                                    官方平台
                                </el-tag>
                                <el-tag v-else type="danger">
                                    API
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount"
                            align="center"
                            label="总资金"
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="status"
                            align="center"
                            label="状态"
                            min-width="100"
                            :show-overflow-tooltip="true">
                            <template #default="scope" v-if="auth('enable')">
                                <CustomSwitch
                                    v-if="auth('enable')"
                                    v-model="scope.row.status"
                                    :id="scope.row.aid"
                                    :active-value="0"
                                    :inActiveValue="1"
                                    :enable="enable"
                                    :disable="disable"/>
                                <el-tag v-else :type="scope.row.status===0?'success':'warning'">
                                    {{ scope["row"].status === 0 ? "启用" : "禁用" }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            header-align="center"
                            label="操作"
                            min-width="140"
                          >
                            <template #default="scope">
                                <div class="operate_btn">
                                    <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.aid)"/>
                                    <BtnArea v-if="auth('area')" @click="authorityArea(scope.row)"/>
                                    <BtnCapital
                                        v-if="auth('capital') && scope.row.status === 0"
                                        @click="addCapital(scope.row)"/>
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
                <el-tab-pane label="代理商操作日志" :name="1">
                    <el-table v-loading="loading" :data="accountLogList" border>
                        <el-table-column
                            :fixed="true"
                            prop="name"
                            align="center"
                            label="代理商"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="ip"
                            align="center"
                            label="客户端IP"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="url"
                            align="center"
                            label="URL地址"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="desc"
                            align="center"
                            label="内容"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="updated_at"
                            align="center"
                            label="时间"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            fixed="right"
                            align="center"
                            label="操作"
                            min-width="60"
                            >
                            <template #default="scope">
                                <div class="operate_btn">
                                    <BtnView @click="editLogComparison(scope.row)"/>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfo.pageSize"
                        v-model:page="pageInfo.page"
                        :total="total"
                        @render="getLogList">
                    </paging-module>
                </el-tab-pane>
                <el-tab-pane label="代理商充值记录" :name="2">
                    <el-table v-loading="loading" :data="CapitalLists" border>
                        <el-table-column
                            :fixed="true"
                            prop="name"
                            align="center"
                            label="代理商"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            align="center"
                            label="类型"
                            min-width="200"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag>
                                    {{ types[scope.row.types] }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="quota"
                            align="center"
                            label="变动金额"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="amount"
                            align="center"
                            label="账户结余"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="desc"
                            align="center"
                            label="说明"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="remark"
                            align="center"
                            label="备注"
                            min-width="200"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-popover
                                    v-if="scope.row.remark"
                                    placement="top-start"
                                    title="备注信息"
                                    width="400"
                                    trigger="hover"
                                    :content="scope.row.remark">
                                    <template #reference>
                                        <el-button type="primary" link>详情</el-button>
                                    </template>
                                </el-popover>
                                <el-button v-else type="info" link>-</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            prop="updated_at"
                            align="center"
                            label="操作时间"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfos.pageSize"
                        v-model:page="pageInfos.page"
                        :total="total"
                        @render="getCapitalLists">
                    </paging-module>
                </el-tab-pane>
                <el-tab-pane label="代理商消费记录" :name="3">
                    <el-table v-loading="loading" :data="CapitalLists" border>
                        <el-table-column
                            :fixed="true"
                            prop="name"
                            align="center"
                            label="代理商"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            align="center"
                            label="类型"
                            min-width="200"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag>
                                    {{ types[scope.row.types] }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="quota"
                            align="center"
                            label="变动金额"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="amount"
                            align="center"
                            label="账户结余"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="desc"
                            align="center"
                            label="说明"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="remark"
                            align="center"
                            label="备注"
                            min-width="200"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-popover
                                    v-if="scope.row.remark"
                                    placement="top-start"
                                    title="备注信息"
                                    width="400"
                                    trigger="hover"
                                    :content="scope.row.remark">
                                    <template #reference>
                                        <el-button type="primary" link>详情</el-button>
                                    </template>
                                </el-popover>
                                <el-button v-else type="info" link>-</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="updated_at"
                            align="center"
                            label="操作时间"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            fixed="right"
                            align="center"
                            label="操作"
                            min-width="100"
                           >
                            <template #default="scope">
                                <div class="operate_btn">
                                    <el-tooltip v-if="auth('edit')" content="撤销" placement="top">
                                        <el-button
                                            :disabled="scope.row.type === 2"
                                            class="btn_shadow"
                                            type="danger"
                                            size="small"
                                            @click="rollBackConsumeItem(scope.row.id)">
                                            <el-icon size="14">
                                                <CircleClose/>
                                            </el-icon>
                                        </el-button>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfos.pageSize"
                        v-model:page="pageInfos.page"
                        :total="total"
                        @render="getCapitalLists">
                    </paging-module>
                </el-tab-pane>
            </el-tabs>
            <popup-form/>
            <authority-area-popup-form/>
            <addition-funding-popup-form/>
            <logs-popup-form/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import PopupForm from "/@/views/backend/agent/account/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {ElMessageBox} from 'element-plus'
import {
    accountManagement,
    accountManagementArea,
    accountManagementCapitalLists,
    accountManagementDetail,
    accountManagementLists,
    accountManagementLogs,
    accountManagementLogsDiff,
    accountManagementRollback
} from "/@/api/backend/agent/account/account";
import {auth} from '/@/utils/common'
import {agentAccountConfig} from "/@/stores/agent/account/account";
import AuthorityAreaPopupForm from "/@/views/backend/agent/account/authorityAreaPopupForm.vue";
import AdditionFundingPopupForm from "/@/views/backend/agent/account/additionFundingPopupForm.vue";
import LogsPopupForm from "/@/views/backend/agent/account/logsPopupForm.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnView from "/@/components/buttons/BtnView.vue";
import BtnArea from "/@/components/buttons/BtnArea.vue";
import BtnCapital from "/@/components/buttons/BtnCapital.vue";
import {CircleClose} from "@element-plus/icons-vue";

const store = agentAccountConfig()
const activeName = ref(0)
const loading = ref(false)
const AgentModel = ref(0)
const total = ref(0)
const certList = ref<Area[]>([])
const accountLogList = ref<Area[]>([])
const CapitalLists = ref<Area[]>([])
const types = ref<Area[]>([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: '',
    agent_type: 0
})
const pageInfos = reactive({
    page: 1,
    pageSize: 10,
    type: 1,
})
const getList = () => {
    loading.value = true
    accountManagementLists(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const getLogList = () => {
    loading.value = true
    accountManagementLogs(pageInfo).then(res => {
        accountLogList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const getCapitalLists = () => {
    loading.value = true
    accountManagementCapitalLists(pageInfos).then(res => {
        CapitalLists.value = res.data.content.lists.data
        total.value = res.data.content.lists.total
        types.value = res.data.content.types
        loading.value = false
    })
}
const editLogComparison = (row: any) => {
    accountManagementLogsDiff({id: row.id, aid: row.uid}).then(res => {
        store.newList = res.data.content.new
        store.oldList = res.data.content.old
        store.dialog = true
    })
}
const authorityArea = (obj: any) => {
    accountManagementArea({id: obj.aid}).then(res => {
        store.name = obj.name
        store.id = obj.aid
        store.phone = obj.phone
        store.operate = '更新代理商授权区域'
        store.treeList = res.data.content.area_trees
        store.checked_keys = res.data.content.checked_keys
        store.authorityAreaDialog = true
    })
}
const addCapital = (obj: any) => {
    store.name = obj.name
    store.id = obj.aid
    store.phone = obj.phone
    store.superior_aid = obj.superior_aid
    store.operate = '增加资金'
    store.addCapitalDialog = true
}
const add = () => {
    store.operate = '新增代理商账户'
    store.dialogVisible = true
}
const editCate = (i: number) => {
    store.selectedOptions = []
    store.operate = '编辑代理商账户'
    accountManagementDetail({id: i}).then(res => {
        let obj = res.data.content.agent
        store.selectedOptions[0] = obj.province_id
        store.selectedOptions[1] = obj.city_id
        store.selectedOptions[2] = obj.county_id
        store.address = obj.address
        store.director = obj.director
        store.email = obj.email
        store.id = obj.aid
        store.name = obj.name
        store.option_type = obj.option_type
        store.pay_type = obj.pay_type
        store.phone = obj.phone
        store.dialogVisible = true
    })
}
const handleClick = () => {
    pageInfos.page = 1
    pageInfo.page = 1
    pageInfo.name = ''
    switch (activeName.value) {
        case 0:
            getList()
            break
        case 1:
            getLogList()
            break
        case 2:
            pageInfos.type = 1
            getCapitalLists()
            break
        case 3:
            pageInfos.type = 2
            getCapitalLists()
            break
        default:
            break
    }
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        accountManagement({id}, 'enable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        accountManagement({id}, 'disable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const search = () => {
    pageInfo.agent_type = Number(AgentModel.value)
    if (activeName.value === 0) {
        getList()
    } else {
        getLogList()
    }


}
const rollBackConsumeItem = (id: number) => {
    ElMessageBox.confirm(
        '是否确认撤销此记录？',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        accountManagementRollback({id})
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
