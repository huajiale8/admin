<script lang="ts" setup>
defineProps<{ loading?: { type: Boolean, default: false } }>();
</script>
<template>
    <el-tooltip content="审核" placement="top">
        <el-button
            type="warning"
            size="small"
            class="btn_shadow"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading">
                <Checked/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: "BtnAudit",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
</style>
