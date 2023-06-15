<template>
    <el-dialog
        class="ba-operate-dialog"
        width="40%"
        v-model="store.dialogVisible"
        :destroy-on-close="true"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                {{ store.operate }}
            </div>
        </template>
        <el-scrollbar>
            <div class="ba-operate-form">
                <el-form
                    ref="formRef"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="优惠活动名称" prop="name">
                        <el-input v-model="store.name" placeholder="请输入活动名称"/>
                    </el-form-item>
                    <el-form-item label="优惠活动金额" prop="price">
                        <el-input v-model="store.price" placeholder="请输入优惠价格"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="auth('update')"
                @click="onSubmit(formRef)"
                type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ElForm, FormInstance} from "element-plus";
import {auth} from "/@/utils/common";
import {orderActivity} from "/@/stores/order/activity";
import {activitySave} from "/@/api/backend/auth/quote/activity";

const checkNumber = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error('不可为空'));
    }
    const reg = /[^\d\.]/g; // 控制只能输入整数、浮点数
    if (value && new RegExp(reg).test(value)) {
        return callback(new Error('请输入正确的数字值'));
    }
    callback()
}

const store = orderActivity()
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    name: [{required: true, message: '请填写优惠活动名称', trigger: 'blur'},],
    price: [
        {required: true, message: '请填写优惠价格', trigger: 'blur'},
        {validator: checkNumber, trigger: 'blur'}
    ],
})

const handleClose = () => {
    store.name = ''
    store.price = ''
    store.id = ''
    store.refreshPage = false
    store.dialogVisible = false
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            activitySave({
                id: store.id,
                name: store.name,
                amount: store.price,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
</script>

<style scoped lang="scss">
</style>
