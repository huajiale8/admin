<template>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialogVisible"
        width="80%"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                系统日志详情
            </div>
        </template>
        <el-scrollbar max-height="60vh">
            <div class="ba-operate-form">
                <el-table :data="store.logList" border>
                    <el-table-column
                        fixed
                        prop="timestamp"
                        label="创建日期"
                        align="center"
                        width="200"
                        :show-overflow-tooltip="true"/>
                    <el-table-column
                        prop="env"
                        align="center"
                        label="环境"
                        width="100"
                        :show-overflow-tooltip="true"/>
                    <el-table-column
                        prop="type"
                        label="类型"
                        align="center"
                        width="100"
                        :show-overflow-tooltip="true">
                        <template #default="scope">
                            <el-button v-if="scope.row.env === 'ERROR'" type="success" plain>ERROR</el-button>
                            <el-button v-else type="success" plain>INFO</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="message"
                        label="详情"
                        align="center"
                        :show-overflow-tooltip="true"/>
                </el-table>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {logConfig} from '/@/stores/maintenance/log'

const store = logConfig()

const handleClose = () => {
    store.name = ''
    store.id = 0
    store.level = 0
    store.logList = []
    store.flag = false
    store.dialogVisible = false
}
</script>
<style scoped lang="scss"></style>
