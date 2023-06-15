<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        v-model="store.dialogVisible"
        @open="onDialogOpen"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                {{ store.operate }}
            </div>
        </template>
        <el-scrollbar class="ba-table-form-scrollbar">
            <div class="ba-operate-form">
                <el-form
                    v-if="store.dialogVisible" ref="formRef"
                    :model="store" :rules="rules"
                    label-position="right" label-width="auto">
                    <el-form-item label="父级菜单" prop="pid">
                        <el-cascader
                            style="width: 100%;"
                            v-model="store.selectedOptions"
                            :options="store.options"
                            :props="props"
                            :key="store.isResourceShow"
                            @change="handleChange"
                            change-on-select
                            :clearable="true"
                            placeholder="请选择父级菜单">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="菜单类型" prop="type">
                        <el-radio-group v-model="store.type">
                            <el-radio label="menu_dir">菜单目录</el-radio>
                            <el-radio label="menu">菜单项</el-radio>
                            <el-radio label="button">页面按钮</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="菜单标题" prop="title">
                        <el-input v-model="store.title" placeholder="菜单标题"></el-input>
                    </el-form-item>
                    <el-form-item label="URL地址" prop="url">
                        <el-input v-model="store.url" placeholder="URL地址"></el-input>
                    </el-form-item>
                    <el-form-item label="ICON图标" v-if="store.type !== 'button'">
                        <IconSelector
                            :showIconName="true"
                            :modelValue="store.icon"
                            @update:modelValue="updateInputValue"/>
                    </el-form-item>
                    <el-form-item v-if="store.type === 'menu'" label="组件地址" prop="component">
                        <el-input v-model="store.component" placeholder="URL地址"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示" prop="is_show">
                        <el-radio-group v-model="store.is_show">
                            <el-radio :label="0">显示</el-radio>
                            <el-radio :label="1">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model="store.sort" placeholder="排序"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="4" v-model="store.tips" placeholder="备注"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button v-if="auth('update')"
                       :loading="submitLoading" @click="onSubmit(formRef)" type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {CascaderProps, ElForm, FormInstance} from 'element-plus'
import {reactive, ref,} from "vue";
import {auth} from "/@/utils/common";
import {menuConfig} from "/@/stores/system/menu";
import {menuLists, MenuUpdateApi} from "/@/api/backend/auth/menu";
import IconSelector from "/@/components/baInput/components/iconSelector.vue";
import {validatorUrl} from "/@/utils/validate";

const emit = defineEmits(['refreshNode'])
const submitLoading = ref(false);
const oldPid = ref();
const formRef = ref<InstanceType<typeof ElForm>>();
const store = menuConfig()
const rules = reactive({
    pid: [
        {required: true, message: "请选择父级菜单", trigger: "blur"},
    ],
    title: [
        {required: true, message: "请填写菜单名称", trigger: "blur"},
        {max: 10, message: "菜单名称不能超过10个字符", trigger: "blur"},
    ],
    url: [
        {required: true, message: "请填写URL地址", trigger: "blur"},
        {validator: validatorUrl, trigger: "blur"},
    ],
    component: [
        {required: true, message: "请填写组件URL地址", trigger: "blur"},
    ],
    type: [
        {required: true, message: "请选择菜单类型", trigger: "blur"},
    ],
    sort: [
        {required: true, message: "请填写菜单排序", trigger: "blur"},
    ],
});
const lists = ref([]);
const handleChange = (options: []) => {
    store.pid = options ? options.at(-1) : undefined;
};

const updateInputValue = (icon: string) => {
    store.icon = icon;
};
const onDialogOpen = () => {
    oldPid.value = store.pid;
};
const props: CascaderProps = {
    value: "id",
    label: "title",
    lazy: true,
    leaf: "leaf",
    checkStrictly: true,
    lazyLoad(node, resolve: any) {
        const {data} = node;
        menuLists(data.id as number).then(res => {
            const list = res.data.content;
            resolve(list);
        });
    },
};
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            MenuUpdateApi({
                id: store.id,
                is_show: store.is_show,
                icon: store.icon,
                leaf: store.leaf,
                level: store.level,
                order: store.order,
                pid: store.pid,
                sort: store.sort,
                status: store.status,
                tips: store.tips,
                title: store.title,
                url: store.url,
                type: store.type,
                component: store.component,
            }).then(async () => {
                if (store.pid === 0 || oldPid.value == 0) {
                    menuLists().then(response => {
                        lists.value = response.data.content;
                    });
                }
                await menuLists(store.pid).then(res => {
                    emit('refreshNode', store.pid, res.data.content)
                });
                if (store.pid !== oldPid.value) {
                    await menuLists(oldPid.value).then(res => {
                        emit('refreshNode', oldPid.value, res.data.content)
                    });
                }
                store.dialogVisible = false;
            }).finally(()=>{
                submitLoading.value = false;
            }
               
            )
        }
    });
};
const handleClose = () => {
    store.id = 0;
    store.pid = 0;
    store.title = "";
    store.url = "";
    store.type = "menu_dir";
    store.sort = 50;
    store.is_show = 0;
    store.tips = "";
    store.icon = "";
    store.component = "";
    store.dialogVisible = false;
    store.selectedOptions = [];
};
</script>

<style scoped lang="scss"></style>
