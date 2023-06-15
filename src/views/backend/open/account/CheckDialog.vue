<script lang="ts" setup>
import {computed, ref} from "vue";
import {ElMessageBox} from "element-plus";
import {useAccountStore} from "/@/stores/open/account";
import {auth} from "/@/utils/common";
import {passAccount, rejectAccount} from "/@/api/backend/open/account";

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

const store = useAccountStore();
const rejectLoading = ref(false);
const passLoading = ref(false);

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
            rejectAccount({id: store.account.oid, audit_failed_reason: value}).then(() => {
                emit("onSuccess");
                closeDialog();
            }).finally(() => {
                rejectLoading.value = false;
            });
        });
};

const pass = () => {
    passLoading.value = true;
    passAccount({id: store.account.oid}).then(() => {
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
                审核账户
            </div>
        </template>
        <div class="ba-operate-form">
            <el-descriptions
                :column="2"
                size="large"
                border
            >
                <el-descriptions-item label="机构名称" :span="2">
                    {{ store["account"]["org_name"] }}
                </el-descriptions-item>
                <el-descriptions-item label="机构联系人">
                    {{ store["account"]["contact_name"] }}
                </el-descriptions-item>
                <el-descriptions-item label="机构联系方式">
                    {{ store["account"]["contact_information"] }}
                </el-descriptions-item>
                <el-descriptions-item label="机构地址" :span="2">
                    {{ store["account"]["address"] }}
                </el-descriptions-item>
                <el-descriptions-item label="营业执照">
                    <div class="photo-wrapper">
                        <el-image
                            class="photo"
                            fit="contain"
                            :z-index="100000"
                            :src="store['account']['attach'][0]"
                            :preview-src-list="store.account['attach']"/>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item label="法人证件照">
                    <div class="photo-wrapper">
                        <el-image
                            class="photo"
                            fit="contain"
                            :z-index="100000"
                            :src="store['account']['attach'][1]"
                            :preview-src-list="store.account['attach']"/>
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <template #footer>
            <el-button @click="closeDialog">取消</el-button>
            <el-button
                v-if="auth('reject')" type="danger" @click="reject" :loading="rejectLoading"
                :disabled="passLoading">驳回
            </el-button>
            <el-button
                v-if="auth('pass')" type="primary" @click="pass" :loading="passLoading"
                :disabled="rejectLoading">通过
            </el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.photo-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > .photo {
        width: 150px;
        height: 100px;
    }
}
</style>

<script lang="ts">
export default {
    name: "CheckDialog",
};
</script>
