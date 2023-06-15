<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnAdd v-if="auth('add')" @click="add"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="19">
                                <el-input
                                    clearable
                                    placeholder="请输入全景标题"
                                    v-model="pageInfo.title"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-table v-loading="loading" :data="bannerList" border>
                <el-table-column
                    fixed
                    prop="title"
                    align="center"
                    label="标题"
                    min-width="230"/>
                <el-table-column
                    align="center"
                    label="缩略图"
                    min-width="230"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <img alt="" style="width: 100px;height: 50px" :src="scope.row.photo">
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="URL地址"
                    min-width="230"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-link :href="scope.row.url" target="_blank" :underline="false">
                            {{ scope.row.url }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="显示位置"
                    min-width="200">
                    <template #default="scope">
                        <div v-if="scope.row.place_id !== 0">
                            <div v-for="(item, index) in store.place" :key="index">
                                <el-tag v-if="item.id === scope.row.place_id">{{ item.name }}</el-tag>
                            </div>
                        </div>
                        <div v-else>
                            <el-tag type="info">全平台</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.id)"/>
                            <BtnDelete v-if="auth('del')" @click="deleteCate(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:pageSize="pageInfo.pageSize"
                v-model:page="pageInfo.page"
                :total="total"
                @render="getList">
            </paging-module>
            <popup-form/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {auth} from '/@/utils/common'
import {bannerConfig} from '/@/stores/portal/banner'
import PopupForm from "/@/views/backend/portal/banner/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {bannerDeleteLists, bannerLists, detailLists} from "/@/api/backend/portal/banner/banner";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnDelete from "/@/components/buttons/BtnDelete.vue";

const store = bannerConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    title: ''
})
const total = ref(0)
const bannerList = ref<Area[]>([])
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const add = () => {
    store.operate = '新增Banner内容'
    store.dialogVisible = true
}
const deleteCate = (i: number) => {
    bannerDeleteLists({id: i}).then(() => {
        getList();
    })
}
const getList = () => {
    loading.value = true
    bannerLists(pageInfo).then(res => {
        bannerList.value = res.data.content.lists.data
        total.value = res.data.content.lists.total
        store.place = res.data.content.place
        loading.value = false
    })
}

const editCate = (i: number) => {
    detailLists({id: i}).then(res => {
        store.operate = '编辑Banner内容'
        let obj = res.data.content
        store.id = obj.id
        store.name = obj.title
        store.banner_url = obj.url
        store.place_id = obj.place_id
        store.cover = obj.photo
        store.dialogVisible = true
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
