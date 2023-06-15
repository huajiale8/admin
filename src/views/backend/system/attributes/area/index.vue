<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-alert class="ba-table-alert" v-if="remark" :title="remark" type="info" show-icon/>
            <el-row class="m-b-10">
                <BtnRefresh @click="getList" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="addChildNode"/>
            </el-row>
            <div>
                <el-table
                    v-loading="loading"
                    :load="load"
                    ref="tableRef"
                    header-cell-class-name="table-header-cell"
                    class="ba-data-table w100"
                    :expand-row-keys="rowKey"
                    :data="areaList"
                    row-key="id"
                    lazy
                    border
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column prop="name" label="区域名称" :fixed="true"/>
                    <el-table-column
                        prop="amount"
                        align="center"
                        label="状态"
                        min-width="100"
                        :show-overflow-tooltip="true"
                    >
                        <template #default="scope">
                            <CustomSwitch
                                v-model="scope.row.status"
                                :id="scope.row.id"
                                :enable="EnablePic"
                                :disable="disablePic"
                                :active-value=0
                                :inactive-value=1
                            />
                        </template>
                    </el-table-column>
                    <el-table-column width="120" label="操作" align="center" fixed="right">
                        <template #default="scope">
                            <div class="operate_btn">
                                <BtnEdit v-if="auth('edit')" @click="editArea(scope.row)"/>
                                <CBtnAdd
                                    v-if="auth('add') && scope.row.level < 3"
                                    @click="addChildNode(scope.row)"
                                    title="新增区域"/>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {areaDisableApi, areaEnableApi, areaLists, UpdateArea} from "/@/api/backend/auth/attributes/area";
import {auth} from '/@/utils/common'
import {ElMessageBox, ElNotification} from "element-plus";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import CBtnAdd from "/@/components/buttons/CBtnAdd.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";

const remark = ref("");
const rowKey = ref(['0'])
const loading = ref(false)
const areaList = ref<Area[]>([])
const listMap = new Map();
const tableRef = ref();

const load = (tree: any, treeNode: any, resolve: any) => {
    listMap.set(tree.id, {tree, treeNode, resolve});
    areaLists(tree.id).then(res => {
        resolve(res.data.content);
    }).catch(error => {
        ElNotification({type: "error", message: error.message});
    });
}
const getList = () => {
    loading.value = true
    areaLists().then(res => {
        areaList.value = res.data.content
        loading.value = false
    })
}

const editArea = (row: any) => {
    ElMessageBox.prompt("编辑区域", "编辑", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValue: row.name,
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入区域";
        },
    }).then(({value}) => {
        let obj = {
            pid: row.pid,
            name: value,
            level: row.level,
            id: row.id
        }
        UpdateArea(obj).then(async () => {
            if (obj.pid === 0) {
                areaLists().then(response => {
                    areaList.value = response.data.content;
                });
            } else {
                await areaLists(obj.pid).then(res => {
                    refreshNode(obj.pid, res.data.content);
                });
            }
        })
    });
}
const EnablePic = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        areaEnableApi({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disablePic = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        areaDisableApi({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const addChildNode = (row?: any) => {
    ElMessageBox.prompt("新增区域", "新增", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入区域";
        },
    }).then(({value}) => {
        let pid = 0
        let level = 1
        if (row) {
            pid = row.id
            level = row.level + 1
        }
        let obj = {
            status: 0,
            pid,
            name: value,
            level,
            id: 0
        }
        UpdateArea(obj).then(async () => {
            if (obj.pid === 0) {
                areaLists().then(response => {
                    areaList.value = response.data.content;
                });
            } else {
                await areaLists(obj.pid).then(res => {
                    refreshNode(obj.pid, res.data.content);
                });
            }
        })
    });
}
const refreshNode = (pid: number, node: any) => {
    tableRef.value.store.states.lazyTreeNodeMap.value[pid] = node;
};
onMounted(() => {
    getList()
});
</script>
<style scoped lang="scss">
</style>
