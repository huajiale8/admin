<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {ElScrollbar} from "element-plus";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import {orderUpdate} from "/@/api/backend/order/outsource";
import {useOutsourceStore} from "/@/stores/order/outsource";

const props = defineProps(["modelValue", "categories", "typeList"]);
const emit = defineEmits(["update:modelValue", "onSuccess"]);

const store = useOutsourceStore();
const orderFormRef = ref<FormInstance>();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const areaArr = ref([]);
const submitLoading = ref(false);
const orderForm = reactive({
    id: 0,
    name: "",
    url: "",
    category: "",
    type: "",
    distribution: "",
    province_id: 0,
    city_id: 0,
    county_id: 0,
    price: undefined,
    server_end_time: "",
    scene_num: 0,
    scene_num_final: 0,
});
const orderRules = reactive<FormRules>({
    name: [
        {required: true, message: "请输入客户名称", trigger: "blur"},
    ],
    url: [
        {required: true, message: "请输项目地址", trigger: "blur"},
    ],
    category: [
        {required: true, message: "请选择项目所属类目", trigger: "blur"},
    ],
    type: [
        {required: true, message: "请选择项目服务类型", trigger: "blur"},
    ],
    distribution: [
        {required: true, message: "请输入经销商名称", trigger: "blur"},
    ],
    price: [
        {required: true, message: "请输入订单金额", trigger: "blur"},
    ],
    server_end_time: [
        {required: true, message: "请选择服务到期日", trigger: "blur"},
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
        orderForm.url = store.order.url;
        orderForm.category = store.order.category;
        orderForm.type = store.order.type;
        orderForm.distribution = store.order.distribution;
        orderForm.province_id = store.order.province_id;
        orderForm.city_id = store.order.city_id;
        orderForm.county_id = store.order.county_id;
        orderForm.price = parseFloat(store.order.price);
        orderForm.server_end_time = store.order.server_end_time;
        orderForm.scene_num = parseInt(store.order.scene_num);
        orderForm.scene_num_final = parseInt(store.order.scene_num_final);
    }
    setTimeout(() => {
        scrollbarRef.value.setScrollTop(0);
    }, 100);
};

const onAreaChange = () => {
    orderForm.province_id = null;
    orderForm.city_id = null;
    orderForm.county_id = null;
    if (areaArr.value) {
        orderForm.province_id = areaArr.value[0] || null;
        orderForm.city_id = areaArr.value[1] || null;
        orderForm.county_id = areaArr.value[2] || null;
    }
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            orderUpdate(orderForm).then(() => {
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
                新增订单
            </div>
        </template>
        <el-scrollbar max-height="60vh" ref="scrollbarRef">
            <div class="ba-operate-form">
                <el-form
                    label-position="right" label-width="auto" :model="orderForm"
                    :rules="orderRules" ref="orderFormRef">
                    <el-form-item label="客户名称" prop="name">
                        <el-input v-model="orderForm.name" placeholder="客户名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="项目地址" prop="url">
                        <el-input v-model="orderForm.url" placeholder="项目地址" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="所属类目" prop="category">
                        <el-select
                            v-model="orderForm.category" placeholder="请选择所属类目"
                            clearable>
                            <el-option
                                v-for="item in categories" :label="item.name" :value="item.name"
                                :key="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务类型" prop="type">
                        <el-select v-model="orderForm.type" placeholder="请选择服务类型" clearable>
                            <el-option
                                v-for="item in typeList" :label="item.name" :value="item.name"
                                :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="经销商" prop="distribution">
                        <el-input v-model="orderForm.distribution" placeholder="经销商名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="所在区域">
                        <AreaCascader v-model="areaArr" @change="onAreaChange"/>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="订单金额" prop="price">
                                <el-input-number v-model="orderForm.price" :min="0" label="订单金额"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务到期日" prop="server_end_time">
                                <el-date-picker
                                    v-model="orderForm.server_end_time"
                                    type="date"
                                    placeholder="选择服务到期日"
                                    format="YYYY-MM-DD"
                                    value-format="YYYY-MM-DD">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="拍摄场景数">
                                <el-input-number
                                    v-model="orderForm.scene_num" :min="0"
                                    label="拍摄场景数"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="后期场景数">
                                <el-input-number
                                    v-model="orderForm.scene_num_final" :min="0"
                                    label="后期场景数"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
