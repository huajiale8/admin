<script lang="ts" setup>
import {InfoFilled} from "@element-plus/icons-vue";

defineProps<{ loading?: Boolean }>();
</script>

<template>
    <el-popconfirm
        width="220"
        confirm-button-text="确定"
        cancel-button-text="取消"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="是否删除此条记录"
        @confirm="$attrs.onClick"
    >
        <template #reference>
            <el-button
                type="danger"
                size="small"
                :loading="loading"
                class="btn_shadow"
            >
                <el-icon size="14" v-if="!loading">
                    <Delete/>
                </el-icon>
            </el-button>
        </template>
    </el-popconfirm>
</template>

<script lang="ts">
export default {
    name: "BtnDelete",
    inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
</style>
