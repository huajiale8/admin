<script lang="ts" setup>

</script>

<template>
    <el-tooltip content="搜索" placement="top">
        <el-button
            @click="$attrs.onClick()"
            type="primary">
            <el-icon>
                <Search/>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: "BtnSearch",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>

</style>
