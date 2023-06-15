<script lang="ts" setup>
import {computed, ref} from "vue";
import {usePanoramaTaskStore} from "/@/stores/open/panorama/order";
import {ElScrollbar} from "element-plus";

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
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

const onOpen = () => {
    setTimeout(() => {
        scrollbarRef.value.setScrollTop(0);
    }, 100);
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
        @open="onOpen"
    >
        <template #header>
            <div
                style="text-align: center"
                class="title"
                v-drag="['.ba-operate-dialog', '.el-dialog__header']"
                v-zoom="'.ba-operate-dialog'">
                查看照片
            </div>
        </template>
        <el-scrollbar ref="scrollbarRef" max-height="60vh">
            <div class="wrapper">
                <el-row style="margin-bottom: 20px;">
                    <el-col :offset="2" :span="2"><span><b>原片</b></span></el-col>
                    <el-col :offset="1" :span="18">
                        <el-row v-for="(pic,index) in store.pictures" :key="index">
                            <el-col :span="12">
                                <el-image
                                    style="height: 100px;width: 200px;" :src="pic.url"
                                    :preview-src-list="store.fileList"/>
                            </el-col>
                            <el-col :span="12">
                                <div class="link-wrapper">
                                    <el-link type="primary" :href="pic.url" target="_blank" :underline="false">{{
                                            pic.name
                                        }}
                                    </el-link>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
        </el-scrollbar>
        <template #footer>
            <el-button @click="closeDialog">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
export default {
    name: "RevisionViewDialog",
};
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 40px 0;

    .link-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
    }
}
</style>
