<script lang="ts" setup>
import {DocumentRemove} from "@element-plus/icons-vue";

defineProps<{ loading?: { type: Boolean, default: false } }>();
</script>
<template>
    <el-tooltip content="详情" placement="top">
        <el-button
            type="primary"
            size="small"
            class="btn_shadow"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading">
                <DocumentRemove/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: "BtnDetail",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
</style>
