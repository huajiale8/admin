<script lang="ts" setup>
defineProps<{ loading?: Boolean }>();
</script>

<template>
    <el-tooltip content="查看" placement="top">
        <el-button
            color="#7d7d73"
            type="primary"
            size="small"
            class="btn_shadow"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading">
                <View/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: "BtnView",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
</style>
