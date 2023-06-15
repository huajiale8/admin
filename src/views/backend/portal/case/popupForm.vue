<template>
    <el-dialog
        width="40%"
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
                    <el-form-item label="全景名称" prop="name">
                        <el-input v-model="store.name" placeholder="全景名称"/>
                    </el-form-item>
                    <el-form-item label="全景链接" prop="panorama_url">
                        <el-input v-model="store.panorama_url" placeholder="全景链接"/>
                    </el-form-item>
                    <el-form-item label="归属地区" prop="selectedOptions">
                        <AreaCascader v-model="store.selectedOptions"/>
                    </el-form-item>
                    <el-form-item label="全景类型" prop="category_id">
                        <el-select v-model="store.category_id" placeholder="请选择">
                            <el-option
                                v-for="item in store.category"
                                :key="item.key"
                                :label="item.name"
                                :value="item.id"/>
                        </el-select>
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
                    <div class="display">
                        <el-form-item label="PC端封面图" prop="thumb_pc" >
                            <CustomUploder
                                v-model="store.thumb_pc"
                                :handleSuccess="handleAvatarSuccess"
                                :beforeAvatarUpload="beforeAvatarUpload"
                                :flag="false"
                            />
                        </el-form-item>
                        <el-form-item label="手机端封面图" prop="thumb_mobile">
                            <CustomUploder
                                v-model="store.thumb_mobile"
                                :handleSuccess="handleAvatarSuccessMobile"
                                :beforeAvatarUpload="beforeAvatarUploadMobile"
                                :flag="false"
                            />
                        </el-form-item>
                    </div>
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
import {ElMessage, FormInstance, UploadProps} from "element-plus";
import {caseConfig} from "/@/stores/portal/case";
import {updateLists} from "/@/api/backend/portal/case/case";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import {auth} from "/@/utils/common";
import CustomUploder from "/@/components/custom/CustomUploader.vue";

const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const submitLoading = ref(false)
const store = caseConfig()
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
        {required: true, message: '请填写全景名称', trigger: 'blur'},
    ],
    category_id: [
        {required: true, message: '请选择全景类型', trigger: 'blur'},
    ],
    place_id: [
        {required: true, message: '请选择显示位置', trigger: 'blur'},
    ],
    selectedOptions: [
        {required: true, message: '请选择归属地区', trigger: 'blur'},
    ],
    panorama_url: [
        {required: true, message: '请输入正确的全景链接地址', trigger: 'blur', validator: validateLon},

    ],
    thumb_pc: [
        {required: true, message: '请上传PC端封面图片', trigger: 'blur'},

    ],
    thumb_mobile: [
        {required: true, message: '请上传手机端封面图', trigger: 'blur'},
    ],
})

const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            updateLists({
                id: store.id,
                name: store.name,
                province_id: store.selectedOptions[0],
                city_id: store.selectedOptions[1],
                category_id: store.category_id,
                thumb_pc: store.thumb_pc,
                thumb_mobile: store.thumb_mobile,
                pano_url: store.panorama_url,
                county_id: store.selectedOptions[2],
                place_id: store.place_id
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
    store.thumb_mobile = response.content.origin
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
    store.thumb_pc = ''
    store.thumb_mobile = ''
    store.selectedOptions = []
    store.id = ''
    store.name = ''
    store.category_id = ''
    store.location_id = ''
    store.place_id = ''
    store.panorama_url = ''
    store.refreshPage = false
    store.dialogVisible = false
}

onMounted(() => {
});
</script>

<style lang="scss" scoped>
</style>
