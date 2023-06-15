<template>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialogVisible"
        :close-on-click-modal="false"
        :destroy-on-close="true"
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
        <el-scrollbar>
            <div class="ba-operate-form">
                <el-form
                    ref="formRef"
                    :model="store"
                    :rules="rules"
                    label-width="auto">
                    <el-form-item label="报价员账户名称" prop="accountName">
                        <el-input v-model="store.accountName" placeholder="请输入活动名称"/>
                    </el-form-item>
                    <el-form-item label="登录密码" >
                        <el-input v-model="store.password" placeholder="请输入登录密码"
                                  type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="store.name" placeholder="请输入报价员姓名"/>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="store.phone" placeholder="请输入联系电话"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button v-if="auth('update')" @click="onSubmit(formRef)" type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                数据比较
            </div>
        </template>
        <el-scrollbar>
            <div class="ba-operate-form">
                <code-diff
                    :new-string="newList"
                    :old-string="oldList"
                    file-name="数据差异对比"
                    :context="10000"
                    :isShowNoChange="true"
                    output-format="side-by-side"/>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from "vue";
import {ElForm, FormInstance} from "element-plus";
import {accountConfig} from '/@/stores/quote/accountpupFrom'
import {accountUpdate} from "/@/api/backend/auth/quote/account";
import {auth} from "/@/utils/common";

const store = accountConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const newList = ref(JSON.stringify(store.newList))
const oldList = ref(JSON.stringify(store.oldList))
const rules = reactive({
    accountName: [{required: true, message: '请填写优惠活动名称', trigger: 'blur'},],
    password: [{required: true, message: '请填写登录密码', trigger: 'blur'},],
})

const handleClose = () => {
    store.name = ''
    store.id = 0
    store.price = ''
    store.password = ''
    store.accountName = ""
    store.phone = ''
    store.newList = {}
    store.oldList = []
    store.dialog = false
    store.refreshPage = false
    store.dialogVisible = false
}
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            accountUpdate({
                id: store.id,
                name: store.accountName,
                password: store.password,
                contact_name: store.name,
                contact_phone: store.phone
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}

const getDialog = computed(() => {
    return store.dialog
})

watch(getDialog, (newValue) => {
    if (newValue) {
        newList.value = JSON.stringify([store.newList], null, 2)
        oldList.value = JSON.stringify(store.oldList, null, 2)
    }
}, {immediate: true, deep: true});
</script>

<style scoped lang="scss">
.box-card {
    width: 49%;

    .card-header {
        text-align: center !important;
        width: 100%;
        align-items: center;
    }
}

:deep(.el-input__prefix) {
    position: absolute !important;
    right: 0 !important;
    top: -4px !important;
}
</style>
