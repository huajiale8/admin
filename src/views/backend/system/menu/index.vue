<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="getMenuList" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table
                v-loading="loading"
                :load="load"
                ref="tableRef"
                class="ba-data-table w100"
                header-cell-class-name="table-header-cell"
                :data="lists"
                row-key="id"
                lazy
                border
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column
                    :show-overflow-tooltip="true"
                    min-width="200"
                    prop="title"
                    label="标题"
                    header-align="center"
                    fixed="left"/>
                <el-table-column label="图标" align="center" min-width="60">
                    <template #default="scope">
                        <Icon :color="config.getColorVal('menuColor')"
                              :name="scope.row.icon ? scope.row.icon : config.layout.menuDefaultIcon"/>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="url"
                    label="URL"
                    min-width="200"
                    :show-overflow-tooltip="true"
                    header-align="center">
                    <template #default="scope">
                        <span
                            @dblclick="editCell(scope.row.id)"
                            v-if="col_id !== scope.row.id">
                            {{
                                scope.row.url
                            }}
                        </span>
                        <el-input v-else v-model="scope.row.url" @blur="editUrl(scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" min-width="110">
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 'menu_dir'" type="warning">菜单目录</el-tag>
                        <el-tag v-if="scope.row.type === 'menu'" type="success">菜单项</el-tag>
                        <el-tag v-if="scope.row.type === 'button'">页面按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" min-width="60" label="排序" align="center"/>
                <el-table-column prop="updated_at" label="修改时间" align="center" min-width="180"/>
                <el-table-column label="是否显示" align="center" min-width="100">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_show === 0" type="success">显示</el-tag>
                        <el-tag v-else type="info">隐藏</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" min-width="80">
                    <template #default="scope">
                        <CustomSwitch
                            v-model="scope.row.status"
                            :id="scope.row.id"
                            :activeValue="0"
                            :inActiveValue="1"
                            :enable="enable"
                            :disable="disable"/>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" header-align="center" width="100">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="editMenu(scope.row.id)"/>
                            <CBtnAdd
                                v-if="auth('add') && scope.row.type !== 'button'"
                                @click="addChildNode(scope.row.id)"
                                title="添加子节点"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <popup-form @refreshNode="refreshNode"/>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {auth} from "/@/utils/common";
import {MenuDetailApi, MenuEnableApi, menuLists, MenuUpdateApi,} from "/@/api/backend/auth/menu";
import {ElNotification} from "element-plus";
import {useConfig} from "/@/stores/config";
import _ from "lodash";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CBtnAdd from "/@/components/buttons/CBtnAdd.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import {menuConfig} from "/@/stores/system/menu";
import PopupForm from "/@/views/backend/system/menu/popupForm.vue";

const tableRef = ref();
const store = menuConfig()
const config = useConfig();
const lists = ref([]);
const col_id = ref(0)
const loading = ref(false);
const listMap = new Map();
const topMenoOption: OptionsType = {
    id: 0,
    is_show: 0,
    icon: "",
    leaf: true,
    level: 1,
    order: "1",
    pid: 0,
    sort: 1,
    status: 0,
    tips: null,
    title: "顶层菜单",
    url: "",
    type: "",
    component: "",
};
const add = () => {
    store.operate = '新增菜单'
    store.dialogVisible = true
}
const editCell = (id: number) => {
    col_id.value = id
}
const editUrl = (row: any) => {
    col_id.value = 0
    MenuUpdateApi({
        id: row.id,
        is_show: row.is_show,
        icon: row.icon,
        leaf: row.leaf,
        level: row.level,
        order: row.order,
        pid: row.pid,
        sort: row.sort,
        status: row.status,
        tips: row.tips,
        title: row.title,
        url: row.url,
        type: row.type,
        component: row.component,
    }).then(() => {
    })
}

const enable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        MenuEnableApi({id}, 'enable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disable = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        MenuEnableApi({id}, 'disable').then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const getMenuList = () => {
    loading.value = true;
    menuLists().then(response => {
        lists.value = response.data.content;
        store.options = _.cloneDeep(response.data.content);
        store.options.unshift(topMenoOption);
        loading.value = false;
    }).catch(error => {
        ElNotification({type: "error", message: error.message});
    });
};
const load = (tree: any, treeNode: any, resolve: any) => {
    listMap.set(tree.id, {tree, treeNode, resolve});
    menuLists(tree.id).then(response => {
        resolve(response.data.content);
    }).catch(error => {
        ElNotification({type: "error", message: error.message});
    });
};
const editMenu = (id: number) => {
    MenuDetailApi({id}).then(res => {
        store.operate = '编辑菜单节点'
        let obj = res.data.content.info;
        store.id = obj.id;
        store.pid = obj.pid;
        store.title = obj.title;
        store.url = obj.url;
        store.type = obj.type;
        store.sort = obj.sort;
        store.is_show = obj.is_show;
        store.tips = obj.tips;
        store.icon = obj.icon;
        store.component = obj.component;
        store.selectedOptions = res.data.content.selectedOptions;
        store.dialogVisible = true;
    });
};
const addChildNode = (id: number) => {
    MenuDetailApi({id: id, type: "add"}).then(res => {
        store.operate = "添加子节点";
        store.selectedOptions = res.data.content.selectedOptions;
        store.pid = id;
        store.dialogVisible = true;
    });
};
const refreshNode = (pid: number, node: any) => {
    tableRef.value.store.states.lazyTreeNodeMap.value[pid] = node;
};
onMounted(() => {
    getMenuList();
});
</script>

<style scoped lang="scss">
</style>
