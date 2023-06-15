<template>
    <el-config-provider :locale="zhCn">
        <router-view></router-view>
    </el-config-provider>
</template>
<script setup lang="ts">
import {onMounted, watch} from 'vue'
import iconfontInit from '/@/utils/iconfont'
import {useRoute} from 'vue-router'
import {setTitleFromRoute} from '/@/utils/common'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const route = useRoute()


// 初始化 element 的语言包
onMounted(() => {
    iconfontInit()
})

// 监听路由变化时更新浏览器标题
watch(
    () => route.path,
    () => {
        setTitleFromRoute()
    }
)
</script>

