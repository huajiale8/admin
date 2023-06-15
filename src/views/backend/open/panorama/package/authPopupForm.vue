<template>
        <el-dialog
            class="ba-operate-dialog"
            :destroy-on-close="true"
            :close-on-click-modal="false"
            v-model="store.dialog"
            @close="handleClose">
            <template #header>
                <div
                    style="text-align: center"
                    class="title">
                    更新套餐可使用的代理商信息
                </div>
            </template>
            <el-scrollbar max-height="60vh">
                <div class="ba-operate-form">
                    <el-form
                        ref="formRef"
                        :model="store"
                        label-width="auto">
                        <el-form-item label="当前套餐">
                            <div>
                                {{ store.name }}
                                <small>{{ store.price }}</small>
                            </div>
                        </el-form-item>
                        <el-form-item label="授权代理商 :">
                            <el-checkbox
                                v-model="store.checkAll"
                                @change="handleCheckAll">
                                全选
                            </el-checkbox>
                            <el-checkbox-group v-model="store.checked_agents">
                                <el-checkbox
                                    v-for="(item) in store.agents"
                                    :key="item.aid"
                                    :label="item.aid"
                                    name="type">{{ item.name }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button v-if="auth('save')" @click="submitPower" type="primary">
                    保存
                </el-button>
            </template>
        </el-dialog>
</template>

<script setup lang="ts">
import {auth} from '/@/utils/common'
import {ref} from "vue";
import '@wangeditor/editor/dist/css/style.css'
import type {ElForm} from "element-plus";
import {openPackageConfig} from "/@/stores/open/panorama/package";
import {getPackageDistributionPost} from "/@/api/backend/open/panorama/package";

const store = openPackageConfig()
const formRef = ref<InstanceType<typeof ElForm>>();
const submitPower = () => {
    getPackageDistributionPost({
        id: store.id,
        agents: store.checked_agents
    }).then(() => {
        store.refreshPage = true
        store.dialog = false
    })
}
const handleCheckAll = (row: any) => {
    if (row === true) {
        store.checked_agents = store.agent_ids
    } else {
        store.checked_agents = []
    }
}
const handleClose = () => {
    store.id = 0
    store.checked_agents = []
    store.agents = []
    store.agent_ids = []
    store.name = ''
    store.price = ''
    store.refreshPage = false
    store.checkAll = false
    store.dialog = false
}
</script>
<style lang="scss" scoped>
</style>
