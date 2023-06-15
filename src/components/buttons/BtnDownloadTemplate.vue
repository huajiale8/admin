<script lang="ts" setup>
const props = defineProps<{ templateUrl: string }>();
const download = () => {
    const a = document.createElement("a");
    a.setAttribute("href", props.templateUrl);
    a.setAttribute("download", "example.xlsx");
    a.click();
};
</script>

<template>
    <el-button
        size="small" text
        class="button"
        @click="download"
    >
        下载模板
    </el-button>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
export default {
    name: "BtnDownloadTemplate",
};
</script>
