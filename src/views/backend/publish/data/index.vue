<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-table v-loading="loading" :data="lists" border>
                <el-table-column
                    fixed
                    prop="num"
                    align="center"
                    label="编号"
                    min-width="200px"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="导入项目数据"
                    align="center"
                    label="操作名称"
                    min-width="300px"
                    show-overflow-tooltip/>
                <el-table-column
                    label="选择文件"
                    prop="file">

                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-upload">导入</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref,} from "vue";

const loading = ref(false)
const lists = ref([{
    num: 1,
    name: '导入项目数据',
    file: ''
}])

onMounted(() => {

});
</script>

<style lang="scss" scoped>
</style>
