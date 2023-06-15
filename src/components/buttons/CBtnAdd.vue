<script lang="ts" setup>
const props = defineProps<{ loading?: Boolean; title?: string }>();
</script>

<template>
    <el-tooltip
        :hide-after="0"
        :content="title ? title : '添加'" placement="top">
        <el-button
            type="primary"
            size="small"
            class="button"
            @click="$attrs.onClick"
            :loading="loading">
            <el-icon size="14" v-if="!loading">
               <i class="fa fa-plus-circle"></i>
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<style scoped>
.button{
    padding: 5px;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 0 10px #00000050;
}
</style>

<script lang="ts">
export default {

    name: "CBtnAdd",
    inheritAttrs: false,
};
</script>
