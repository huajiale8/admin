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
                    <el-form-item label="套餐名称" prop="name">
                        <el-input v-model="store.name" placeholder="请输入套餐名称"/>
                    </el-form-item>
                    <el-form-item label="套餐价格" prop="price">
                        <el-input v-model="store.price" placeholder="请输入套餐价格"/>
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
import {openPlatformConfig} from "/@/stores/open/panorama/platform";
import {getPlanePackageUpdate} from "/@/api/backend/open/panorama/platform";
import ossUrl from "/@/utils/ossUrl";
import ossfileUrl from "/@/utils/ossFileUrl";

const submitLoading = ref(false)
const store = openPlatformConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
type InsertFnType = (url: string, alt: string, href: string) => void
const editorRef = shallowRef()
const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: ["italic", "bold", "underline", "|", "fontFamily", "fontSize", "headerSelect", "|", "color", "bgColor", "|", "justifyJustify", "justifyLeft", "justifyRight", "justifyCenter", "|", "insertLink", "uploadImage", "uploadVideo"],
};
const editorConfig: Partial<IEditorConfig> = {
    MENU_CONF: {},
};
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
    content: [
        {required: true, message: '请填写套餐描述', trigger: 'blur'},
    ],
})
const url = ossUrl()
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
const urls = ossfileUrl()
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
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            getPlanePackageUpdate({
                id: store.id,
                name: store.name,
                price: store.price,
                desc: store.content,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.id = 0
    store.name = ''
    store.content = ''
    store.price = ''
    store.refreshPage = false
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
