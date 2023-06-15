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
                    ref="formRef"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="store.title" placeholder="请输入标题"/>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <div style="border: 1px solid #ccc">
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
                    <el-form-item label="上传附件" prop="files">
                        <el-upload
                            v-model:file-list="store.files"
                            class="upload-demo"
                            accept="*"
                            :http-request="onUpload"
                            :on-remove="handleRemove"
                            :auto-upload="true"
                            :multiple="true"
                        >
                            <el-button type="primary">点击上传</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    单个文件大小不超过2MB
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="auth('update')"
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
import {agentNoticeConfig} from "/@/stores/agent/notice/notice";
import {IDomEditor, IEditorConfig, IToolbarConfig} from "@wangeditor/editor";
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import axios from "axios";
import {agentNoticeSaveLists} from "/@/api/backend/agent/notice/notice";
import {meiTuanHotelUp} from "/@/api/backend/activity/meituan/hotel/hotel";
import ossUrl from "/@/utils/ossUrl";
import ossfileUrl from "/@/utils/ossFileUrl";

const mode = import.meta.env.MODE
const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const config = {
    headers: {
        'Token-Id': token,
        'Token-Secret': secret,
    }
}
const store = agentNoticeConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    title: [
        {required: true, message: '请选择标题内容', trigger: 'blur'},
    ],
    files: [
        {required: true, message: '请选择附件', trigger: 'blur'},
    ],
})
type InsertFnType = (url: string, alt: string, href: string) => void
const editorRef = shallowRef()
const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: ["italic", "bold", "underline", "|", "fontFamily", "fontSize", "headerSelect", "|", "color", "bgColor", "|", "justifyJustify", "justifyLeft", "justifyRight", "justifyCenter", "|", "insertLink", "uploadImage", "uploadVideo"],
};
const editorConfig: Partial<IEditorConfig> = {
    MENU_CONF: {},
    placeholder: "最多输入10000字",
};
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

editorConfig.MENU_CONF!["uploadVideo"] = {
    customUpload(res: any, insertFn: InsertFnType) {  // TS 语法
        let urls = ossfileUrl()
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
const onUpload = (options: any) => {
    const {file} = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", 'admin/file');
    meiTuanHotelUp(formData).then(res => {
        store.backups = [...store.backups]
        store.backups.push(res.data.content.url)
        let attaches = store.files
        attaches.forEach((i: any) => {
            i.name = res.data.content.url.substring(res.data.content.url.lastIndexOf("/") + 1)
        })
    })
};
const handleRemove = (file: any) => {
    store.backups.forEach((item, index) => {
        if (item === file.url) {
            store.backups.splice(index, 1);
        }
    })
    // store.attaches = attaches.value.join(',')
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    let back: any = store.backups.join(',')
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            agentNoticeSaveLists({
                id: store.id,
                title: store.title,
                content: store.content,
                attaches: back,
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.id = 0
    store.title = ''
    store.content = ''
    store.attaches = ''
    store.backups = []
    store.files = []
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
