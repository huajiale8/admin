<template>
        <el-dialog
            class="ba-operate-dialog"
            :close-on-click-modal="false"
            v-model="store.dialogVisible"
            width="30%"
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
            <el-scrollbar class="ba-table-form-scrollbar">
                <div class="ba-operate-form">
                    <el-form
                        v-if="store.dialogVisible"
                        ref="formRef"
                        :model="data"
                        :rules="rules"
                        label-position="right"
                        label-width="auto">
                        <el-form-item label="归属地区" prop="selectedOptions">
                            <AreaCascader v-model="data.selectedOptions"/>
                        </el-form-item>
                        <el-form-item label="酒店信息文件">
                            <el-upload
                                v-model:file-list="fileList"
                                class="upload-demo"
                                :http-request="onUpload"
                                accept=".xls,.xlsx"
                                :on-remove="handleRemove"
                                :before-upload="beforeUpload"
                                :on-success="handleSuccess"
                                :before-remove="beforeRemove"
                                :auto-upload="true"
                            >
                                <el-button type="primary">点击上传</el-button>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        只能上传xls、xlsx文件，且不超过2M
                                    </div>
                                </template>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button v-if="auth('import')"
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
import {ElMessage, ElMessageBox, FormInstance, UploadProps, UploadUserFile} from 'element-plus'
import {meiTuanHotelConfig} from "/@/stores/activity/meituan/hotel/hotel";
import {meiTuanHotelImport, meiTuanHotelUp} from "/@/api/backend/activity/meituan/hotel/hotel";
import AreaCascader from "/@/components/custom/AreaCascader.vue";
import {auth} from "/@/utils/common";

const data = ref({
    selectedOptions: []
})
const submitLoading = ref(false)
const store = meiTuanHotelConfig()
const hotel_file = ref('')
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    selectedOptions: [
        {required: true, message: '请选择地址区域', trigger: 'blur'},
    ],
})
const fileList = ref<UploadUserFile[]>([])
const beforeUpload = (file: any) => {
    let legalName = ['xlsx', 'xls']
    let name = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
    if (!legalName.includes(name)) {
        ElMessage.warning(
            `上传酒店信息文件只能是EXCEL(后缀为xls或者xlsx)!`
        )
        return false
    }
    return true
}
const onUpload = (options: any) => {
    const {file} = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", 'admin/file');
    meiTuanHotelUp(formData)
        .then(res => {
            hotel_file.value = res.data.content.url
        })
};
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
}
const handleSuccess = (res: any) => {
    if (res.code === 1) {
        ElMessage.warning(res.message)
        return false
    }
    hotel_file.value = res.data.content.url
    ElMessage.success(res.message)
}
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
    return ElMessageBox.confirm(
        `确认移除${uploadFile.name} ?`
    ).then(
        () => true,
        () => false
    )
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            meiTuanHotelImport({
                province_id: data.value.selectedOptions[0],
                city_id: data.value.selectedOptions[1],
                county_id: data.value.selectedOptions[2],
                hotel_file: hotel_file.value
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.thumb_pc = ''
    store.id = ''
    store.certType_id = ''
    store.fileList = []
    data.value.selectedOptions = []
    store.previewImg = []
    fileList.value = []
    store.name = ''
    store.category_id = ''
    store.panorama_url = ''
    hotel_file.value = ''
    store.dateValue = ''
    store.refreshPage = false
    store.dialogVisible = false
}
onMounted(() => {
});
</script>
<style lang="scss" scoped>
</style>
