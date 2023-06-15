import createAxios from '/@/utils/axios'

const controllerUrl = '/admin/auth/'

export function login(params: object = {}): ApiPromise {
    return createAxios({
        url: controllerUrl + 'login',
        data: params,
        method: 'POST',
    }) as ApiPromise
}

export function userInfo(): ApiPromise {
    return createAxios({
        url: controllerUrl + 'userInfo',
        data: {noSuccessMessage: true},
        method: 'GET',
    }) as ApiPromise
}

export function logout(params: object = {}) {
    return createAxios({
        url: controllerUrl + 'logout',
        method: 'POST',
        data: params,
    })
}

export function refresh(params: object = {}): ApiPromise {
    return createAxios({
        url: controllerUrl + 'refresh',
        data: params,
        method: 'POST',
    }) as ApiPromise
}
