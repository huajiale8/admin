<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <el-col :span="8" class="col-left">
                    <BtnRefresh @click="refresh"/>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="待审核" :name="1"/>
                <el-tab-pane label="驳回" :name="0"/>
                <el-tab-pane label="审核通过" :name="2"/>
            </el-tabs>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="custom_name"
                    align="center"
                    label="客户"
                    min-width="200"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="custom_contact_name"
                    align="center"
                    label="联系人"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    align="center"
                    label="消费类型"
                    min-width="200"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <span>{{ store.consumeTypes[scope.row.types] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="关键字"
                    min-width="150"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <el-link
                            type="primary"
                            :underline="false"
                            target="_blank"
                            :href="searchEngine[scope.row.engine_id].url + scope.row.keyword">
                            {{ scope.row.keyword }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="current_ranking"
                    align="center"
                    label="当前排名"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="quota"
                    align="center"
                    label="消费金额"
                    min-width="150"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="amount"
                    align="center"
                    label="账户余额"
                    min-width="200"
                    show-overflow-tooltip/>
                <el-table-column
                    align="center"
                    label="截图"
                    min-width="100"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <el-image
                            style="width: 30px; height: 30px"
                            :src="scope.row.picture"
                            :zoom-rate="1.2"
                            :preview-src-list="[scope.row.picture]"
                            :initial-index="4"
                            fit="cover"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="200"
                    show-overflow-tooltip/>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="状态"
                    min-width="100"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnAudit v-if="activeName === 1 && auth('check')" @click="operation(scope.row.id)"/>
                            <el-tag v-if=" activeName === 0" :type="'danger'">审核失败</el-tag>
                            <el-tag v-if=" activeName === 2" type="success">审核通过</el-tag>
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
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {agentSeoApiCorrectDetail, agentSeoApiCorrectLists} from "/@/api/backend/agent/seo/api/correct/correct";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import {auth} from "/@/utils/common";
import {agentSeoApiCorrectConfig} from "/@/stores/agent/seo/api/correct";
import BtnAudit from "/@/components/buttons/BtnAudit.vue";

const store = agentSeoApiCorrectConfig()
const activeName = ref(1)
const searchEngine = ref([])
const loading = ref(false)
const total = ref(0)
const certList = ref<Area[]>([])
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    status: 1,
})
const handleClick = () => {
    pageInfo.page = 1
    pageInfo.status = activeName.value
    getList()
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const operation = (id: number) => {
    agentSeoApiCorrectDetail({id: id}).then(res => {
        store.custom_name = res.data.content.custom_name
        store.contact_name = res.data.content.contact_name
        store.types = res.data.content.types
        store.current_ranking = res.data.content.current_ranking
        store.quota = res.data.content.quota
        store.keyword = res.data.content.keyword
        store.website = res.data.content.website
        store.id = res.data.content.id
        store.dialogVisible = true
    })
}
const getList = () => {
    pageInfo.status = activeName.value
    loading.value = true
    agentSeoApiCorrectLists(pageInfo).then(res => {
        certList.value = res.data.content.lists.data
        store.consumeTypes = res.data.content.consumeTypes
        searchEngine.value = res.data.content.searchEngine
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
