import createAxios from '/@/utils/axios'

const certLibraryUrl = 'admin/cert/library/'

export function certLists(params: any) {
    return createAxios({
        url: certLibraryUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function certDetail(params: any) {
    return createAxios({
        url: certLibraryUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function certUpdate(params: any) {
    return createAxios({
        url: certLibraryUrl + 'update',
        method: 'post',
        data: params
    })
}

