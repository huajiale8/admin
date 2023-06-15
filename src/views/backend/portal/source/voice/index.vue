<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" border>
                <el-table-column
                    fixed
                    prop="id"
                    align="center"
                    width="80px"
                    label="序号"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="name"
                    align="center"
                    label="音频名称"
                    width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="qq"
                    align="center"
                    label="音频预览"
                    width="260px">
                    <template #default="scope">
                        <audio controls ref="audio" style="height: 30px;width: 230px">
                            <source :src="scope.row.origin"/>
                        </audio>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="size"
                    align="center"
                    label="文件大小"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span>{{ parseFloat(scope.row.size / 1024000).toFixed(2) + 'Mb' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建日期"
                    width="170"/>
                <el-table-column
                    prop="origin"
                    align="center"
                    label="源文件地址"
                    min-width="270"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    fixed="right"
                    prop="status"
                    label="状态"
                    align="center"
                    width="110">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enableVoice"
                            :disable="disableVoice"
                            :active-value=0
                            :inactive-value=1
                        />
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:pageSize="query.pageSize"
                v-model:page="query.page"
                :total="pageTotal"
                @render="getList">
            </paging-module>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref,} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {audioLists, disable, enable} from "/@/api/backend/portal/source/voice";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import {auth} from "/@/utils/common";

const pageTotal = ref(0)
const query = reactive({
    name: '',
    page: 1,
    pageSize: 10,
});
const loading = ref(false)
const categoryList = ref<Area[]>([])

const getList = () => {
    loading.value = true
    audioLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const refresh = () => {
    query.page = 1
    getList()
}
const enableVoice = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disableVoice = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        disable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
