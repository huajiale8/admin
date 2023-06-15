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
                    width="100"/>
                <el-table-column
                    prop="name"
                    align="center"
                    label="项目名称">
                    <template #default="scope">
                        <el-tooltip content="预览" placement="top">
                            <span class="smallHand">{{ scope.row.name }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="qq"
                    align="center"
                    label="缩略图"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-image
                            :preview-teleported="true"
                            :preview-src-list="[scope.row.thumb_path]"
                            style="width: 30px; height: 30px"
                            :src="scope.row.thumb_path"
                            :initial-index="4"
                            fit="cover"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建日期"
                    width="170"/>
                <el-table-column prop="status" label="状态" align="center" width="110">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enablePanor"
                            :disable="disablePanor"
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
import {onMounted, reactive, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {disable, enable, panoramaLists} from "/@/api/backend/portal/project/panorama";
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
const refresh = () => {
    query.page = 1
    getList()
}
const getList = () => {
    loading.value = true
    panoramaLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const enablePanor = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disablePanor = (id: number) => {
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
