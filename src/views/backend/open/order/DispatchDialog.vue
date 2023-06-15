<script lang="ts" setup>

import {FormInstance, FormRules} from "element-plus";
import {computed, reactive, ref} from "vue";
import {dispatchTask} from "/@/api/backend/open/order";
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
    oid: "",
    cost: "",
});
const rules = reactive<FormRules>({
    oid: [
        {required: true, message: "请选择机构", trigger: "blur"},
    ],
    cost: [
        {required: true, message: "请输入外包金额", trigger: "blur"},
        {
            validator: (rule, value, callback) => {
                const costReg = /^\d+(\.\d{2})?$/;
                setTimeout(() => {
                    if (costReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error("请输入正确的外包金额"));
                    }
                }, 100);
            }, trigger: "blur",
        },
    ],
});

const onClose = () => {
    form.id = 0;
    formRef.value.resetFields();
};

const onOpen = () => {
    form.cost = store.task.cost.toString();
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            form.id = store.task.id as number;
            dispatchTask(form).then(() => {
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
        width="40%"
        @open="onOpen"
        @closed="onClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                派单
            </div>
        </template>
        <div class="ba-operate-form">
            <el-form
                label-width="auto" :model="form"
                :rules="rules" ref="formRef">
                <el-form-item label="派单到机构" prop="oid">
                    <el-select v-model="form.oid">
                        <el-option
                            v-for="item in store.organs" :label="item.org_name" :value="item.oid"
                            :key="item.oid"/>
                        <el-option label="众包自有平台" :value="999999999" :key="999999999"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="外包金额" prop="cost">
                    <el-input v-model="form.cost" placeholder="外包任务金额，如：100.00/0.01"/>
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
    name: "DispatchDialog",
};
</script>

<style lang="scss" scoped>

</style>
