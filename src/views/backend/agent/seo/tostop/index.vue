<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="16">
                                <el-select
                                    v-model="pageInfo.engine_id"
                                    placeholder="请选择搜索引擎"
                                    :clearable="true">
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
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-tabs v-model="activeName" @tab-change="handleClick">
                <el-tab-pane label="待审核" :name="3"/>
                <el-tab-pane label="驳回" :name="0"/>
                <el-tab-pane label="审核通过" :name="4"/>
            </el-tabs>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    fixed="left"
                    prop="company_name"
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
                        <el-link type="primary" :underline="false" target="_blank"
                                 :href="searchEngine[scope.row.engine_id].url + scope.row.keyword">{{
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
                    prop="created_at"
                    align="center"
                    label="添加时间"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="初排"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span v-if="scope.row.lowest_ranking === 0">--</span>
                        <span v-else-if="scope.row.lowest_ranking > 100"> &gt;100 </span>
                        <span v-else>{{ scope.row.lowest_ranking }}</span>
                    </template>
                </el-table-column>
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
                    prop="cycle_time"
                    align="center"
                    label="周期"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="状态"
                    min-width="100"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnAudit v-if="activeName === 3 && auth('check')" @click="operation(scope.row.id)"/>
                            <el-tag v-if="activeName === 0" :type="'danger'">审核失败</el-tag>
                            <el-tag v-if="activeName === 4" type="success">审核通过</el-tag>
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
            <popup-form/>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import {auth} from '/@/utils/common'
import {computed, onMounted, reactive, ref, watch} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {agentSeoTostopDetail, agentSeoTostopList} from "/@/api/backend/agent/seo/tostop/tostop";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import {agentSeoStopConfig} from "/@/stores/agent/seo/tostop";
import PopupForm from "/@/views/backend/agent/seo/tostop/popupForm.vue";
import BtnAudit from "/@/components/buttons/BtnAudit.vue";

const store = agentSeoStopConfig()
const activeName = ref(3)
const searchEngine = ref([])
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    status: 3,
    keyword: '',
    engine_id: ''
})
const total = ref(0)
const certList = ref<Area[]>([])
const handleClick = () => {
    pageInfo.page = 1
    pageInfo.keyword = ''
    pageInfo.status = activeName.value
    getList()
}
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const operation = (id: number) => {
    agentSeoTostopDetail({id: id}).then(res => {
        store.company_name = res.data.content.company_name
        store.contact_name = res.data.content.contact_name
        store.keyword = res.data.content.keyword
        store.website = res.data.content.website
        store.price = res.data.content.price
        store.engine = res.data.content.engine
        store.id = res.data.content.id
        store.dialogVisible = true
    })
}
const formatEngine = (row: any) => {
    if (row.engine_id) {
        return searchEngine.value[row.engine_id].name;
    }
}
const getList = () => {
    pageInfo.status = activeName.value
    loading.value = true
    agentSeoTostopList(pageInfo).then(res => {
        certList.value = res.data.content.lists.data
        searchEngine.value = res.data.content.search_engine
        total.value = res.data.content.lists.total
        loading.value = false
    })
}
const getDialog = computed(() => {
    return store.refreshPage
})
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});

onMounted(() => {
    getList()
});

</script>
<style lang="scss" scoped>
</style>
