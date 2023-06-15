<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import ossUrl from "/@/utils/ossUrl";

const url = ref('oss')
const token = import.meta.env.VITE_APP_TOKEN_ID
const secret = import.meta.env.VITE_APP_TOKEN_SECRET
const props = defineProps(["modelValue", 'handleSuccess', 'beforeAvatarUpload', 'handleRemove', 'type', 'flag']);
const emits = defineEmits(["update:modelValue"]);
const value = computed({
    get: () => {
        return props.modelValue
    },
    set: (value) => {
        emits('update:modelValue', value)
    }
});
onMounted(() => {
    url.value = ossUrl()
})
</script>
<template>
    <el-upload
        class="avatar-uploader"
        :action=url
        :headers="{
                     'Token-Id': token,
                     'Token-Secret': secret,
                   }"
        :show-file-list="flag"
        :on-success="handleSuccess"
        :before-upload="beforeAvatarUpload"
        accept=".png,.jpg,.jpeg"
        :on-remove="handleRemove"
        :list-type="type"
    >
        <img v-if="value" :src="value" class="avatar" alt=""/>
        <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
        </el-icon>
    </el-upload>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
export default {
    name: "CustomUploder",
};
</script>
