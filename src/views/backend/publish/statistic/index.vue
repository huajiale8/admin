<template>
    <div class="default-main ba-table-box">
        <div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-card>
                        <div class="clearfix">
                            <span>统计行业柱状图</span>
                        </div>
                        <div>
                            <div id="order" :style="{width: chartWidth, height: chartHeight}"></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card>
                        <div class="clearfix">
                            <span>统计业务类型柱状图</span>
                        </div>
                        <div>
                            <div id="project" :style="{width: chartWidth, height: chartHeight}"></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {statisticMenuLists} from "/@/api/backend/publish/statistic";
import * as echarts from "echarts";

const order = ref<Area[]>([])
const project = ref<Area[]>([])
const chartWidth = ref('100%')
const chartHeight = ref('450px')
const getList = () => {
    statisticMenuLists().then(res => {
        order.value = res.data.content.order
        project.value = res.data.content.project
        initEchart(order)
        initEcharts(project)
    })
}
const initEchart = (data: any) => {
    const option = {
        yAxis: {
            type: 'value'
        },
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
            data: data.value.title
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    title: '保存为图片',
                }
            }
        },
        series: [{
            type: 'bar',
            data: data.value.content,
            showBackground: true,
            backgroundStyle: {
                color: 'rgb(236, 245, 255)'
            },
            color: '#409EFF'
        }]
    };
    const myChart = echarts.init(document.getElementById("project"));
    myChart.setOption(option);
    window.addEventListener("resize", () => {
        myChart.resize();
    });
}
const initEcharts = (data: any) => {
    const option = {
        yAxis: {
            type: 'value'
        },
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
            data: data.value.title
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    title: '保存为图片',
                }
            }
        },
        series: [{
            type: 'bar',
            data: data.value.content,
            showBackground: true,
            backgroundStyle: {
                color: 'rgb(236, 245, 255)'
            },
            color: '#409EFF'
        }]
    };
    const myChart = echarts.init(document.getElementById("order"));
    myChart.setOption(option);
    window.addEventListener("resize", () => {
        myChart.resize();
    });
}
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
