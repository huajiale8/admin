<template>
        <el-dialog
            width="40%"
            class="ba-operate-dialog"
            v-model="store.dialogVisible"
            :destroy-on-close="true"
            :close-on-click-modal="false"
            @closed="handleClose">
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
                        <el-form-item label="服务项目分类" prop="cid">
                            <el-select v-model="store.cid" placeholder="请选择活动区域">
                                <el-option
                                    v-for="(item,index) in store.categories"
                                    :key="index"
                                    :label=item.name
                                    :value="index">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务项目名称" prop="name">
                            <el-input v-model="store.name" placeholder="请输入服务分类名称">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="服务项目价格" prop="price">
                            <el-input v-model="store.price" placeholder="请输入服务项目价格">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="服务项目单位" prop="unit">
                            <el-input v-model="store.unit" placeholder="请输入服务项目单位">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <el-button @click="handleClose">
                    取消
                </el-button>
                <el-button v-blur @click="onSubmit(formRef)" type="primary">
                    保存
                </el-button>
            </template>
        </el-dialog>
</template>
<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ElForm, FormInstance} from "element-plus";
import {itemsConfig} from "/@/stores/quote/itemsPopupForm";
import {itemsSave} from "/@/api/backend/auth/quote/items";

const rules = reactive({
    name: [{required: true, message: '请填写服务项目名称', trigger: 'blur'},],
    cid: [{required: true, message: '请选择服务项目类型', trigger: 'blur'},],
    price: [{required: true, message: '请填写服务项目价格', trigger: 'blur'},],
    unit: [{required: true, message: '请填写服务项目单位', trigger: 'blur'},],
})
const formRef = ref<InstanceType<typeof ElForm>>();
const store = itemsConfig()
const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            itemsSave({
                name: store.name,
                id: store.id,
                cid: store.cid,
                price: store.price,
                unit: store.unit
            }).then(() => {
                store.refreshPage = true
                store.dialogVisible = false
            })
        }
    })
}
const handleClose = () => {
    store.name = ''
    store.cid = ""
    store.unit = ""
    store.price = ""
    store.id = 0
    store.refreshPage = false
    store.dialogVisible = false
}
</script>
<style scoped lang="scss"></style>
