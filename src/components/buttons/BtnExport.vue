<script lang="ts" setup>

</script>

<template>
    <el-tooltip content="导出" placement="top">
        <el-button
            class="table-header-operate"
            @click="$attrs.onClick()"
            type="danger">
            <i class="fa fa-cloud-download"></i>
        </el-button>
    </el-tooltip>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
export default {
    name: "BtnExport",
    inheritAttrs: false,
};
</script>
