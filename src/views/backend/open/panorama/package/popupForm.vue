<template>
    <el-dialog
        :destroy-on-close="true"
        class="ba-operate-dialog"
        :close-on-click-modal="false"
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
                    <el-form-item label="套餐名称" prop="name">
                        <el-input v-model="store.name" placeholder="请输入套餐名称"/>
                    </el-form-item>
                    <el-form-item label="充值金额">
                        <el-input
                            :disabled="!store.can"
                            v-model="store.custom_account_price"
                            placeholder="请填写套餐拆分出需要给客户账户充值的金额，如100、1000"/>
                    </el-form-item>
                    <el-form-item label="套餐价格" prop="price">
                        <el-input
                            v-model="store.price"
                            :disabled="!store.can"
                            placeholder="请填写套餐价格，如100、1000">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="套餐类型">
                        <el-select
                            v-model="store.type"
                            placeholder="请选择套餐类型"
                            @change="getParent"
                            :disabled="!store.can">
                            <el-option label="顶级套餐" :value="1" :key="1"></el-option>
                            <el-option label="续费套餐" :value="2" :key="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="顶级套餐" v-if="store.is_show">
                        <el-select v-model="store.pid" placeholder="请选择顶级套餐">
                            <el-option
                                v-for="item in store.parents"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="套餐有效期" prop="term">
                        <el-select
                            v-model="store.term"
                            placeholder="请选择有效期"
                            :disabled="!store.can">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="套餐描述" prop="content">
                        <div style="border: 1px solid #ccc" v-if="store.dialogVisible">
                            <Toolbar
                                style="border-bottom: 1px solid #ccc"
                                :editor="editorRef"
                                :defaultConfig="toolbarConfig"
                                mode="simple"
                            />
                            <Editor
                                style="height: 500px; overflow-y: hidden"
                                v-model="store.content"
                                :defaultConfig="editorConfig"
                                mode="simple"
                                @onCreated="handleCreated"
                            />
                        </div>
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
import {auth} from '/@/utils/common'
import {onBeforeUnmount, reactive, ref, shallowRef} from "vue";
import '@wangeditor/editor/dist/css/style.css'
import type {ElForm} from "element-plus";
import {ElMessage, FormInstance} from 'element-plus'
import {IDomEditor, IEditorConfig, IToolbarConfig} from "@wangeditor/editor";
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import axios from "axios";
import {openPackageConfig} from "/@/stores/open/panorama/package";
import {getPackageUpdate} from "/@/api/backend/open/panorama/package";
import ossUrl from "/@/utils/ossUrl";
import ossfileUrl from "/@/utils/ossFileUrl";

const submitLoading = ref(false)
const store = openPackageConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const options = reactive([
    {
        label: '3个月',
        value: '3'
    },
    {
        label: '6个月',
        value: '6'
    },
    {
        label: '12个月',
        value: '12'
    },
    {
        label: '18个月',
        value: '18'
    },
    {
        label: '24个月',
        value: '24'
    },])
type InsertFnType = (url: string, alt: string, href: string) => void
const editorRef = shallowRef()
const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: ["italic", "bold", "underline", "|", "fontFamily", "fontSize", "headerSelect", "|", "color", "bgColor", "|", "justifyJustify", "justifyLeft", "justifyRight", "justifyCenter", "|", "insertLink", "uploadImage", "uploadVideo"],
};
const editorConfig: Partial<IEditorConfig> = {
    MENU_CONF: {},

};
const url = ossUrl()
const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const config = {
    headers: {
        'Token-Id': token,
        'Token-Secret': secret,
    }
}

const rules = reactive({
    name: [
        {required: true, message: '请填写套餐名称', trigger: 'blur'},
    ],
    price: [
        {required: true, message: '请填写套餐价格', trigger: 'blur'},
    ],
    term: [
        {required: true, message: '请填选择套餐有效期', trigger: 'blur'},
    ],
    content: [
        {required: true, message: '请填写套餐描述', trigger: 'blur'},
    ],
})
const urls = ossfileUrl()
editorConfig.MENU_CONF['uploadImage'] = {

    customUpload(file: File, insertFn: InsertFnType) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", 'admin/agent/notice/img');
        axios.post(url, formData, config).then(res => {
            ElMessage.success(res.data.message)
            insertFn(res.data.content.origin, res.data.content.name, res.data.content.origin)
        }).catch(res => {
            ElMessage.warning(res.data.message)
        })
    }
}
editorConfig.MENU_CONF!["uploadVideo"] = {
    customUpload(res: any, insertFn: InsertFnType) {  // TS 语法
        const formData = new FormData();
        formData.append("file", res);
        formData.append("type", 'admin/agent/notice/video');
        axios.post(urls, formData, config).then(res => {
            ElMessage.success(res.data.message)
            insertFn(res.data.content.origin, res.data.content.name, res.data.content.origin)
        }).catch(res => {
            ElMessage.warning(res.data.message)
        })
    }
};
const getParent = () => {
    store.is_show = store.type === 2;
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            getPackageUpdate({
                id: store.id,
                name: store.name,
                price: store.price,
                desc: store.content,
                pid: store.pid,
                term: store.term,
                custom_account_price: store.custom_account_price,
                can: store.can,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.id = 0
    store.pid = ''
    store.name = ''
    store.content = ''
    store.type = 1
    store.custom_account_price = ''
    store.price = ''
    store.term = ''
    store.options = []
    store.refreshPage = false
    store.is_show = false
    store.can = true
    store.dialogVisible = false
}
const handleCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
};
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
</script>
<style lang="scss" scoped>
</style>
