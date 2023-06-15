<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {ElMessage, ElScrollbar} from "element-plus";
import {getOrderInfo, updateTask} from "/@/api/backend/open/panorama/order";
import {getCategoryList} from "/@/api/backend/public/common";
import AreaCascader from "/@/components/custom/AreaCascader.vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "onSuccess"]);

const orderFormRef = ref<FormInstance>();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const submitLoading = ref(false);
const loading = ref(false);
const orderOptions = ref([]);
const categories = ref([]);
const areaArr = ref([]);
const orderForm = reactive({
    id: 0,
    pid: "",
    type: 1,
    name: "",
    category_id: "",
    province_id: 0,
    city_id: 0,
    county_id: 0,
    address: "",
    contact_name: "",
    contact_information: "",
    cost: "",
    plane_image_count: "",
    panorama_size: [],
    panorama_count: [],
    aerial_type: [],
    aerial_size: [],
    aerial_count: [],
});
const orderRules = reactive<FormRules>({
    pid: [
        {required: true, message: "请选择全景订单", trigger: "blur"},
    ],
    name: [
        {required: true, message: "请输入订单/客户名称", trigger: "blur"},
        {max: 100, message: "订单/客户名称最大不超过100个字符", trigger: "blur"},
    ],
    category_id: [
        {required: true, message: "请选择订单类型", trigger: "blur"},
    ],
    province_id: [
        {required: true, message: "请选择所在区域", trigger: "blur"},
    ],
    address: [
        {required: true, message: "请输入详细地址", trigger: "blur"},
        {max: 100, message: "详细地址最大不超过100个字符", trigger: "blur"},
    ],
    contact_name: [
        {required: true, message: "请输入联系人", trigger: "blur"},
        {max: 100, message: "联系人最大不超过100个字符", trigger: "blur"},
    ],
    contact_information: [
        {required: true, message: "请输入联系方式", trigger: "blur"},
        {max: 100, message: "联系方式最大不超过100个字符", trigger: "blur"},
    ],
    cost: [
        {required: true, message: "请输入外包价格", trigger: "blur"},
        {
            validator: (rule, value, callback) => {
                const costReg = /^\d+(\.\d{2})?$/;
                setTimeout(() => {
                    if (costReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error("请输入正确的外包价格"));
                    }
                }, 100);
            }, trigger: "blur",
        },
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

const getOrders = (query: string) => {
    if (query) {
        loading.value = true;
        getOrderInfo({name: query}).then(res => {
            loading.value = false;
            orderOptions.value = res.data.content;
        });
    } else {
        orderOptions.value = [];
    }
};

const onAreaChange = () => {
    orderForm.province_id = 0;
    orderForm.city_id = 0;
    orderForm.county_id = 0;
    if (areaArr.value) {
        orderForm.province_id = areaArr.value[0] || 0;
        orderForm.city_id = areaArr.value[1] || 0;
        orderForm.county_id = areaArr.value[2] || 0;
    }
};

const onClose = () => {
    orderForm.id = 0;
    orderFormRef.value.resetFields();
};

const onOpen = () => {
    getCategoryList().then(res => {
        categories.value = res.data.content;
    });
    setTimeout(() => {
        scrollbarRef.value.setScrollTop(0);
    }, 100);
};

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            updateTask(orderForm).then(res => {
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
                新增任务
            </div>
        </template>
        <el-scrollbar class="ba-table-form-scrollbar" ref="scrollbarRef">
            <div class="ba-operate-form">
                <el-form
                    label-width="auto" :model="orderForm"
                    :rules="orderRules" ref="orderFormRef">
                    <el-form-item label="全景订单" prop="pid">
                        <el-select
                            v-model="orderForm.pid"
                            clearable
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请选择全景订单"
                            :remote-method="getOrders"
                            :loading="loading">
                            <el-option
                                v-for="item in orderOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务名称" prop="name">
                        <el-input v-model="orderForm.name" placeholder="任务/客户名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="category_id">
                        <el-select v-model="orderForm.category_id">
                            <el-option
                                v-for="item in categories" :label="item.name" :value="item.id"
                                :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在区域" prop="province_id">
                        <AreaCascader
                            v-model="areaArr"
                            @change="onAreaChange"
                        />
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input v-model="orderForm.address" placeholder="详细地址" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="contact_name">
                        <el-input v-model="orderForm.contact_name" placeholder="联系人" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contact_information">
                        <el-input v-model="orderForm.contact_information" placeholder="联系方式" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="价格" prop="cost">
                        <el-input v-model="orderForm.cost" placeholder="外包价格，如：100.00/0.01" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="拍摄属性"/>
                    <el-form-item label="平面数量">
                        <el-input
                            v-model="orderForm.plane_image_count"
                            placeholder="平面照图片数量，没有可不填写"/>
                    </el-form-item>
                    <el-form-item label="全景照">
                        <el-row>
                            <el-col>
                                <el-row :gutter="10">
                                    <el-col :span="12">
                                        <el-input
                                            v-model="orderForm.panorama_size[0]"
                                            placeholder="全景图片尺寸:如：8192*4096"></el-input>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-input
                                            v-model="orderForm.panorama_count[0]"
                                            placeholder="全景场景数量，没有可不填写"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="航拍">
                        <el-row>
                            <el-col>
                                <el-row :gutter="10" >
                                    <el-col :span="8" >
                                        <el-input
                                            v-model="orderForm.aerial_type[0]"
                                            placeholder="航拍类型（全景/平面）"></el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input
                                            v-model="orderForm.aerial_size[0]"
                                            placeholder="图片尺寸:如：8192*4096"></el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input
                                            v-model="orderForm.aerial_count[0]"
                                            placeholder="图片/场景数量，没有可不填写"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="8" style="margin-top: 10px">
                                        <el-input
                                            v-model="orderForm.aerial_type[1]"
                                            placeholder="航拍类型（全景/平面）"></el-input>
                                    </el-col>
                                    <el-col :span="8" style="margin-top: 10px">
                                        <el-input
                                            v-model="orderForm.aerial_size[1]"
                                            placeholder="图片尺寸:如：8192*4096"></el-input>
                                    </el-col>
                                    <el-col :span="8" style="margin-top: 10px">
                                        <el-input
                                            v-model="orderForm.aerial_count[1]"
                                            placeholder="图片/场景数量，没有可不填写"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
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
