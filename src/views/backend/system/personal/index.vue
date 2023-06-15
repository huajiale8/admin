<template>
    <div class="default-main ba-table-box">
        <el-card class="box-card">
            <el-form
                ref="formRef"
                :model="rulesForm"
                label-width="120px"
                :rules="rules"
            >
                <el-form-item label="头像">
                    <CustomUploder
                        v-model="rulesForm.avatar"
                        :handleSuccess="handleAvatarSuccess"
                        :beforeAvatarUpload="beforeAvatarUpload"
                        :flag="false"
                    />
                </el-form-item>
                <el-form-item label="真实姓名" prop="name">
                    <el-input v-model="rulesForm.name"/>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="rulesForm.phone"/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input :show-password="true" v-model="rulesForm.password" type="password"/>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input :show-password="true" v-model="rulesForm.password_confirmation" type="password"/>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="auth('update')" class="but"
                               @click="onSubmit(formRef)" type="primary">
                        保存
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {ElForm, ElMessage, FormInstance, UploadProps} from "element-plus";
import {userLists, userSave} from "/@/api/backend/auth/quote/user";
import {auth} from "/@/utils/common";
import CustomUploder from "/@/components/custom/CustomUploader.vue";

const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const formRef = ref<InstanceType<typeof ElForm>>();
const rulesForm = reactive({
    uid: 0,
    password: '',
    name: '',
    password_confirmation: '',
    phone: '',
    avatar: '',
})
const rules = reactive({
    name: [
        {required: true, message: '请填写真实姓名', trigger: 'blur'},
    ],
    phone: [
        {required: true, message: '请填写手机号码', trigger: 'blur'},
    ],
})
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response
) => {
    rulesForm.avatar = response.content.origin
    ElMessage.success('封面图上传成功！')
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const isJPG = rawFile.type === 'image/jpeg' || 'image/png';
    const isLt2M = rawFile.size / 1024 / 1024 < 2;
    if (!isJPG) {
        ElMessage.error('图片只能是 JPG或PNG 格式!!')
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
    }
    return isJPG && isLt2M;
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            if (!rulesForm.password) {
                userSave({
                    uid: rulesForm.uid,
                    name: rulesForm.name,
                    phone: rulesForm.phone,
                    avatar: rulesForm.avatar,
                }).then(() => {
                    getList()
                })

            } else {
                userSave({
                    uid: rulesForm.uid,
                    name: rulesForm.name,
                    password: rulesForm.password,
                    password_confirmation: rulesForm.password_confirmation,
                    phone: rulesForm.phone,
                    avatar: rulesForm.avatar,
                }).then(() => {
                    getList()
                })
            }
        }
    })
}
const getList = () => {
    userLists().then(res => {
        let obj = res.data.content
        rulesForm.uid = obj.id
        rulesForm.name = obj.name
        rulesForm.phone = obj.phone
        rulesForm.avatar = obj.avatar
    })
}

onMounted(() => {
    getList()
});
</script>

<style scoped lang="scss">
.but {
    margin-top: 20px;
    position: absolute;
    right: 20px;
}
</style>
