<template>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            width="40%"
            v-model="store.dialogVisible"
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
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="store.name" placeholder="全景分类名称"/>
                        </el-form-item>
                        <el-form-item label="字体图标" prop="icon">
                            <el-input v-model="store.icon" placeholder="ICON图标"/>
                        </el-form-item>
                        <el-form-item label="封面图" prop="cover">
                            <CustomUploder
                                v-model="store.cover"
                                :handleSuccess="handleAvatarSuccess"
                                :beforeAvatarUpload="beforeAvatarUpload"
                                :flag="false"
                            />
                        </el-form-item>
                        <el-form-item label="手机-封面图" prop="cover_mobile">
                            <CustomUploder
                                v-model="store.cover_mobile"
                                :handleSuccess="handleAvatarSuccessMobile"
                                :beforeAvatarUpload="beforeAvatarUploadMobile"
                                :flag="false"
                            />
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
import {ElMessage, FormInstance, UploadProps} from "element-plus";
import {cateConfig} from "/@/stores/category/category";
import {addCateApi} from "/@/api/backend/auth/attributes/category";
import {auth} from "/@/utils/common";
import CustomUploder from "/@/components/custom/CustomUploader.vue";

const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const submitLoading = ref(false)
const store = cateConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    name: [
        {required: true, message: '请填写区域名称', trigger: 'blur'},
        {max: 10, message: '区域名称不能超过10个字符', trigger: 'blur'},
    ],
    icon: [
        {required: true, message: '请输入字体图标代码', trigger: 'blur'},
    ],
    cover: [
        {required: true, message: '请上传封面图片', trigger: 'blur'},
    ],
    cover_mobile: [
        {required: true, message: '请上传手机封面图', trigger: 'blur'},
    ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            addCateApi({
                id: store.id,
                name: store.name,
                icon: store.icon,
                cover: store.cover,
                cover_mobile: store.cover_mobile
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response
) => {
    store.cover = response.content.origin
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
const handleAvatarSuccessMobile: UploadProps['onSuccess'] = (
    response
) => {
    store.cover_mobile = response.content.origin
    ElMessage.success('手机封面图上传成功！')
}
const beforeAvatarUploadMobile: UploadProps['beforeUpload'] = (rawFile) => {
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
const handleClose = () => {
    store.cover = ''
    store.cover_mobile = ''
    store.id = 0
    store.name = ''
    store.icon = ''
    store.refreshPage = false
    store.dialogVisible = false
}
</script>
<style lang="scss" scoped>
</style>
