<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh" :loading="loading"/>
                        <BtnAdd @click="add" v-if="auth('add')"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col :span="5" :offset="15">
                                <el-select v-model="pageInfo.type" placeholder="请选择代理商层级" clearable>
                                    <el-option :key="1" label="合作伙伴" :value="1"></el-option>
                                    <el-option :key="2" label="新看点集团" :value="2"></el-option>
                                    <el-option :key="3" label="818平台" :value="3"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4">
                                <el-input
                                    clearable
                                    placeholder="请输入代理商名称"
                                    v-model="pageInfo.name"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="getList"/>
            </div>
            <el-table v-loading="loading" :data="certList" border>
                <el-table-column
                    :fixed="true"
                    prop="name"
                    align="center"
                    label="名称"
                    min-width="150"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    prop="pic"
                    align="center"
                    label="图片"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                    <template #default="scope">
                        <el-image
                            :preview-teleported="true"
                            :preview-src-list="[scope.row.pic]"
                            style="width: 30px; height: 30px"
                            :src="scope.row.pic"
                            :initial-index="4"
                            fit="cover"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="source_name"
                    align="center"
                    label="资源包名称"
                    min-width="200"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    prop="source"
                    align="center"
                    label="资源包url"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                    <template #default="scope">
                        <el-tooltip :content="scope.row.source" placement="top">
                            <el-link
                                type="primary"
                                :underline="false"
                                target="_blank"
                                :href="scope.row.source">
                                详情
                            </el-link>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    align="center"
                    label="类型"
                    min-width="150"
                    :show-overflow-tooltip="true"
                >
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 1">合作伙伴</el-tag>
                        <el-tag v-if="scope.row.type === 2">新看点集团</el-tag>
                        <el-tag v-if="scope.row.type === 3">818平台</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="创建时间"
                    min-width="200"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    prop="amount"
                    align="center"
                    label="状态"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                    <template #default="scope" v-if="auth('enable')">
                        <CustomSwitch
                            v-if="auth('enable')"
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :enable="EnablePic"
                            :disable="disablePic"
                            :active-value=0
                            :inactive-value=1
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="60"
                >
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('detail')" @click="editCate(scope.row.id)"/>
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
import PopupForm from "/@/views/backend/udc/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {auth} from '/@/utils/common'
import {udcDetail, udcLists, udcManagementDisable, udcManagementEnable} from "/@/api/backend/udc/udc";
import {udcConfig} from "/@/stores/udc/udc";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";


const store = udcConfig()
const loading = ref(false)
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    name: '',
    type: ''
})
const total = ref(0)
const certList = ref<Area[]>([])

const refresh = () => {
    pageInfo.page = 1
    getList()
}
const editCate = (i: number) => {
    store.operate = '编辑UDC'
    udcDetail({id: i}).then(res => {
        let obj = res.data.content
        store.name = obj.name
        store.udcImg = obj.pic
        store.id = obj.id
        if (store.fileList === undefined) {
            store.fileList = []
        }
        store.fileList.push({name: obj.source_name, url: obj.source})
        store.source_name = obj.source_name
        store.source = obj.source
        store.type = obj.type
        store.dialogVisible = true
    })
}
const EnablePic = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        udcManagementEnable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disablePic = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        udcManagementDisable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};

const add = () => {
    store.operate = '新增UDC'
    store.dialogVisible = true
}
const getList = () => {
    loading.value = true
    udcLists(pageInfo).then(res => {
        certList.value = res.data.content.data
        total.value = res.data.content.total
        loading.value = false
    })
}

const getDialog = computed(() => {
    return store.refreshPage
})
onMounted(() => {
    getList()
});
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});
</script>
<style lang="scss" scoped>
</style>
