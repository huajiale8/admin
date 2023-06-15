<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        v-model="store.dialogVisible"
        width="40%"
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
        <el-scrollbar max-height="60vh">
            <div class="ba-operate-form">
                <el-form
                    ref="formRef"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="所在区域" prop="selectedOptions">
                        <AreaCascader v-model="store.selectedOptions"/>
                    </el-form-item>
                    <el-form-item label="付费类型" prop="option_type">
                        <el-select v-model="store.option_type" placeholder="请选择付费类型" clearable>
                            <el-option :key="0" label="预付费" :value="0"></el-option>
                            <el-option :key="1" label="后付费" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账户操作类型" prop="pay_type">
                        <el-select v-model="store.pay_type" placeholder="请选择账户操作类型" clearable>
                            <el-option :key="0" label="官方平台" :value="0"></el-option>
                            <el-option :key="1" label="API" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代理商名称" prop="name">
                        <el-input v-model="store.name" placeholder="请输入代理商名称"/>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="store.phone" placeholder="请输入手机号码"/>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input v-model="store.address" placeholder="请输入详细地址"/>
                    </el-form-item>
                    <el-form-item label="负责人" prop="director">
                        <el-input v-model="store.director" placeholder="请输入负责人"/>
                    </el-form-item>
                    <el-form-item label="账户邮箱" prop="email">
                        <el-input v-model="store.email" placeholder="请输入账户邮箱"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="auth('update')"
                :loading="submitLoading"
                @click="onSubmit(formRef)"
                type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import type {ElForm} from "element-plus";
import {FormInstance} from 'element-plus'
import {agentAccountConfig} from "/@/stores/agent/account/account";
import {accountManagementUpdate} from "/@/api/backend/agent/account/account";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import {auth} from "/@/utils/common";

const submitLoading = ref(false)
const store = agentAccountConfig()
const hotel_file = ref('')
const formRef = ref<InstanceType<typeof ElForm>>();
const Mobile = (rule: any, value: any, callback: any) => {
    const regMobile = /^((\(\d{2,3}\))|(\d{3}\-))?1[3|5|8]\d{9}$/;
    if (!value) {
        return callback(new Error("请输入手机号！"));
    }
    if (!regMobile.test(value)) {
        callback(new Error("您输入手机格式错误！"));
    }
    callback()
};
const Email = (rule: any, value: any, callback: any) => {
    const regMobile = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if ( value && !regMobile.test(value)) {
        callback(new Error("您输入邮箱地址错误！"));
    }
    callback()
};
const rules = reactive({
    selectedOptions: [
        {required: true, message: '请选择所在区域', trigger: 'blur'},
    ],
    pay_type: [
        {required: true, message: '请选择账户操作类型', trigger: 'blur'},
    ],
    option_type: [
        {required: true, message: '请选择付费类型', trigger: 'blur'},
    ],
    address: [
        {required: true, message: '请输入详细地址', trigger: 'blur'},
    ],
    phone: [
        {required: true, message: '请输入手机号码', trigger: 'blur'},
        {validator: Mobile, trigger: 'blur'},
    ],
    name: [
        {required: true, message: '请输入代理商名称', trigger: 'blur'},
    ],
    director: [
        {required: true, message: '请输入负责人', trigger: 'blur'},
    ],
    email: [
        {validator: Email, trigger: 'blur'},

    ],
})
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            accountManagementUpdate({
                province_id: store.selectedOptions[0],
                city_id: store.selectedOptions[1],
                county_id: store.selectedOptions[2],
                name: store.name,
                id: store.id,
                phone: store.phone,
                address: store.address,
                director: store.director,
                pay_type: store.pay_type,
                option_type: store.option_type,
                email: store.email,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.id = 0
    store.phone = ''
    store.address = ''
    store.option_type = ''
    store.director = ''
    store.certType_id = ''
    store.place_id = ''
    store.location_id = ''
    store.pay_type = 0
    store.certType_id = ''
    store.email = ''
    store.selectedOptions = []
    store.name = ''
    hotel_file.value = ''
    store.refreshPage = false
    store.dialogVisible = false
}
</script>

<style lang="scss" scoped>
</style>
