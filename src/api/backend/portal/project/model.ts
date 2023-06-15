import createAxios from '/@/utils/axios'

const modelUrl = 'admin/portal/project/model/'

export function modelLists(params: any) {
    return createAxios({
        url: modelUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function enable(params: any) {
    return createAxios({
        url: modelUrl + 'enable',
        method: 'post',
        data: params
    })
}

export function disable(params: any) {
    return createAxios({
        url: modelUrl + 'disable',
        method: 'post',
        data: params
    })
}
