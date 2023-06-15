<script lang="ts" setup>
const props = defineProps<{ loading?: Boolean; title?: string }>();
</script>

<template>
    <el-tooltip content="导出" placement="top">
        <el-button
            type="primary"
            size="small"
            class="button"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading">
                <Download/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<style lang="scss" scoped>
.button {
    padding: 5px;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 0 10px #00000050;

    > :deep(span:nth-child(2)) {
        display: none;
    }
}
</style>

<script lang="ts">
export default {
    name: "CBtnExport",
    inheritAttrs: false,
};
</script>


