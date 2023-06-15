<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {usePanoramaTaskStore} from "/@/stores/open/panorama/order";
import {ElMessage, ElScrollbar, ElTable, FormInstance, FormRules} from "element-plus";
import {confirmTaskCustom} from "/@/api/backend/open/order";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "onSuccess"]);

const dialogVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const store = usePanoramaTaskStore();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const form = reactive({
    id: 0,
    picture_ids: [],
});
const rules = reactive<FormRules>({
    picture_ids: [
        {required: true, message: "请选择至少一张图片", trigger: "blur"},
    ],
});

const onOpen = () => {
    setTimeout(() => {
        scrollbarRef.value.setScrollTop(0);
    }, 100);
};

const closeDialog = () => {
    emit("update:modelValue", false);
};

const tableRef = ref<InstanceType<typeof ElTable>>();

const handleSelectionChange = (val: { id: number, url: string }[]) => {
    form.picture_ids = val.map(pic => {
        return pic.id;
    });
};

const onSingleClick = (row: any) => {
    tableRef.value!.toggleRowSelection(row, undefined);
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            form.id = store.task.id as number;
            confirmTaskCustom(form).then(res => {
                emit("onSuccess");
                closeDialog();
            }).finally(() => {
                submitLoading.value = false;
            });
        }
    });
};

</script>

<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="true"
        v-model="dialogVisible"
        width="40%"
        @open="onOpen"
    >
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                查看照片
            </div>
        </template>
        <el-scrollbar ref="scrollbarRef" max-height="60vh">
            <div class="wrapper">
                <el-form
                    label-width="auto" :model="form"
                    :rules="rules" ref="formRef">
                    <el-form-item prop="picture_ids">
                        <el-table
                            ref="tableRef"
                            :data="store.pictures"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                            @row-click="onSingleClick"
                        >
                            <el-table-column type="selection" width="55"/>
                            <el-table-column prop="name" label="名称" min-width="120" show-overflow-tooltip>
                                <template #default="scope">
                                    <el-link
                                        type="primary" :href="scope.row.url" target="_blank"
                                        :underline="false">
                                        {{ scope["row"].name }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="缩略图" min-width="120">
                                <template #default="scope">
                                    <el-image style="height: 100px;width: 200px;" :src="scope.row.url"/>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="closeDialog">关闭</el-button>
            <el-button
                :loading="submitLoading"
                @click="onSubmit(formRef)"
                type="primary">
                选定
            </el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 0 20px;

    :deep(.el-form-item__content) {
        > div {
            width: 100%;
        }
    }
}
</style>

<script lang="ts">
export default {
    name: "CustomPickDialog",
};
</script>
