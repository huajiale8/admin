<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {ElMessage, ElScrollbar} from "element-plus";
import {saveOpenOrdersUrl} from "/@/api/backend/open/orders";
import {useOpenOrderStore} from "/@/stores/open/orders";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "onSuccess"]);

const store = useOpenOrderStore();
const orderFormRef = ref<FormInstance>();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const submitLoading = ref(false);
const orderForm = reactive({
    id: 0,
    name: "",
    expire_time: "",
    type: 2,
    desc: "",
});
const orderRules = reactive<FormRules>({
    name: [
        {required: true, message: "请输入订单名称", trigger: "blur"},
    ],
    expire_time: [
        {required: true, message: "请选择订单截止日期", trigger: "blur"},
    ],
    desc: [
        {required: true, message: "请输入订单描述", trigger: "blur"},
    ],
});

const dialogVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const onClose = () => {
    orderForm.id = 0;
    orderFormRef.value.resetFields();
    store.status = "add";
};

const onOpen = () => {
    if (store.status === "edit") {
        orderForm.id = store.order.id;
        orderForm.name = store.order.name;
        orderForm.expire_time = store.order.expire_time;
        orderForm.desc = store.order.desc;
    }
    setTimeout(() => {
        scrollbarRef.value.setScrollTop(0);
    }, 100);
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            saveOpenOrdersUrl(orderForm).then(res => {
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
                {{store.status === "add"?'新增':'编辑'}}订单
            </div>
        </template>
        <el-scrollbar max-height="60vh" ref="scrollbarRef">
            <div class="ba-operate-form">
                <el-form
                    label-position="right" label-width="auto" :model="orderForm"
                    :rules="orderRules" ref="orderFormRef">
                    <el-form-item label="订单名称" prop="name">
                        <el-input v-model="orderForm.name" placeholder="订单名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="订单说明" prop="desc">
                        <el-input v-model="orderForm.desc" placeholder="订单说明" clearable type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="截止日期" prop="expire_time">
                        <el-date-picker
                            v-model="orderForm.expire_time"
                            type="datetime"
                            placeholder="选择日期"
                            format="YYYY-MM-DD hh:mm:ss"
                            value-format="YYYY-MM-DD hh:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="closeDialog">取消</el-button>
            <el-button
                :loading="submitLoading"
                @click="onSubmit(orderFormRef)"
                type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>

</style>
