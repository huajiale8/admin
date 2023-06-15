<template>
    <div class="default-main ba-table-box">
        <el-card >
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh"/>
                        <BtnExport @click="derive"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :offset="4" :span="8">
                                <CustomDatePicker @change="addDate"/>
                            </el-col>
                            <el-col :span="4">
                                <el-select v-model="pageInfo.engine_id" placeholder="请选择搜索引擎" clearable>
                                    <el-option
                                        v-for="item in searchEngine"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4">
                                <el-input
                                    clearable
                                    placeholder="关键词"
                                    v-model="pageInfo.keyword"
                                    autocomplete="off"/>
                            </el-col>
                            <el-col :span="4">
                                <el-select
                                    clearable
                                    v-model="pageInfo.agent"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请填写代理商名称"
                                    :remote-method="getAgent"
                                    :loading="loading">
                                    <el-option
                                        v-for="item in agentOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="custom_name"
                    align="center"
                    label="客户"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="keyword"
                    align="center"
                    label="关键字"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-link
                            type="primary"
                            :underline="false"
                            target="_blank"
                            :href="searchEngine[scope.row.engine_id].url + scope.row.keyword">
                            {{
                                scope.row.keyword
                            }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="website"
                    align="center"
                    label="网址"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="engine_id"
                    align="center"
                    :formatter="formatEngine"
                    label="搜索引擎"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="添加时间"
                    min-width="200"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="lowest_ranking"
                    align="center"
                    :sortable="true"
                    label="初排"
                    min-width="100"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <span v-if="scope.row.lowest_ranking === 0">--</span>
                        <span v-else-if="scope.row.lowest_ranking > 100"> &gt;100 </span>
                        <span v-else>{{ scope.row.lowest_ranking }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="current_ranking"
                    align="center"
                    label="新排"
                    :sortable="true"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span v-if="scope.row.current_ranking === 0">--</span>
                        <span v-else-if="scope.row.current_ranking > 100"> &gt;100 </span>
                        <span
                            v-else-if="scope.row.current_ranking <= 10"
                            style="color: red;">{{ scope.row.current_ranking }}</span>
                        <span v-else>{{ scope.row.current_ranking }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="change_ranking"
                    align="center"
                    label="变化"
                    :sortable="true"
                    min-width="100"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <span v-if="scope.row.change_ranking === 0">--</span>
                        <span
                            v-if="scope.row.change_ranking > 0"
                            style="color: red;">↑{{ scope.row.change_ranking }}</span>
                        <span
                            v-if="scope.row.change_ranking < 0"
                            style="color: green;">↓{{ Math.abs(scope.row.change_ranking) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updated_at"
                    align="center"
                    label="更新时间"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="over_numbers"
                    align="center"
                    label="达标"
                    :sortable="true"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="cycle_time"
                    align="center"
                    label="周期"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="price"
                    align="center"
                    label="单价"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="cost"
                    align="center"
                    label="成本"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="备注"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-popover
                            v-if="scope.row.remark"
                            placement="top-start"
                            title="备注"
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
                    align="center"
                    label="操作"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="operate_btn">
                        <el-tooltip content="关键词指数" placement="top">
                            <el-button
                                class="btn_shadow"
                                type="primary"
                                size="small"
                                @click="operation(scope.row)">
                                <el-icon size="14">
                                    <Finished/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
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
            <el-dialog
                class="ba-operate-dialog"
                v-model="dialog"
                :destroy-on-close="true"
                @close="handleClose">
                <template #header>
                    <div
                        style="text-align: center"
                        class="title"
                        v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                        v-zoom="'.ba-operate-dialog'">
                        关键字指数
                    </div>
                </template>
                <el-scrollbar>
                    <div>
                        <div id="container" style="min-height: 300px;"></div>
                    </div>
                </el-scrollbar>
            </el-dialog>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {ElMessage} from "element-plus";
import {agentSeoKeyquery, agentSeoKeywordTask} from "/@/api/backend/agent/seo/optimization/optimization";
import * as echarts from "echarts";
import {
    agentSeoApiOptimizationList,
    agentSeoApiOptimizationLists
} from "/@/api/backend/agent/seo/api/optimization/optimization";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnExport from "/@/components/buttons/BtnExport.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import CustomDatePicker from "/@/components/custom/CustomDatePicker.vue";

const searchEngine = ref([])
const agentOptions = ref([])
const loading = ref(false)
const dialog = ref(false)
const total = ref(0)
const certList = ref<Area[]>([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    status: '3',
    keyword: '',
    agent: '',
    engine_id: '',
    type: 'query',
    start_time: '',
    end_time: '',
})
const getList = () => {
    loading.value = true
    agentSeoApiOptimizationList(pageInfo).then(res => {
        certList.value = res.data.content.lists.data
        searchEngine.value = res.data.content.search_engine
        total.value = res.data.content.lists.total
        loading.value = false
    })
}
const refresh = () => {
    pageInfo.page = 1
    pageInfo.keyword = ''
    pageInfo.agent = ''
    pageInfo.engine_id = ''
    getList()
}
const addDate = (obj: string) => {
    if (obj === null) {
        pageInfo.start_time = ''
        pageInfo.end_time = ''
    }else {
        pageInfo.start_time = obj[0]
        pageInfo.end_time = obj[1]
    }
}
const handleClose = () => {
    dialog.value = false
}
const getAgent = (query: string) => {
    if (!query) return
    agentSeoKeyquery({name: query}).then(res => {
        let list = res.data.content;
        agentOptions.value = list.map((item: any) => {
            return {value: item.aid, label: item.name};
        });
    })
}
const operation = (row: any) => {
    dialog.value = true
    agentSeoKeywordTask({id: row.id, keyword: row.keyword}).then(res => {
        setTimeout(() => {
            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: res.data.content.time
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: res.data.content.name,
                        data: res.data.content.rank,
                        type: 'line'
                    }
                ]
            };
            const myChart = echarts.init(document.getElementById("container"));
            myChart.setOption(option);
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        }, 500)
    })
}
const formatEngine = (row: any) => {
    if (row.engine_id) {
        return searchEngine.value[row.engine_id].name;
    }
}
const derive = () => {
    if (!pageInfo.start_time || !pageInfo.end_time) {
        ElMessage({
            type: 'error',
            message: '请选择时间日期',
        })
        return false
    }
    pageInfo.type = 'query'
    agentSeoApiOptimizationList(pageInfo).then(res => {
        let arr = res.data.content.lists.data
        if (arr.length > 0) {
            pageInfo.type = 'export'
            agentSeoApiOptimizationLists(pageInfo).then(res => {
                let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
                let fileUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.setAttribute("href", fileUrl);
                a.setAttribute("download", 'example.xlsx');
                a.click();
                pageInfo.type = 'query'
            })
        } else {
            ElMessage({
                type: 'error',
                message: '没有数据',
            })
            return false
        }
    })
}
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
