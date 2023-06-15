<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
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
                    <el-form-item label="标题" prop="name">
                        <el-input v-model="store.name" placeholder="标题"/>
                    </el-form-item>
                    <el-form-item label="全景xml地址" prop="banner_url">
                        <el-input v-model="store.banner_url" placeholder="全景链接"/>
                    </el-form-item>
                    <el-form-item label="banner图" prop="cover">
                        <CustomUploder
                            v-model="store.cover"
                            :handleSuccess="handleAvatarSuccess"
                            :beforeAvatarUpload="beforeAvatarUpload"
                            :flag="false"
                        />
                    </el-form-item>
                    <el-form-item label="显示位置" prop="place_id">
                        <el-select v-model="store.place_id" placeholder="请选择">
                            <el-option
                                v-for="item in store.place"
                                :key="item.key"
                                :label="item.name"
                                :value="item.id"/>
                        </el-select>
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
import {bannerConfig} from "/@/stores/portal/banner";
import {updateLists} from "/@/api/backend/portal/banner/banner";
import {auth} from "/@/utils/common";
import CustomUploder from "/@/components/custom/CustomUploader.vue";

const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const submitLoading = ref(false)
const store = bannerConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const validateLon = async (rule: any, value: any) => {
    const logNum = /^(https?:\/\/(([a-zA-Z0-9]+-?)+\.)*[a-zA-Z\d]+)+(:\d+)?(\/.*)?(\?.*)?(#.*)?$/
    if (!logNum.test(value)) {
        return Promise.reject('请输入正确的URL地址');
    } else {
        return Promise.resolve();

    }
};
const rules = reactive({
    name: [
        {required: true, message: '请填标题', trigger: 'blur'},
    ],
    cover: [
        {required: true, message: '请选择banner图', trigger: 'blur'},
    ],
    place_id: [
        {required: true, message: '请选择显示位置', trigger: 'blur'},
    ],
    banner_url: [
        {required: true, message: '请输入正确的URL链接地址', trigger: 'blur', validator: validateLon},

    ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            updateLists({
                id: store.id,
                title: store.name,
                photo: store.cover,
                url: store.banner_url,
                place_id: store.place_id,
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

const handleClose = () => {
    store.cover = ''
    store.id = ''
    store.name = ''
    store.refreshPage = false
    store.banner_url = ''
    store.place_id = ''
    store.dialogVisible = false
}
</script>

<style lang="scss" scoped>
</style>
