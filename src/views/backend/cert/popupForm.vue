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
                    <el-form-item label="素材名称" prop="name">
                        <el-input v-model="store.name" placeholder="请填写素材名称（企业，酒店，景点等名称）"/>
                    </el-form-item>
                    <el-form-item label="全景地址" prop="panorama_url">
                        <el-input v-model="store.panorama_url" placeholder="已上线的全景地址URL"/>
                    </el-form-item>
                    <el-form-item label="产品分类" prop="category_id">
                        <el-select v-model="store.category_id" placeholder="请选择">
                            <el-option
                                v-for="item in store.category"
                                :key="item.key"
                                :label="item.name"
                                :value="item.id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="认证星级" prop="certType_id">
                        <el-select v-model="store.certType_id" placeholder="请选择">
                            <el-option
                                v-for="item in store.certType"
                                :key="item"
                                :label="item.name"
                                :value="item.id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="认证有效期" prop="dateValue">
                        <el-date-picker
                            v-model="store.dateValue"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="缩略图" prop="thumb_pc">
                        <CustomUploder
                            v-model="store.thumb_pc"
                            :handleSuccess="handleSuccess"
                            :beforeAvatarUpload="beforeAvatarUpload"
                            :flag='false'
                        />
                    </el-form-item>
                    <el-form-item label="预览图">
                        <el-upload
                            :on-success="handlePreviewSuccess"
                            :before-upload="previewUpload"
                            v-model:file-list="store.fileList"
                            accept=".png,.jpg,.jpeg"
                            class="upload-demo"
                            :action=url
                            :headers="{
                                    'Token-Id': token,
                                    'Token-Secret': secret,
                                }"
                            :on-remove="handleRemove"
                            list-type="picture"
                        >
                            <el-button type="primary">点击上传</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    只能上传jpg/png文件，且不超过500kb
                                </div>
                            </template>
                        </el-upload>
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
import {onMounted, reactive, ref,} from "vue";
import type {ElForm} from "element-plus";
import {ElMessage, FormInstance, UploadFiles, UploadProps} from "element-plus";
import {certConfig} from "/@/stores/cert/cert";
import {certUpdate} from "/@/api/backend/cert/cert";
import {auth} from "/@/utils/common";
import CustomUploder from "/@/components/custom/CustomUploader.vue";
import ossUrl from "/@/utils/ossUrl";

const  url = ossUrl()
const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const submitLoading = ref(false)
const store = certConfig()
const previewImg = ref([])
const formRef = ref<InstanceType<typeof ElForm>>();
const certType = ref(
    [
        {id: 1, name: '一星级'},
        {id: 2, name: '二星级'},
        {id: 3, name: '三星级'},
    ]
)
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
        {required: true, message: '请填写素材名称', trigger: 'blur'},
    ],
    category_id: [
        {required: true, message: '请选择产品类型', trigger: 'blur'},
    ],
    panorama_url: [
        {required: true, message: '请输入正确的全景地址', trigger: 'blur', validator: validateLon},

    ],
    dateValue: [
        {required: true, message: '请选择有效日期', trigger: 'blur'},

    ],
    certType_id: [
        {required: true, message: '请选择认证星级', trigger: 'blur'},
    ],
})
const handleSuccess = (index: number, res: any, file: any, fileList: UploadFiles) => {
    store.thumb_pc = res.response.content.origin
    ElMessage.success('PPT截图上传成功！')
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    previewImg.value.join(',')
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            certUpdate({
                id: store.id,
                name: store.name,
                panorama_url: store.panorama_url,
                category_id: store.category_id,
                cert_type: store.certType_id,
                expiry_date: store.dateValue,
                thumb: store.thumb_pc,
                photos: store.previewImg
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
    store.thumb_pc = response.content.origin
    ElMessage.success('封面图上传成功！')
}
const handlePreviewSuccess: UploadProps['onSuccess'] = (
    response
) => {
    store.previewImg.push(response.content.origin)
    ElMessage.success('预览图上传成功！')
}
const handleRemove = (uploadFile: any) => {
    const i = uploadFile.url
    const x = store.previewImg.indexOf(i)
    store.previewImg.splice(x, 1)
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
const previewUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const isJPG = rawFile.type === 'image/jpeg' || 'image/png';
    const isLt2M = rawFile.size / 1024 / 1024 < 0.5;
    if (!isJPG) {
        ElMessage.error('图片只能是 JPG或PNG 格式!!')
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 500kb!')
    }
    return isJPG && isLt2M;
}
const handleClose = () => {
    store.thumb_pc = ''
    store.id = ''
    store.certType_id = ''
    store.fileList = []
    store.previewImg = []
    store.name = ''
    store.category_id = ''
    store.panorama_url = ''
    store.dateValue = ''
    store.refreshPage = false
    store.dialogVisible = false
}
onMounted(() => {
    store.certType = certType.value
});
</script>
<style lang="scss" scoped>
.display {
    display: flex;
}
</style>
