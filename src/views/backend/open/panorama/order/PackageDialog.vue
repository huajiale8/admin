<script lang="ts" setup>
import {computed} from "vue";
import {usePanoramaTaskStore} from "/@/stores/open/panorama/order";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const dialogVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const store = usePanoramaTaskStore();

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
                套餐详情
            </div>
        </template>
        <div class="wrapper">
            <el-row style="margin-bottom: 20px;">
                <el-col :offset="6" :span="3"><span><b>套餐名称</b></span></el-col>
                <el-col :offset="1" :span="8"><p>{{ store.info.name }}</p></el-col>
            </el-row>
            <el-row>
                <el-col :offset="6" :span="3"><span><b>套餐描述</b></span></el-col>
                <el-col :offset="1" :span="8"><p>{{ store.info.desc }}</p></el-col>
            </el-row>
        </div>
        <template #footer>
            <el-button @click="closeDialog">关闭</el-button>
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
    name: "PackageDialog",
};
</script>
