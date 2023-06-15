<script lang="ts" setup>

import {computed, ref} from "vue";
import {usePanoramaTaskStore} from "/@/stores/open/panorama/order";
import {ElMessageBox} from "element-plus";
import {
    passTaskPackaging,
    rejectTaskPackaging,
} from "/@/api/backend/open/panorama/order";
import {auth} from "/@/utils/common";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "onSuccess"]);

const dialogVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const store = usePanoramaTaskStore();
const passLoading = ref(false);
const rejectLoading = ref(false);

const reject = () => {
    ElMessageBox.prompt("请输入驳回理由", "驳回", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputValidator: (value) => {
            if (!value || value.length < 1) return "请输入驳回理由";
        },
    })
        .then(({value}) => {
            rejectLoading.value = true;
            rejectTaskPackaging({id: store.task.id, reject_reason: value}).then(() => {
                emit("onSuccess");
                closeDialog();
            }).finally(() => {
                rejectLoading.value = false;
            });
        });
};

const pass = () => {
    passLoading.value = true;
    passTaskPackaging({id: store.task.id}).then(() => {
        emit("onSuccess");
        closeDialog();
    }).finally(() => {
        passLoading.value = false;
    });
};

const closeDialog = () => {
    emit("update:modelValue", false);
};
</script>

<template>
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="true"
        v-model="dialogVisible"
        width="40%"
    >
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                封装审核
            </div>
        </template>
        <div class="wrapper">
            <el-row style="margin-bottom: 20px;">
                <el-col :offset="2" :span="3">
                    <div
                        style="height: 100%;display:flex;align-items:center;width: 100%;justify-content: end;font-weight: bold">
                        VR源地址
                    </div>
                </el-col>
                <el-col :offset="1" :span="16">
                    <el-link type="primary" :href="store.task.source_path" target="_blank" :underline="false">
                        {{ store.task.source_path }}
                    </el-link>
                </el-col>
            </el-row>
        </div>
        <template #footer>
            <el-button @click="closeDialog">取消</el-button>
            <el-button v-if="auth('packaging/reject')" type="danger" @click="reject" :loading="rejectLoading"
                       :disabled="passLoading">驳回
            </el-button>
            <el-button v-if="auth('packaging/pass')" type="primary" @click="pass" :loading="passLoading"
                       :disabled="rejectLoading">通过
            </el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 40px 0;
}
</style>

<script lang="ts">
export default {
    name: "PackageCheckDialog",
};
</script>
