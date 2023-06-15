<template>
    <div class="default-main ba-table-box">
        <el-card v-loading="loading">
            <template v-slot:header>
                站点设置
            </template>
            <div style="width: 100%;margin: 0 auto;">
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="formRef"
                    label-width="100px"
                    >
                    <el-row :gutter="20">
                        <el-col :span="10" :offset="1">
                            <el-form-item label="网站名称" prop="site_name">
                                <el-input v-model="ruleForm.site_name" placeholder="网站名称"/>
                            </el-form-item>
                            <el-form-item label="网站标题" prop="site_title">
                                <el-input v-model="ruleForm.site_title" placeholder="网站标题"/>
                            </el-form-item>
                            <el-form-item label="关键词" prop="site_keywords">
                                <el-input v-model="ruleForm.site_keywords" placeholder="关键字:例如（AS.极简）"/>
                            </el-form-item>
                            <el-form-item label="联系QQ">
                                <el-input v-model="ruleForm.site_contact_qq" placeholder="联系QQ"/>
                            </el-form-item>
                            <el-form-item label="联系微信">
                                <el-input v-model="ruleForm.site_contact_wechat" placeholder="微信号码"/>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <el-input v-model="ruleForm.site_contact_phone" placeholder="联系电话"/>
                            </el-form-item>
                            <el-form-item label="公司名称">
                                <el-input v-model="ruleForm.site_company_name" placeholder="公司名称"/>
                            </el-form-item>
                            <el-form-item label="公司地址">
                                <el-input v-model="ruleForm.site_company_address" placeholder="公司地址"/>
                            </el-form-item>
                            <el-form-item label="IPC备案号">
                                <el-input v-model="ruleForm.site_icp" placeholder="IPC备案号"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="1" style="border-left: dashed 1px #cccccc;">
                            <el-form-item label="站点状态">
                                <el-radio-group v-model="ruleForm.site_status">
                                    <el-radio label="1">开启</el-radio>
                                    <el-radio label="2">关闭</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="手机-封面图">
                                <CustomUploder
                                    v-model="ruleForm.site_logo"
                                    :handleSuccess="handleAvatarSuccessMobile"
                                    :beforeAvatarUpload="beforeAvatarUploadMobile"
                                    :flag="false"
                                />
                            </el-form-item>
                            <el-form-item label="站点描述">
                                <el-input
                                    type="textarea"
                                    :rows="3"
                                    :style="'width: calc(100% - ' + 160 / 1.8 + 'px); text-align: right;'"
                                    placeholder="站点描述"
                                    v-model="ruleForm.site_desc"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div :style="'width: calc(100% - ' + 160 / 1.8 + 'px); text-align: right;'">
                    <el-button
                        type="primary"
                        v-if="auth('update')"
                        @click="submitForm(formRef)">保存
                    </el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {auth} from '/@/utils/common'
import {ElForm, ElMessage, FormInstance, UploadProps} from "element-plus";
import {detailConfig, updateConfig} from "/@/api/backend/auth/config";
import CustomUploder from "/@/components/custom/CustomUploader.vue";

const loading = ref(false)
const formRef = ref<InstanceType<typeof ElForm>>();
const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
let ruleForm = reactive({
    name: '',
    id: '',
    site_name: '',
    site_title: '',
    site_keywords: '',
    site_logo: '',
    site_status: "1",
    site_desc: '',
    site_contact_qq: '',
    site_contact_wechat: '',
    site_contact_phone: '',
    site_company_name: '',
    site_company_address: '',
    site_icp: ''
})
const rules = reactive({
    site_name: [
        {required: true, message: '请填写网站名称', trigger: 'blur'},
    ],
    site_title: [
        {required: true, message: '请填写网站标题', trigger: 'blur'},
    ],
    site_keywords: [
        {required: true, message: '请输入关键词', trigger: 'blur'},
    ],
})

const handleAvatarSuccessMobile: UploadProps['onSuccess'] = (
    response
) => {
    ruleForm.site_logo = response.content.origin
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
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            updateConfig(ruleForm).then(res => {
                getList()
            })
        }
    })
}
const getList = () => {
    loading.value = true
    detailConfig().then(res => {
        let obj = res.data.content
        ruleForm.name = obj.name
        ruleForm.id = obj.id
        ruleForm.site_name = obj.site_name
        ruleForm.site_title = obj.site_title
        ruleForm.site_keywords = obj.site_keywords
        ruleForm.site_logo = obj.site_logo
        ruleForm.site_status = obj.site_status
        ruleForm.site_desc = obj.site_desc
        ruleForm.site_contact_qq = obj.site_contact_qq
        ruleForm.site_contact_wechat = obj.site_contact_wechat
        ruleForm.site_contact_phone = obj.site_contact_phone
        ruleForm.site_company_name = obj.site_company_name
        ruleForm.site_company_address = obj.site_company_address
        ruleForm.site_icp = obj.site_icp
        loading.value = false
    })
}

onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    padding: 10px 10px;
    background-color: white;
    margin-top: 10px;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    img {
        width: 178px;
    }
}
</style>
