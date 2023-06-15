<template>
    <div>
        <div id="bubble" class="bubble">
            <canvas id="bubble-canvas" class="bubble-canvas"></canvas>
        </div>
        <div class="login">
            <div class="login-box">
                <div class="head">
                    <img src="~assets/images/login-header.png" alt=""/>
                </div>
                <div class="form">
                    <img class="profile-avatar" src="~assets/images/home-logo.png" alt=""/>
                    <div class="content">
                        <el-form
                            @keyup.enter="onSubmit(formRef)"
                            ref="formRef"
                            :rules="rules"
                            size="large"
                            :model="form">
                            <el-form-item prop="phone">
                                <el-input
                                    ref="phoneRef"
                                    type="text"
                                    clearable
                                    v-model="form.phone"
                                    placeholder="请输入登录手机号"
                                >
                                    <template #prefix>
                                        <Icon
                                            name="fa fa-user"
                                            class="form-item-icon"
                                            size="16"
                                            color="var(--el-input-icon-color)"/>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input
                                    ref="passwordRef"
                                    v-model="form.password"
                                    type="password"
                                    placeholder="请输入登录密码"
                                    show-password>
                                    <template #prefix>
                                        <Icon
                                            name="fa fa-unlock-alt"
                                            class="form-item-icon"
                                            size="16"
                                            color="var(--el-input-icon-color)"/>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    :loading="form.loading"
                                    class="submit-button"
                                    round type="primary"
                                    size="large"
                                    @click="onSubmit(formRef)">
                                    登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue'
import * as pageBubble from '/@/utils/pageBubble'
import type {ElForm, ElInput} from 'element-plus'
import {ElNotification} from "element-plus";
import {useAccessToken} from "/@/stores/accessToken";
import {login} from '/@/api/backend'
import router from '/@/router'
import {generalConfig} from "/@/api/backend/auth/common";
import {updateHtmlGreyClass} from "/@/utils/common";

let timer: NodeJS.Timer;
const accessToken = useAccessToken()
const formRef = ref<InstanceType<typeof ElForm>>()
const phoneRef = ref<InstanceType<typeof ElInput>>()
const passwordRef = ref<InstanceType<typeof ElInput>>()
const form = reactive({
    phone: '',
    password: '',
    keep: false,
    loading: false,
})
// 表单验证规则
const rules = reactive({
    phone: [
        {required: true, message: '请输入登录手机号', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '请输入登录密码', trigger: 'blur'}
    ],
})
onMounted(() => {
    const access_token = useAccessToken().getToken()
    if (access_token !== null && access_token !== '' && access_token !== undefined) {
        ElNotification({
            type: 'error',
            message: '您已登录，请不要重复登录',
            onClose: () => {
            }
        })
        router.push({path: '/'})
    } else {
        generalConfig({type: 'isGrey'}).then(res => {
            let status = res.data.content.status
            updateHtmlGreyClass(status)
        })
    }

    timer = setTimeout(() => {
        pageBubble.init()
    }, 1000)
})

onBeforeUnmount(() => {
    clearTimeout(timer)
    pageBubble.removeListeners()
})
const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            form.loading = true
            login(form).then((response) => {
                const content = response.data.content
                accessToken.setToken(content.access_token, content.token_type)
                form.loading = false
                router.push({path: '/'})
            }).catch(() => {
                form.loading = false
            })
        } else {
            return false
        }
    })
}
</script>

<style scoped lang="scss">
.switch-language {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1;
}

.bubble {
    overflow: hidden;
    background: url(/@/assets/images/bg.jpg) repeat;
}

.form-item-icon {
    height: auto;
}

.login {
    position: absolute;
    top: 0;
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: flex-start;
    justify-content: center;

    .login-box {
        overflow: hidden;
        width: 430px;
        padding: 0;
        background: var(--ba-bg-color-overlay);
        margin-top: 130px;
    }

    .head {
        background: #ccccff;

        img {
            display: block;
            width: 430px;
            margin: 0 auto;
            user-select: none;
        }
    }

    .form {
        position: relative;

        .profile-avatar {
            display: block;
            position: absolute;
            height: 100px;
            width: 100px;
            border-radius: 50%;
            border: 4px solid var(--ba-bg-color-overlay);
            top: -50px;
            right: calc(50% - 50px);
            z-index: 2;
            user-select: none;
        }

        .content {
            padding: 100px 40px 40px 40px;
        }

        .submit-button {
            width: 100%;
            letter-spacing: 2px;
            font-weight: 300;
            margin-top: 15px;
            --el-button-bg-color: var(--el-color-primary);
        }
    }
}

@media screen and (max-width: 720px) {
    .login {
        display: flex;
        align-items: center;
        justify-content: center;

        .login-box {
            width: 340px;
            margin-top: 0;
        }
    }
}

.chang-lang :deep(.el-dropdown-menu__item) {
    justify-content: center;
}

.content :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
}

.captcha-img {
    width: 100%;
}

// 暗黑样式
@at-root .dark {
    .bubble {
        background: url(/@/assets/images/bg-dark.jpg) repeat;
    }

    .login {
        .login-box {
            background: #161b22;
        }

        .head {
            img {
                filter: brightness(61%);
            }
        }

        .form {
            .submit-button {
                --el-button-bg-color: var(--el-color-primary-light-5);
                --el-button-border-color: rgba(240, 252, 241, 0.1);
            }
        }
    }

    .captcha-img {
        filter: brightness(61%);
    }
}
</style>
