<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="handleClick"/>
                    </el-col>
                    <el-col :span="18" v-if="activeName === 0">
                        <el-row :gutter="10">
                            <el-col :span="5" :offset="19">
                                <el-input
                                    clearable
                                    placeholder="请输入员工名称"
                                    v-model="pageInfo.name"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="员工列表" :name="0">
                    <el-table v-loading="loading" :data="certList" style="width: 100%" border>
                        <el-table-column
                            fixed="left"
                            prop="phone"
                            align="center"
                            label="登录手机"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="name"
                            align="center"
                            label="员工姓名"
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="type"
                            align="center"
                            label="员工类型"
                            min-width="150"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag>
                                    {{ type[scope.row.type] }}
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
                            label="最近登录时间"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="last_login_ip"
                            align="center"
                            label="最近登录IP"
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            fixed="right"
                            prop="status"
                            align="center"
                            label="状态"
                            min-width="100"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <CustomSwitch
                                    v-if="auth('enable')"
                                    v-model="scope.row.status"
                                    :id="scope.row.aid"
                                    :enable="enable"
                                    :disable="disable"
                                    :active-value=0
                                    :inactive-value=1
                                />
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
                <el-tab-pane label="员工操作日志" :name="1">
                    <el-table v-loading="loading" :data="LogsList" style="width: 100%" border>
                        <el-table-column
                            fixed="left"
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
                            min-width="200"
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
                            label="操作"
                            width="70"
                            align="center">
                            <template #default="scope">
                                <div class="operate_btn">
                                    <BtnView @click="examine(scope.row.id,scope.row.uid)"/>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfo.pageSize"
                        v-model:page="pageInfo.page"
                        :total="total"
                        @render="agentStaffLogs">
                    </paging-module>
                </el-tab-pane>
            </el-tabs>
            <logs-popup-form v-model='dialogVisible' :newList="newList" :oldList="oldList"/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {
    agentStaffList,
    agentStaffLogsDiff,
    agentStaffLogsLists,
    agentStaffStatus
} from "/@/api/backend/agent/staff/staff";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import {auth} from "/@/utils/common";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnView from "/@/components/buttons/BtnView.vue";
import LogsPopupForm from "/@/views/backend/agent/staff/logsPopupForm.vue";

const dialogVisible = ref(false)
const activeName = ref(0)
const loading = ref(false)
const newList = ref(JSON.stringify({}))
const oldList = ref(JSON.stringify({}))
const total = ref(0)
const certList = ref<Area[]>([])
const LogsList = ref<Area[]>([])
const type = ref<Area[]>([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const handleClick = () => {
    pageInfo.page = 1
    if (activeName.value === 0) {
        getList()
    } else {
        agentStaffLogs()
    }
}
const examine = (id: number, uid: number) => {
    agentStaffLogsDiff({id: id, aid: uid}).then(res => {
        newList.value = JSON.stringify(res.data.content.new, null, 2)
        oldList.value = JSON.stringify(res.data.content.old, null, 2)
        dialogVisible.value = true
    })
}
const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        agentStaffStatus({id}, 'enable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        agentStaffStatus({id}, 'disable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const getList = () => {
    loading.value = true
    agentStaffList(pageInfo).then(res => {
        certList.value = res.data.content.lists.data
        total.value = res.data.content.lists.total
        type.value = res.data.content.type
        loading.value = false
    })
}
const agentStaffLogs = () => {
    loading.value = true
    agentStaffLogsLists(pageInfo).then(res => {
        LogsList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
