<script lang="ts" setup>
import {CascaderProps} from "element-plus";
import {areaCity, areaCounty} from "/@/api/backend/portal/case/case";
import {computed, onMounted, ref} from "vue";
import {getAreaList} from "/@/api/backend/public/common";

const props=defineProps(["modelValue"]);
const emits=defineEmits(["update:modelValue"]);
const value = computed({
    get:()=>{
        return props.modelValue
    },
    set:(value)=>{
        emits('update:modelValue',value)
    }
});
const cascaderProps: CascaderProps = {
    lazy: true,
    label: "name",
    value: "id",
    checkStrictly: true,
    lazyLoad(node, resolve) {
        if (node.level === 1) {
            areaCity({pid: node.data.id}).then(res => {
                let data = res.data.content;
                resolve(data);
            });
        } else if (node.level === 2) {
            areaCounty({cid: node.data.id}).then(res => {
                let data = res.data.content;
                resolve(data);
            });
        } else {
            resolve();
        }
    },
};

const areaList = ref([]);
onMounted(() => {
    getAreaList().then(res => {
        areaList.value = res.data.content;
    });
});
</script>

<template>
    <el-cascader
        clearable
        placeholder="请选择地址区域"
        v-model="value"
        :options="areaList"
        :props="cascaderProps">
    </el-cascader>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
export default {
    name: "AreaCascader",
};
</script>
