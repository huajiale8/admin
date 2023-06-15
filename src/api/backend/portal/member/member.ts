import createAxios from '/@/utils/axios'

const memberUrl = 'admin/portal/member/'

export function memberLists(params: any) {
    return createAxios({
        url: memberUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function enable(params: any) {
    return createAxios({
        url: memberUrl + 'enable',
        method: 'post',
        data: params
    })
}

export function disable(params: any) {
    return createAxios({
        url: memberUrl + 'disable',
        method: 'post',
        data: params
    })
}

export function detail(params: any) {
    return createAxios({
        url: memberUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}


export function save(params: any) {
    return createAxios({
        url: memberUrl + 'save',
        method: 'post',
        data: params
    })
}
