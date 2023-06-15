import createAxios from '/@/utils/axios'

const projectMenu = 'admin/publish/project/'

export function projectMenuLists(params: any) {
    return createAxios({
        url: projectMenu + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function projectMenuDetail(params: any) {
    return createAxios({
        url: projectMenu + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function projectMenuUpdate(params: any) {
    return createAxios({
        url: projectMenu + 'update',
        method: 'post',
        data: params
    })
}

export function projectMenuDelete(params: any) {
    return createAxios({
        url: projectMenu + 'delete',
        method: 'post',
        data: params
    })
}

