<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-table
                :header-cell-style="{'text-align':'center','color':'#848484'}"
                v-loading="loading"
                :data="data"
                border>
                <el-table-column
                    fixed="left"
                    min-width="200"
                >
                    <template #header>
                        搜索引擎
                    </template>
                    <template #default="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="300"
                >
                    <template #header>
                        网址
                    </template>
                    <template #default="scope">
                        <el-input v-model="scope.row.url" class="engine-item"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="200"
                >
                    <template #header>
                        基础关键词单价
                    </template>
                    <template #default="scope">
                        <el-input v-model="scope.row.base_price" class="engine-item">
                            <template #prepend>￥</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="200"
                >
                    <template #header>
                        一级代理商关键词单价
                    </template>
                    <template #default="scope">
                        <el-input v-model="scope.row.first_price" class="engine-item">
                            <template #prepend>￥</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="200"
                >
                    <template #header>
                        二级代理商关键词单价
                    </template>
                    <template #default="scope">
                        <el-input v-model="scope.row.second_price" class="engine-item">
                            <template #prepend>￥</template>
                        </el-input>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :model="data" label-width="auto">
                <el-form-item>
                    <el-col :span="24" style="text-align: right">
                        <span>设置搜索引擎的关键词单价，如填 10 表示此搜索引擎单个关键词价格为 10 元</span>
                    </el-col>
                </el-form-item>
                <el-form-item  style="float: right">
                        <el-button v-if="auth('update')" class="btn_shadow" type="primary" @click="update">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {auth} from '/@/utils/common'
import {agentSystemEngineList, agentSystemEngineUpdate} from "/@/api/backend/agent/seo/engine/engine";

const loading = ref(false)
const data = ref<Area[]>([])
const update = () => {
    agentSystemEngineUpdate({data: data.value}).then(() => {
        getList()
    })
}
const getList = () => {
    loading.value = true
    agentSystemEngineList().then(res => {
        data.value = res.data.content
        loading.value = false
    })
}
onMounted(() => {
    getList()
});

</script>
<style lang="scss" scoped>
.engine-item {
    padding-left: 20px;
}

</style>
