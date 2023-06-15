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
                        <el-form-item label="UDC名称：" prop="name">
                            <el-input v-model="store.name" placeholder="请输入udc名称"/>
                        </el-form-item>
                        <el-form-item label="资源类型：" prop="type">
                            <el-select
                                v-model="store.type"
                                placeholder="请选择资源类型"
                                clearable
                                size="large">
                                <el-option :key="1" label="合作伙伴" :value="1"></el-option>
                                <el-option :key="2" label="新看点集团" :value="2"></el-option>
                                <el-option :key="3" label="818平台" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="UDC图片：" prop="udcImg">
                            <CustomUploder
                                v-model="store.udcImg"
                                :handleSuccess="handleAvatarSuccess"
                                :beforeAvatarUpload="beforeAvatarUpload"
                                :flag="false"
                            />
                        </el-form-item>
                        <el-form-item label="UDC资源包：" prop="fileList">
                            <el-upload
                                :before-upload="beforeAvatarUploads"
                                v-model:file-list="store.fileList"
                                :http-request="onUpload"
                                accept=".zip,.rar,.7z,.gz"
                                :limit="1"
                            >
                                <el-button type="primary">点击上传</el-button>
                            </el-upload>
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
import {onMounted, reactive, ref} from "vue";
import type {ElForm} from "element-plus";
import {ElMessage, FormInstance, UploadProps} from "element-plus";
import {udcConfig} from "/@/stores/udc/udc";
import {meiTuanHotelUp} from "/@/api/backend/activity/meituan/hotel/hotel";
import {udcUpdate} from "/@/api/backend/udc/udc";
import CustomUploder from "/@/components/custom/CustomUploader.vue";

const token = import.meta.env.VITE_APP_TOKEN_ID;
const secret = import.meta.env.VITE_APP_TOKEN_SECRET;
const submitLoading = ref(false);
const store = udcConfig();
const hotel_file = ref("");
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    type: [
        {required: true, message: "请选择资源类型", trigger: "blur"},
    ],
    name: [
        {required: true, message: "请输入udc名称", trigger: "blur"},
    ],
    udcImg: [
        {required: true, message: "请选择udc图片", trigger: "blur"},
    ],
    fileList: [
        {required: true, message: "请上传UDC资源包,类型（.zip,.rar,.7z,.gz）", trigger: "blur"},
    ],
});
const onUpload = (options: any) => {
    const {file} = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "admin/file");
    meiTuanHotelUp(formData)
        .then(res => {
            let obj = res.data.content;
            store.fileList[0].url = obj.url;
            store.fileList[0].status = "success";
        });
};
const handleAvatarSuccess: UploadProps["onSuccess"] = (
    response,
) => {
    store.udcImg = response.content.origin;
    ElMessage.success("UDC图片上传成功！");
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
    const isJPG = rawFile.type === "image/jpeg" || "image/png" ;
    const isLt2M = rawFile.size / 1024 / 1024 < 2;
    if (!isJPG) {
        ElMessage.error("图片只能是 JPG或PNG 格式!!");
    }
    if (!isLt2M) {
        ElMessage.error("图片大小不能超过 2MB!");
    }
    return isJPG && isLt2M;
};
const beforeAvatarUploads: UploadProps["beforeUpload"] = (rawFile) => {
    const isLt2M = rawFile.size / 1024 / 1024 < 20;
    if (!isLt2M) {
        ElMessage.error("资源大小不能超过 20MB!");
    }
    return isLt2M;
};

const onSubmit =  (formEl: FormInstance | undefined) => {
    if (!formEl) return;
     formEl.validate((valid) => {
        if (valid) {
            udcUpdate({
                id: store.id,
                name: store.name,
                type: store.type,
                pic: store.udcImg,
                source: store.fileList[0].url,
                source_name: store.fileList[0].name,
            }).then(() => {
                store.refreshPage = true;
                store.dialogVisible = false;
            });
        }
    });
};

const handleClose = () => {
    store.id = 0;
    store.type = "";
    store.udcImg = "";
    store.name = "";
    store.source = "";
    hotel_file.value = "";
    store.fileList = [];
    store.refreshPage = false;
    store.dialogVisible = false;
};
onMounted(() => {

});
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
