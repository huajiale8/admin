import createAxios from '/@/utils/axios'

const typeUrl = '/admin/kaleidoscope/type/'

export function kaleidoscopeTypeLists(params: any) {
    return createAxios({
        url: typeUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeTypeDetail(params: any) {
    return createAxios({
        url: typeUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeTypeSave(params: any) {
    return createAxios({
        url: typeUrl + 'save',
        method: 'post',
        data: params
    })
}

export function kaleidoscopeTypeDelete(params: any) {
    return createAxios({
        url: typeUrl + 'delete',
        method: 'post',
        data: params,
    })
}



