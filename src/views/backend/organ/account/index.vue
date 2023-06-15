<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import {disableAccount, enableAccount, getAccountDetail, getAccountList} from "/@/api/backend/organ/account";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import {TabsPaneContext} from "element-plus";
import {auth} from "/@/utils/common";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import {useAccountStore} from "/@/stores/open/account";
import CapitalDialog from "/@/views/backend/organ/account/CapitalDialog.vue";
import TypeDialog from "/@/views/backend/organ/account/TypeDialog.vue";
import CheckDialog from "/@/views/backend/organ/account/CheckDialog.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnCapital from "/@/components/buttons/BtnCapital.vue";

type Query = {
    page: number,
    pageSize: number,
    email?: string,
    status?: number,
    enterprise_name?: string
    total?: number,
    province_id?: number,
    city_id?: number,
    county_id?: number,
}

const store = useAccountStore();
const account_list = ref([]);
const typeDialogVisible = ref(false);
const capitalDialogVisible = ref(false);
const checkDialogVisible = ref(false);
const tableLoading = ref(false);
const areaArr = ref([]);
const activeTab = ref(0);
const queryInfo = ref<Query>({page: 1, pageSize: 10});

const refreshList = (params?: { query?: Query, loading?: boolean }) => {
    params = params || {};
    (params.loading === undefined || params.loading === true) && (tableLoading.value = true);
    getAccountList(params.query || queryInfo.value).then(res => {
        account_list.value = res.data.content.data;
        queryInfo.value.total = res.data.content.total;
        (params.loading === undefined || params.loading === true) && (tableLoading.value = false);
    });
};

const handleTabClick = (tab: TabsPaneContext) => {
    queryInfo.value.status = Number(tab.props.name);
    queryInfo.value.page = 1;
    queryInfo.value.province_id = undefined;
    queryInfo.value.city_id = undefined;
    queryInfo.value.county_id = undefined;
    queryInfo.value.email = undefined;
    queryInfo.value.enterprise_name = undefined;
    refreshList();
};

const onAreaChange = () => {
    queryInfo.value.province_id = null;
    queryInfo.value.city_id = null;
    queryInfo.value.county_id = null;
    if (areaArr.value) {
        queryInfo.value.province_id = areaArr.value[0] || null;
        queryInfo.value.city_id = areaArr.value[1] || null;
        queryInfo.value.county_id = areaArr.value[2] || null;
    }
};

const check = (id: number) => {
    getAccountDetail({id}).then(res => {
        store.account = res.data.content;
        checkDialogVisible.value = true;
    });
};

const setType = (id: number) => {
    getAccountDetail({id}).then(res => {
        store.account = res.data.content;
        typeDialogVisible.value = true;
    });
};

const addCapital = (id: number) => {
    getAccountDetail({id}).then(res => {
        store.account = res.data.content;
        capitalDialogVisible.value = true;
    });
};

const onDisableAccount = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        disableAccount({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};

const onEnableAccount = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enableAccount({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const refresh = () => {
    queryInfo.value.page = 1
    refreshList()
}
const onSearch = () => {
    refreshList();
};

const init = () => {
    refreshList();
};

onMounted(() => {
    init();
});
</script>

<template>
    <div class="default-main ba-table-box">
        <TypeDialog v-model="typeDialogVisible" @on-success="refreshList({loading:false})"/>
        <CapitalDialog v-model="capitalDialogVisible" @on-success="refreshList({loading:false})"/>
        <CheckDialog v-model="checkDialogVisible" @on-success="refreshList({loading:false})"/>
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="tableLoading"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="9">
                                <el-input v-model="queryInfo.enterprise_name" placeholder="请输入机构名称" clearable/>
                            </el-col>
                            <el-col :span="5">
                                <el-input v-model="queryInfo.email" placeholder="请输入用户邮箱地址" clearable/>
                            </el-col>
                            <el-col :span="5">
                                <AreaCascader v-model="areaArr" @change="onAreaChange" style="width: 100%;"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="onSearch"/>
            </div>
            <el-row class="m-b-10">
                <el-col :span="24">
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="默认" :name="0"/>
                        <el-tab-pane label="待审核" :name="1"/>
                        <el-tab-pane label="已驳回" :name="3"/>
                        <el-tab-pane label="已通过" :name="2"/>
                    </el-tabs>
                </el-col>
            </el-row>
            <el-table v-loading="tableLoading" :data="account_list" border fit>
                <el-table-column
                    label="机构名称"
                    prop="org_name"
                    width="200"
                    show-overflow-tooltip
                    fixed/>
                <el-table-column label="等级" prop="level" width="120">
                    <template #default="scope">
                        <el-tag type="success">
                            <span v-if="scope.row.level === 1">金牌代理商</span>
                            <span v-else-if="scope.row.level === 2">银牌代理商</span>
                            <span v-else-if="scope.row.level === 3">铜牌代理商</span>
                            <span v-else>未设置</span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="价格折扣" prop="level" width="120">
                    <template #default="scope">
                    <span>
                        <el-tag v-if="scope.row.discount === '' || scope.row.discount === '0.0'"> 【 不打折 】</el-tag>
                        <el-tag v-else type="danger">【 {{ scope.row.discount }} 折 】</el-tag>
                    </span>
                    </template>
                </el-table-column>
                <el-table-column label="账户邮箱" prop="email" width="200" show-overflow-tooltip/>
                <el-table-column label="联系人" prop="contact_name"/>
                <el-table-column
                    label="联系方式" prop="contact_information" width="150"
                    show-overflow-tooltip/>
                <el-table-column label="省份" prop="province" width="100"/>
                <el-table-column label="城市" prop="city" width="100"/>
                <el-table-column label="区域" prop="county" width="120"/>
                <el-table-column
                    label="最近登录时间" prop="last_login_time" width="200"
                    show-overflow-tooltip></el-table-column>
                <el-table-column
                    label="最近登录IP" prop="last_login_ip" width="200"
                    show-overflow-tooltip/>
                <el-table-column label="总资金" prop="amount" width="200" show-overflow-tooltip/>
                <el-table-column label="状态" align="center" fixed="right" width="100" show-overflow-tooltip>
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row['oid']"
                            :active-value="0"
                            :inactive-value="1"
                            :disable="onDisableAccount"
                            :enable="onEnableAccount"/>
                        <el-tag v-else :type="scope.row.status===0?'success':'warning'">
                            {{ scope["row"].status === 0 ? "启用" : "禁用" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeTab===1 || activeTab===2"
                    label="操作"
                    :width="activeTab===1?'70':'100'"
                    fixed="right"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="activeTab===1&&auth('check')" @click="check(scope.row.oid)"/>
                            <el-tooltip content="设置类型" placement="top" v-if="activeTab===2&&auth('type')">
                                <el-button
                                    class="btn_shadow"
                                    type="warning"
                                    size="small"
                                    @click="setType(scope.row.oid)">
                                    <el-icon>
                                        <Operation/>
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <BtnCapital
                                v-if="activeTab===2&&auth('capital')"
                                @click="addCapital(scope.row.oid)"/>
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

<style lang="scss" scoped>
</style>

<script lang="ts">
export default {
    name: "index",
};
</script>
