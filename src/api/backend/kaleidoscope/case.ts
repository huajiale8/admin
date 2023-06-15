import createAxios from '/@/utils/axios'

const kaleidoscopeCaseUrl = '/admin/kaleidoscope/case/'

export function kaleidoscopeCaseLists(params: any) {
    return createAxios({
        url: kaleidoscopeCaseUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeCaseDetail(params: any) {
    return createAxios({
        url: kaleidoscopeCaseUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeCaseSave(params: any) {
    return createAxios({
        url: kaleidoscopeCaseUrl + 'save',
        method: 'post',
        data: params
    })
}

export function kaleidoscopeCaseDelete(params: any) {
    return createAxios({
        url: kaleidoscopeCaseUrl + 'delete',
        method: 'post',
        data: params
    })
}

