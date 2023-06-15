<script lang="ts" setup>
import {WalletFilled} from "@element-plus/icons-vue";

defineProps<{ loading?: { type: Boolean, default: false } }>();
</script>

<template>
    <el-tooltip content="增加资金" placement="top">
        <el-button
            color="#529578"
            type="success"
            size="small"
            class="btn_shadow"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading">
                <WalletFilled/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: "BtnArea",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
</style>
