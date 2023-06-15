<script lang="ts" setup>
import {ref, watchEffect} from "vue";

const props = defineProps<{ loading?: Boolean }>();
const iconRef = ref<HTMLElement>();

watchEffect(() => {
    if (!iconRef.value) return;
    if (props.loading === true) {
        iconRef.value.classList.add("isLoading");
    } else {
        iconRef.value.classList.remove("isLoading");
    }
});
</script>

<template>
    <el-tooltip content="刷新" placement="top">
        <el-button
            color="#40485b"
            class="table-header-operate"
            type="info"
            @click="$attrs.onClick()">
            <i class="fa fa-refresh" ref="iconRef"></i>
        </el-button>
    </el-tooltip>
</template>

<style lang="scss" scoped>
.fa-refresh {
    &.isLoading {
        animation: rotating 1s linear infinite;
        @keyframes rotating {
            0% {
                transform: rotateZ(0);
            }
            100% {
                transform: rotateZ(360deg);
            }
        }
    }
}
</style>

<script lang="ts">
export default {
    name: "BtnRefresh",
    inheritAttrs: false,
};
</script>
