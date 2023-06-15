<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import {orderUpdate} from "/@/api/backend/order/stats";
import {ElScrollbar} from "element-plus";

const props = defineProps(["modelValue", "categories", "platforms"]);
const emit = defineEmits(["update:modelValue", "onSuccess"]);

const orderFormRef = ref<FormInstance>();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const areaArr = ref([]);
const submitLoading = ref(false);
const source_list = [{value: 1, label: "平台"}, {value: 2, label: "分销"}, {value: 3, label: "直客"}];
const orderForm = reactive({
    id: 0,
    name: "",
    contacts: "",
    number: "",
    url: "",
    category: "",
    source: "",
    distribution: "",
    province_id: 0,
    city_id: 0,
    county_id: 0,
    address: "",
    price: "",
    server_begin_time: "",
    server_end_time: "",
    order_date_time: "",
    platform: [],
});
const checkNumber = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error("不可为空"));
    }
    const reg = /[^(\-|\+)?\d.]/g; //控制只能输入正数、负数、浮点数
    if (value && new RegExp(reg).test(value)) {
        return callback(new Error("请输入正确的数字值"));
    }
    return callback();
};
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
    source: [
        {required: true, message: "请选择项目来源渠道", trigger: "blur"},
    ],
    distribution: [
        {required: true, message: "请输入经销商名称", trigger: "blur"},
    ],
    price: [
        {validator: checkNumber, trigger: "blur"},
        {required: true, message: "请输入订单金额", trigger: "blur"},
    ],
    server_end_time: [
        {required: true, message: "请选择服务到期日", trigger: "blur"},
    ],
    order_date_time: [
        {required: true, message: "请选择订单时间", trigger: "blur"},
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
};

const onOpen = () => {
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
                submitLoading.value = false;
                emit("onSuccess");
                closeDialog();
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
                    label-width="auto"
                    :model="orderForm"
                    :rules="orderRules" ref="orderFormRef">
                    <el-form-item label="客户名称" prop="name">
                        <el-input v-model="orderForm.name" placeholder="客户名称" clearable/>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-input v-model="orderForm.contacts" placeholder="联系人" clearable/>
                    </el-form-item>
                    <el-form-item label="联系方式">
                        <el-input v-model="orderForm.number" placeholder="联系方式" clearable/>
                    </el-form-item>
                    <el-form-item label="项目地址" prop="url">
                        <el-input v-model="orderForm.url" placeholder="项目地址" clearable/>
                    </el-form-item>
                    <el-form-item label="所属类目" prop="category">
                        <el-select
                            v-model="orderForm.category" placeholder="请选择所属类目"
                            clearable>
                            <el-option
                                v-for="item in categories" :label="item.name" :value="item.name"
                                :key="item.name"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源渠道" prop="source">
                        <el-select
                            v-model="orderForm.source" placeholder="请选择来源渠道"
                            clearable>
                            <el-option
                                v-for="item in source_list" :label="item.label" :value="item.label"
                                :key="item.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="经销商" prop="distribution">
                        <el-input v-model="orderForm.distribution" placeholder="经销商名称" clearable/>
                    </el-form-item>
                    <el-form-item label="推广平台">
                        <el-select
                            v-model="orderForm.platform" multiple
                            placeholder="请选择推广平台(多选)" clearable>
                            <el-option
                                v-for="item in platforms" :label="item.name" :value="item.name"
                                :key="item.name"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在区域">
                        <AreaCascader v-model="areaArr" @change="onAreaChange"/>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-input v-model="orderForm.address" placeholder="详细地址" clearable/>
                    </el-form-item>
                    <el-form-item label="订单金额" prop="price">
                        <el-input v-model="orderForm.price" placeholder="订单金额" clearable/>
                    </el-form-item>
                    <el-form-item label="服务到期日" prop="server_end_time">
                        <el-date-picker
                            v-model="orderForm.server_end_time"
                            type="date"
                            placeholder="选择服务到期日"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="订单时间" prop="order_date_time">
                        <el-date-picker
                            v-model="orderForm.order_date_time"
                            type="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD">
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
