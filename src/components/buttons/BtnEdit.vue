<script lang="ts" setup>
defineProps<{ loading?: { type: Boolean, default: false } }>();
</script>
<template>
    <el-tooltip content="编辑" placement="top">
        <el-button
            type="primary"
            size="small"
            class="btn_shadow"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading">
                <EditPen/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: "BtnEdit",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
</style>
