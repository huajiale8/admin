<template>
    <el-dialog
        :destroy-on-close="true"
        :close-on-click-modal="false"
        class="ba-operate-dialog"
        v-model="store.newOrderDialogVisible"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                {{ store.orderName }}
            </div>
        </template>
        <el-scrollbar max-height="60vh">
            <div class="ba-operate-form">
                <el-steps :active="active" finish-status="success">
                    <el-step title="客户资料"></el-step>
                    <el-step title="乙方资料"></el-step>
                    <el-step title="服务内容"></el-step>
                    <el-step title="项目工期"></el-step>
                    <el-step title="折扣"></el-step>
                </el-steps>
                <el-form
                    style="width: 100%; margin: 50px auto">
                    <!--                    客户资料-->
                    <div v-if="active === 0" class="custom-form">
                        <el-form
                            ref="formRef"
                            :model="partAInfo"
                            label-width="150px"
                            :rules="rules"
                            style="width: 50%; margin: auto">
                            <el-form-item label="甲方名称" prop="custom_name">
                                <el-input v-model="partAInfo.custom_name" placeholder="请输入甲方名称"></el-input>
                            </el-form-item>
                            <el-form-item label="甲方联系人" prop="custom_contact">
                                <el-input v-model="partAInfo.custom_contact" placeholder="请输入甲方联系人"></el-input>
                            </el-form-item>
                            <el-form-item label="甲方联系方式" prop="custom_phone">
                                <el-input v-model="partAInfo.custom_phone" placeholder="请输入甲方联系方式"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!--                    乙方资料-->
                    <div v-if="active === 1">
                        <el-form
                            :inline="true"
                            label-width="150px"
                            :model="partBInfo"
                            style="width: 50%; margin: 50px auto">
                            <el-form-item  label="乙方经理">
                                <el-select
                                    v-model="partBInfo.id"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请输入关键词"
                                    :remote-method="remoteMethod"
                                    @change="onPartBSelected"
                                    :loading="loading">
                                    <el-option
                                        v-for="item in partBList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="乙方客户经理" style="display: none">
                                <el-input v-model="partBInfo.bidder_name" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="乙方联系方式">
                                <el-input v-model="partBInfo.bidder_phone" disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!--                    服务内容-->
                    <div v-if="active === 2">
                        <el-table
                            style="width: 100%"
                            :data="tableData"
                            border
                            row-key="key"
                            :default-expand-all="false"
                            fit
                            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                            <el-table-column
                                fixed="left"
                                min-width="200"
                                prop="name"
                                label="内容名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="price"
                                label="单价"
                                min-width="100px"
                                header-align="center"
                                align="center">
                                <template #default="scope">
                                    <el-input
                                        v-model="scope.row.price"
                                        @input="handleChange(scope)"
                                        v-if="scope.row.price">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="数量"
                                min-width="200px"
                                header-align="center"
                                align="center">
                                <template #default="scope">
                                    <el-input-number
                                        v-model="scope.row.num"
                                        @change="handleChange(scope)"
                                        :min="0"
                                        v-if="!scope.row.children"
                                        label="数量">
                                    </el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="unit"
                                min-width="60px"
                                label="单位"
                                header-align="center"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="总价"
                                min-width="100px"
                                header-align="center"
                                align="center">
                                <template #default="scope">
                                    <span v-if="scope.row.price" disabled>
                                        ￥{{ scope.row.total }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!--                    项目工期-->
                    <div v-if="active === 3">
                        <div class="dis">
                            <el-date-picker
                                @change="dateSelected"
                                v-model="dateInfo.dateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="x">
                            </el-date-picker>
                        </div>
                        <div v-if="dateInfo.dayRange" class="dateRangeText">
                            项目工期为:{{ dateInfo.dayRange }} 天
                        </div>
                    </div>
                    <div v-if="active === 4">
                        <active-five></active-five>
                    </div>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button v-if="active === 0" type="primary" @click="one_next_step(formRef)" class="btn-custom-info">下一步
            </el-button>
            <el-button class="left" v-if="active > 0" @click="pre">上一步</el-button>
            <el-button
                type="primary"
                class="center"
                v-if="active < 4 && active > 0"
                @click="next">下一步
            </el-button>
            <el-button class="right" v-if="active=== 4" type="primary" @click="onSubmit">提交报价</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {orderConfig} from "/@/stores/quote/orderPopupForm";
import {ElForm, FormInstance} from "element-plus";
import {orderQuery, orderSave} from "/@/api/backend/auth/quote/order"
import ActiveFive from "/@/views/backend/quote/order/active-five.vue";
import {storeToRefs} from "pinia";

const store = orderConfig()
const loading = ref(false)
const formRef = ref<InstanceType<typeof ElForm>>();
const active = ref(store.active)
const partBList: any = ref([])
const tableData = ref([]) //服务内容表格数据
const partAInfo = ref(store.partAInfo)
const partBInfo = ref(store.partBInfo)
const {dateInfo} = storeToRefs(store)
const rules = reactive({
    custom_name: [{required: true, message: '请填写甲方名称', trigger: 'blur'},],
    custom_contact: [{required: true, message: '请填写甲方联系人', trigger: 'blur'},],
    custom_phone: [{required: true, message: '请填写甲方联系方式', trigger: 'blur'},],
})
const handleClose = () => {
    store.refreshPage = false
    tableData.value = []
    store.partAInfo.custom_phone = ''
    store.partAInfo.custom_name = ''
    store.partAInfo.custom_contact = ''
    store.partBInfo.bidder_name = ''
    store.partBInfo.bidder_phone = ''
    store.partBInfo.id = ''
    store.dateInfo.dateRange = []
    store.dateInfo.dateStart = ''
    store.dateInfo.dateEnd = ''
    store.dateInfo.dayRange = 0
    store.id = 0
    active.value = 0
    store.discountInfo.serviceDiscount = []
    store.discountInfo.type = []
    store.discountInfo.discount = 0
    store.discountInfo.remark = ''
    store.RebateDate = []
    store.activityArr = []
    store.services = []
    store.newOrderDialogVisible = false
}

const dateSelected = () => {
    // 选择完成后换算总天数
    store.dateInfo.dayRange = (store.dateInfo.dateRange[1] - store.dateInfo.dateRange[0]) / 3600 / 24 / 1000
    // 开始时间
    store.dateInfo.dateStart = dateTransform(store.dateInfo.dateRange[0])
    // 结束时间
    store.dateInfo.dateEnd = dateTransform(store.dateInfo.dateRange[1])
}
// 时间类型调整
const dateTransform = (time: any) => {
    const date = new Date(time)
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    const currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    return date.getFullYear() + "-" + month + "-" + currentDate;
}
// 点击步进器时换算该商品总价
const handleChange = (scope: any) => {
    scope.row.total = scope.row.price * scope.row.num
}
const remoteMethod = (i: any) => {
    if (i !== '') {
        loading.value = true
        partBList.value = []
        orderQuery({name: i}).then(res => {
            loading.value = false
            res.data.content.forEach((i: any) => {
                const temp: any = {
                    value: i.id,
                    label: i.contact_name,
                    phone: i.contact_phone,
                }
                partBList.value.push(temp)
            })
        })
    }
}
const onPartBSelected = (i: number) => {
    const obj = partBList.value.find((x: any) => {
        return x.value === i
    })
    partBInfo.value.bidder_name = obj.label
    partBInfo.value.bidder_phone = obj.phone
}
// 客户资料的下一步
const one_next_step = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            active.value++ //进度条加一
            tableData.value = store.services //把深拷贝的服务内容数据赋值给tableData
            tableData.value.forEach((item) => {
                item.children.forEach((j: any) => {
                    j.num = parseInt(j.num) //把数据中的数量改为整数
                })
            })
        }
    })
}
const next = () => {
    active.value++
    if (active.value === 4) {
        store.flag = true
        if (store.discountInfo.serviceDiscount.length === 0) {
            store.services.forEach((i: any) => {
                store.discountInfo.serviceDiscount.push({
                    id: i.id,
                    discount: 0,
                    name: i.name,
                    qid: 75,
                    step: 0,
                    cid: i.id
                })
            })
        }
    }
}
const pre = () => {
    active.value -= 1
}
const onSubmit = () => {
    store.discountInfo.serviceDiscount.forEach((item) => {
        item.old_id = item.id
        item.id = item.cid
    })
    const obj = {
        id: store.id,
        uid: partBInfo.value.id,
        custom_contact: partAInfo.value.custom_contact,
        custom_name: partAInfo.value.custom_name,
        custom_phone: partAInfo.value.custom_phone,
        dateStart: dateInfo.value.dateStart,
        dateEnd: dateInfo.value.dateEnd,
        remark: store.discountInfo.remark,
        serviceDiscount: store.discountInfo.serviceDiscount,
        services: tableData.value,
        beforeTaxCost: store.beforeTaxCost,
        afterTaxCost: store.afterTaxCost,
        discount: store.discountInfo.discount,
        activities: store.discountInfo.type
    }
    orderSave(obj).then(() => {
        store.refreshPage = true
        store.newOrderDialogVisible = false
    })
}

onMounted(() => {
    dateInfo.value.dateRange[0] = new Date(dateInfo.value.dateStart)
    dateInfo.value.dateRange[1] = new Date(dateInfo.value.dateEnd)
});
</script>

<style scoped lang="scss">
.custom-form {
    position: relative;

    > .btn-custom-info {
        position: absolute;
        bottom: -50px;
        right: 15px;
    }
}

.demo-form-inline {
    position: relative;
}

.dialog-footer {
    position: absolute;
    right: 10px;
    bottom: 1px;
}

.dateRangeText {
    padding-top: 10px;
    text-align: center;
}

.dis {
    width: 40%;
    margin: auto;
    display: flex;
    justify-content: center;
}
</style>
