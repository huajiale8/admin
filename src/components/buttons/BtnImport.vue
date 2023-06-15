<script lang="ts" setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import type {UploadRequestOptions} from "element-plus";
import {uploadFile} from "/@/api/backend/public/common";

const props = defineProps<{ fileType: string, fileSize: string, filePath: string, }>();
const emit = defineEmits<{ (e: "onSuccess", fileInfo: { file: string, name: string }): void }>();
const dialogVisible = ref(false);
const regexKb = /kb/i;
const regexMb = /mb/i;
const onUpload = (options: UploadRequestOptions) => {
    const {file} = options;
    const typeArr = props.fileType.replace(".", "").split(",");
    const extensionName = file.name.slice(file.name.lastIndexOf(".") + 1, file.name.length);
    if (regexKb.test(props.fileSize)) {
        if (file.size / 1024 > parseFloat(props.fileSize)) {
            return ElMessage.error("文件大小超出限制");
        }
    }
    if (regexMb.test(props.fileSize)) {
        if (file.size / 1024 / 1024 > parseFloat(props.fileSize)) {
            return ElMessage.error("文件大小超出限制");
        }
    }
    if (typeArr.indexOf(extensionName) < 0) {
        return ElMessage.error("文件类型错误");
    }
    const form = new FormData();
    form.append("file", file);
    form.append("type", props.fileType);
    uploadFile(form).then(res => emit("onSuccess", {file: res.data.content.url, name: file.name}));
};
</script>

<template>
    <el-tooltip content="导入" placement="top">
        <el-button
            class="table-header-operate"
            @click="dialogVisible=true"
            type="primary">
            <i class="fa fa-cloud-upload"></i>
        </el-button>
    </el-tooltip>
    <el-dialog
        v-model="dialogVisible"
        title="上传文件"
        width="30%"
    >
        <el-upload
            drag
            :accept="props.fileType"
            :show-file-list="false"
            :http-request="onUpload"
        >
            <el-icon class="el-icon--upload">
                <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
                拖拽文件至此 或 <em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    只能上传{{ props.fileType }}文件，且大小不能超过{{ props.fileSize }}
                </div>
            </template>
        </el-upload>
    </el-dialog>
</template>

<style lang="scss" scoped>
.table-header-operate {
    margin-right: 12px;
}
</style>

<script lang="ts">
export default {
    name: "BtnImport",
    inheritAttrs: false,
};
</script>
