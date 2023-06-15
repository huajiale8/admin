<template>
    <el-dialog
        width="40%"
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
        <el-scrollbar>
            <div class="ba-operate-form">
                <el-form
                    ref="formRef"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="store.name" placeholder="请输入真实姓名"/>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="store.phone" placeholder="请输入手机号码"/>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="store.password"
                            placeholder="请填写密码"
                            show-password/>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="store.nickname" placeholder="请输入您的昵称"/>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="store.email" placeholder="请输入您的邮箱"/>
                    </el-form-item>
                    <el-form-item label="QQ">
                        <el-input v-model="store.qq" placeholder="请输入您的QQ（可不填）"/>
                    </el-form-item>
                    <el-form-item label="微信openID">
                        <el-input v-model="store.openid" placeholder="请输入您的openID（可不填）"/>
                    </el-form-item>
                    <el-form-item label="是否启用">
                        <el-radio-group v-model="store.level">
                            <el-radio :label="0">显示</el-radio>
                            <el-radio :label="1">隐藏</el-radio>
                        </el-radio-group>
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
import {memberConfig} from '/@/stores/portal/memberpupFrom'
import {ElForm, FormInstance} from "element-plus";
import {validatorPhone} from "/@/utils/validate";
import {save} from "/@/api/backend/portal/member/member";
import {auth} from "/@/utils/common";

const formRef = ref<InstanceType<typeof ElForm>>();
const store = memberConfig()
const Email = (rule: any, value: any, callback: any) => {
    const regMobile = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if ( value && !regMobile.test(value)) {
        callback(new Error("您输入邮箱地址错误！"));
    }
    callback()
};
const rules = reactive({
    name: [
        {required: true, message: '请填写真实姓名', trigger: 'blur'},
    ],
    phone: [
        {required: true, message: '请填写手机号码', trigger: 'blur'},
        {validator: validatorPhone, trigger: 'blur'}
    ],
    nickname: [
        {required: true, message: '请填写昵称', trigger: 'blur'},
    ],
    email: [
        {required: true, message: '请填写邮箱', trigger: 'blur'},
        {validator: Email, trigger: 'blur'},
    ],
    password: [
        {required: true, message: '请填写密码', trigger: 'blur'},
    ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            save({
                mid: store.mid,
                name: store.name,
                phone: store.phone,
                password: store.password,
                status: store.level,
                qq: store.qq,
                email: store.email,
                openid: store.openid,
                nickname: store.nickname
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.name = ''
    store.mid = ''
    store.level = 0
    store.password = ''
    store.email = ''
    store.qq = ''
    store.openid = ''
    store.nickname = ''
    store.phone = ''
    store.refreshPage = false
    store.dialogVisible = false
}
</script>

<style scoped lang="scss">
</style>
