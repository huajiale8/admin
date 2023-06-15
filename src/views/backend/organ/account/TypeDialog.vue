<script lang="ts" setup>

import {computed, reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {useAccountStore} from "/@/stores/open/account";
import {setAccountType} from "/@/api/backend/organ/account";

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

const store = useAccountStore();
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const form = reactive({
    id: 0,
    level: undefined,
    discount: 0,
});
const level = [
    {id: 1, label: "金牌代理商"},
    {id: 2, label: "银牌代理商"},
    {id: 3, label: "铜牌代理商"},
];
const rules = reactive<FormRules>({
    level: [
        {required: true, message: "请选择代理商级别", trigger: "blur"},
    ],
    discount: [
        {required: true, message: "请设置代理商折扣", trigger: "blur"},
    ],
});

const onClose = () => {
    form.id = 0;
    formRef.value.resetFields();
};

const onOpen = () => {
    form.level = store.account.level;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            form.id = store.account.oid as number;
            setAccountType(form).then(() => {
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
                设置账户类型
            </div>
        </template>
        <div class="ba-operate-form">
            <el-form
                label-position="left"
                label-width="auto" :model="form"
                :rules="rules" ref="formRef">
                <el-form-item label="代理商级别" prop="level">
                    <el-select v-model="form.level">
                        <el-option
                            v-for="item in level" :label="item.label" :value="item.id"
                            :key="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格折扣" prop="discount">
                    <el-slider  :show-tooltip="false" :step="0.1" :max="10" v-model="form.discount" show-input  />
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

<style lang="scss" scoped>

</style>

<script lang="ts">
export default {
    name: "TypeDialog",
};
</script>
