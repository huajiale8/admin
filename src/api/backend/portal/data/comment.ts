import createAxios from '/@/utils/axios'

const commentUrl = 'admin/portal/data/comment/'

export function commentLists(params: any) {
    return createAxios({
        url: commentUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function enable(params: any) {
    return createAxios({
        url: commentUrl + 'enable',
        method: 'post',
        data: params
    })
}

export function disable(params: any) {
    return createAxios({
        url: commentUrl + 'disable',
        method: 'post',
        data: params
    })
}

export function del(params: any) {
    return createAxios({
        url: commentUrl + 'delete',
        method: 'post',
        data: params
    })
}

