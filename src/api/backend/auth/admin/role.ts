import createAxios from '/@/utils/axios'

const roleUrl  = '/admin/admin/role/'

export function RoleLists(params: any) {
    return createAxios({
        url: roleUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function rulesTreeApi() {
    return createAxios({
        url: roleUrl + 'rules',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function rulesFlag(params: any, url: any) {
    return createAxios({
        url: roleUrl + url,
        method: 'post',
        data: params
    })
}
export function rulesUpdate(params: any) {
    return createAxios({
        url: roleUrl + 'update',
        method: 'post',
        data: params
    })
}

export function rulesDetail(params: any) {
    return createAxios({
        url: roleUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

