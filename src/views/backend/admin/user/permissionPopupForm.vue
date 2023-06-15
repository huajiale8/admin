<template>
    <el-dialog
        class="ba-operate-dialog"
        v-model="store.dialog"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        @close="handleClose">
        <template #header>
            <div
                style="text-align: center"
                class="title">
                权限组分配
            </div>
        </template>
        <el-scrollbar max-height="60vh">
            <div class="ba-operate-form">
                <el-form
                    ref="formRef"
                    :model="store"
                    label-width="auto">
                    <el-form-item label="当前用户 :">
                        <span>{{ store.name }}</span>
                    </el-form-item>
                    <el-form-item label="联系方式 :">
                        <span>{{ store.phone }}</span>
                    </el-form-item>
                    <el-form-item label="权限组 :">
                        <el-checkbox-group v-model="store.accesses">
                            <el-checkbox
                                v-for="(item) in store.type"
                                :key="item.id"
                                :label="item.id"
                                name="type">{{ item.title }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button @click="submitPower" type="primary" v-if="auth('group')">
                保存
            </el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {userConfig} from '/@/stores/admin/userpupForm'
import {ElForm} from "element-plus";
import {GroupUpdate} from "/@/api/backend/auth/admin/user";
import {auth} from '/@/utils/common'

const formRef = ref<InstanceType<typeof ElForm>>();
const store = userConfig()
const submitPower = () => {
    GroupUpdate({
        uid: store.id,
        rules: store.accesses
    }).then(() => {
        store.refreshPage = true
        store.dialog = false
    })
}
const handleClose = () => {
    store.name = ''
    store.id = 0
    store.level = 0
    store.password = ''
    store.phone = ''
    store.accesses = []
    store.refreshPage = false
    store.dialogVisible = false
    store.dialog = false
}
</script>
<style scoped lang="scss">
</style>
