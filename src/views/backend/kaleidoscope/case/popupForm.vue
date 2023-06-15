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
                    v-if="store.dialogVisible"
                    ref="formRef"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="案例名称：" prop="name">
                        <el-input v-model="store.name" placeholder="案例名称"/>
                    </el-form-item>
                    <el-form-item label="案例封面：" prop="cover">
                        <CustomUploder
                            v-model="store.cover"
                            :handleSuccess="handleAvatarSuccess"
                            :beforeAvatarUpload="beforeAvatarUpload"
                            :flag="false"
                        />
                    </el-form-item>
                    <el-form-item label="行业分类：" prop="label_ids">
                        <el-select
                            v-model="store.label_ids"
                            placeholder="行业分类："
                            multiple>
                            <el-option
                                v-for="(item, index) in store.labels"
                                :key="index"
                                :value="index"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="技术标签：" prop="tech_ids">
                        <el-select
                            v-model="store.tech_ids"
                            placeholder="技术标签："
                            multiple>
                            <el-option
                                v-for="(item, index) in store.techs"
                                :key="index"
                                :value="index"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="首页分类：" prop="type_ids">
                        <el-select
                            v-model="store.type_ids"
                            placeholder="首页分类："
                            multiple>
                            <el-option
                                v-for="(item, index) in store.types"
                                :key="index"
                                :value="index"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推荐首页：" prop="recommend">
                        <el-switch
                            v-model="store.recommend"
                            active-text="是"
                            inactive-text="否"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="案例类型：" prop="type">
                        <el-select
                            v-model="store.type"
                            placeholder="案例类型："
                        >
                            <el-option
                                v-for="(item, ) in options"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="案列内容：">
                        <el-upload
                            v-if="store.type === 3"
                            class="avatar-uploader"
                            accept=".mp4"
                            :action=urls
                            :headers="{
                                    'Token-Id': token,
                                    'Token-Secret': secret,
                                }"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessVideo"
                            :before-upload="beforeAvatarUploadVideo">
                            <video v-if="store.video" :src="store.video" class="avatar"/>
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus/>
                            </el-icon>
                        </el-upload>
                        <CustomUploder
                            v-if="store.type === 2"
                            v-model="store.cover_mobile"
                            :handleSuccess="handleAvatarSuccessMobile"
                            :beforeAvatarUpload="beforeAvatarUploads"
                            :flag="false"
                        />
                        <el-input v-if="store.type === 1" v-model="store.url" placeholder="案例链接"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="auth('save')"
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
import {auth} from "/@/utils/common";
import {kaleidoscopeCaseConfig} from "/@/stores/kaleidoscope/case";
import {kaleidoscopeCaseSave} from "/@/api/backend/kaleidoscope/case";
import CustomUploder from "/@/components/custom/CustomUploader.vue";
import ossfileUrl from "/@/utils/ossFileUrl";

const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const submitLoading = ref(false)
const options = ref([
    {label: '链接', value: 1},
    {label: '图片', value: 2},
    {label: '视频', value: 3}
])
const store = kaleidoscopeCaseConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    name: [
        {required: true, message: '请填写案列名称', trigger: 'blur'},
    ],
    label_ids: [
        {required: true, message: '请选择行业分类', trigger: 'blur'},
    ],
    tech_ids: [
        {required: true, message: '请选择技术标签', trigger: 'blur'},
    ],
    type_ids: [
        {required: true, message: '请选择首页分类', trigger: 'blur'},
    ],
    cover: [
        {required: true, message: '请上传封面图片', trigger: 'blur'},
    ],
    cover_mobile: [
        {required: true, message: '请上传案列内容图片', trigger: 'blur'},
    ],
    recommend: [
        {required: true, message: '请选择是否推荐到首页', trigger: 'blur'},
    ],
    type: [
        {required: true, message: '请选择案列类型', trigger: 'blur'},
    ],
})
const urls = ossfileUrl()
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            let content = ''
            if (store.type === 1) {
                content = store.url
            } else if (store.type === 2) {
                content = store.cover_mobile
            } else if (store.type === 3) {
                content = store.video
            }
            kaleidoscopeCaseSave({
                id: store.id,
                name: store.name,
                poster: store.cover,
                type_ids: store.type_ids,
                tech_ids: store.tech_ids,
                label_ids: store.label_ids,
                recommend: store.recommend,
                type: store.type,
                content: content
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const beforeAvatarUploads: UploadProps['beforeUpload'] = (rawFile) => {
    const isJPG = rawFile.type === 'image/jpeg' || 'image/png';
    if (!isJPG) {
        ElMessage.error('上传的图片只能是JPG、PNG格式!!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('上传的图片大小不能超过2MB!')
        return false
    }
    return true
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response
) => {
    store.cover = response.content.origin
    ElMessage.success('封面图上传成功！')
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const isJPG = rawFile.type === 'image/jpeg' || 'image/png';
    if (!isJPG) {
        ElMessage.error('上传的图片只能是JPG、PNG格式!!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('上传的图片大小不能超过2MB!')
        return false
    }
    return true
}
const handleAvatarSuccessMobile: UploadProps['onSuccess'] = (
    response
) => {
    store.cover_mobile = response.content.origin
    ElMessage.success('案列图片上传成功！')
}
const handleAvatarSuccessVideo: UploadProps['onSuccess'] = (
    response
) => {
    store.video = response.content.origin
    ElMessage.success('案列视频上传成功！')
}
const beforeAvatarUploadVideo: UploadProps['beforeUpload'] = (rawFile) => {
    const isJPG = rawFile.type === 'video/mp4';
    const isLt2M = rawFile.size / 1024 / 1024 <= 25;
    if (!isJPG) {
        ElMessage.error('上传的视频只能是Mp4格式!!')
    }
    if (!isLt2M) {
        ElMessage.error('上传的视频大小不能超过25MB!')
    }
    return isJPG && isLt2M;
}
const handleClose = () => {
    store.cover = ''
    store.cover_mobile = ''
    store.video = ''
    store.label_ids = ''
    store.tech_ids = ''
    store.url = ''
    store.type_ids = ''
    store.recommend = 0
    store.type = 1
    store.id = ''
    store.name = ''
    store.icon = ''
    store.refreshPage = false
    store.dialogVisible = false
}
</script>

<style lang="scss" scoped>
</style>
