<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import {auth} from "/@/utils/common";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import {
    completeTaskPackaging,
    completeTaskRevision,
    getTaskDispatching,
    getTaskList, getTaskOriginCheck,
    getTaskPackage, getTaskPackagingCheck, getTaskRevisionCheck, getTaskRevisionUpload, getTaskRevisionView,
    getTaskTaking,
    getTaskUpload, postTaskOnline, shootTaskOrigin,
} from "/@/api/backend/open/panorama/order";
import type { TabsPaneContext} from "element-plus";
import PopupForm from "/@/views/backend/open/panorama/order/popupForm.vue";
import DispatchDialog from "/@/views/backend/open/panorama/order/DispatchDialog.vue";
import {usePanoramaTaskStore} from "/@/stores/open/panorama/order";
import PackageDialog from "/@/views/backend/open/panorama/order/PackageDialog.vue";
import TakingDialog from "/@/views/backend/open/panorama/order/TakingDialog.vue";
import OriginUploadDialog from "/@/views/backend/open/panorama/order/OriginUploadDialog.vue";
import OriginCheckDialog from "/@/views/backend/open/panorama/order/OriginCheckDialog.vue";
import RevisionViewDialog from "/@/views/backend/open/panorama/order/RevisionViewDialog.vue";
import RevisionUploadDialog from "/@/views/backend/open/panorama/order/RevisionUploadDialog.vue";
import RevisionCheckDialog from "/@/views/backend/open/panorama/order/RevisionCheckDialog.vue";
import {ElMessageBox} from "element-plus";
import PackageCheckDialog from "/@/views/backend/open/panorama/order/PackageCheckDialog.vue";

type Query = {
    page: number,
    pageSize: number,
    total?: number,
    status: string,
    province_id?: number,
    city_id?: number,
    county_id?: number,
    name?: string,
    address?: string,
}

const store = usePanoramaTaskStore();
const dialogVisible = ref(false);
const dispatchDialogVisible = ref(false);
const packageDialogVisible = ref(false);
const takingDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const revisionUploadDialogVisible = ref(false);
const originCheckDialogVisible = ref(false);
const revisionViewDialogVisible = ref(false);
const revisionCheckDialogVisible = ref(false);
const packageCheckDialogVisible = ref(false);
const task_list = ref([]);
const tableLoading = ref(false);
const areaArr = ref<number[]>([]);
const active = ref(0);
const queryInfo = ref<Query>({page: 1, pageSize: 10, status: "0"});

const refresh = () => {
    queryInfo.value.page = 1
    refreshList()
}
const refreshList = (params?: { query?: Query, loading?: boolean }) => {
    params = params || {};
    (params.loading === undefined || params.loading === true) && (tableLoading.value = true);
    getTaskList(params.query || queryInfo.value).then(res => {
        task_list.value = res.data.content.data;
        queryInfo.value.total = res.data.content.total;
        (params.loading === undefined || params.loading === true) && (tableLoading.value = false);
    });
};

const onAreaChange = () => {
    queryInfo.value.province_id = null;
    queryInfo.value.city_id = null;
    queryInfo.value.county_id = null;
    if (areaArr.value) {
        queryInfo.value.province_id = areaArr.value[0] || null;
        queryInfo.value.city_id = areaArr.value[1] || null;
        queryInfo.value.county_id = areaArr.value[2] || null;
    }
};

const handleTabClick = (name:any) => {
    queryInfo.value.status = name.toString();
    queryInfo.value.page = 1;
    queryInfo.value.province_id = undefined;
    queryInfo.value.city_id = undefined;
    queryInfo.value.county_id = undefined;
    queryInfo.value.name = undefined;
    queryInfo.value.address = undefined;
    refreshList();
};

const onAdd = () => {
    dialogVisible.value = true;
};

const dispatching = (id: number) => {
    getTaskDispatching({id}).then(res => {
        store.organs = res.data.content.organs;
        store.task = task_list.value.find(task => task.id === id);
        dispatchDialogVisible.value = true;
    });
};

const onPackage = (id: number) => {
    getTaskPackage({id}).then(res => {
        store.task = task_list.value.find(task => task.id === id);
        store.info = res.data.content;
        packageDialogVisible.value = true;
    });
};

const taking = (id: number) => {
    getTaskTaking({id}).then(res => {
        store.task = res.data.content.order;
        store.members = res.data.content.members;
        takingDialogVisible.value = true;
    });
};

const upload = (id: number) => {
    getTaskUpload({id}).then(res => {
        store.task = res.data.content;
        uploadDialogVisible.value = true;
    });
};

const shoot = (id: number) => {
    shootTaskOrigin({id}).then(() => {
        refreshList();
    });
};

const originCheck = (id: number) => {
    getTaskOriginCheck({id}).then(res => {
        store.task = res.data.content.order;
        originCheckDialogVisible.value = true;
    });
};

const revisionView = (id: number) => {
    getTaskRevisionView({id}).then(res => {
        store.task = res.data.content.order;
        store.pictures = res.data.content.pictures;
        store.fileList = res.data.content.fileList;
        revisionViewDialogVisible.value = true;
    });
};

const revisionUpload = (id: number) => {
    getTaskRevisionUpload({id}).then(res => {
        store.task = res.data.content;
        revisionUploadDialogVisible.value = true;
    });
};

const revision = (id: number) => {
    completeTaskRevision({id}).then(() => {
        refreshList();
    });
};

const revisionCheck = (id: number) => {
    getTaskRevisionCheck({id}).then(res => {
        store.task = res.data.content.order;
        store.pictures = res.data.content.pictures;
        store.fileList = res.data.content.fileList;
        revisionCheckDialogVisible.value = true;
    });
};

const packaging = (id: number) => {
    const reg = new RegExp("^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&amp;%\\$\\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,4})(\\:[0-9]+)?(/[^/][a-zA-Z0-9\\.\\,\\?\\'\\\\/\\+&amp;%\\$#\\=~_\\-@]*)*$");
    ElMessageBox.prompt("<b>VR源地址：</b>上传到SVN或者GIT的地址<br/><b style='opacity: 0;'>VR源地址：</b>以 http://, https://, ftp:// 开头", "完成封装", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        inputPattern: reg,
        inputErrorMessage: "请输入正确的url地址",
    })
        .then(({value}) => {
            completeTaskPackaging({id, source_path: value}).then(() => {
                refreshList();
            });
        });
};

const packagingCheck = (id: number) => {
    getTaskPackagingCheck({id}).then(res => {
        store.task = res.data.content;
        packageCheckDialogVisible.value = true;
    });
};

const online = (id: number) => {
    const reg = new RegExp("^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&amp;%\\$\\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,4})(\\:[0-9]+)?(/[^/][a-zA-Z0-9\\.\\,\\?\\'\\\\/\\+&amp;%\\$#\\=~_\\-@]*)*$");
    ElMessageBox.prompt("<b>上线地址：</b>以 http://, https://, ftp:// 开头", "上线", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        inputPattern: reg,
        inputErrorMessage: "请输入正确的url地址",
    })
        .then(({value}) => {
            postTaskOnline({id, panorama_url: value}).then(() => {
                refreshList();
            });
        });
};

const colWidth = () => {
    switch (active.value) {
        case 0:
        case 1:
            return "240px";
        case 2:
        case 4:
        case 5:
        case 7:
            return "360px";
        default :
            return "120px";
    }
};

const init = () => {
    refreshList({});
};

onMounted(() => {
    init();
});
</script>

<template>
    <div class="default-main ba-table-box">
        <PopupForm v-model="dialogVisible" @on-success="refreshList()"/>
        <DispatchDialog v-model="dispatchDialogVisible" @on-success="refreshList()"/>
        <PackageDialog v-model="packageDialogVisible"/>
        <TakingDialog v-model="takingDialogVisible" @on-success="refreshList()"/>
        <OriginUploadDialog v-model="uploadDialogVisible" @on-success="refreshList()"/>
        <OriginCheckDialog v-model="originCheckDialogVisible" @on-success="refreshList()"/>
        <RevisionViewDialog v-model="revisionViewDialogVisible" @on-success="refreshList()"/>
        <RevisionUploadDialog v-model="revisionUploadDialogVisible" @on-success="refreshList()"/>
        <RevisionCheckDialog v-model="revisionCheckDialogVisible" @on-success="refreshList()"/>
        <PackageCheckDialog v-model="packageCheckDialogVisible" @on-success="refreshList()"/>
        <el-card >
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh :loading="tableLoading" @click="refresh"/>
                        <BtnAdd v-if="auth('add')" @click="onAdd"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10" justify="space-between">
                            <el-col  :span="5" :offset="9">
                                <AreaCascader v-model="areaArr" @change="onAreaChange"/>
                            </el-col>
                            <el-col :span="5">
                                <el-input v-model="queryInfo.name" clearable placeholder="请输入任务名称"/>
                            </el-col>
                            <el-col :span="5">
                                <el-input v-model="queryInfo.address" clearable placeholder="请输入详细地址"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="refreshList({})"/>
            </div>
            <el-row class="m-b-10">
                <el-col>
                    <el-tabs v-model="active" @tab-change="handleTabClick">
                        <el-tab-pane label="待处理" :name="0"></el-tab-pane>
                        <el-tab-pane label="已派单" :name="1"></el-tab-pane>
                        <el-tab-pane label="已接单" :name="2"></el-tab-pane>
                        <el-tab-pane label="原片审核" :name="3"></el-tab-pane>
                        <el-tab-pane label="原片重拍" :name="5"></el-tab-pane>
                        <el-tab-pane label="待修图" :name="4"></el-tab-pane>
                        <el-tab-pane label="成片审核" :name="6"></el-tab-pane>
                        <el-tab-pane label="成片重修" :name="7"></el-tab-pane>
                        <el-tab-pane label="待封装" :name="8"></el-tab-pane>
                        <el-tab-pane label="封装审核" :name="9"></el-tab-pane>
                        <el-tab-pane label="待重新封装" :name="11"></el-tab-pane>
                        <el-tab-pane label="待上线" :name="10"></el-tab-pane>
                        <el-tab-pane label="已上线" :name="12"></el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
            <el-table v-loading="tableLoading" :data="task_list" border>
                <el-table-column
                    :show-overflow-tooltip="true" align="center" fixed label="任务名称" width="150"
                    prop="name"/>
                <el-table-column
                    align="center" label="联系人" prop="contact_name"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center" label="联系电话" width="120" prop="contact_information"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center" label="省份" prop="province"
                    :show-overflow-tooltip="true"/>
                <el-table-column align="center" label="城市" prop="city" :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center" label="区域" width="100" prop="county"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center" label="详细地址" width="180" prop="address"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center" fixed="right" label="操作"
                    :width="colWidth()"
                >
                    <template #default="scope">
                        <span v-if="active === 0">
                            <el-button
                                v-if="auth('dispatching')" type="primary"
                                @click="dispatching(scope.row.id)">派单</el-button>
                            <el-button
                                v-if="auth('package')" type="success"
                                @click="onPackage(scope.row.id)">查看套餐</el-button>
                        </span>
                        <span v-if="active === 1">
                            <el-button
                                v-if="auth('taking')" type="primary"
                                @click="taking(scope.row.id)">接单</el-button>
                            <el-button
                                v-if="auth('package')" type="success"
                                @click="onPackage(scope.row.id)">查看套餐</el-button>
                        </span>
                        <span v-if="active === 2">
                            <el-button
                                v-if="auth('upload')" type="primary"
                                @click="upload(scope.row.id)">上传图片</el-button>
                            <el-popconfirm
                                title="确认已经拍摄完成并上传了原图？"
                                width="270"
                                @confirm="shoot(scope.row.id)">
                                    <template #reference>
                                        <el-button
                                            v-if="auth('shoot')" type="warning"
                                        >完成拍摄</el-button>
                                    </template>
                            </el-popconfirm>
                            <el-button
                                v-if="auth('package')" type="success"
                                @click="onPackage(scope.row.id)">查看套餐</el-button>
                        </span>
                        <span v-if="active === 3">
                            <el-button
                                v-if="auth('origin/check')" type="primary"
                                @click="originCheck(scope.row.id)">审核原片</el-button>
                        </span>
                        <span v-if="active === 4">
                            <el-button
                                v-if="auth('revision/view')" type="primary"
                                @click="revisionView(scope.row.id)">查看照片</el-button>
                            <el-button
                                v-if="auth('revision/upload')" type="primary"
                                @click="revisionUpload(scope.row.id)">
                                上传成片
                            </el-button>
                            <el-popconfirm
                                title="确认已经完成图片优化及成片上传处理？"
                                width="300"
                                @confirm="revision(scope.row.id)">
                                <template #reference>
                                    <el-button v-if="auth('revision')" type="warning">
                                        完成修图
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </span>
                        <span v-if="active === 5">
                            <el-button
                                v-if="auth('upload')" type="primary"
                                @click="upload(scope.row.id)">上传图片</el-button>
                            <el-popconfirm
                                title="确认已经拍摄完成并上传了原图？"
                                width="270"
                                @confirm="shoot(scope.row.id)">
                                    <template #reference>
                                        <el-button
                                            v-if="auth('shoot')" type="warning"
                                        >完成拍摄</el-button>
                                    </template>
                            </el-popconfirm>
                            <el-button
                                v-if="auth('package')" type="success"
                                @click="onPackage(scope.row.id)">查看套餐</el-button>
                        </span>
                        <span v-if="active === 6">
                            <el-button
                                v-if="auth('revision/check')" type="primary"
                                @click="revisionCheck(scope.row.id)">
                                审核成片
                            </el-button>
                        </span>
                        <span v-if="active === 7">
                            <el-button
                                v-if="auth('revision/view')" type="primary"
                                @click="revisionView(scope.row.id)">查看照片</el-button>
                            <el-button
                                v-if="auth('revision/upload')" type="primary"
                                @click="revisionUpload(scope.row.id)">
                                上传成片
                            </el-button>
                            <el-button
                                v-if="auth('revision')" type="warning"
                                @click="revision(scope.row.id)">完成修图</el-button>
                        </span>
                        <span v-if="active === 8">
                            <el-button
                                v-if="auth('packaging')" type="primary"
                                @click="packaging(scope.row.id)">完成封装</el-button>
                        </span>
                        <span v-if="active === 9">
                            <el-button
                                v-if="auth('packaging/check')" type="primary"
                                @click="packagingCheck(scope.row.id)">封装审核</el-button>
                        </span>
                        <span v-if="active === 10">
                            <el-button
                                v-if="auth('online')" type="primary"
                                @click="online(scope.row.id)">上线</el-button>
                        </span>
                        <span v-if="active === 11">
                            <el-button
                                v-if="auth('packaging')" type="primary"
                                @click="packaging(scope.row.id)">完成封装</el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:page="queryInfo.page"
                v-model:pagesize="queryInfo.pageSize"
                @render="refreshList"
                :total="queryInfo.total">
            </paging-module>
        </el-card>
    </div>
</template>

<script lang="ts">
export default {
    name: "index.vue",
};
</script>

<style lang="scss" scoped>
span {
    box-sizing: border-box;
}
</style>
