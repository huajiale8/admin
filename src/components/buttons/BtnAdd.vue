<script lang="ts" setup>
</script>

<template>
    <el-tooltip content="添加" placement="top">
        <el-button
            class="table-header-operate"
            @click="$attrs.onClick()"
            type="primary">
            <i class="fa fa-plus"></i>
        </el-button>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: "BtnAdd",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>

</style>
