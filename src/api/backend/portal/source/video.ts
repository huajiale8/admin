import createAxios from '/@/utils/axios'

const sourceVideoUrl = 'admin/portal/source/video/'

export function videoLists(params: any) {
    return createAxios({
        url: sourceVideoUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function enable(params: any) {
    return createAxios({
        url: sourceVideoUrl + 'enable',
        method: 'post',
        data: params
    })
}

export function disable(params: any) {
    return createAxios({
        url: sourceVideoUrl + 'disable',
        method: 'post',
        data: params
    })
}
