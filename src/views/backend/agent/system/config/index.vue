<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="8">
                    <BtnRefresh @click="getList"/>
                </el-col>
            </el-row>
            <el-divider/>
            <el-form
                style="max-width: 460px"
                ref="formRef"
                :model="config"
                label-width="auto">
                <el-form-item label="意向客户个数限制">
                    <el-input v-model="config.custom_purpose_limit" placeholder="请输入标题"/>
                </el-form-item>
                <el-form-item label="无订单回归公海天数">
                    <el-input v-model="config.no_order_back_days" placeholder="请输入标题"/>
                </el-form-item>
                <el-form-item label="关键词允许停止期限">
                    <el-input v-model="config.keyword_to_stop_days" placeholder="请输入标题"/>
                </el-form-item>
                <el-form-item label="关键词允许停止排名">
                    <el-input v-model="config.keyword_to_stop_ranking" placeholder="请输入标题"/>
                </el-form-item>
                <el-form-item>
                    <el-button
                        v-if="auth('update')"
                        @click="onSubmit"
                        type="primary">
                        保存
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, reactive} from "vue";
import {agentSystemList, agentSystemUpdateList} from "/@/api/backend/agent/system/config/config";
import {auth} from '/@/utils/common'
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";

const config = reactive({
    custom_purpose_limit: 0,
    keyword_to_stop_days: 0,
    keyword_to_stop_ranking: 0,
    no_order_back_days: 0,
})

const getList = () => {
    agentSystemList().then(res => {
        let num = res.data.content
        config.custom_purpose_limit = num.custom_purpose_limit
        config.keyword_to_stop_days = num.custom_purpose_limit
        config.keyword_to_stop_ranking = num.keyword_to_stop_ranking
        config.no_order_back_days = num.no_order_back_days
    })
}
const onSubmit = () => {
    agentSystemUpdateList({config}).then(() => {
    })
}
onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
:deep(.el-form-item__content) {
    display: flex;
    justify-content: end;
}
</style>
