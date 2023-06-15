<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnExport @click="derive"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="8" :offset="8">
                                <CustomDatePicker @change="addDate"/>
                            </el-col>
                            <el-col :span="4">
                                <el-select
                                    :clearable="true"
                                    v-model="pageInfo.custom"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请填写客户名称"
                                    :remote-method="getCustom"
                                    :loading="loading">
                                    <el-option
                                        v-for="item in customOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4">
                                <el-select
                                    :clearable="true"
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
                    prop="agent_name"
                    align="center"
                    label="代理商"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="custom_name"
                    align="center"
                    label="客户"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
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
                    prop="website_id"
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
                    prop="current_ranking"
                    label="排名"
                    min-width="150"
                    align="center"
                    sortable/>
                <el-table-column
                    prop="chinaz_ranking"
                    label="chianz排名"
                    min-width="150"
                    align="center"
                    sortable/>
                <el-table-column
                    prop="time"
                    label="扣费日期"
                    min-width="150"
                    align="center"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="quota"
                    label="扣费金额"
                    min-width="150"
                    align="center"/>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="状态"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="operate_btn">
                            <el-tooltip content="关键词指数" placement="top">
                                <el-button
                                    class="btn"
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
                :close-on-click-modal="false"
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
import {agentSeoKeywordTask} from "/@/api/backend/agent/seo/optimization/optimization";
import * as echarts from "echarts";
import {
    agentSeoDeductionCustomQuery,
    agentSeoDeductionList,
    agentSeoDeductionLists,
    agentSeoDeductionQuery
} from "/@/api/backend/agent/seo/deduction/deduction";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnExport from "/@/components/buttons/BtnExport.vue";
import CustomDatePicker from "/@/components/custom/CustomDatePicker.vue";

const searchEngine = ref([])
const agentOptions = ref([])
const customOptions = ref([])
const loading = ref(false)
const dialog = ref(false)
const total = ref(0)
const certList = ref<Area[]>([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    custom: '',
    agent: '',
    type: 'query',
    start_time: '',
    end_time: '',
})
const refresh = () => {
    pageInfo.page = 1
    pageInfo.custom = ''
    pageInfo.agent = ''
    pageInfo.type = 'query'
    getList()
}
const addDate = (obj: string[]) => {
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
const getCustom = (query: string) => {
    if (!query) return
    agentSeoDeductionCustomQuery({name: query}).then(res => {
        let list = res.data.content;
        customOptions.value = list.map((item: any) => {
            return {value: item.id, label: item.name};
        });
    })
}
const getAgent = (query: string) => {
    if (!query) return
    agentSeoDeductionQuery({name: query}).then(res => {
        let list = res.data.content;
        agentOptions.value = list.map((item: any) => {
            return {value: item.aid, label: item.name};
        });
    })
}
const operation = (row: any) => {
    agentSeoKeywordTask({id: row.keyword_id, keyword: row.keyword}).then(res => {
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
        dialog.value = true
    })
}
const formatEngine = (row: any) => {
    if (row.engine_id) {
        return searchEngine.value[row.engine_id].name;
    }
}
const derive = () => {
    if (!pageInfo.start_time || !pageInfo.end_time) return ElMessage.error("请选择时间段");
    pageInfo.type = 'query'
    agentSeoDeductionList(pageInfo).then(res => {
        let arr = res.data.content.lists.data
        if (arr.length > 0) {
            pageInfo.type = 'export'
            agentSeoDeductionLists(pageInfo).then(res => {
                let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
                let fileUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.setAttribute("href", fileUrl);
                a.setAttribute("download", 'example.xlsx');
                a.click();
                pageInfo.type = ''
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
const getList = () => {
    loading.value = true
    agentSeoDeductionList(pageInfo).then(res => {
        certList.value = res.data.content.lists.data
        searchEngine.value = res.data.content.search_engine
        total.value = res.data.content.lists.total
        loading.value = false
    })
}
onMounted(() => {
    getList()
});

</script>
<style lang="scss" scoped>
</style>
