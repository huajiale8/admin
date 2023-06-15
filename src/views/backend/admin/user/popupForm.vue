<template>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialogVisible"
        :destroy-on-close="true"
        :close-on-click-modal="false"
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
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="store.name" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="store.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="store.password"
                            placeholder="请输入密码"
                            type="password"
                            :show-password=true>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button v-if="auth('update')" @click="onSubmit(formRef)" type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {userConfig} from '/@/stores/admin/userpupForm'
import {ElForm, FormInstance} from "element-plus";
import {userUpdate} from "/@/api/backend/auth/admin/user";
import {auth} from '/@/utils/common'
import {validatorPhone} from "/@/utils/validate";

const formRef = ref<InstanceType<typeof ElForm>>();
const store = userConfig()
const rules = reactive({
    name: [
        {required: true, message: '请填写真实姓名', trigger: 'blur'},
    ],
    phone: [
        {required: true, message: '请填写手机号码', trigger: 'blur'},
        {validator: validatorPhone, trigger: 'blur'}
    ],
    password: [
        {required: true, message: '请填写密码', trigger: 'blur'},
        {min: 6, message: '登录密码长度不能低于6个字符', trigger: 'blur'},
    ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            userUpdate({
                id: store.id,
                name: store.name,
                phone: store.phone,
                password: store.password,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.name = ''
    store.id = 0
    store.level = 0
    store.password = ''
    store.phone = ''
    store.accesses = []
    store.refreshPage = false
    store.dialogVisible = false
    store.dialog = false
}
</script>
<style scoped lang="scss">
</style>
