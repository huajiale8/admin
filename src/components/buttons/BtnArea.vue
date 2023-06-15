<script lang="ts" setup>
defineProps<{ loading?: { type: Boolean, default: false } }>();
</script>

<template>
    <el-tooltip content="授权区域" placement="top">
        <el-button
            color="#707464"
            type="primary"
            size="small"
            class="btn_shadow"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading" >
                <Operation/>
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
