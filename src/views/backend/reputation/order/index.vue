<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="5" :offset="19" justify="space-between">
                                <el-input
                                    clearable
                                    placeholder="请输入店铺名称关键字"
                                    v-model="searchName"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="search"/>
            </div>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    :fixed="true"
                    prop="shop_name"
                    align="center"
                    label="店铺名称"
                    min-width="230"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="contactor"
                    align="center"
                    label="联系人"
                    min-width="230"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="联系方式"
                    min-width="200"
                    show-overflow-tooltip/>
                <el-table-column
                    align="center"
                    label="联系地址"
                    min-width="200"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <span v-if="scope.row.province">{{ scope.row.province }}</span>
                        <span v-if="scope.row.city">{{ '-' + scope.row.city }}</span>
                        <span style="margin-left: 10px">
                            <el-tooltip
                                :content="scope.row.province + '-' + scope.row.city +'-'+ scope.row.address"
                                placement="top-start">
                            <el-icon><WarningFilled/></el-icon>
                        </el-tooltip>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="总价格"
                    min-width="200"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <span>{{ scope.row.total_price + '元' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态"
                    min-width="200"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <el-tag v-if="scope.row.isadvertised === 1">创建完成</el-tag>
                        <el-tag v-else>制作中...</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="全景链接"
                    min-width="200"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <span v-if="scope.row.pano_url !== '0' && scope.row.pano_url !== 0">
                            <el-link
                                type="primary"
                                :href="scope.row.pano_url"
                                target="_blank"
                                :underline="false">
                                预览全景
                            </el-link>
                        </span>
                        <span v-else>暂无全景</span>
                        <span v-if="scope.row.pano_url !== '0' && scope.row.pano_url !== 0" style="margin-left: 10px">
                             <el-tooltip
                                 :content="scope.row.pano_url"
                                 placement="top-start">
                               <el-icon><WarningFilled/></el-icon>
                            </el-tooltip>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="上传目录"
                    min-width="200"
                    show-overflow-tooltip>
                    <template #default="scope">
                        查看目录
                        <span style="margin-left: 10px">
                             <el-tooltip
                                 :content="scope.row.shop_id"
                                 placement="top-start">
                               <el-icon><WarningFilled/></el-icon>
                            </el-tooltip>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="order_time"
                    align="center"
                    label="订购时间"
                    min-width="200"
                    show-overflow-tooltip/>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="120"
                    align="center">
                    <template #default="scope">
                        <div v-if="scope.row.pano_url !== '0' && scope.row.pano_url !== 0">
                            <span v-if="scope.row.isadvertised !== 0 && scope.row.isadvertised !== '0'">
                                    <el-button
                                        type="success"
                                        @click="online(scope.row.id)"
                                        size="small">
                                        生成广告
                                    </el-button>
                            </span>
                            <span v-else>
                            <el-button
                                type="danger"
                                @click="offline(scope.row.id)"
                                size="small">
                                下架广告
                            </el-button>
                             </span>
                        </div>
                        <div v-else>
                            <el-button
                                type="primary"
                                @click="createOrder(scope.row.id)"
                                size="small">
                                生成全景
                            </el-button>
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
import {
    reputationOrderLists,
    reputationOrderOffline,
    reputationOrderOnline,
    reputationOrderUpdate
} from "/@/api/backend/reputation/order/order";
import {ElMessageBox,} from "element-plus";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";

const loading = ref(false)
const searchName = ref("")
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: ''
})
const total = ref(0)
const certList = ref<Area[]>([])

const refresh = () => {
    pageInfo.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    reputationOrderLists(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}
const search = () => {
    pageInfo.name = searchName.value
    getList()
}
const online = (i: number) => {
    ElMessageBox.confirm(
        '确认生成该店铺全景广告？?',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        reputationOrderOnline({id: i}).then(() => {
            getList();
        })
    })
}
const offline = (i: number) => {
    ElMessageBox.confirm(
        '确认下架该店铺全景广告？？?',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        reputationOrderOffline({id: i}).then(() => {
            getList();
        })
    })
}
const createOrder = (i: number) => {
    ElMessageBox.confirm(
        '确认生成该店铺全景广告？?',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        reputationOrderUpdate({id: i}).then(() => {
            getList();
        })
    })
}
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
