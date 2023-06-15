<script lang="ts" setup>
import {FormInstance, FormRules} from "element-plus";
import {computed, reactive, ref} from "vue";
import {takeTask} from "/@/api/backend/open/panorama/order";
import {usePanoramaTaskStore} from "/@/stores/open/panorama/order";

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
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const form = reactive({
    id: 0,
    mid: "",
});
const rules = reactive<FormRules>({
    mid: [
        {required: true, message: "请选择摄影师", trigger: "blur"},
    ],
});

const onClose = () => {
    form.id = 0;
    formRef.value.resetFields();
};

const onOpen = () => {
    form.id = store.task.id as number;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            form.id = store.task.id as number;
            takeTask(form).then(() => {
                emit("onSuccess");
                closeDialog();
            }).finally(() => {
                submitLoading.value = false;
            });
        }
    });
};

const closeDialog = () => {
    emit("update:modelValue", false);
};
</script>

<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="true"
        v-model="dialogVisible"
        width="30%"
        @open="onOpen"
        @closed="onClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                接单
            </div>
        </template>
        <div class="ba-operate-form">
            <el-form
                label-width="auto" :model="form"
                :rules="rules" ref="formRef">
                <el-form-item label="任务名称">
                    <div>{{ store.task.name }}&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ store.task["category"] }}</span>
                    </div>
                </el-form-item>
                <el-form-item label="联系人">
                    <div>{{ store.task["contact_name"] }}</div>
                </el-form-item>
                <el-form-item label="详细地址">
                    <div>
                        {{ store.task["province"] }}
                        {{ store.task["city"] }}
                        {{ store.task["county"] }}
                        {{ store.task["address"] }}
                    </div>
                </el-form-item>
                <el-form-item label="备注">
                    <div>{{ store.task["remarks"] }}</div>
                </el-form-item>
                <el-divider>套餐详情</el-divider>
                <el-form-item label="套餐名称">
                       <span
                           v-if="store.task['package_detail'] && store.task['package_detail'].name">
                                {{ store.task["package_detail"].name }}
                       </span>
                </el-form-item>
                <el-form-item label="套餐描述">
                        <span
                            v-if="store.task['package_detail'] && store.task['package_detail'].desc">
                                {{ store.task["package_detail"].desc }}
                        </span>
                </el-form-item>
                <el-form-item label="派单到摄影师" prop="mid">
                    <el-select v-model="form.mid">
                        <el-option
                            v-for="item in store['members']"
                            :label="item.nickname + '(' + item.phone + ')'"
                            :value="item.mid" :key="item.mid"/>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button @click="closeDialog">取消</el-button>
            <el-button
                :loading="submitLoading"
                @click="onSubmit(formRef)"
                type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
export default {
    name: "TakingDialog",
};
</script>

<style lang="scss" scoped>
.ba-operate-form {
    padding: 30px 80px;
}
</style>
