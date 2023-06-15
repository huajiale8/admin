<template>
    <el-dialog class="ba-operate-dialog" :close-on-click-modal="false" v-model="store.dialogVisible"
               @close="handleClose">
        <template #header>
            <div style="text-align: center" class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                 v-zoom="'.ba-operate-dialog'">
                {{ store.operate }}
            </div>
        </template>
        <el-scrollbar class="ba-table-form-scrollbar" height="60vh">
            <div class="ba-operate-form">
                <el-form v-if="store.dialogVisible" ref="formRef" :model="store" :rules="rules" label-position="right"
                         label-width="auto">
                    <el-form-item label="解决方案名称" prop="name">
                        <el-input v-model="store.name" placeholder="案例名称"/>
                    </el-form-item>
                    <el-form-item label="解决方案icon" prop="icon">
                        <CustomUploder
                            v-model="store.icon"
                            :handleSuccess="handleAvatarSuccess"
                            :beforeAvatarUpload="beforeAvatarUpload"
                            :flag="false"
                        />
                    </el-form-item>
                    <el-card class="box-card" v-for="(item, index) in store.content" :key="index">
                        <div class="clearfix">
                            <el-icon @click="removeCard(item, index)">
                                <Close/>
                            </el-icon>
                        </div>
                        <el-form-item label="PPT截图" :prop="'content.' + index + '.picture'" :rules="rules.picture">
                            <el-upload
                                class="avatar-uploader"
                                :action=url
                                :headers="{
                                    'Token-Id': token,
                                    'Token-Secret': secret,
                                }"
                                :show-file-list="false"
                                :on-success="(response, file, fileList) => handleSuccess(index, response, file, fileList)"
                                :before-upload="beforeAvatarUpload"
                            >
                                <img v-if="store.content[index].picture" :src="store.content[index].picture"
                                     class="avatar" alt=""/>
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus/>
                                </el-icon>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="案列链接" :prop="'content.' + index + '.link'" :rules="rules.link">
                            <el-input v-model="store.content[index].link" placeholder="案例链接"/>
                        </el-form-item>
                    </el-card>
                </el-form>
                <div style="text-align: center; margin-top: 18px">
                    <el-button type="primary" @click="addSolution" size="small" class="el-icon-circle-plus-outline">
                        添加解决方案
                    </el-button>
                </div>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose"> 取消</el-button>
            <el-button v-if="auth('save')" :loading="submitLoading" @click="onSubmit(formRef)" type="primary"> 保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {ElForm, UploadFiles} from 'element-plus'
import {ElMessage, FormInstance, UploadProps} from 'element-plus'
import {auth} from '/@/utils/common'
import {kaleidoscopeSolutionConfig} from '/@/stores/kaleidoscope/solution'
import {kaleidoscopeSolutionSave} from '/@/api/backend/kaleidoscope/solution'
import CustomUploder from "/@/components/custom/CustomUploader.vue";
import ossUrl from "/@/utils/ossUrl";


const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const submitLoading = ref(false)
const store = kaleidoscopeSolutionConfig()
const formRef = ref<InstanceType<typeof ElForm>>()
const rules = reactive({
    name: [{required: true, message: '请填写案列名称', trigger: 'blur'}],
    icon: [{required: true, message: '请选择解决方案icon', trigger: 'blur'}],
    picture: [{required: true, message: '请选择ppt截图', trigger: 'blur'}],
    link: [{required: true, message: '请输入链接', trigger: ['blur', 'change']}],
})
const removeCard = (item: any, index: any) => {
    let newArr = []
    let content = store.content
    for (let k in content) {
        if (parseInt(k) === parseInt(index)) delete content[k]
    }
    for (let k in content) {
        newArr.push(content[k])
    }
    store.content = newArr
}
const onSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            kaleidoscopeSolutionSave({
                id: store.id,
                name: store.name,
                icon: store.icon,
                content: store.content,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    store.icon = response.content.origin
    ElMessage.success('解决方案Icon上传成功！')
}
const handleSuccess = (index: number, res: any, file: any, fileList: UploadFiles) => {
    store.content[index].picture = res.content.origin
    ElMessage.success('PPT截图上传成功！')
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
const addSolution = () => {
    store.flag = false
    store.content.push({link: '', picture: ''})
}
const handleClose = () => {
    store.id = ''
    store.name = ''
    store.icon = ''
    store.refreshPage = false
    store.dialogVisible = false
}
const url = ref('')
onMounted(() => {
    url.value = ossUrl()
})
</script>

<style lang="scss" scoped>
.box-card {
    position: relative;
    width: 100%;
    margin-bottom: 10px;

    .clearfix {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 20px;
        height: 20px;
    }
}
</style>
