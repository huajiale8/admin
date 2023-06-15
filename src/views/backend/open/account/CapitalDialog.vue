<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {useAccountStore} from "/@/stores/open/account";
import {addAccountCapital} from "/@/api/backend/open/account";

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
    amount: undefined,
    desc: "",
});

const rules = reactive<FormRules>({
    amount: [
        {required: true, message: "请填写资金额度", trigger: "blur"},
    ],
    desc: [
        {required: true, message: "请填写业务类型", trigger: "blur"},
    ],
});

const onClose = () => {
    form.id = 0;
    formRef.value.resetFields();
};

const onOpen = () => {
    formRef.value.resetFields();
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            form.id = store.account.did as number;
            addAccountCapital(form).then(() => {
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
                增加资金
            </div>
        </template>
        <div class="ba-operate-form">
            <el-form
                label-width="auto" :model="form"
                :rules="rules" ref="formRef">
                <el-form-item label="资金额度" prop="amount">
                    <el-input v-model="form.amount" placeholder="增加的资金额度，如：100.00/0.01">
                        <template #prepend>￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="业务类型" prop="desc">
                    <el-input v-model="form.desc" placeholder="系统赠送/用户充值等"/>
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
    name: "CapitalDialog",
};
</script>
