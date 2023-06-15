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
                        v-if="store.dialogVisible"
                        ref="formRef"
                        :model="store"
                        :rules="rules"
                        label-width="auto">
                        <el-form-item label="项目名称" prop="name">
                            <el-input v-model="store.name" placeholder="项目名称"/>
                        </el-form-item>
                        <el-form-item label="项目链接" prop="project_url">
                            <el-input v-model="store.project_url" placeholder="项目链接"/>
                        </el-form-item>
                        <el-form-item label="项目类型" prop="project_type_id">
                            <el-select v-model="store.project_type_id" placeholder="请选择" >
                                <el-option
                                    v-for="item in store.project_typeList"
                                    :key="item.key"
                                    :label="item.project_type"
                                    :value="item.project_type"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单类型" prop="order_type_id">
                            <el-select v-model="store.order_type_id" placeholder="请选择" >
                                <el-option
                                    v-for="item in store.order_typeList"
                                    :key="item.key"
                                    :label="item.order_type"
                                    :value="item.order_type"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目版本" prop="versions">
                            <el-input v-model="store.versions" placeholder="项目版本列如：(V1.0.0)" />
                        </el-form-item>
                        <el-form-item label="上线时间" prop="dateValue">
                            <el-date-picker
                                v-model="store.dateValue"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="微信分享内容">
                            <el-input
                                v-model="store.wxShareContent"
                                :rows="3"
                                type="textarea"
                                placeholder="分享内容...."
                            />
                        </el-form-item>
                        <el-form-item label="微信分享图片">
                            <CustomUploder
                                v-model="store.projectImg"
                                :handleSuccess="handleAvatarSuccess"
                                :beforeAvatarUpload="beforeAvatarUpload"
                                :flag="false"
                            />
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button
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
import {projectConfig} from "/@/stores/publish/project";
import {projectMenuUpdate} from "/@/api/backend/publish/project";
import CustomUploder from "/@/components/custom/CustomUploader.vue";

const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const submitLoading = ref(false)
const store = projectConfig()
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
        {required: true, message: '请填写项目名称', trigger: 'blur'},
    ],
    project_type_id: [
        {required: true, message: '请选择项目类型', trigger: 'blur'},
    ],
    order_type_id: [
        {required: true, message: '请选择订单类型', trigger: 'blur'},
    ],
    project_url: [
        {required: true, message: '请输入正确的项目链接地址', trigger: 'blur', validator: validateLon},

    ],
    dateValue: [
        {required: true, message: '请选择上线日期', trigger: 'blur'},

    ],
    versions: [
        {required: true, message: '请填写版本号', trigger: 'blur'},
    ],
})
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            projectMenuUpdate({
                project_id: store.id,
                project_name: store.name,
                project_type: store.project_type_id,
                order_type: store.order_type_id,
                project_version: store.versions,
                project_url: store.project_url,
                datetime: infoData(store.dateValue),
                weixincontent: store.wxShareContent,
                weixinimg: store.projectImg
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}

const infoData = (data: any) => {
    let date = new Date(data);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1 as number;
    MM = MM < 10 ? ('0' + MM) as unknown as number : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) as unknown as number : d;
    return y + '-' + MM + '-' + d;
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response
) => {
    store.projectImg = response.content.origin
    ElMessage.success('微信分享图片上传成功！')
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
    store.id = ''
    store.name = ''
    store.dateValue = ''
    store.operate = ''
    store.project_url = ''
    store.projectImg = ''
    store.project_type_id = ''
    store.order_type_id = ''
    store.dateValue = ''
    store.versions = ''
    store.wxShareContent = ''
    store.refreshPage = false
    store.dialogVisible = false
}
onMounted(() => {
});
</script>

<style lang="scss" scoped>
</style>
