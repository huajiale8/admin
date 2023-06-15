<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="handleClick" :loading="loading"/>
                    </el-col>
                    <el-col :span="18" v-if="activeName === 0">
                        <el-row :gutter="10">
                            <el-col :span="5" :offset="14">
                                <AreaCascader v-model="areaOptions"/>
                            </el-col>
                            <el-col :span="5">
                                <el-input
                                    :clearable="true"
                                    placeholder="请输入客户名称"
                                    v-model="pageInfo.name"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="客户列表" :name="0">
                    <el-table v-loading="loading" :data="certList" border>
                        <el-table-column
                            fixed="left"
                            prop="name"
                            align="center"
                            label="客户名称"
                            min-width="250"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="name"
                            align="center"
                            label="联系人"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="contact_phone"
                            align="center"
                            label="联系方式"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="province"
                            align="center"
                            label="省份"
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="city"
                            align="center"
                            label="城市"
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="county"
                            align="center"
                            label="区域"
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            fixed="right"
                            prop="address"
                            align="center"
                            label="详细地址"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfo.pageSize"
                        v-model:page="pageInfo.page"
                        :total="total"
                        @render="getList">
                    </paging-module>
                </el-tab-pane>
                <el-tab-pane label="客户变动日志" :name="1">
                    <el-table v-loading="loading" :data="LogsList" border>
                        <el-table-column
                            fixed="left"
                            prop="custom_name"
                            align="center"
                            label="客户名称"
                            min-width="250"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="agent_name"
                            align="center"
                            label="代理商/员工姓名"
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="remarks"
                            align="center"
                            label="操作日志"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            fixed="right"
                            prop="updated_at"
                            align="center"
                            label="操作时间"
                            min-width="170"
                            :show-overflow-tooltip="true"/>
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfo.pageSize"
                        v-model:page="pageInfo.page"
                        :total="total"
                        @render="agentCustomLog">
                    </paging-module>
                </el-tab-pane>
                <el-tab-pane label="客户操作日志" :name="2">
                    <el-table v-loading="loading" :data="OperationsList" border>
                        <el-table-column
                            fixed="left"
                            prop="name"
                            align="center"
                            label="客户"
                            min-width="250"
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
                        @render="agentCustomLogOperations">
                    </paging-module>
                </el-tab-pane>
                <el-tab-pane label="客户充值记录" :name="3">
                    <el-table v-loading="loading" :data="ConsumesList" border>
                        <el-table-column
                            fixed="left"
                            prop="custom_name"
                            align="center"
                            label="客户名称"
                            min-width="250"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            align="center"
                            label="类型"
                            min-width="200"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag>
                                    {{ type[scope.row.type] }}
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
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="desc"
                            align="center"
                            label="说明"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="updated_at"
                            align="center"
                            label="操作时间"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            fixed="right"
                            align="center"
                            label="备注"
                            min-width="100"
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
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfo.pageSize"
                        v-model:page="pageInfo.page"
                        :total="total"
                        @render="agentCustomLogConsumes">
                    </paging-module>
                </el-tab-pane>
                <el-tab-pane label="客户消费记录" :name="4">
                    <el-table v-loading="loading" :data="ConsumesList" border>
                        <el-table-column
                            fixed="left"
                            prop="custom_name"
                            align="center"
                            label="客户名称"
                            min-width="250"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            align="center"
                            label="类型"
                            min-width="200"
                            :show-overflow-tooltip="true">
                            <template #default="scope">
                                <el-tag>
                                    {{ type[scope.row.type] }}
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
                            min-width="100"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="desc"
                            align="center"
                            label="说明"
                            min-width="150"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            prop="updated_at"
                            align="center"
                            label="操作时间"
                            min-width="200"
                            :show-overflow-tooltip="true"/>
                        <el-table-column
                            fixed="right"
                            align="center"
                            label="备注"
                            min-width="100"
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
                    </el-table>
                    <paging-module
                        v-model:page-size="pageInfo.pageSize"
                        v-model:page="pageInfo.page"
                        :total="total"
                        @render="agentCustomLogConsumes">
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
    agentCustomList,
    agentCustomLogConsumesList,
    agentCustomLogDiffList,
    agentCustomLogList,
    agentCustomLogOperationsList
} from "/@/api/backend/agent/custom/custom";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnView from "/@/components/buttons/BtnView.vue";
import LogsPopupForm from "/@/views/backend/agent/custom/logsPopupForm.vue";

const activeName = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const areaOptions = ref([])
const newList = ref(JSON.stringify({}))
const oldList = ref(JSON.stringify([]))
const total = ref(0)
const certList = ref<Area[]>([])
const LogsList = ref<Area[]>([])
const OperationsList = ref<Area[]>([])
const ConsumesList = ref<Area[]>([])
const type = ref<Area[]>([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: '',
    province_id: 0,
    city_id: 0,
    county_id: 0,
    type: 1
})

const handleClick = () => {
    pageInfo.page = 1
    switch (activeName.value) {
        case 0:
            getList()
            break
        case 1:
            agentCustomLog()
            break
        case 2:
            agentCustomLogOperations()
            break
        case 3:
            pageInfo.type = 1
            agentCustomLogConsumes()
            break
        case 4:
            pageInfo.type = 2
            agentCustomLogConsumes()
            break
        default:
            break
    }
}
const examine = (id: number, uid: number) => {
    agentCustomLogDiffList({id: id, aid: uid}).then(res => {
        newList.value = JSON.stringify([res.data.content.new], null, 2)
        oldList.value = JSON.stringify(res.data.content.old, null, 2)
        dialogVisible.value = true
    })
}
const agentCustomLogOperations = () => {
    pageInfo.type = activeName.value
    loading.value = true
    agentCustomLogOperationsList(pageInfo).then(res => {
        OperationsList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const agentCustomLogConsumes = () => {
    loading.value = true
    agentCustomLogConsumesList(pageInfo).then(res => {
        ConsumesList.value = res.data.content.lists.data
        type.value = res.data.content.types
        total.value = res.data.content.lists.total
        loading.value = false
    })
}
const agentCustomLog = () => {
    loading.value = true
    agentCustomLogList(pageInfo).then(res => {
        LogsList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const getList = () => {
    loading.value = true
    if (areaOptions.value) {
        pageInfo.province_id = areaOptions.value[0]
        pageInfo.city_id = areaOptions.value[1]
        pageInfo.county_id = areaOptions.value[2]
    } else {
        pageInfo.province_id = 0
        pageInfo.city_id = 0
        pageInfo.county_id = 0
    }
    agentCustomList(pageInfo).then(res => {
        certList.value = res.data.content.data
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
