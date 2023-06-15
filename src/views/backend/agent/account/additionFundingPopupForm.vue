<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        width="40%"
        v-model="store.addCapitalDialog"
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
                    <el-form-item label="代理商名称：" prop="name">
                        <span>{{ store.name }}</span>
                    </el-form-item>
                    <el-form-item label="代理商层级：" prop="phone">
                        <span v-if="store.superior_aid === 0"> 一级代理商</span>
                        <span v-else> 二级代理商</span>
                    </el-form-item>
                    <el-form-item label="资金额度：" prop="amount">
                        <el-input v-model="store.amount" placeholder="增加的资金额度，如：100">
                            <template #prepend>￥</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="业务类型：" prop="reason">
                        <el-select v-model="store.reason" clearable>
                            <el-option :key="0" label="代理充值" value="代理充值"></el-option>
                            <el-option :key="1" label="返货馈送" value="返货馈送"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="充值备注：" prop="remark">
                        <el-input
                            :rows="3"
                            type="textarea"
                            v-model="store.remark"
                            placeholder="具体的充值实际金额描述"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button
                v-if="auth('capital')"
                :loading="submitLoading"
                @click="onSubmit(formRef)"
                type="primary">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import type {ElForm} from "element-plus";
import {FormInstance} from 'element-plus'
import {agentAccountConfig} from "/@/stores/agent/account/account";
import {accountManagementCapital} from "/@/api/backend/agent/account/account";
import {auth} from "/@/utils/common";

const submitLoading = ref(false)
const store = agentAccountConfig()
const hotel_file = ref('')
const formRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
    amount: [
        {required: true, message: '请输入资金额度', trigger: 'blur'},
    ],
    reason: [
        {required: true, message: '请选择业务类型', trigger: 'blur'},
    ],
    remark: [
        {required: true, message: '请输入备注内容', trigger: 'blur'},
    ]
})
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            accountManagementCapital({
                id: store.id,
                amount: store.amount,
                reason: store.reason,
                remark: store.remark,
            }).then(() => {
                store.refreshPage = true
                store.addCapitalDialog = false
            })
        }
    })
}
const handleClose = () => {
    store.name = ''
    store.id = 0
    store.amount = ''
    store.reason = ''
    store.remark = ''
    hotel_file.value = ''
    store.refreshPage = false
    store.addCapitalDialog = false
}
</script>
<style lang="scss" scoped>
</style>
