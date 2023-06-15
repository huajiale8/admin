<script lang="ts" setup>
import {ref} from "vue";

defineProps(
    {
        valueFormat: {
            type: String,
            default: "YYYY-MM-DD HH:mm:ss",
        },
        format: {
            type: String,
            default: "YYYY-MM-DD HH:mm:ss",
        }
    },
);
const value = ref([])
const shortcuts = [
    {
        text: "最近一周",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
        },
    },
    {
        text: "最近一个月",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
        },
    },
    {
        text: "最近三个月",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
        },
    },
];
</script>

<template>
    <el-date-picker style="width: 100%;"
        v-model="value"
        type="datetimerange"
        :shortcuts="shortcuts"
        range-separator="至"
        :format="format"
        :value-format="valueFormat"
        start-placeholder="开始时间"
        end-placeholder="终止时间"
    />
</template>

<script lang="ts">
export default {
    name: "CustomDatePicker",
};
</script>

<style scoped>

</style>
