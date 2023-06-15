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
                    label="序号"
                    width="80"/>
                <el-table-column
                    prop="name"
                    align="center"
                    min-width="200"
                    label="视频名称"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="视频预览"
                    width="100px">
                    <template #default="scope">
                        <video
                            @click="View(scope.row)"
                            ref="audio"
                            style="height: 50px;width: 50px;">
                            <source :src="scope.row.origin"/>
                        </video>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="size"
                    align="center"
                    label="文件大小"
                    width="100">
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
                            :enable="enableVideo"
                            :disable="disableVideo"
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
        <el-dialog
            class="ba-operate-dialog"
            v-model="dialogVisible"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            @close="handleClose">
            <template #header>
                <div
                    style="text-align: center"
                    class="title"
                    v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                    v-zoom="'.ba-operate-dialog'">
                    视频播放
                </div>
            </template>
            <el-scrollbar>
                <video controls autoplay ref="audio" class="aud" style="height: 500px;width: 100%">
                    <source :src="particulars.site"/>
                </video>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref,} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {disable, enable, videoLists} from "/@/api/backend/portal/source/video";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import {auth} from "/@/utils/common";

const particulars = ref({
    site: '',
})
const pageTotal = ref(0)
const query = reactive({
    name: '',
    page: 1,
    pageSize: 10,
});
const loading = ref(false)
const categoryList = ref<Area[]>([])
const dialogVisible = ref(false)

const refresh = () => {
    query.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    videoLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const View = (row: any) => {
    particulars.value.site = row.origin
    dialogVisible.value = true
}

const enableVideo = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disableVideo = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        disable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const handleClose = () => {
    particulars.value.site = ''
    dialogVisible.value = false
}
onMounted(() => {
    getList()
});
</script>
<style lang="scss" scoped>
</style>
