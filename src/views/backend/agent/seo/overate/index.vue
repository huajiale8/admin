<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="getList" :loading="loading"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="20">
                                <el-select v-model="custom_id" placeholder="请填写客户名称" clearable>
                                    <el-option
                                        v-for="item in customOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="refresh"/>
            </div>
            <div>
                <el-row :gutter="20" style="min-height: 300px;">
                    <el-col :span="8">
                        <el-card class="box-card" shadow="always" style="min-height: 200px;">
                            <div class="clearfix">
                                <span>达标关键词</span>
                            </div>
                            <div class="item">
                                <div class="context">{{ over_numbers }}</div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card class="box-card" shadow="always">
                            <div class="clearfix">
                                <span>优化中关键词</span>
                            </div>
                            <div class="item">
                                <div class="context">{{ total }}</div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card class="box-card" shadow="always">
                            <div class="clearfix">
                                <span>上词率</span>
                            </div>
                            <div class="item">
                                <div class="context">{{ percentage }}</div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-card class="box-card" shadow="always">
                            <div>
                                <div id="myChart" ref="chart" style="min-height: 300px;"></div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {agentSeoCustomsList, agentSeoOverrateList} from "/@/api/backend/agent/seo/overrate/overrate";
import * as echarts from "echarts";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";

const custom_id = ref('')
const loading = ref(false)
const days = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
const total = ref(0)
const percentage = ref('')
const over_numbers = ref(0)
const customOptions = ref<Area[]>([])

const refresh = () => {
    getList()
}
const initEcharts = (data: any) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br />{a0}: {c0}%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        legend: {
            data: ['关键词达标率']
        },
        xAxis: {
            type: 'category',
            data: days
        },
        yAxis: {
            name: '百分比',
            type: 'value',
            show: true,
            min: 0,
            max: 100,
            minInterval: 20,
            axisLabel: {
                formatter: (value: any) => {
                    return value + '%';
                },
            },
            data: ['100', '80', '60', '40', '20', '0']
        },
        series: [{
            name: '关键词达标率',
            type: 'bar',
            label: {},
            data: data,
            showBackground: true,
            backgroundStyle: {
                color: 'rgb(236, 245, 255)'
            },
            color: '#409EFF'
        }]
    };
    const myChart = echarts.init(document.getElementById("myChart"));
    myChart.setOption(option);
    window.addEventListener("resize", () => {
        myChart.resize();
    });
}
const getList = () => {
    loading.value = true
    agentSeoOverrateList({custom_id: custom_id.value}).then(res => {
        over_numbers.value = res.data.content.over_numbers
        total.value = res.data.content.total
        percentage.value = getPercent(over_numbers.value, total.value)
        initEcharts(res.data.content.over_rate)
        loading.value = false
    })

}
const getPercent = (num: any, total: any) => {
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return "-";
    }
    return total <= 0 ? "0%" : Math.round(num / total * 100) + '%';
}
onMounted(() => {
    getList()
    agentSeoCustomsList({custom_id: custom_id.value}).then(res => {
        customOptions.value = res.data.content.customs
    })
});

</script>
<style lang="scss" scoped>
.item {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.context {
    font-size: 50px;
}
</style>
