import createAxios from '/@/utils/axios'

const attributesGeneralUrl = '/admin/system/attributes/general/'

export function generalLists(params: any) {
    return createAxios({
        url: attributesGeneralUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function generalUpdate(params: any) {
    return createAxios({
        url: attributesGeneralUrl + 'save',
        method: 'post',
        data: params
    })
}

export function generalDetail(params: any) {
    return createAxios({
        url: attributesGeneralUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function general(params: any, item: string) {
    return createAxios({
        url: attributesGeneralUrl + item,
        method: 'post',
        data: params
    })
}

