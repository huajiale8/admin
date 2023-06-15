<script lang="ts" setup>
import type {UploadFile, UploadProps, UploadUserFile} from "element-plus";
import {ElMessage, ElScrollbar, FormInstance, UploadRawFile} from "element-plus";
import {computed, reactive, ref} from "vue";
import {usePanoramaTaskStore} from "/@/stores/open/panorama/order";
import {uploadTaskOrigin} from "/@/api/backend/open/order";
import _ from "lodash";
import CustomUploder from "/@/components/custom/CustomUploader.vue";
import ossUrl from "/@/utils/ossUrl";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "onSuccess"]);

const dialogVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const token = import.meta.env.VITE_APP_TOKEN_ID;
const secret = import.meta.env.VITE_APP_TOKEN_SECRET;
const store = usePanoramaTaskStore();
const formRef = ref<FormInstance>();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const submitLoading = ref(false);
const picLoading = ref([]);
const uploadForm = reactive({
    id: 0,
    pictures: [],
});
const fileList = ref<UploadUserFile[]>([]);

const onOpen = () => {
    setTimeout(() => {
        scrollbarRef.value.setScrollTop(0);
    }, 100);
};

const onClose = () => {
    fileList.value = [];
    formRef.value.resetFields();
};

const closeDialog = () => {
    emit("update:modelValue", false);
};

const handleRemove: UploadProps["onRemove"] = (uploadFile) => {
    for (let i = 0; i < fileList.value.length; i++) {
        if (fileList.value[i] === uploadFile) {
            fileList.value.splice(i, 1);
        }
    }
    uploadForm.pictures = fileList.value;
};

const handlePhotoSuccess = (res: any, rawFile: UploadFile) => {
    rawFile.url = res.content.origin;
    const file = _.cloneDeep(rawFile);
    delete file["percentage"];
    delete file["raw"];
    delete file["response"];
    delete file["uid"];
    fileList.value.push(file);
    uploadForm.pictures = fileList.value;
    picLoading.value.pop();
    submitLoading.value = picLoading.value.length > 0;
};

const beforePhotoUpload = (file: UploadRawFile) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (["image/*", "image/jpeg", "image/png", "image/gif"].indexOf(file.type) < 0) {
        ElMessage.error("上传图片只能是jpg,png,gif,jpeg格式!");
        return false;
    }

    if (!isLt20M) {
        ElMessage.error("上传图片大小不能超过 20MB!");
        return false;
    }
    return true;
};

const onUploading = () => {
    submitLoading.value = true;
    picLoading.value.push("loading");
};
const url = ossUrl()
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            submitLoading.value = true;
            uploadForm.id = store.task.id as number;
            uploadTaskOrigin(uploadForm).then(() => {
                emit("onSuccess");
                closeDialog();
            }).finally(() => {
                submitLoading.value = false;
            });
        }
    });
};
</script>

<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="true"
        v-model="dialogVisible"
        width="40%"
        @open="onOpen"
        @closed="onClose"
    >
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                上传原图
            </div>
        </template>
        <el-scrollbar ref="scrollbarRef" max-height="60vh">
            <div class="wrapper">
                <el-form
                    label-width="auto" :model="uploadForm"
                    ref="formRef">
                    <el-form-item label="上传原图">
                        <el-upload
                            :action=url
                            :headers="{
                                    'Token-Id': token,
                                    'Token-Secret': secret,
                                }"
                            multiple
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            accept=".png,.jpg,.jpeg,.gif"
                            :on-success="handlePhotoSuccess"
                            :before-upload="beforePhotoUpload"
                            :on-progress="onUploading"
                            list-type="picture">
                            <el-button type="primary">点击上传</el-button>
                            <template #tip>
                                <div>只能上传.jpg, .png, .gif, .jpeg文件，且不超过20MB</div>
                            </template>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="closeDialog">关闭</el-button>
            <el-button
                :loading="submitLoading"
                @click="onSubmit(formRef)"
                type="primary">
                {{ picLoading.length > 0 ? "上传中" : "保存" }}
            </el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 40px;

    :deep(.el-form-item__content) {
        > div {
            width: 100%;
        }
    }
}
</style>

<script lang="ts">
export default {
    name: "OriginUploadDialog",
};
</script>
