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
                    width="100"
                    label="序号"/>
                <el-table-column
                    prop="project"
                    align="center"
                    label="项目名称"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="user"
                    align="center"
                    label="会员名称/昵称"/>
                <el-table-column
                    prop="content"
                    align="center"
                    label="评论/说一说内容"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建日期"
                    width="170"/>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    width="110">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="enableComment"
                            :disable="disableComment"
                            :active-value=0
                            :inactive-value=1
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="60"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnDelete v-if="auth('delete')" @click="deleteComment(scope.row.id)"/>
                        </div>
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
import {commentLists, del, disable, enable} from "/@/api/backend/portal/data/comment";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";
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
    commentLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const deleteComment = (i: number) => {
    del({id: i}).then(() => {
        getList()
    })
}
const enableComment = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disableComment = (id: number) => {
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
